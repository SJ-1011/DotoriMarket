import { ORDER_STATE_LABEL, AdminOrderHistory } from '@/types/AdminOrder';

export default function OrderHistory({ history }: { history: AdminOrderHistory[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-dark-gray mb-2">주문 상태 변경 내역</h2>
      {!history || history.length === 0 ? (
        <p className="text-xs sm:text-sm lg:text-base text-gray">상태 변경 이력이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {history.map((h, i) => (
            <li key={i} className="flex justify-between text-xs sm:text-sm lg:text-base py-1">
              <span className="font-semibold">{ORDER_STATE_LABEL[h.updated.state]}</span>
              <span className="text-gray">{new Date(h.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
