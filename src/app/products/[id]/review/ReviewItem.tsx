import React from 'react';
import Image from 'next/image';
import ReviewImages from './ReviewImages';
import { LoginUser } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Review {
  _id: number;
  productId: number | string;
  user: {
    _id: number;
    name: string;
    image?: string | { path: string };
  };
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
}

interface ReviewItemProps {
  review: Review;
  currentUser: LoginUser | null;
  expanded: boolean;
  toggleExpand: (reviewId: number) => void;
  openImageModal: (images: string[], index: number) => void;
}

export default function ReviewItem({ review, currentUser, expanded, toggleExpand, openImageModal }: ReviewItemProps) {
  const imageSrc = (() => {
    const img = review.user.image;
    if (!img) return null;
    if (typeof img === 'string') return `${API_URL}/${img}`;
    if (typeof img === 'object' && 'path' in img) return `${API_URL}/${img.path}`;
    return null;
  })();

  const isMyReview = currentUser?._id && String(review.user._id) === String(currentUser._id);

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex items-center gap-3 mb-2">
        {imageSrc ? <Image src={imageSrc} alt={`${review.user.name} 프로필 이미지`} width={40} height={40} className="rounded-full object-cover" unoptimized /> : <Image src="/login-logo.webp" alt="도토리" width={40} height={40} className="rounded-full object-cover" />}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{review.user.name}</p>
            {isMyReview && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">내 후기</span>}
          </div>
          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
      <p className="text-sm mb-1">⭐ {review.rating} / 5</p>
      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{review.content}</p>
      {review.images && review.images.length > 0 && <ReviewImages images={review.images} reviewId={review._id} expanded={expanded} toggleExpand={toggleExpand} openImageModal={openImageModal} />}
    </div>
  );
}
