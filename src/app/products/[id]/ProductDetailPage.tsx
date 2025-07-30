'use client';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/Product';
import PurchaseSection from './PurchaseSection';
import ProductTabSection from './TabSection';
import DotBackgroundWrapper from '@/components/common/DotBackgroundWrapper';
import { Order } from '@/types/Order';
import { useLoginStore } from '@/stores/loginStore';
import { getOrders } from '@/utils/getOrders';
import type { Review } from '@/types/Review';
import { getReviews } from '@/utils/getReviews';

export default function ProductDetailPage({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('상품 정보');
  const [order, setOrder] = useState<Order | undefined>(undefined);

  // 리뷰 상태 선언 추가
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);

  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  // 주문 정보 불러오기
  useEffect(() => {
    async function fetchUserOrders() {
      if (!accessToken) {
        setOrder(undefined);
        return;
      }
      const res = await getOrders(accessToken);
      if (res.ok && Array.isArray(res.item)) {
        const foundOrder = res.item.find((order: Order) => order.products.some(productItem => String(productItem._id) === String(product._id)));
        setOrder(foundOrder);
      }
    }
    fetchUserOrders();
  }, [accessToken, product._id]);

  // 리뷰 불러오기
  useEffect(() => {
    async function fetchProductReviews() {
      setLoadingReviews(true);
      try {
        const data = await getReviews(product._id);
        setReviews(data);
      } catch (error) {
        console.error('리뷰 불러오기 실패:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchProductReviews();
  }, [product._id]);

  return (
    <DotBackgroundWrapper>
      <div className="max-w-[800px] mx-auto px-4 pt-4 bg-white">
        <PurchaseSection product={product} reviews={reviews} loadingReviews={loadingReviews} />
      </div>
      <div className="w-full max-w-[800px] mx-auto">
        <ProductTabSection activeTab={activeTab} setActiveTab={setActiveTab} product={product} order={order} />
      </div>
    </DotBackgroundWrapper>
  );
}
