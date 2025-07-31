import type { AdminOrder } from '@/types/AdminOrder';
import AdminOrderCard from './AdminOrderCard';

interface Props {
  orders: AdminOrder[];
  timeAgo: (date: string) => string;
  removePostalCode: (address?: string) => string;
  onChangeOrderState: (orderId: number) => void;
}

export default function AdminOrdersMobile({ orders, timeAgo, removePostalCode, onChangeOrderState }: Props) {
  return (
    <div className="w-full sm:hidden">
      <div className="flex flex-col gap-3 w-full">
        {orders.map(order => (
          <AdminOrderCard key={order._id} order={order} timeAgo={timeAgo} removePostalCode={removePostalCode} onChangeOrderState={onChangeOrderState} />
        ))}
      </div>
    </div>
  );
}
