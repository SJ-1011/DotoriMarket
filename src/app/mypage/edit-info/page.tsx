import EditForm from './EditForm';

//회원 정보 수정 페이지
export default function EditInfo() {
  return (
    <>
      <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
        <div className="flex flex-col flex-nowrap gap-6 sm:w-[600px] lg:w-[800px] mx-auto">
          {/* 타이틀 */}
          <div className="flex flex-col flex-nowrap px-4 sm:px-0">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">회원 정보 수정</h2>
            <p>회원 정보를 수정할 수 있습니다.</p>
          </div>
          <EditForm />
        </div>
      </section>
    </>
  );
}
