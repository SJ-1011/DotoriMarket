'use client';

import { useState, useEffect } from 'react';
import ProductTabSection from '@/app/products/[id]/TabSection';
import RelatedProducts from '@/app/products/[id]/RelatedProducts';
import { useLoginStore } from '@/stores/loginStore';
import { Product } from '@/types/Product';
import { Order } from '@/types/Order';
import { Review } from '@/types/Review';
import { getOrders } from '@/utils/getOrders';
import { getReviews } from '@/utils/getReviews';

interface ProductEditPageProps {
  product: Product;
}

export default function ProductEditPage({ product }: ProductEditPageProps) {
  const [activeTab, setActiveTab] = useState('상품 정보');
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [, setReviews] = useState<Review[]>([]);
  const [, setLoadingReviews] = useState<boolean>(true);

  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken;

  useEffect(() => {
    async function fetchUserOrders() {
      if (!accessToken) {
        setOrder(undefined);
        return;
      }
      const res = await getOrders(accessToken);
      if (res.ok && Array.isArray(res.item)) {
        const foundOrder = res.item.find(order => order.products.some(productItem => String(productItem._id) === String(product._id)));
        setOrder(foundOrder);
      }
    }
    fetchUserOrders();
  }, [accessToken, product._id]);

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
    <>
      <ProductTabSection activeTab={activeTab} setActiveTab={setActiveTab} product={product} order={order} />
      {product.extra?.category?.[0] && <RelatedProducts currentProductId={Number(product._id)} categoryCode={product.extra.category[0]} />}
    </>
  );
}
