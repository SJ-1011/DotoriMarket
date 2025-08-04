import Link from 'next/link';
import Image from 'next/image';
import type { Review } from '@/types/Review';
import { getFullImageUrl } from '@/utils/getFullImageUrl';

interface BestReviewCardProps {
  review: Review;
  variant?: 'slider' | 'grid';
  className?: string;
}

export default function BestReviewCard({ review, variant = 'slider', className = '' }: BestReviewCardProps) {
  const productId = review.product?._id;

  if (!productId) {
    return <div>상품 정보가 없습니다.</div>;
  }

  const profileImage = (() => {
    const img = review.user.image;
    if (!img) return null;
    if (typeof img === 'string') {
      return getFullImageUrl(img);
    }
    if (typeof img === 'object' && 'path' in img) {
      return getFullImageUrl(img.path);
    }
    return null;
  })();

  const imageUrl = getFullImageUrl(review.images?.[0] || '');

  const ReviewTextOverlay = (
    <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs p-2 space-y-1 pointer-events-none select-none">
      <div className="text-yellow-400 font-semibold leading-tight">⭐ {review.rating}</div>
      <div
        className={`
        whitespace-normal leading-snug
        ${variant === 'slider' ? 'line-clamp-2' : ''}
        ${variant === 'grid' ? 'line-clamp-2 sm:line-clamp-none' : ''}
      `}
      >
        {review.content}
      </div>
    </div>
  );

  if (variant === 'slider') {
    return (
      <Link href={`/products/${productId}`} className={`relative inline-block w-[120px] h-[160px]  sm:w-[170px] sm:h-[220px]   flex-shrink-0 rounded shadow-sm overflow-hidden cursor-pointer ${className}`}>
        <div className="relative w-full h-full">
          {imageUrl ? <Image src={imageUrl} alt="리뷰 이미지" fill sizes="170px" className="object-cover pointer-events-none" priority={false} /> : <div className="w-full h-full bg-gray-700" />}

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
      </Link>
    );
  }

  return (
    <Link href={`/products/${productId}`} className={`relative aspect-square rounded shadow-sm overflow-hidden cursor-pointer ${className}`}>
      <div className="relative w-full h-full">
        {imageUrl ? <Image src={imageUrl} alt="리뷰 이미지" fill sizes="170px" className="object-cover" priority={false} /> : <div className="w-full h-full bg-gray-700" />}

        {/* 프로필 이미지 */}
        <div className="absolute top-2 left-2 w-10 h-10 rounded-full overflow-hidden bg-gray-600 z-10 hidden sm:block">
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
    </Link>
  );
}
