'use client';

import Image from 'next/image';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="fixed bottom-6 right-6 lg:right-10 2xl:right-30 z-10 cursor-pointer" onClick={scrollToTop}>
      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40">
        <Image src="/kitty-color.png" alt="상단으로 이동" title="페이지 상단으로 이동" width={160} height={160} />
      </div>
    </aside>
  );
}
