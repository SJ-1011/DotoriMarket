'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCarts } from '@/utils/getCarts';
import type { CartResponse } from '@/types/Cart';
import { useLoginStore } from '@/stores/loginStore';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import Loading from '../loading';
import CartItem from './CartItem';

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const { user } = useLoginStore();
  const quantityStore = useCartQuantityStore();

  useEffect(() => {
    if (!user?.token?.accessToken) return;
    getCarts(user.token.accessToken).then(data => {
      setCart(data);
      const initial: Record<number, number> = {};
      data.item.forEach(item => {
        initial[item._id] = item.quantity;
      });
      quantityStore.resetQuantities(initial);
    });
  }, [user?.token?.accessToken]);

  const priceMap = useMemo(() => {
    if (!cart) return {};
    return cart.item.reduce(
      (acc, item) => {
        acc[item._id] = item.product.price;
        return acc;
      },
      {} as Record<number, number>,
    );
  }, [cart]);

  const totalCost = useCartQuantityStore(state => state.getTotal(priceMap));
  const shippingFee = cart?.cost.shippingFees ?? 0;
  const finalTotal = totalCost + shippingFee;

  if (!cart) return <Loading />;

  return (
    <div className="bg-background p-4">
      <div className="max-w-[1080px] mx-auto">
        <table className="w-full text-sm border-t border-black">
          <thead>
            <tr className="border-b border-gray-300 text-center">
              <th className="w-10 py-3">
                <input type="checkbox" className="mx-auto" />
              </th>
              <th className="text-left">상품 정보</th>
              <th>수량</th>
              <th>주문금액</th>
              <th>배송비</th>
            </tr>
          </thead>
          <tbody>
            {cart.item.map(item => (
              <CartItem key={item._id} item={item} />
            ))}
          </tbody>
        </table>

        <table className="w-full mt-10 border-t border-black text-center">
          <thead>
            <tr>
              <th>총 주문금액</th>
              <th>총 배송비</th>
              <th>총 결제금액</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-lg font-bold">
              <td>{totalCost.toLocaleString()}원</td>
              <td>{shippingFee.toLocaleString()}원</td>
              <td className="text-red-600">{finalTotal.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
