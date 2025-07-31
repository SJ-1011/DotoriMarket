'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/Post';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';

interface Props {
  posts: Post[];
}

export default function NoticeBoardClientWrapper({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 모바일 상태 확인
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 기준 sm 미만이면 모바일
    };

    checkIsMobile(); // 초기 확인
    window.addEventListener('resize', checkIsMobile); // 리사이즈 대응

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.title?.toLowerCase().includes(query)));
    }

    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [searchQuery, posts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 검색바 */}
      {!isMobile && (
        <div className="flex justify-end mb-8">
          <form className="flex items-center gap-2" onSubmit={e => e.preventDefault()}>
            <div className="flex items-center gap-2 border border-[#A97452] rounded-md px-3 py-2 w-48 sm:w-60 lg:w-72 h-8 sm:h-8 lg:h-10 bg-white">
              <input type="text" placeholder="제목으로 검색" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
            </div>
          </form>
        </div>
      )}
      {isMobile && (
        <div className="flex flex-col flex-nowrap w-full fixed z-20 bottom-0 bg-white border-t border-primary">
          <div className="flex flex-row flex-nowrap justify-between p-4">
            <button type="button" className="w-full text-sm" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              검색하기
            </button>
          </div>
          {isSearchOpen && (
            <form onSubmit={e => e.preventDefault()} className="flex flex-row flex-nowrap mb-4 gap-2 px-2">
              {/* 검색 input */}
              <div className="flex p-4 items-center gap-2 border border-[#A97452] w-full bg-white">
                <input type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
              </div>
            </form>
          )}
        </div>
      )}

      {/* 검색바 */}

      {/* 게시글 테이블 */}
      <div className="sm:p-4 mb-8">
        <table className="w-full text-center">
          <thead>
            <tr className="text-[#A97452] border-y border-[#965b29]">
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base">번호</th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base">제목</th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base">작성자</th>
              <th className="py-2 font-bold text-xs sm:text-sm lg:text-base">작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-xs sm:text-sm lg:text-base text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              currentPosts.map(post => (
                <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-xs sm:text-sm lg:text-base">{post._id}</td>
                  <td className="py-2 text-center px-2 text-xs sm:text-sm lg:text-base">
                    <Link href={`/board/notice/${post._id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2 text-xs sm:text-sm lg:text-base">{post.user.name}</td>
                  <td className="py-2 text-xs sm:text-sm lg:text-base">{post.createdAt?.substring(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="py-8">
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </>
  );
}
