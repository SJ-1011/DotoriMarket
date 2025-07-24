'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm" onClick={onClose}>
      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors" aria-label="모달 닫기">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 이미지 컨테이너 */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto" onClick={e => e.stopPropagation()}>
        <Image src={imageSrc} alt={imageAlt} width={800} height={800} className="object-contain max-w-full max-h-full rounded-lg shadow-2xl" unoptimized priority />
      </div>

      {/* 모달 하단 안내 텍스트 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">클릭하거나 ESC를 눌러 닫기</div>
    </div>
  );
}
