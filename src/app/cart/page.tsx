'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCarts } from '@/utils/getCarts';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';
import type { CartResponse } from '@/types/Cart';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { useLoginStore } from '@/stores/loginStore';
import Image from 'next/image';
import Loading from '../loading';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function CartPage() {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const debounceTimers = useRef<Record<number, NodeJS.Timeout | null>>({});
  const previousQty = useRef<Record<number, number>>({});
  const { user } = useLoginStore();
  const getImageUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  const cartStore = useCartQuantityStore();
  const shippingCost = 3000;

  const priceTable = useMemo(() => {
    if (!cartData) return {};
    return Object.fromEntries(cartData.item.map(product => [product._id, product.product.price]));
  }, [cartData]);

  const orderTotal = cartStore.getTotal(priceTable);
  const totalWithShipping = orderTotal + shippingCost;

  const increaseQty = (id: number, stock: number) => {
    const currentQty = cartStore.getQuantity(id);
    if (currentQty >= stock) {
      alert(`최대 ${stock}개까지 구매 가능합니다.`);
      return;
    }
    cartStore.setQuantity(id, currentQty + 1);
  };

  const decreaseQty = (id: number) => {
    const currentQty = cartStore.getQuantity(id);
    if (currentQty <= 1) return;
    cartStore.setQuantity(id, currentQty - 1);
  };

  useEffect(() => {
    if (!user?.token?.accessToken) return;

    const fetchAndSyncCart = async () => {
      const data = await getCarts(user.token.accessToken);
      setCartData(data);
      const initialQuantities = Object.fromEntries(data.item.map(product => [product._id, product.quantity]));
      cartStore.resetQuantities(initialQuantities);
    };

    fetchAndSyncCart();
  }, [user?.token?.accessToken]);
  useEffect(() => {
    if (!cartData || !user?.token?.accessToken) return;

    cartData.item.forEach(product => {
      const currentQty = cartStore.getQuantity(product._id);
      if (previousQty.current[product._id] === currentQty) return;

      if (debounceTimers.current[product._id]) {
        clearTimeout(debounceTimers.current[product._id]!);
      }

      debounceTimers.current[product._id] = setTimeout(async () => {
        try {
          await patchCartQuantity(product._id, currentQty, user.token.accessToken);
          previousQty.current[product._id] = currentQty;
        } catch {
          cartStore.setQuantity(product._id, previousQty.current[product._id]);
        }
      }, 300);
    });
  }, [cartStore.quantities]);

  if (!cartData) return <Loading />;

  return (
    <div className="p-4">
      <div className="max-w-[1080px] mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '장바구니' }]} />
        </div>

        {/* 헤더 (데스크탑 전용 테이블) */}
        <table className="hidden sm:table w-full text-sm border-y">
          <thead className="text-sm lg:text-base text-dark-gray">
            <tr className=" border-b border-gray-200">
              <th className="text-center py-2 px-2 lg:py-4">
                <input type="checkbox" />
              </th>
              <th className="text-center py-2 px-2 lg:py-4">상품 정보</th>
              <th className="text-center py-2 px-2 lg:py-4">수량</th>
              <th className="text-center py-2 px-2 lg:py-4">주문 금액</th>
              <th className="text-center py-2 px-2 lg:py-4">배송비</th>
              <th className="text-center py-2 px-2 lg:py-4">삭제</th>
            </tr>
          </thead>
          <tbody>
            {cartData.item.map(product => (
              <tr key={product._id} className="text-center text-sm lg:text-base border-b py-4 border-gray-200">
                <td>
                  <input type="checkbox" />
                </td>
                <td className="text-left border-r border-gray-200">
                  <div className="flex items-center gap-4 py-4 lg:py-6">
                    <Image src={getImageUrl(product.product.image.path)} alt={product.product.name} width={80} height={80} className="rounded-md" />
                    <div>
                      <div className="font-semibold">{product.product.name}</div>
                      <div className="text-gray-500 text-sm">{product.product.price.toLocaleString()}원</div>
                    </div>
                  </div>
                </td>
                <td className="border-r border-gray-200">
                  <div className="flex items-center justify-center gap-2 border rounded-md w-fit mx-auto">
                    <button onClick={() => decreaseQty(product._id)} className="px-2 text-lg">
                      -
                    </button>
                    <span className="px-2">{cartStore.getQuantity(product._id)}</span>
                    <button onClick={() => increaseQty(product._id, product.product.quantity)} className="px-2 text-lg">
                      +
                    </button>
                  </div>
                </td>
                <td className="border-r border-gray-200">{(product.product.price * cartStore.getQuantity(product._id)).toLocaleString()}원</td>
                <td className="border-r border-gray-200">{shippingCost.toLocaleString()}원</td>
                <td>
                  <button className="text-sm text-gray-400 hover:text-red-500">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 모바일 카드형 */}
        <div className="flex flex-col sm:hidden">
          {cartData.item.map(product => (
            <div key={product._id} className="py-4 border-t border-dark-gray first:border-t-0 last:border-b last:border-dark-gray">
              <div className="flex justify-between items-start gap-4">
                <Image src={getImageUrl(product.product.image.path)} alt={product.product.name} width={80} height={80} className="rounded-sm" />
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-sm">{product.product.name}</div>
                    <button className="text-xs border border-gray px-2 py-1 text-gray hover:text-red hover:border-red">삭제</button>
                  </div>
                  <div className="text-gray text-xs mt-1">{product.product.price.toLocaleString()}원</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex border divide-x border-gray overflow-hidden text-sm">
                  <button onClick={() => decreaseQty(product._id)} className="px-3 py-1">
                    -
                  </button>
                  <span className="px-4 py-1">{cartStore.getQuantity(product._id)}</span>
                  <button onClick={() => increaseQty(product._id, product.product.quantity)} className="px-3 py-1">
                    +
                  </button>
                </div>
                <div className="font-bold text-base">총 {(product.product.price * cartStore.getQuantity(product._id)).toLocaleString()}원</div>
              </div>
            </div>
          ))}
        </div>

        {/* 총 결제 정보 */}
        <div className="mt-4 mb-100 text-dark-gray text-base ">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>총 주문금액</th>
                <th>총 배송비</th>
                <th>총 결제금액</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold">
                <td>{orderTotal.toLocaleString()}원</td>
                <td>{shippingCost.toLocaleString()}원</td>
                <td className="text-red">{totalWithShipping.toLocaleString()}원</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 구매 버튼 */}
        <div className="mt-8 sm:static fixed bottom-0 left-0 right-0 p-4 z-2 sm:border-none sm:p-0">
          <button className="w-full bg-primary text-white py-4 rounded-md text-center">
            <span className="font-bold text-base">{totalWithShipping.toLocaleString()}원 구매하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
