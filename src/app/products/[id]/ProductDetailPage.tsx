'use client';
import { useState } from 'react';
import type { Product } from '@/types/Product';
import PurchaseSection from './PurchaseSection';
import ProductTabSection from './TabSection';
import DotBackgroundWrapper from '@/components/common/DotBackgroundWrapper';

export default function ProductDetailPage({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('상품 정보');

  return (
    <DotBackgroundWrapper>
      <div className="max-w-[800px] mx-auto px-4 pt-4 bg-white">
        <PurchaseSection product={product} />
      </div>
      <div className="w-full max-w-[800px] mx-auto">
        <ProductTabSection activeTab={activeTab} setActiveTab={setActiveTab} product={product} />
      </div>
    </DotBackgroundWrapper>
  );
}
