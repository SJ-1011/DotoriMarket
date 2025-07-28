// app/cart/page.tsx
import CartWrapper from './CartWrapper';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function CartPage() {
  return (
    <div className="max-w-[900px] mx-auto p-4 py-8">
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '장바구니' }]} />
      <div className="mb-4">
        <CartWrapper />
      </div>
    </div>
  );
}
