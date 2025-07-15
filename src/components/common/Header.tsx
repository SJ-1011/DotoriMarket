'use client';

import BarIcon from '@/components/icon/BarIcon';
import BellIcon from '@/components/icon/BellIcon';
import CartIcon from '@/components/icon/CartIcon';
import MypageIcon from '@/components/icon/MypageIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  // 햄버거 바 클릭 시 카테고리가 열려있는지 useState로 상태 관리
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // 햄버거 바가 클릭 된 상태에서 현재 클릭된 세부 메뉴가 무엇인지 상태 관리
  const [detailOpen, setDetailOpen] = useState('신상품');

  // 카테고리 내부의 세부 내용들 상태 관리
  const [categoryData, setCategoryData] = useState<string[]>(['신상품 보러가기']);

  useEffect(() => {
    switch (detailOpen) {
      case '신상품':
        setCategoryData(['신상품 보러가기']);
        break;
      case '인기상품':
        setCategoryData(['인기상품 보러가기']);
        break;
      case '캐릭터':
        setCategoryData(['스튜디오 지브리', '디즈니/픽사', '산리오', '미피', '핑구', '짱구는 못말려', '호빵맨', '치이카와', '스누피', '별의 커비']);
        break;
      case '미니어처':
        setCategoryData(['미니어처 보러가기']);
        break;
      case '문구':
        setCategoryData(['필기류', '스티커', '카드팩/스티커팩', '마스킹테이프', '데코용품', '스탬프', '다이어리/달력', '포스터/엽서', '메모지/노트']);
        break;
      case '리빙&소품':
        setCategoryData(['키링', '케이스/파우치', '패션/생활', '미용&악세사리', '인테리어', '키친', '폰 악세사리', '지비츠', '강아지용품']);
        break;
      case '랜덤박스':
        setCategoryData(['랜덤박스 보러가기']);
        break;
      case 'COMMUNITY':
        setCategoryData(['공지사항', 'Q&A', '자유게시판', '문의게시판']);
        break;
    }
  }, [detailOpen]);

  return (
    <>
      <header className="max-w-[75rem] mx-auto mt-12">
        <nav aria-label="유저 상단 메뉴">
          <ul className="flex flex-row flex-nowrap gap-4 justify-end">
            <li>
              <Link href="/" aria-label="장바구니">
                <CartIcon className="w-6 h-6" color="#A97452" />
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="마이페이지">
                <MypageIcon className="w-6 h-6" />
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="알림">
                <BellIcon className="w-6 h-6" />
              </Link>
            </li>
          </ul>
        </nav>
        <h1 className="flex justify-center my-8">
          <Link href="/">
            <Image src="/logo.png" alt="도토리섬 메인으로 이동" width={200} height={200}></Image>
          </Link>
        </h1>
        <nav aria-label="카테고리 메뉴">
          <ul className="flex flex-row flex-nowrap gap-8 justify-center items-center">
            <li>
              <BarIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                }}
              />
            </li>
            <li>
              <Link href="/">신상품</Link>
            </li>
            <li>
              <Link href="/">인기상품</Link>
            </li>
            <li>
              <Link href="/">캐릭터</Link>
            </li>
            <li>
              <Link href="/">미니어처</Link>
            </li>
            <li>
              <Link href="/">문구</Link>
            </li>
            <li>
              <Link href="/">리빙&소품</Link>
            </li>
            <li>
              <Link href="/">랜덤박스</Link>
            </li>
            <li>
              <Link href="/">COMMUNITY</Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="relative">
        <hr className="mt-6 border-[#A97452]" />
        {isCategoryOpen && (
          <nav aria-label="세부 카테고리 메뉴" className="absolute z-[50] left-1/2 -translate-x-1/2 top-full w-[40rem] mx-auto bg-[#E5CBB7] flex flex-row">
            <ul className="flex flex-col flex-nowrap text-center">
              {['신상품', '인기상품', '캐릭터', '미니어처', '문구', '리빙&소품', '랜덤박스', 'COMMUNITY'].map(category => (
                <li key={category} className={`p-4 cursor-pointer ${detailOpen === category ? 'bg-[#F5EEE6]' : ''}`} onClick={() => setDetailOpen(category)}>
                  {category}
                </li>
              ))}
            </ul>
            <ul className="bg-[#F5EEE6] w-full flex flex-col flex-nowrap p-8 gap-4">
              {categoryData.map((item, i) => (
                <li key={i}>
                  <Link href="/" className="cursor-pointer">
                    {item} &gt;
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
