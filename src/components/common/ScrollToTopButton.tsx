'use client';
import { memo, useEffect, useState } from 'react';
import Image from 'next/image';

function ScrollToTopButtonComponent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <aside onClick={scrollToTop} className={`fixed bottom-6 right-6 lg:right-10 2xl:right-20 z-10 cursor-pointer transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40">
        <Image src="/kitty-color.png" alt="상단으로 이동" width={160} height={160} />
      </div>
    </aside>
  );
}

export default memo(ScrollToTopButtonComponent);
