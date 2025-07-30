import MyPosts from './MyPosts';

export default function MyPostsPage() {
  return (
    <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
      <div className="flex flex-col flex-nowrap sm:w-[600px] lg:w-[800px] mx-auto">
        {/* 타이틀 */}
        <div className="flex flex-col flex-nowrap px-4 sm:px-0">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">내가 쓴 글</h2>
          <p>회원님이 작성하신 게시글을 확인할 수 있습니다.</p>
        </div>
        <MyPosts />
      </div>
    </section>
  );
}
