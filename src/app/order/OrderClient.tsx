'use client';

import { useFormContext } from 'react-hook-form';
import type { OrderForm } from '@/types/Order';
import type { CartItem } from '@/types/Cart';
import OrderUserInfo from './OrderUserInfo';
import OrderProductList from './OrderProductList';
import OrderCostSummary from './OrderCostSummary';
import OrderPayment from './OrderPayment';

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

export default function OrderClient({ cartCost, cartItems, userInfo }: Props) {
  // context에서 받아옴
  const { handleSubmit } = useFormContext<OrderForm>();

  const onSubmit = (data: OrderForm) => {
    console.log('최종 API 전송 데이터:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <OrderUserInfo name={userInfo.name} recipient={userInfo.recipient} phone={userInfo.phone} address={userInfo.address} />
      <OrderProductList items={cartItems} />
      <OrderCostSummary cartCost={cartCost} />
      <OrderPayment />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        주문하기
      </button>
    </form>
  );
}
