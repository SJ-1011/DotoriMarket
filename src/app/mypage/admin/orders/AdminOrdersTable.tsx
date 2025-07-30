import type { AdminOrder } from '@/types/AdminOrder';
import Image from 'next/image';
import { ORDER_STATE_LABEL } from '@/types/AdminOrder';
import { useRouter } from 'next/navigation';

interface Props {
  orders: AdminOrder[];
  timeAgo: (date: string) => string;
  removePostalCode: (address?: string) => string;
  onChangeOrderState: (orderId: number) => void;
}

export default function AdminOrdersTable({ orders, timeAgo, removePostalCode, onChangeOrderState }: Props) {
  const router = useRouter();

  const goToDetail = (id: number) => {
    router.push(`/mypage/admin/orders/${id}`);
  };

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="w-full table-auto text-sm lg:text-base text-dark-gray text-center">
        <thead className="bg-primary-light text-primary-dark">
          <tr>
            <th className="p-2 lg:p-3">번호</th>
            <th className="p-2 lg:p-3">주문일</th>
            <th className="p-2 lg:p-3">상품</th>
            <th className="p-2 lg:p-3">금액</th>
            <th className="p-2 lg:p-3">주문자</th>
            <th className="p-2 lg:p-3">배송지</th>
            <th className="p-2 lg:p-3">상태</th>
            <th className="p-2 lg:p-3">배송 변경</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const product = order.products[0];

            return (
              <tr key={order._id} onClick={() => goToDetail(order._id)} className="border-b border-soft-gray hover:bg-secondary transition cursor-pointer">
                <td className="p-2 lg:p-3 font-semibold text-primary">#{order._id}</td>
                <td className="p-2 lg:p-3 text-gray">{timeAgo(order.createdAt)}</td>

                {/* 상품 이미지만 */}
                <td className="p-2 lg:p-3">{product?.image?.path && <Image src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image.path}`} alt="상품 이미지" width={36} height={36} className="rounded border inline-block lg:w-[42px] lg:h-[42px]" />}</td>

                <td className="p-2 lg:p-3 font-bold">{order.cost.total.toLocaleString()}원</td>
                <td className="p-2 lg:p-3">{order.user?.name}</td>
                <td className="p-2 lg:p-3 truncate max-w-[140px]">{removePostalCode(order.address?.value)}</td>

                <td className="p-2 lg:p-3">
                  <span className="px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-[11px] lg:text-xs bg-primary-light text-primary-dark border border-primary">{ORDER_STATE_LABEL[order.state] ?? '상태'}</span>
                </td>

                {/* 배송 상태 변경 버튼 */}
                <td className="p-2 lg:p-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onChangeOrderState(order._id);
                    }}
                    className="text-[11px] lg:text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    변경
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
