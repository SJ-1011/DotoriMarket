'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/Post';
import Pagination from '@/components/common/Pagination';
import SearchIcon from '@/components/icon/SearchIcon';
import ArrowIcon from '@/components/icon/ArrowIcon';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  posts: Post[];
}

export default function QnaBoardClientWrapper({ posts }: Props) {
  const [searchField, setSearchField] = useState<'title' | 'user'>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter(post => {
          if (searchField === 'title') {
            return post.title?.toLowerCase().includes(query);
          } else if (searchField === 'user') {
            return post.user?.name?.toLowerCase().includes(query);
          }
          return false;
        }),
      );
    }

    setCurrentPage(1); // 검색 시 1페이지로 이동
  }, [searchQuery, searchField, posts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 검색 UI */}
      <div className="flex justify-end mb-8">
        <form className="flex items-center gap-2" onSubmit={e => e.preventDefault()}>
          {/* 드롭다운 */}
          <div className="relative w-20 sm:w-24">
            <select value={searchField} onChange={e => setSearchField(e.target.value as 'title' | 'user')} className="appearance-none w-full h-8 lg:h-10 pl-3 pr-8 border border-[#A97452] bg-white text-[#A97452] text-xs sm:text-sm lg:text-base rounded-full outline-none cursor-pointer">
              <option value="title">제목</option>
              <option value="user">작성자</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ArrowIcon svgProps={{ className: 'w-[10px] h-[6px] lg:w-[14px] lg:h-[9px]' }} />
            </div>
          </div>

          {/* 검색창 */}
          <div className="flex items-center gap-2 border border-[#A97452] rounded-3xl px-3 py-2 w-48 sm:w-60 lg:w-72 h-8 sm:h-8 lg:h-10 bg-white">
            <input type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
            <button type="submit" className="ml-2">
              <SearchIcon className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-[#A97452]" />
            </button>
          </div>
        </form>
      </div>

      {/* 게시글 테이블 */}
      <table className="w-full text-center">
        <thead>
          <tr className="text-[#A97452] border-b border-[#965b29]">
            <th className="py-2 font-bold text-xs sm:text-sm lg:text-base" style={{ width: 100 }}>
              번호
            </th>
            <th className="py-2 font-bold text-xs sm:text-sm lg:text-base" style={{ width: 200 }}>
              상품정보
            </th>
            <th className="py-2 font-bold text-xs sm:text-sm lg:text-base">제목</th>
            <th className="py-2 font-bold text-xs sm:text-sm lg:text-base" style={{ width: 150 }}>
              작성자
            </th>
            <th className="py-2 font-bold text-xs sm:text-sm lg:text-base" style={{ width: 120 }}>
              작성일
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-xs sm:text-sm lg:text-base text-gray-400">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            currentPosts.map(post => (
              <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50 h-[40px] sm:h-[60px]">
                <td className="py-2 text-xs sm:text-sm lg:text-base truncate max-w-[200px]">{post._id}</td>
                <td className="py-2 flex items-center justify-center">{post.extra?.imagePath && <Image src={`${API_URL}/${post.extra.imagePath}`} alt="상품정보" width={30} height={30} className="object-cover sm:w-[50px] sm:h-[50px]" unoptimized />}</td>
                <td className="py-2 text-xs sm:text-sm lg:text-base truncate max-w-[200px]">
                  <Link href={`/board/qna/${post._id}`} className="hover:underline">
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

      {/* 페이지네이션 */}
      {<Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />}
    </>
  );
}
