import AdminOrdersWrapper from './AdminOrdersWrapper';

export default function AdminOrdersPage() {
  return (
    <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
      <div className="flex flex-col flex-nowrap sm:w-[700px] lg:w-[900px] mx-auto">
        {/* 타이틀 */}
        <div className="flex flex-col flex-nowrap px-4 sm:px-0">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">관리자 주문 관리</h2>
        </div>
        <AdminOrdersWrapper />
      </div>
    </section>
  );
}
