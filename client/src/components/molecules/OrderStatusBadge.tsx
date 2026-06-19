import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from '@/lib/orderStatus';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const colorClass =
    ORDER_STATUS_COLORS[status as OrderStatus] ?? 'bg-gray-100 text-gray-800';
  const label = ORDER_STATUS_LABELS[status as OrderStatus] ?? status;

  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}
    >
      {label}
    </span>
  );
}
