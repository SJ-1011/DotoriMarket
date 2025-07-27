import Breadcrumb from '@/components/common/Breadcrumb';
import OrderCompleteWrapper from './OrderCompleteWrapper';

export default async function OrderCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="bg-secondary">
      <div className="max-w-[900px] mx-auto p-4 py-8">
        <div className="mb-4">
          <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '결제완료' }]} />
        </div>
        <OrderCompleteWrapper orderId={id} />
      </div>
    </div>
  );
}
