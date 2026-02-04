import { OrderStatus, ORDER_STATUS_LABELS } from '@vite-et-gourmand/supabase/enums';

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PREPARING]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.READY]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERING]: 'bg-orange-100 text-orange-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800';
  const label = ORDER_STATUS_LABELS[status as OrderStatus] ?? status;

  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}
