'use client';

import BarIcon from '@/components/icon/BarIcon';
import CartIcon from '@/components/icon/CartIcon';
import MypageIcon from '@/components/icon/MypageIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import SearchIcon from '../icon/SearchIcon';
import { CHARACTER_CATEGORIES, LIVING_CATEGORIES, STATIONERY_CATEGORIES } from '@/constants/categories';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';
import NotificationIcon from './NotificationIcon';

export default function DesktopHeader() {
  const router = useRouter();
  const { isLogin, user } = useLoginStore();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState('신상품');
  const [categoryData, setCategoryData] = useState<string[]>(['신상품 보러가기']);
  const [query, setQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null); //헤더 전체 영역 참조하는 ref
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null); //드롭다운 타임아웃 처리를 위한ㄴ ref

  // 검색 query를 url로 제출
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  // 클릭 외부 감지로 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // 컴포넌트 언마운트 시 타이머 정리
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const categoryAddress = {
    신상품: 'new',
    인기상품: 'popular',
    캐릭터: 'character',
    미니어처: 'miniature',
    문구: 'stationery',
    '리빙&소품': 'living-accessories',
    COMMUNITY: 'board',
  } as const;

  type CategoryName = keyof typeof categoryAddress;

  const boardAddress = ['notice', 'community', 'qna'];

  useEffect(() => {
    switch (detailOpen) {
      case '신상품':
        setCategoryData(['신상품 보러가기']);
        break;
      case '인기상품':
        setCategoryData(['인기상품 보러가기']);
        break;
      case '캐릭터':
        setCategoryData(CHARACTER_CATEGORIES);
        break;
      case '미니어처':
        setCategoryData(['미니어처 보러가기']);
        break;
      case '문구':
        setCategoryData(STATIONERY_CATEGORIES);
        break;
      case '리빙&소품':
        setCategoryData(LIVING_CATEGORIES);
        break;
      case 'COMMUNITY':
        setCategoryData(['공지사항', '자유게시판', '문의게시판']);
        break;
    }
  }, [detailOpen]);

  // 카테고리에 hover 했을 때 실행할 핸들러(baricon은 그대로 클릭임)
  const handleCategoryHover = (category: string) => {
    // 기존 타이머가 있으면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setDetailOpen(category);
    setIsCategoryOpen(true);
  };

  // 카테고리 leave 핸들러
  const handleCategoryLeave = () => {
    // 마우스 떼고 150ms 후에 닫긩
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  // hover 했을때 펼쳐지는 드롭다운 영역 hover 핸들러
  const handleDropdownHover = () => {
    // 기존 타이머가 있으면 취소
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };
  //hover 했을때 펼쳐지는 드롭다운 영역 leave 핸들러
  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 150);
  };

  return (
    <>
      <header ref={headerRef} className="max-w-[55rem] lg:max-w-[75rem] mx-auto mt-12 bg-white">
        <nav aria-label="유저 상단 메뉴">
          <ul className="flex flex-row flex-nowrap gap-4 justify-end mr-8">
            {isLogin && <li>{user?.name}님 환영합니다!</li>}
            <li>
              <Link href="/" aria-label="장바구니">
                <CartIcon svgProps={{ className: 'w-6 h-6' }} />
              </Link>
            </li>
            <li>
              {isLogin && (
                <Link href="/mypage" aria-label="마이페이지">
                  <MypageIcon svgProps={{ className: 'w-6 h-6' }} />
                </Link>
              )}
              {!isLogin && (
                <Link href="/login" aria-label="로그인하기">
                  <MypageIcon svgProps={{ className: 'w-6 h-6' }} />
                </Link>
              )}
            </li>
            <NotificationIcon />
          </ul>
        </nav>

        <h1 className="flex justify-center my-8 lg:my-12">
          <Link href="/">
            <Image src="/logo.png" alt="도토리섬 메인으로 이동" width={120} height={120}></Image>
          </Link>
        </h1>
        <form onSubmit={handleSearch} className="flex flex-row flex-nowrap justify-between items-center border rounded-full border-primary w-md lg:w-lg mx-auto py-2 lg:py-3 px-4 lg:px-8 my-6 lg:my-8 text-sm lg:text-base">
          <input type="search" aria-label="상품 검색창" placeholder="상품을 검색해보세요!" className="w-[90%]" value={query} onChange={event => setQuery(event.target.value)} />
          <button type="submit" className="cursor-pointer" aria-label="상품 검색 버튼">
            <SearchIcon className="w-6 h-6" />
          </button>
        </form>
        <nav aria-label="카테고리 메뉴">
          <ul className="flex flex-row flex-wrap gap-8 justify-center items-center text-sm lg:text-base">
            <li>
              <BarIcon
                className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                }}
                aria-label="메뉴 토글 버튼"
              />
            </li>
            {Object.entries(categoryAddress).map(([title, address]) => (
              <li key={title} onMouseEnter={() => handleCategoryHover(title)} onMouseLeave={handleCategoryLeave} className="relative">
                <Link
                  href={address === 'board' ? `/${address}` : `/category/${address}`}
                  onClick={() => {
                    setIsCategoryOpen(false);
                  }}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="relative">
        <hr className="mt-6 border-primary" />
        {isCategoryOpen && (
          <nav ref={popoverRef} aria-label="세부 카테고리 메뉴" className="absolute z-[50] left-1/2 -translate-x-1/2 top-full w-[30rem] lg:w-[40rem] text-sm lg:text-base mx-auto bg-[#E5CBB7] flex flex-row border-b border-x border-primary" onMouseEnter={handleDropdownHover} onMouseLeave={handleDropdownLeave}>
            <ul className="flex flex-col flex-nowrap text-center">
              {['신상품', '인기상품', '캐릭터', '미니어처', '문구', '리빙&소품', 'COMMUNITY'].map(category => (
                <li key={category} className={`p-4 cursor-pointer ${detailOpen === category ? 'bg-background' : ''}`} onClick={() => setDetailOpen(category)} onMouseEnter={() => setDetailOpen(category)}>
                  {category}
                </li>
              ))}
            </ul>
            <ul className="bg-background w-full flex flex-col flex-nowrap p-8 gap-4">
              {categoryData.map((item, i) => {
                const val = categoryAddress[detailOpen as CategoryName];

                if (['character', 'stationery', 'living-accessories'].includes(val)) {
                  return (
                    <li key={i}>
                      <Link href={`/category/${val}/0${i + 1}`} onClick={() => setIsCategoryOpen(false)}>
                        {item} &gt;
                      </Link>
                    </li>
                  );
                } else if (val === 'board') {
                  return (
                    <li key={i}>
                      <Link href={`/${val}/${boardAddress[i]}`} onClick={() => setIsCategoryOpen(false)}>
                        {item} &gt;
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={i}>
                    <Link href={`/category/${val}`} onClick={() => setIsCategoryOpen(false)}>
                      {item} &gt;
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
