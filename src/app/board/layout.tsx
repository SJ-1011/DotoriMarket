import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Link from 'next/link';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col-reverse sm:flex-row max-w-[1200px] mx-auto">
        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
