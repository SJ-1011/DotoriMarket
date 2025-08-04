'use client';

import EditForm from '../edit-info/EditForm';
import ResidentCard from '../ResidentCard';

export default function ImageTest() {
  return (
    <>
      <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
        <div className="flex flex-col flex-nowrap gap-6 sm:w-[600px] lg:w-[800px] mx-auto">
          {/* 타이틀 */}
          <div className="flex flex-col flex-nowrap px-4 sm:px-0">
            <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">관리자 정보 수정</h2>
            <p>관리자 정보를 수정할 수 있습니다.</p>
          </div>
          <div className="self-center">
            <ResidentCard />
          </div>
          <EditForm />
        </div>
      </section>
    </>
  );
}
