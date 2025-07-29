'use client';

import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ReviewImagesProps {
  images: string[];
  reviewId: number;
  expanded: boolean;
  toggleExpand: (id: number) => void;
  openImageModal: (images: string[], index: number) => void;
}

export default function ReviewImages({ images, reviewId, expanded, toggleExpand, openImageModal }: ReviewImagesProps) {
  if (!expanded) {
    return (
      <div className="flex flex-wrap gap-2 relative">
        {images.slice(0, 2).map((imgSrc, idx) => (
          <Image key={idx} src={`${API_URL}/${imgSrc}`} alt={`리뷰 사진 ${idx + 1}`} width={100} height={100} className="rounded object-cover w-[100px] h-[100px] cursor-pointer" unoptimized onClick={() => openImageModal(images, idx)} />
        ))}
        {images.length > 2 && (
          <div className="relative w-[100px] h-[100px] rounded overflow-hidden cursor-pointer" onClick={() => toggleExpand(reviewId)}>
            <Image src={`${API_URL}/${images[2]}`} alt="리뷰 사진 더보기" width={100} height={100} className="object-cover w-[100px] h-[100px]" unoptimized style={{ filter: 'brightness(0.3)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold text-sm select-none">
              <span>사진 {images.length - 2}장</span>
              <span>더보기</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((imgSrc, idx) => (
        <Image key={idx} src={`${API_URL}/${imgSrc}`} alt={`리뷰 사진 전체 보기 ${idx + 1}`} width={100} height={100} className="rounded object-cover w-[100px] h-[100px] cursor-pointer" unoptimized onClick={() => openImageModal(images, idx)} />
      ))}
    </div>
  );
}
