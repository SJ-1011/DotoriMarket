import type { AdminOrder } from '@/types/AdminOrder';
import { ORDER_STATE_LABEL } from '@/types/AdminOrder';

export default function OrderSummary({ order }: { order: AdminOrder }) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-dark-gray mb-2">주문 요약</h2>
      <p className="text-xs sm:text-sm lg:text-base text-dark-gray">
        주문번호: <span className="font-semibold text-primary">#{order._id}</span>
      </p>
      <p className="text-xs sm:text-sm lg:text-base text-dark-gray">주문일: {order.createdAt}</p>
      <p className="text-xs sm:text-sm lg:text-base text-dark-gray">
        현재 상태: <span className="px-2 py-0.5 lg:py-1 rounded bg-primary-light text-primary-dark text-xs sm:text-sm">{ORDER_STATE_LABEL[order.state]}</span>
      </p>
      {order.memo && <p className="mt-2 text-xs sm:text-sm lg:text-sm text-gray">메모: {order.memo}</p>}
    </div>
  );
}
