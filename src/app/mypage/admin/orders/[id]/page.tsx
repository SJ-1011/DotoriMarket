import AdminOrderDetailWrapper from './AdminOrderDetailWrapper';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);

  return (
    <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
      <div className="flex flex-col flex-nowrap sm:w-[600px] lg:w-[800px] mx-auto">
        <div className="px-4 sm:px-0">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">관리자 주문 상세</h2>
        </div>
        <AdminOrderDetailWrapper orderId={orderId} />
      </div>
    </section>
  );
}
