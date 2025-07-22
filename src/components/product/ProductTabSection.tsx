import type { Product } from '@/types/Product';
import ProductInfo from './ProductInfo';
import ShoppingGuide from './ShoppingGuide';
import ProductReviews from './ProductReviews';
import ProductQuestions from './ProductQuestions';

export default function ProductTabSection({ product, activeTab, setActiveTab }: { product: Product; activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = ['상품정보', '쇼핑가이드', '상품후기', '상품문의'];

  return (
    <>
      <nav className="flex space-x-4 border-b mb-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </nav>

      <div>
        {activeTab === '상품정보' && <ProductInfo content={product.content} />}
        {activeTab === '쇼핑가이드' && <ShoppingGuide />}
        {activeTab === '상품후기' && <ProductReviews productId={product._id} />}
        {activeTab === '상품문의' && <ProductQuestions productId={product._id} />}
      </div>
    </>
  );
}
