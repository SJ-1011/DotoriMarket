import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Link from 'next/link';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col-reverse sm:flex-row max-w-[1200px] mx-auto">
        {/* Sidebar */}
        <aside className="text-dark-gray w-full sm:w-50 lg:w-70 p-3">
          <nav className="space-y-5 flex flex-col text-sm sm:text-base lg:text-lg">
            <Link href="/mypage/myposts">내가 쓴 글</Link>
            <Link href="/mypage/address">배송 주소록 관리</Link>
            <Link href="/mypage/wishlist">관심 상품</Link>
            <Link href="/mypage/edit-info">회원 정보 수정</Link>
            <Link href="/mypage/logout">로그아웃</Link>
          </nav>
        </aside>
        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
