import { useState } from 'react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import {
  useOrders,
  useUpdateOrderStatus,
  useAcceptOrder,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from '@/api/hooks/useOrders';
import { OrderRejectModal } from '@/components/molecules/OrderRejectModal';

const ALL_STATUSES: OrderStatus[] = ['pending', 'rejected', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmees' },
  { value: 'preparing', label: 'En preparation' },
  { value: 'rejected', label: 'Refusees' },
  { value: 'cancelled', label: 'Annulees' },
];

export const OrderListPage = () => {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const acceptOrder = useAcceptOrder();
  const [statusModalId, setStatusModalId] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatus.mutate({ id: orderId, status }, { onSuccess: () => setStatusModalId(null) });
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
                <th className="px-4 py-3 text-left font-medium">Cree le</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders?.map((order) => {
                // Get client name from profiles or guest info
                const clientName = order.profiles
                  ? [order.profiles.first_name, order.profiles.last_name].filter(Boolean).join(' ') || 'Client'
                  : order.guest_name || 'Client invité';
                const clientEmail = order.profiles?.email || order.guest_email;

                // Get order items summary
                const itemsSummary = order.order_items?.length
                  ? order.order_items.map((item) => `${item.menus?.name || 'Menu'} x${item.quantity}`).join(', ')
                  : '-';

                return (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{clientName}</p>
                        {clientEmail && (
                          <p className="text-xs text-muted-foreground">{clientEmail}</p>
                        )}
                        {order.guest_phone && (
                          <p className="text-xs text-muted-foreground">{order.guest_phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-48">
                      <p className="truncate text-sm" title={itemsSummary}>
                        {itemsSummary}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      {order.status === 'rejected' && order.rejection_reason && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-32 truncate" title={order.rejection_reason}>
                          {order.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">{order.total_price.toFixed(2)} EUR</td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{formatDate(order.delivery_date)}</p>
                        {order.delivery_city && (
                          <p className="text-xs text-muted-foreground">{order.delivery_city}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
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
                        <button
                          onClick={() => setStatusModalId(order.id)}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-accent"
                        >
                          Statut
                        </button>
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
      {statusModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Changer le statut</h2>
            <div className="space-y-2">
              {ALL_STATUSES.filter((s) => s !== 'rejected').map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(statusModalId, status)}
                  disabled={updateStatus.isPending}
                  className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-accent ${ORDER_STATUS_COLORS[status]}`}
                >
                  {ORDER_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setStatusModalId(null)}
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
