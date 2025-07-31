import Breadcrumb from '@/components/common/Breadcrumb';
import OrderWrapper from './OrderWrapper';

export default function OrderPage() {
  return (
    <div className="bg-background py-8">
      <div className="max-w-[900px] mx-auto p-4">
        <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '결제하기' }]} />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2 pb-4">결제</h2>

        <OrderWrapper />
      </div>
    </div>
  );
}
