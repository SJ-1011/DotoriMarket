import Image from 'next/image';
import type { Review } from '@/types/Review';

interface BestReviewCardProps {
  review: Review;
  variant?: 'slider' | 'grid';
  className?: string;
}

interface UserImageObject {
  path: string;
}

type UserImage = string | UserImageObject | null | undefined;

export default function BestReviewCard({ review, variant = 'slider', className = '' }: BestReviewCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  const profileImage = (() => {
    const img: UserImage = review.user.image;
    if (!img) return null;
    if (typeof img === 'string') {
      return `${API_URL}/${img}`;
    }
    if (typeof img === 'object' && 'path' in img) {
      return `${API_URL}/${img.path}`;
    }
    return null;
  })();

  const imageUrl = review.images?.[0] ?? null;

  const ReviewTextOverlay = (
    <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs p-2 space-y-1">
      <div className="text-yellow-400 font-semibold leading-tight">⭐ {review.rating}</div>
      <div className={`whitespace-normal leading-snug ${variant === 'slider' ? 'line-clamp-2' : ''}`}>{review.content}</div>
    </div>
  );

  // 슬라이더 뷰
  if (variant === 'slider') {
    return (
      <div className={`relative inline-block w-[170px] h-[220px] flex-shrink-0 rounded shadow-sm overflow-hidden ${className}`}>
        <div className="relative w-full h-full">
          {imageUrl ? <Image src={imageUrl} alt="리뷰 이미지" fill className="object-cover pointer-events-none" priority={false} /> : <div className="w-full h-full bg-gray-700" />}

          {/* 프로필 이미지 */}
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full overflow-hidden bg-gray-600 z-10">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${review.user.name} 프로필`}
                fill
                className="object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Image src="/login-logo.webp" alt="도토리 기본 이미지" fill className="object-cover" />
            )}
          </div>

          {ReviewTextOverlay}
        </div>
      </div>
    );
  }

  // 그리드 뷰
  return (
    <div className={`relative aspect-square rounded shadow-sm overflow-hidden ${className}`}>
      <div className="relative w-full h-full">
        {imageUrl ? <Image src={imageUrl} alt="리뷰 이미지" fill className="object-cover" priority={false} /> : <div className="w-full h-full bg-gray-700" />}

        {/* 프로필 이미지 */}
        <div className="absolute top-2 left-2 w-10 h-10 rounded-full overflow-hidden bg-gray-600 z-10">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${review.user.name} 프로필`}
              fill
              className="object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Image src="/login-logo.webp" alt="도토리 기본 이미지" fill className="object-cover" />
          )}
        </div>

        {ReviewTextOverlay}
      </div>
    </div>
  );
}
