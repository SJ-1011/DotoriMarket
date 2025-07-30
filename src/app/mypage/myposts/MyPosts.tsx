'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Post } from '@/types/Post';
import { getUserPosts } from '@/utils/getPosts';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import FilterIcon from '@/components/icon/FilterIcon';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<string>('all');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useLoginStore(state => state.user);
  const filteredPosts = sortOption === 'all' ? posts : posts.filter(post => post.type === sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const itemsPerPage = 10;
  const [isMobile, setIsMobile] = useState(false);

  const popoverRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640); // 모바일 기준 폭 설정
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paginatedPosts = useMemo(() => {
    if (filteredPosts) {
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      if (isMobile) {
        return filteredPosts.slice(0, endIdx);
      } else {
        return filteredPosts.slice(startIdx, endIdx);
      }
    } else {
      return [];
    }
  }, [filteredPosts, currentPage, isMobile]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?.token?.accessToken) return;
      setLoading(true);

      const res = await getUserPosts(user.token.accessToken);
      if (res.ok === 1 && res.item) {
        const sortedPosts = [...res.item].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(sortedPosts);
        setTotalPage(Math.ceil(res.item.length / itemsPerPage));
      } else if (res.ok === 0) {
        console.error(res.message);
      }

      setLoading(false);
    };

    fetchMyPosts();
  }, [user]);

  // 정렬
  const sortState = [
    { label: '전체', value: 'all' },
    { label: '문의게시판', value: 'qna' },
    { label: '자유게시판', value: 'community' },
  ];

  // 클릭 외부 감지로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // 페이지 초기화
    setTotalPage(Math.ceil(filteredPosts.length / itemsPerPage)); // 총 페이지 수 재계산
  }, [sortOption, filteredPosts]);

  return (
    <>
      <div className="flex flex-row flex-nowrap justify-between items-center p-4 sm:px-0 relative">
        <p>TOTAL {posts ? posts.length : 0} ITEMS</p>
        <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="sm:hidden">
          <option value="all">전체</option>
          <option value="qna">문의게시판</option>
          <option value="community">자유게시판</option>
        </select>
        <button type="button" className="hidden cursor-pointer sm:flex sm:flex-row sm:flex-nowrap sm:gap-4 sm:items-center" onClick={() => setIsOpen(!isOpen)}>
          {/* <p>{sortState.find(item => item.value == `${sortOption}`)?.label}</p> */}
          <FilterIcon svgProps={{ className: 'w-8 h-8' }} />
        </button>
        {isOpen && (
          <ul ref={popoverRef} className="absolute bg-white p-4 flex flex-col flex-nowrap gap-2 right-0 top-12 z-10 border border-primary">
            {sortState.map((option, index) => (
              <li
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setSortOption(option.value);
                  setIsOpen(!isOpen);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <Loading />}

      {!loading && (
        <>
          {paginatedPosts.length === 0 ? (
            <p className="px-4 text-gray text-sm lg:text-base">등록된 글이 없습니다.</p>
          ) : (
            <>
              {/* 모바일 리스트형 */}
              <ul className="block sm:hidden">
                {paginatedPosts.map((post, index) => (
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
                    <th className="py-2 px-2">글 번호</th>
                    <th className="py-2 px-2">제목</th>
                    <th className="py-2 px-2">분류</th>
                    <th className="py-2 px-2">작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map(post => (
                    <tr key={post._id} className="border-b border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/board/${post.type}/${post._id}`)}>
                      <td className="py-2 px-2 lg:py-4 lg:px-4 text-center">{post._id}</td>
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
      <div className="hidden sm:block">
        <Pagination
          currentPage={currentPage}
          onPageChange={page => {
            setCurrentPage(page);
          }}
          totalPages={totalPage}
        />
      </div>
      {filteredPosts && currentPage * itemsPerPage < filteredPosts.length && (
        <button type="button" onClick={() => setCurrentPage(page => page + 1)} className="w-full border p-4 mb-40 cursor-pointer sm:hidden">
          더보기
        </button>
      )}
    </>
  );
}
