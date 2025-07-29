'use client';

import { useFormContext } from 'react-hook-form';
import type { OrderForm } from '@/types/Order';
import type { CartItem } from '@/types/Cart';
import OrderUserInfo from './OrderUserInfo';
import OrderProductList from './OrderProductList';
import OrderCostSummary from './OrderCostSummary';
import OrderPayment from './OrderPayment';
import { useState } from 'react';

interface Props {
  cartItems: CartItem[];
  cartCost: {
    products: number;
    shippingFees: number;
    discount: { products: number; shippingFees: number };
    total: number;
  };
  userInfo: {
    name: string;
    recipient: string;
    phone: string;
    address: string;
  };
}

export default function OrderClient({ cartCost, cartItems, userInfo, onSubmit }: Props & { onSubmit: (data: OrderForm) => Promise<void> }) {
  const { handleSubmit } = useFormContext<OrderForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderSubmit = async (data: OrderForm) => {
    if (isSubmitting) return;   
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOrderSubmit)} className="relative space-y-4">
      {/* 주문 정보 섹션 */}
      <OrderUserInfo {...userInfo} />
      <OrderProductList items={cartItems} />
      <OrderCostSummary cartCost={cartCost} />
      <OrderPayment />

      {/* 주문 버튼 */}
       <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded cursor-pointer disabled:opacity-50">
        {isSubmitting ? '주문 처리 중...' : '주문하기'}
      </button>

      {/* 로딩 오버레이 (스피너) */}
      {isSubmitting && (
        <div className="absolute inset-0 z-10  bg-grey bg-opacity-30 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-white font-semibold text-sm">주문 처리 중...</span>
        </div>
      )}
    </form>
  );
}

