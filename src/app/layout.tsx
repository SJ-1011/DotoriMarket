import Header from '@/components/common/Header';
import '../styles/globals.css';
import Footer from '@/components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '도토리섬',
  description: '도토리섬과 함께하는 즐거운 시간!',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
