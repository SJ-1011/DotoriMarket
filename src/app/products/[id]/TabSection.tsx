'use client';
import type { Product } from '@/types/Product';
import type { Order } from '@/types/Order';
import ProductInfo from './ProductInfo';
import ShoppingGuide from './ShoppingGuide';
import ProductQuestions from './ProductQuestions';
import ProductReviews from './review/index';

interface ProductTabSectionProps {
  product: Product;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  order?: Order | null;
}

export default function ProductTabSection({ product, activeTab, setActiveTab, order }: ProductTabSectionProps) {
  const tabs = ['상품 정보', '쇼핑 가이드', '상품 후기', '상품 문의'];

  return (
    <>
      <nav className="flex mt-12 bg-primary-light overflow-hidden sticky top-[60px] sm:top-[69px] z-20" style={{ height: '44px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`flex-1 text-center font-medium text-sm cursor-pointer transition ${isActive ? 'bg-background' : 'text-black bg-transparent'}`} style={{ lineHeight: '44px' }}>
              {tab}
            </button>
          );
        })}
      </nav>

      <div>
        {activeTab === '상품 정보' && <ProductInfo product={product} />}
        {activeTab === '쇼핑 가이드' && <ShoppingGuide />}
        {activeTab === '상품 후기' && <ProductReviews productId={product._id} productName={product.name} orderId={order?._id} orderProducts={Array.isArray(order?.products) ? order.products : []} />}
        {activeTab === '상품 문의' && <ProductQuestions productId={product._id} productName={product.name} />}
      </div>
    </>
  );
}
