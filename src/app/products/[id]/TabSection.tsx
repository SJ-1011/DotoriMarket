import type { Product } from '@/types/Product';
import ProductInfo from './Info';
import ShoppingGuide from './ShoppingGuide';
import ProductReviews from './Reviews';
import ProductQuestions from './Questions';

export default function ProductTabSection({ product, activeTab, setActiveTab }: { product: Product; activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = ['상품 정보', '쇼핑 가이드', '상품 후기', '상품 문의'];

  return (
    <>
      <nav className="flex my-12 mb-4 bg-primary-light overflow-hidden" style={{ height: '44px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 text-center font-medium text-sm cursor-pointer transition ${isActive ? 'bg-background' : 'text-black bg-transparent'} `} style={{ lineHeight: '44px' }}>
              {tab}
            </button>
          );
        })}
      </nav>

      <div>
        {activeTab === '상품 정보' && <ProductInfo content={product.content} />}
        {activeTab === '쇼핑 가이드' && <ShoppingGuide />}
        {activeTab === '상품 후기' && <ProductReviews productId={product._id} />}
        {activeTab === '상품 문의' && <ProductQuestions productId={product._id} />}
      </div>
    </>
  );
}
