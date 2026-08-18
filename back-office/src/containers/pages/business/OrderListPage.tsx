import { useState } from 'react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import {
  useOrders,
  useUpdateOrderStatus,
  useAcceptOrder,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_TRANSITIONS,
  type OrderStatus,
} from '@/api/hooks/useOrders';
import { OrderRejectModal } from '@/components/molecules/OrderRejectModal';

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'ACCEPTED', label: 'Acceptées' },
  { value: 'PREPARING', label: 'En préparation' },
  { value: 'DELIVERING', label: 'En livraison' },
  { value: 'COMPLETED', label: 'Terminées' },
  { value: 'REJECTED', label: 'Refusées' },
  { value: 'CANCELLED', label: 'Annulées' },
];

export const OrderListPage = () => {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const acceptOrder = useAcceptOrder();
  const [statusModalOrder, setStatusModalOrder] = useState<{ id: string; status: OrderStatus } | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatus.mutate({ id: orderId, status }, { onSuccess: () => setStatusModalOrder(null) });
  };

  const handleAccept = (orderId: string) => {
    acceptOrder.mutate({ id: orderId });
  };

  const filteredOrders = orders?.filter(
    (order) => activeTab === 'all' || order.status === activeTab
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Statuses reachable from the currently selected order (excluding REJECTED,
  // which has its own dedicated modal because it requires reason + contactMode).
  const reachableStatuses = statusModalOrder
    ? ORDER_STATUS_TRANSITIONS[statusModalOrder.status].filter((s) => s !== 'REJECTED')
    : [];

  return (
    <DashboardPageLayout title="Commandes" description="Gestion des commandes">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Articles</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Livraison</th>
                <th className="px-4 py-3 text-left font-medium">Créé le</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders?.map((order) => {
                const clientName = order.guestName || 'Client';
                const clientEmail = order.guestEmail;

                return (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{clientName}</p>
                        {clientEmail && (
                          <p className="text-xs text-muted-foreground">{clientEmail}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{order.itemCount} article(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">{order.totalPrice.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{formatDate(order.deliveryDate)}</p>
                        {order.deliveryCity && (
                          <p className="text-xs text-muted-foreground">{order.deliveryCity}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAccept(order.id)}
                              disabled={acceptOrder.isPending}
                              className="rounded-md bg-green-500 text-white px-3 py-1 text-xs font-medium hover:bg-green-600 disabled:opacity-50"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => setRejectModalId(order.id)}
                              className="rounded-md bg-destructive text-destructive-foreground px-3 py-1 text-xs font-medium hover:opacity-90"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {ORDER_STATUS_TRANSITIONS[order.status].filter((s) => s !== 'REJECTED').length > 0 && (
                          <button
                            onClick={() => setStatusModalOrder({ id: order.id, status: order.status })}
                            className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-accent"
                          >
                            Statut
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucune commande
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Status change modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Changer le statut</h2>
            {reachableStatuses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune transition disponible.</p>
            ) : (
              <div className="space-y-2">
                {reachableStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(statusModalOrder.id, status)}
                    disabled={updateStatus.isPending}
                    className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-accent ${ORDER_STATUS_COLORS[status]}`}
                  >
                    {ORDER_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStatusModalOrder(null)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModalId && (
        <OrderRejectModal
          orderId={rejectModalId}
          onClose={() => setRejectModalId(null)}
        />
      )}
    </DashboardPageLayout>
  );
};
