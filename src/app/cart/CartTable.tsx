'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { CartResponse } from '@/types/Cart';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface CartTableProps {
  items: CartResponse['item']; // 장바구니 아이템 리스트
  selectedItems: number[]; // 선택된 아이템 id 리스트
  toggleItem: (id: number) => void; // 개별 체크박스 토글
  toggleAll: () => void; // 전체 체크박스 토글
  increaseQty: (id: number, stock: number, buyQty?: number) => void;
  decreaseQty: (id: number) => void;
  handleDeleteItem: (id: number) => void;
  getQuantity: (id: number) => number; // 상태에서 수량 가져오는 함수
}

export default function CartTable({ items, selectedItems, toggleItem, toggleAll, increaseQty, decreaseQty, handleDeleteItem, getQuantity }: CartTableProps) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  return (
    <table className="hidden sm:table w-full text-sm border-y">
      <thead className="text-sm lg:text-base text-dark-gray">
        <tr className="border-b border-gray-200">
          <th className="text-center py-2 px-2 lg:py-4">
            <input type="checkbox" checked={items.filter(item => item.product.quantity > 0).every(item => selectedItems.includes(item._id))} onChange={toggleAll} />
          </th>
          <th className="text-center py-2 px-2 lg:py-4">상품 정보</th>
          <th className="text-center py-2 px-2 lg:py-4">수량</th>
          <th className="text-center py-2 px-2 lg:py-4">주문 금액</th>
          <th className="text-center py-2 px-2 lg:py-4">배송비</th>
          <th className="text-center py-2 px-2 lg:py-4">삭제</th>
        </tr>
      </thead>
      <tbody>
        {items.map(product => (
          <tr key={product._id} className="text-center text-sm lg:text-base border-b py-4 border-gray-200">
            {/* 체크박스 */}
            <td>
              <input type="checkbox" disabled={product.product.quantity === 0} checked={selectedItems.includes(product._id)} onChange={() => toggleItem(product._id)} />
            </td>

            {/* 상품 정보 */}
            <td className="text-left border-r border-gray-200">
              <div className="flex items-center gap-4 py-4 lg:py-6 cursor-pointer" onClick={() => router.push(`/products/${product.product._id}`)}>
                <Image src={getFullImageUrl(product.product.image.path) ?? '/fallback.png'} alt={product.product.name} width={80} height={80} className="rounded-md" />
                <div>
                  <div className="font-semibold">{product.product.name}</div>
                  <div className="text-gray-500 text-sm">{product.product.price.toLocaleString()}원</div>
                </div>
              </div>
            </td>

            {/* 수량 조절 */}
            <td className="border-r border-gray-200">
              {product.product.quantity === 0 ? (
                <div className="text-red-500 font-semibold text-center">품절</div>
              ) : (
                <div className="flex items-center border divide-x border-gray justify-center w-fit mx-auto">
                  <button onClick={() => decreaseQty(product._id)} className="px-3 py-1 text-base cursor-pointer">
                    -
                  </button>
                  <span className="px-3 py-1 text-base">{getQuantity(product._id)}</span>
                  <button onClick={() => increaseQty(product._id, product.product.quantity, product.product.buyQuantity)} className="px-3 py-1 text-base cursor-pointer">
                    +
                  </button>
                </div>
              )}
            </td>

            {/* 주문 금액 */}
            <td className="border-r border-gray-200">{(product.product.price * getQuantity(product._id)).toLocaleString()}원</td>

            {/* 배송비 */}
            <td className="border-r border-gray-200">{product.product.shippingFees?.toLocaleString() ?? '3000'}원</td>

            {/* 삭제 버튼 */}
            <td>
              <button onClick={() => handleDeleteItem(product._id)} className="text-sm text-gray hover:text-red cursor-pointer">
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
