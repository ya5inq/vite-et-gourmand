import { describe, beforeEach, vi, expect, it } from 'vitest';

import { getAnalyticsRepositoryMock } from '@/adapters/analytics/analytics.repository.mock';
import { getLoggerMock } from '@/adapters/logger/logger.mock';
import { getMailSenderMock } from '@/adapters/mailSender/mailSender.mock';
import { getMenuRepositoryMock } from '@/adapters/repositories/menuRepository/menu.repository.mock';
import { getOrderRepositoryMock } from '@/adapters/repositories/orderRepository/order.repository.mock';
import { getCalculateDeliveryPriceUseCaseMock } from '@/application/useCases/deliveryZone/calculateDeliveryPrice/calculateDeliveryPrice.useCase.mock';
import { menuFactory } from '@/domain/entities/menu/menu.factory';
import { OrderStatusEnum } from '@/domain/entities/order/orderStatus';

import { computeLine, CreateOrderUseCase } from './createOrder.useCase';

describe('CreateOrderUseCase', () => {
  const orderRepositoryMock = getOrderRepositoryMock();
  const menuRepositoryMock = getMenuRepositoryMock();
  const calculateDeliveryPriceUseCaseMock = getCalculateDeliveryPriceUseCaseMock();
  const analyticsRepositoryMock = getAnalyticsRepositoryMock();
  const mailSenderMock = getMailSenderMock();
  const loggerMock = getLoggerMock();

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepositoryMock,
    menuRepositoryMock,
    calculateDeliveryPriceUseCaseMock,
    analyticsRepositoryMock,
    mailSenderMock,
    loggerMock,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    calculateDeliveryPriceUseCaseMock.executeCalculateDeliveryPrice.mockResolvedValue({
      zoneId: 'zone-1',
      zoneName: 'Merignac',
      city: 'Merignac',
      distanceKm: 8,
      deliveryFee: 9.72,
    });
  });

  describe('computeLine (pure rule)', () => {
    it('applies the 10% discount exactly at minPersons + 5', () => {
      const menu = menuFactory({ price: 50, minPersons: 10 });
      const result = computeLine(menu, 15);
      expect(result.discountApplied).toBe(true);
      // base = 50 * 15 = 750 ; -10% => 675
      expect(result.lineTotal).toBe(675);
      expect(result.unitPrice).toBe(50);
    });

    it('does NOT apply the discount at minPersons + 4', () => {
      const menu = menuFactory({ price: 50, minPersons: 10 });
      const result = computeLine(menu, 14);
      expect(result.discountApplied).toBe(false);
      // base = 50 * 14 = 700, no discount
      expect(result.lineTotal).toBe(700);
    });
  });

  it('throws BELOW_MIN_PERSONS when quantity < menu.minPersons', async () => {
    menuRepositoryMock.findById.mockResolvedValue(menuFactory({ minPersons: 10, stock: null, isAvailable: true }));

    await expect(
      createOrderUseCase.executeCreateOrder({
        items: [{ menuId: 'menu-1', quantity: 9 }],
        userId: 'user-1',
        userEmail: 'user@test.fr',
        deliveryZoneId: 'zone-1',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_BELOW_MIN_PERSONS' });

    expect(orderRepositoryMock.createWithItemsAndStock).not.toHaveBeenCalled();
  });

  it('throws INSUFFICIENT_STOCK when quantity > menu.stock', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ minPersons: 5, stock: 10, isAvailable: true, price: 40 }),
    );

    await expect(
      createOrderUseCase.executeCreateOrder({
        items: [{ menuId: 'menu-1', quantity: 12 }],
        userId: 'user-1',
        deliveryZoneId: 'zone-1',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT_ORDER_INSUFFICIENT_STOCK' });

    expect(orderRepositoryMock.createWithItemsAndStock).not.toHaveBeenCalled();
  });

  it('throws MENU_UNAVAILABLE when the menu is not available', async () => {
    menuRepositoryMock.findById.mockResolvedValue(menuFactory({ minPersons: 5, stock: null, isAvailable: false }));

    await expect(
      createOrderUseCase.executeCreateOrder({
        items: [{ menuId: 'menu-1', quantity: 10 }],
        userId: 'user-1',
        deliveryZoneId: 'zone-1',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_MENU_UNAVAILABLE' });
  });

  it('computes total = sum(lineTotal) + deliveryFee and persists items', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', name: 'Menu A', price: 50, minPersons: 10, stock: null, isAvailable: true }),
    );

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 15 }], // discount applies => 675
      userId: 'user-1',
      userEmail: 'user@test.fr',
      deliveryZoneId: 'zone-1',
    });

    const payload = orderRepositoryMock.createWithItemsAndStock.mock.calls[0][0];
    // 675 (line) + 9.72 (delivery) = 684.72
    expect(payload.order.totalPrice).toBe(684.72);
    expect(payload.order.deliveryFee).toBe(9.72);
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].lineTotal).toBe(675);
    expect(payload.items[0].discountApplied).toBe(true);
    expect(payload.order.status).toBe(OrderStatusEnum.PENDING);
    expect(payload.history.newStatus).toBe(OrderStatusEnum.PENDING);
    expect(payload.history.oldStatus).toBeNull();
  });

  it('queues a stock decrement for menus that track stock', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', price: 40, minPersons: 5, stock: 100, isAvailable: true }),
    );

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 8 }],
      userId: 'user-1',
      deliveryZoneId: 'zone-1',
    });

    const payload = orderRepositoryMock.createWithItemsAndStock.mock.calls[0][0];
    expect(payload.stockUpdates).toEqual([{ menuId: 'menu-1', newStock: 92 }]);
  });

  it('does NOT queue a stock decrement when stock is null', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', price: 40, minPersons: 5, stock: null, isAvailable: true }),
    );

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 8 }],
      userId: 'user-1',
      deliveryZoneId: 'zone-1',
    });

    const payload = orderRepositoryMock.createWithItemsAndStock.mock.calls[0][0];
    expect(payload.stockUpdates).toEqual([]);
  });

  it('records analytics (write-through) after the order is created', async () => {
    const created = menuFactory({
      id: 'menu-1',
      name: 'Menu A',
      price: 50,
      minPersons: 10,
      stock: null,
      isAvailable: true,
    });
    menuRepositoryMock.findById.mockResolvedValue(created);

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 15 }],
      userId: 'user-1',
      deliveryZoneId: 'zone-1',
    });

    expect(analyticsRepositoryMock.recordOrderStats).toHaveBeenCalledTimes(1);
    const statsArg = analyticsRepositoryMock.recordOrderStats.mock.calls[0][0];
    expect(statsArg.orderStatus).toBe(OrderStatusEnum.PENDING);
    expect(statsArg.lines).toEqual([
      { menuId: 'menu-1', menuName: 'Menu A', quantity: 15, unitPrice: 50, lineRevenue: 675 },
    ]);
  });

  it('sends a confirmation email to the authenticated user', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', price: 50, minPersons: 10, stock: null, isAvailable: true }),
    );

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 15 }],
      userId: 'user-1',
      userEmail: 'user@test.fr',
      deliveryZoneId: 'zone-1',
    });

    expect(mailSenderMock.sendOrderConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(mailSenderMock.sendOrderConfirmationEmail.mock.calls[0][0].email).toBe('user@test.fr');
  });

  it('does not throw when the confirmation email fails', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', price: 50, minPersons: 10, stock: null, isAvailable: true }),
    );
    mailSenderMock.sendOrderConfirmationEmail.mockRejectedValueOnce(new Error('smtp down'));

    await expect(
      createOrderUseCase.executeCreateOrder({
        items: [{ menuId: 'menu-1', quantity: 15 }],
        userId: 'user-1',
        userEmail: 'user@test.fr',
        deliveryZoneId: 'zone-1',
      }),
    ).resolves.toBeDefined();

    expect(loggerMock.error).toHaveBeenCalled();
  });

  it('creates a guest order with guest identity and email', async () => {
    menuRepositoryMock.findById.mockResolvedValue(
      menuFactory({ id: 'menu-1', price: 50, minPersons: 10, stock: null, isAvailable: true }),
    );

    await createOrderUseCase.executeCreateOrder({
      items: [{ menuId: 'menu-1', quantity: 10 }],
      guestInfo: { guestEmail: 'guest@test.fr', guestName: 'Jean Invité', guestPhone: '0600000000' },
      deliveryPostalCode: '33700',
    });

    const payload = orderRepositoryMock.createWithItemsAndStock.mock.calls[0][0];
    expect(payload.order.userId).toBeNull();
    expect(payload.order.guestEmail).toBe('guest@test.fr');
    expect(payload.order.guestName).toBe('Jean Invité');
    expect(mailSenderMock.sendOrderConfirmationEmail.mock.calls[0][0].email).toBe('guest@test.fr');
  });

  it('throws MISSING_IDENTITY when neither userId nor guest email is provided', async () => {
    await expect(
      createOrderUseCase.executeCreateOrder({
        items: [{ menuId: 'menu-1', quantity: 10 }],
        deliveryZoneId: 'zone-1',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_MISSING_IDENTITY' });
  });

  it('throws ORDER_EMPTY when items is empty', async () => {
    await expect(
      createOrderUseCase.executeCreateOrder({ items: [], userId: 'user-1', deliveryZoneId: 'zone-1' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST_ORDER_EMPTY' });
  });
});
