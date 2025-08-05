import NoticePostForm from './NoticePostForm';

export default function NoticeNewPage() {
  const boardType = 'notice';
  return (
    <main className="flex-1 min-w-[320px] p-4">
      <div className="py-4">
        <h2 className="text-center text-base sm:text-xl lg:text-2xl  font-bold text-black">공지사항 등록</h2>
      </div>
      <section className="mb-8 p-4">
        <NoticePostForm boardType={boardType} />
      </section>
    </main>
  );
}
