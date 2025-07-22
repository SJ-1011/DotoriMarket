'use client';
import { useState } from 'react';
import type { Product } from '@/types/Product';
import PurchaseSection from './PurchaseSection';
import ProductTabSection from './ProductTabSection';

export default function ProductDetailPage({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('상품정보');

  return (
    <div className="max-w-3xl mx-auto p-4">
      <PurchaseSection product={product} />
      <ProductTabSection activeTab={activeTab} setActiveTab={setActiveTab} product={product} />
    </div>
  );
}
