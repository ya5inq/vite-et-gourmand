import { useState } from 'react';
import { useRejectOrder } from '@/api/hooks/useOrders';
import { useAuthContext } from '@/contexts/AuthContext';

interface OrderRejectModalProps {
  orderId: string;
  onClose: () => void;
}

export const OrderRejectModal = ({ orderId, onClose }: OrderRejectModalProps) => {
  const { user } = useAuthContext();
  const rejectOrder = useRejectOrder();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (reason.trim().length < 10) {
      setError('La raison doit contenir au moins 10 caracteres');
      return;
    }

    if (!user?.id) {
      setError('Vous devez etre connecte');
      return;
    }

    rejectOrder.mutate(
      { id: orderId, reason: reason.trim(), rejectedBy: user.id },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-foreground">Refuser la commande</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Raison du refus *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Expliquez la raison du refus (min. 10 caracteres)..."
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Cette raison sera visible par le client.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={rejectOrder.isPending}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {rejectOrder.isPending ? 'Envoi...' : 'Confirmer le refus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
