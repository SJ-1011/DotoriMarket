'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 본문 */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <Image src="/error-dotori.png" alt="에러 도토리 이미지" width={200} height={200} priority />
        <h1 className="mt-5 text-center">
          앗, 도토리가 길을 잃었어요🍂
          <br />
          잠시 후 다시 시도해 주세요!
        </h1>
      </main>

      <Footer />
    </div>
  );
}
