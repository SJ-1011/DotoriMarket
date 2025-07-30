import { getPosts } from '@/utils/getPosts';
import { Post } from '@/types/Post';
import QnaWriteButton from './QnaWriteButton';
import QnaBoardClientWrapper from './QnaBoardClientWrapper';

export default async function QnaBoardPage() {
  const res = await getPosts('qna');
  const posts: Post[] = res.ok === 1 ? res.item : [];

  return (
    <div className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      <div className="mb-3 text-xs sm:text-sm lg:text-base text-gray-400">홈 &gt; COMMUNITY</div>

      {/* 글쓰기 버튼 */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#A97452] pt-1">문의게시판</h1>
        <QnaWriteButton />
      </div>

      {/* 구분선 */}
      <hr className="border-t-2 border-[#A97452] mb-8" />

      {/* 클라이언트 컴포넌트 */}
      <QnaBoardClientWrapper posts={posts} />
    </div>
  );
}
