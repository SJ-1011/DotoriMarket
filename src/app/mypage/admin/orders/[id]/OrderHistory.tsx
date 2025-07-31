import { ORDER_STATE_LABEL, AdminOrderHistory } from '@/types/AdminOrder';

export default function OrderHistory({ history }: { history: AdminOrderHistory[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2">주문 상태 변경 내역</h2>
      {!history || history.length === 0 ? (
        <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500">📭 상태 변경 이력이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {history.map((h, i) => (
            <li key={i} className="flex justify-between text-xs sm:text-sm lg:text-base py-1">
              <span className="font-semibold">{ORDER_STATE_LABEL[h.updated.state]}</span>
              <span className="text-gray-500">{new Date(h.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
