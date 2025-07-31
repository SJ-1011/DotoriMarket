'use client';

import { useEffect, useState } from 'react';
import type { AdminOrderDetail } from '@/types/AdminOrder';
import { getAdminOrderDetail } from '@/utils/getAdminOrders';
import OrderSummary from './OrderSummary';
import OrderedProducts from './OrderProducts';
import PaymentInfo from './PaymentInfo';
import BuyerInfo from './BuyerInfo';
import OrderHistory from './OrderHistory';
import { useLoginStore } from '@/stores/loginStore';

export default function AdminOrderDetailWrapper({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useLoginStore();
  const token = user?.token?.accessToken ?? '';

  useEffect(() => {
    if (!token) return;

    (async () => {
      const res = await getAdminOrderDetail(orderId, token);
      if (res.ok === 1 && res.item) {
        const productsWithUrl = res.item.products.map(p => ({
          ...p,
          imageUrl: p.image?.path ? `${process.env.NEXT_PUBLIC_API_URL}/${p.image.path}` : '/no-image.png',
        }));

        const detail: AdminOrderDetail = {
          ...res.item,
          products: productsWithUrl,
          history: res.item.history ?? [],
        };

        setOrder(detail);
      }
      setLoading(false);
    })();
  }, [orderId, token]);

  if (loading) return <p className="text-center py-6">⏳ 주문 상세 불러오는 중...</p>;
  if (!order) return <p className="text-center py-6">❌ 주문 정보를 찾을 수 없습니다.</p>;

  return (
    <section className="p-4 sm:px-0 grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-4">
      {/* 1열 1행 */}
      <div className="sm:col-start-1 sm:row-start-1">
        <OrderSummary order={order} />
      </div>

      {/* 1열 2행 */}
      <div className="sm:col-start-1 sm:row-start-2">
        <OrderedProducts products={order.products} />
      </div>

      {/* 2열 1행 */}
      <div className="sm:col-start-2 sm:row-start-1">
        <BuyerInfo user={order.user} address={order.address} />
      </div>

      {/* 2열 2행 */}
      <div className="sm:col-start-2 sm:row-start-2">
        <PaymentInfo cost={order.cost} />
      </div>

      {/* 3열 전체 */}
      <div className="sm:col-start-3 sm:col-end-4 sm:row-start-1 sm:row-end-3">
        <OrderHistory history={order.history} />
      </div>
    </section>
  );
}
