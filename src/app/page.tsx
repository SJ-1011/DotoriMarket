import BarIcon from '@/components/icon/BarIcon';
import BellIcon from '@/components/icon/BellIcon';
import CartIcon from '@/components/icon/CartIcon';
import MypageIcon from '@/components/icon/MypageIcon';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
              <Link href="/">
                <BarIcon className="w-6 h-6" />
              </Link>
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
      <hr className="mt-6 border-[#A97452]" />
    </>
  );
}
