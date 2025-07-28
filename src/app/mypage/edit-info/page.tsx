import EditForm from './EditForm';

//회원 정보 수정 페이지
export default function EditInfo() {
  return (
    <>
      <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
        <div className="space-y-4 sm:w-[600px] lg:w-[800px] mx-auto">
          {/* 타이틀 */}
          <div className="mb-2 px-4 sm:mb-4 lg:mb-4">
            <h2 className="font-bold text-base sm:text-lg lg:text-xl text-primary">회원정보 수정</h2>
          </div>
          <EditForm />
        </div>
      </section>
    </>
  );
}
