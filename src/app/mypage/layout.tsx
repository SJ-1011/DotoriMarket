import MypageInfo from './MypageInfo';
import MypageNav from './MypageNav';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-background flex flex-col flex-nowrap w-full justify-center">
        {/* 내 정보 */}
        <MypageInfo />

        {/* Sidebar */}
        <MypageNav />

        {/* Content */}
        {children}
      </main>
    </>
  );
}
