'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { OrderResponse } from '@/types/Order';
import OrderCompleteHeader from './OrderCompleteHeader';
import OrderCompleteProducts from './OrderCompleteProducts';
import OrderCompleteUserInfo from './OrderCompleteUserInfo';
import { getOrderById } from '@/utils/getOrders';

export default function OrderCompleteWrapper({ orderId }: { orderId: string }) {
  const { user } = useLoginStore();
  const token = user?.token?.accessToken;
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId, token);
        if (res.ok) setOrder(res.item);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, router]);

  if (loading) return <Loading />;
  if (!order) return <div className="text-center py-10">주문 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      {/* 주문 완료 헤더 */}
      <OrderCompleteHeader createdAt={order.createdAt} orderId={String(order._id)} />

      {/* 주문 상품 리스트 */}
      <OrderCompleteProducts products={order.products} cost={order.cost} />

      {/* 배송 정보 */}
      <OrderCompleteUserInfo name={order.user.name} phone={order.user.phone} address={order.address.value} details={order.address.details} memo={order.memo} />
    </div>
  );
}
