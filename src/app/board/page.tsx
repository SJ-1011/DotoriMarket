import Link from 'next/link';

export default function BoardMainPage() {
  return (
    <div className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      {/* 위치 표시 */}
      <div className="mb-3 text-xs sm:text-sm lg:text-base text-gray-400">홈 &gt; 게시판</div>

      {/* 제목 */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#A97452] mb-8">전체 게시판</h1>

      {/* 게시판 카드들 */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 ">
        {/* 자유 게시판 */}
        <BoardCard title="자유게시판" description="소장품을 자랑하는 공간입니다." href="/board/community" />

        {/* 공지 게시판 */}
        <BoardCard title="공지게시판" description="새로운 소식들이 모여있어요." href="/board/notice" />

        {/* 문의 게시판 */}
        <BoardCard title="문의게시판" description="문의를 작성해보세요." href="/board/qna" />
      </div>
    </div>
  );
}

function BoardCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="border border-[#E5CBB7] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-[#A97452] mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      </div>
      <Link href={href} className="mt-4 inline-block self-end text-sm sm:text-base text-[#A97452] font-semibold hover:underline">
        바로가기 →
      </Link>
    </div>
  );
}
