'use client';

import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center">
        <Image src="/loading-dotori.png" alt="로딩 도토리 이미지" width={400} height={400} priority />
        <h1 className="mt-10 text-center">
          곧 도토리섬에 도착해요!
          <br />
          조금만 기다려 주세요🧺
        </h1>
      </main>

      <Footer />
    </div>
  );
}
