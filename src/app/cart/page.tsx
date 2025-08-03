import CartWrapper from './CartWrapper';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function CartPage() {
  return (
    <div className="max-w-[900px] mx-auto p-4 sm:py-12">
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: '장바구니', href: '/cart' },
        ]}
      />
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">장바구니</h2>

      <div className="mb-4">
        <CartWrapper />
      </div>
    </div>
  );
}
