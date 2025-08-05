import { getPosts } from '@/utils/getPosts';
import { Post } from '@/types/Post';
import NoticeBoardClientWrapper from './NoticeBoardClientWrapper';
import Breadcrumb from '@/components/common/Breadcrumb';
export const dynamic = 'force-dynamic';
export default async function NoticeBoardPage() {
  const res = await getPosts('notice');
  const posts: Post[] = res.ok === 1 ? res.item : [];

  return (
    <div className="bg-white pb-12 min-h-[80vh] flex flex-col flex-nowrap">
      <div className="p-4 sm:pt-8">
        <Breadcrumb
          items={[
            { label: '홈', href: '/' },
            { label: 'COMMMUNITY', href: '/board' },
            { label: '공지게시판', href: '/board/notice' },
          ]}
        />
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">공지게시판</h2>
      </div>

      {/* 클라이언트 컴포넌트 */}
      <NoticeBoardClientWrapper posts={posts} />
    </div>
  );
}
