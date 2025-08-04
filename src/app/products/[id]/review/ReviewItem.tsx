import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import ReviewImages from './ReviewImages';
import { LoginUser } from '@/types';
import { maskUserId } from '@/utils/mask';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

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
  onEditClick: (review: { reviewId: number; rating: number; content: string; images?: string[] }) => void;
  onDeleteClick: (reviewId: number) => void;
}

export default function ReviewItem({ review, currentUser, expanded, toggleExpand, openImageModal, onEditClick, onDeleteClick }: ReviewItemProps) {
  const imageSrc = (() => {
    const img = review.user.image;

    if (!img) return '/default-profile.webp';

    if (typeof img === 'string') {
      return img.startsWith('/') ? img : getFullImageUrl(img);
    }

    if (typeof img === 'object' && 'path' in img) {
      return img.path.startsWith('/') ? img.path : getFullImageUrl(img.path);
    }

    return '/default-profile.webp';
  })();

  const isMyReview = currentUser?._id && String(review.user._id) === String(currentUser._id);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = () => {
    setShowMenu(false);
    onEditClick({
      reviewId: review._id,
      rating: review.rating,
      content: review.content,
      images: review.images,
    });
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDeleteClick(review._id);
  };

  return (
    <div className="border-b border-gray-200 py-3 relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image src={imageSrc || '/login-logo.webp'} alt={imageSrc ? '프로필 이미지' : '도토리'} width={40} height={40} className="w-full h-full object-cover" unoptimized />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">{maskUserId(review.user.name)}</p>
            {isMyReview && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">내 후기</span>}
          </div>
          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
        </div>

        {isMyReview && (
          <div className="ml-auto relative" ref={menuRef}>
            <button onClick={toggleMenu} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700" aria-label="메뉴 열기">
              <span className="text-xl leading-none cursor-pointer">⋮</span>
            </button>

            {showMenu && (
              <div className="absolute right-2 mt-2 w-24 bg-white border border-gray-400 rounded z-10">
                <button onClick={handleEditClick} className="cursor-pointer block w-full text-left text-sm px-3 py-2 hover:bg-gray-100">
                  수정
                </button>
                <button onClick={handleDeleteClick} className="cursor-pointer block w-full text-left text-sm px-3 py-2 text-rose-600 hover:bg-gray-100">
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm mb-1">⭐ {review.rating} / 5</p>
      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{review.content}</p>
      {review.images && review.images.length > 0 && <ReviewImages images={review.images} reviewId={review._id} expanded={expanded} toggleExpand={toggleExpand} openImageModal={openImageModal} />}
    </div>
  );
}
