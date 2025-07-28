'use client';

import { useEffect, useState } from 'react';
import type { Post } from '@/types/Post';
import { getUserPosts } from '@/utils/getPosts';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<string>('all');
  const router = useRouter();
  const user = useLoginStore(state => state.user);
  const filteredPosts = sortOption === 'all' ? posts : posts.filter(post => post.type === sortOption);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?.token?.accessToken) return;
      setLoading(true);

      const res = await getUserPosts(user.token.accessToken);
      if (res.ok === 1 && res.item) {
        const sortedPosts = [...res.item].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(sortedPosts);
      } else if (res.ok === 0) {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchMyPosts();
  }, [user]);

  return (
    <section className="text-xs sm:text-sm lg:text-base bg-white min-h-[700px] py-12">
      <div className="space-y-4 sm:w-[600px] lg:w-[800px] mx-auto">
        {/* 타이틀 */}
        <div className="mb-2 px-4 sm:mb-4 lg:mb-4 flex justify-between items-center">
          <h2 className="font-bold text-base sm:text-lg lg:text-xl text-primary">내가 쓴 글</h2>
          {!loading && (
            <select className="px-1 py-1 rounded text-xs sm:text-sm lg:text-base" value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="all">전체</option>
              <option value="qna">문의게시판</option>
              <option value="community">자유게시판</option>
              {/* <option value="notice">notice</option> */}
            </select>
          )}
        </div>

        {loading && <Loading />}

        {!loading && (
          <>
            {filteredPosts.length === 0 ? (
              <p className="px-4 text-gray text-sm lg:text-base">등록된 글이 없습니다.</p>
            ) : (
              <>
                {/* 모바일 리스트형 */}
                <ul className="block sm:hidden">
                  {filteredPosts.map((post, index) => (
                    <li key={post._id} className={`p-4 border-b border-gray-300 cursor-pointer ${index === 0 ? 'border-t-1 border-t-dark-gray' : ''}`} onClick={() => router.push(`/board/${post.type}/${post._id}`)}>
                      <p className="text-sm font-bold truncate">{post.title}</p>
                      <p className="text-xs text-gray">
                        {post.user.name} · {post.createdAt.slice(0, 10)}
                      </p>
                      <p className="text-xs mt-1">{post.type === 'qna' ? '문의게시판' : '자유게시판'}</p>
                    </li>
                  ))}
                </ul>

                {/* 태블릿/데스크탑 테이블형 */}
                <table className="hidden table-fixed sm:table w-full text-sm lg:text-base border-t border-gray">
                  <colgroup>
                    <col width="15%" />
                    <col width="50%" />
                    <col width="15%" />
                    <col width="20%" />
                  </colgroup>

                  <thead className="bg-secondary">
                    <tr>
                      <th className="py-2 px-2">번호</th>
                      <th className="py-2 px-2">제목</th>
                      <th className="py-2 px-2">분류</th>
                      <th className="py-2 px-2">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, idx) => (
                      <tr key={post._id} className="border-b border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/board/${post.type}/${post._id}`)}>
                        <td className="py-2 px-2 lg:py-4 lg:px-4 text-center">{idx + 1}</td>
                        <td className="py-2 px-2 lg:py-4 lg:px-4 truncate">{post.title}</td>
                        <td className="py-2 px-2 lg:py-4 lg:px-4 text-center">{post.type === 'qna' ? '문의' : '자유'}</td>
                        <td className="py-2 px-2 lg:py-4 lg:px-4 text-center">{post.createdAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
