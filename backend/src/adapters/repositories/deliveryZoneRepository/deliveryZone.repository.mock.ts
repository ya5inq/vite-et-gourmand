import { vi, Mocked } from 'vitest';

import { DeliveryZoneInterface } from '@/domain/entities/deliveryZone/deliveryZone.entity.interface';
import { DeliveryZoneRepositoryInterface } from '@/domain/interfaces/repositories/deliveryZone.repository.interface';

import { deliveryZoneFactory } from '@/domain/entities/deliveryZone/deliveryZone.factory';

export const getDeliveryZoneRepositoryMock = (options?: {
  findById?: DeliveryZoneInterface | null;
  findByPostalCode?: DeliveryZoneInterface | null;
  findAll?: DeliveryZoneInterface[];
  countFindAll?: number;
}): Mocked<DeliveryZoneRepositoryInterface> => ({
  findById: vi.fn().mockResolvedValue(options?.findById ?? null),
  findByPostalCode: vi.fn().mockResolvedValue(options?.findByPostalCode ?? null),
  findAll: vi.fn().mockResolvedValue(options?.findAll ?? []),
  countFindAll: vi.fn().mockResolvedValue(options?.countFindAll ?? 0),
  create: vi
    .fn()
    .mockImplementation((deliveryZone: DeliveryZoneInterface) =>
      Promise.resolve(deliveryZone ?? deliveryZoneFactory()),
    ),
  updateOne: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
});
