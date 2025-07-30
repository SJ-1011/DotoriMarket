import { getPosts } from '@/utils/getPosts';
import { Post } from '@/types/Post';
import NoticeBoardClientWrapper from './NoticeBoardClientWrapper';
export const dynamic = 'force-dynamic';
export default async function NoticeBoardPage() {
  const res = await getPosts('notice');
  const posts: Post[] = res.ok === 1 ? res.item : [];

  return (
    <div className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      <div className="mb-3 text-xs sm:text-sm lg:text-base text-gray-400">홈 &gt; COMMUNITY</div>
      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#A97452] pt-2 mb-8">공지게시판</h1>
      <hr className="border-t-2 border-[#A97452] mb-8" />
      <NoticeBoardClientWrapper posts={posts} />
    </div>
  );
}
