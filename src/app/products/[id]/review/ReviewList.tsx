import React from 'react';
import ReviewItem from './ReviewItem';
import { LoginUser } from '@/types';

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

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  currentUser: LoginUser | null;
  expandedReviewIds: Set<number>;
  toggleExpand: (reviewId: number) => void;
  openImageModal: (images: string[], index: number) => void;
  showMyReviewsOnly: boolean;
}

export default function ReviewList({ reviews, loading, currentUser, expandedReviewIds, toggleExpand, openImageModal, showMyReviewsOnly }: ReviewListProps) {
  if (loading) {
    return <div className="text-gray-500 flex-1 flex items-center justify-center text-center">리뷰 로딩 중...</div>;
  }
  if (reviews.length === 0) {
    return <div className="text-gray-500 flex-1 flex items-center justify-center text-center">{showMyReviewsOnly && !currentUser ? '로그인 후 내가 남긴 후기를 확인할 수 있습니다.' : showMyReviewsOnly ? '내가 작성한 후기가 없습니다.' : '등록된 리뷰가 없습니다.'}</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {reviews.map(review => (
        <ReviewItem key={review._id} review={review} currentUser={currentUser} expanded={expandedReviewIds.has(review._id)} toggleExpand={toggleExpand} openImageModal={openImageModal} />
      ))}
    </div>
  );
}
