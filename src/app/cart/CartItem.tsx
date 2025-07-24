'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import type { CartItem } from '@/types/Cart';
import { useCartQuantityStore } from '@/stores/cartQuantityStore';
import { patchCartQuantity } from '@/data/actions/patchCartQuantity';
import { useLoginStore } from '@/stores/loginStore';

interface Props {
  item: CartItem;
}

export default function CartItem({ item }: Props) {
  const { user } = useLoginStore();
  const qty = useCartQuantityStore(state => state.getQuantity(item._id));
  const setQty = useCartQuantityStore(state => state.setQuantity);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const prevQty = useRef(qty);

  const handleIncrease = () => {
    const maxQty = item.product.quantity;
    if (qty >= maxQty) {
      alert(`최대 ${maxQty}개까지 구매할 수 있어요!`);
      return;
    }
    setQty(item._id, qty + 1);
  };

  const handleDecrease = () => {
    if (qty <= 1) return;
    setQty(item._id, qty - 1);
  };

  useEffect(() => {
    if (prevQty.current === qty) return;
    if (!user?.token?.accessToken) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        await patchCartQuantity(item._id, qty, user.token.accessToken);
        prevQty.current = qty;
      } catch {
        alert('수량 변경 실패 😢');
        setQty(item._id, prevQty.current); // rollback
      }
    }, 300);
  }, [qty]);

  const getImageUrl = (path: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    return `${API_URL}/${path}`;
  };

  return (
    <tr className="border-b">
      <td className="text-center">
        <input type="checkbox" className="mx-auto" />
      </td>
      <td className="flex gap-4 py-4">
        <Image src={getImageUrl(item.product.image.path)} alt={item.product.name} width={100} height={100} />
        <div>
          <h3 className="font-semibold text-sm mb-1">{item.product.name}</h3>
          <div className="text-xs text-gray-600">
            {item.product.name} / {qty}개
          </div>
          <div className="line-through text-xs text-gray-400">{item.product.price.toLocaleString()}원</div>
          <div className="text-red-500 text-sm font-bold">33% {Math.floor(item.product.price * 0.67).toLocaleString()}원</div>
        </div>
      </td>
      <td className="text-center">
        <div className="inline-flex border items-center">
          <button onClick={handleDecrease} className="px-2">
            -
          </button>
          <span className="px-3">{qty}</span>
          <button onClick={handleIncrease} className="px-2">
            +
          </button>
        </div>
      </td>
      <td className="text-center">{(item.product.price * qty).toLocaleString()}원</td>
      <td className="text-center text-sm">
        {item.product.price * qty > 60000 ? (
          '무료 업체배송'
        ) : (
          <div>
            조건무료 업체배송
            <br />
            <span className="text-[11px] text-gray-500">(배송비 3,500원)</span>
          </div>
        )}
      </td>
    </tr>
  );
}
