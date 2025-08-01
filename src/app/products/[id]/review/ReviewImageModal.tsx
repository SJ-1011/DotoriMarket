'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface ReviewImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ReviewImageModal({ images, currentIndex, isOpen, onClose, onPrev, onNext }: ReviewImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const imageSrc = getFullImageUrl(images[currentIndex]);
  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} aria-modal="true" role="dialog">
      <div ref={modalRef} className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center mx-auto" style={{ maxWidth: 900, maxHeight: '90vh', width: '90%', height: 'auto' }}>
        {/* 이전 버튼 */}
        <button
          onClick={onPrev}
          aria-label="이전 이미지"
          className="
      cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 
      flex items-center justify-center 
      text-white select-none hover:text-gray-300 
      bg-gray-800 bg-opacity-50 rounded-full p-1 
       min-w-[40px] min-h-[40px] z-10
    "
        >
          ◀
        </button>

        {/* 이미지 */}
        <Image src={imageSrc} alt={`리뷰 사진 확대 보기 ${currentIndex + 1}`} width={700} height={700} unoptimized className="max-w-[85%] max-h-[80vh] object-contain rounded" style={{ maxHeight: '80vh' }} />

        {/* 다음 버튼 */}
        <button
          onClick={onNext}
          aria-label="다음 이미지"
          className="
      cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 
      flex items-center justify-center 
      text-white select-none hover:text-gray-300 
      bg-gray-800 bg-opacity-50 rounded-full p-1 
       min-w-[40px] min-h-[40px] z-10
    "
        >
          ▶
        </button>

        {/* 닫기 버튼 */}
        <button onClick={onClose} aria-label="모달 닫기" className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300 select-none">
          ×
        </button>
      </div>
    </div>
  );
}
