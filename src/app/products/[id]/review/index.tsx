'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination';
import ReviewModal from '@/components/common/ReviewModal';
import ReviewImageModal from './ReviewImageModal';
import ReviewImages from './ReviewImages';
import { usePathname, useRouter } from 'next/navigation';
import { getReviews, getMyReviews } from '@/utils/getReviews';
import { getOrders } from '@/utils/getOrders';
import type { Order } from '@/types/Order';
import type { Product } from '@/types/Product';
import type { UserImage } from '@/types/User';
import { useLoginStore } from '@/stores/loginStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 리뷰 타입 정의
interface Review {
  _id: number;
  productId: number | string;
  user: {
    _id: number;
    name: string;
    image?: string | UserImage;
  };
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
}

const REVIEWS_PER_PAGE = 5;

export interface ProductReviewsProps {
  productId: string | number;
  productName: string;
  orderId?: string | number;
  orderProducts?: Product[];
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 상태 불러오기
  const currentUser = useLoginStore(state => state.user);
  const accessToken = currentUser?.token?.accessToken;

  // 컴포넌트 상태 정의
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyReviewsOnly, setShowMyReviewsOnly] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'photos' | 'normal'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<number>>(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalReviewImages, setModalReviewImages] = useState<string[]>([]);
  const [modalCurrentImageIdx, setModalCurrentImageIdx] = useState(0);

  // 리뷰 작성 여부 관련 상태
  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [hasOrderedProduct, setHasOrderedProduct] = useState(false);
  const [orderIdForProduct, setOrderIdForProduct] = useState<string | number | null>(null);

  // 이미지 모달
  const openImageModal = (images: string[], index: number) => {
    setModalReviewImages(images);
    setModalCurrentImageIdx(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalReviewImages([]);
    setModalCurrentImageIdx(0);
  };

  const showPrevImage = () => {
    setModalCurrentImageIdx(prev => (prev === 0 ? modalReviewImages.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setModalCurrentImageIdx(prev => (prev === modalReviewImages.length - 1 ? 0 : prev + 1));
  };

  /**
   * 주문 내역과 리뷰 작성 여부 조회
   * 1. 해당 상품을 구매했는지 확인
   * 2. 해당 상품에 대해 작성한 리뷰 개수 확인
   */
  useEffect(() => {
    async function fetchUserOrdersAndReviews() {
      if (!accessToken) {
        console.log('[fetchUserOrdersAndReviews] accessToken 없음');
        setHasOrderedProduct(false);
        setOrderIdForProduct(null);
        setHasWrittenReview(false);
        return;
      }

      try {
        // 1. 주문 내역 확인 - 해당 상품을 포함한 모든 주문 찾기
        const ordersRes = await getOrders(accessToken);

        let hasOrdered = false;
        let orderId = null;
        let orderCount = 0;

        if (ordersRes.ok && Array.isArray(ordersRes.item)) {
          const orders: Order[] = ordersRes.item;
          const ordersWithProduct = orders.filter(order => order.products.some(p => String(p._id) === String(productId)));

          if (ordersWithProduct.length > 0) {
            hasOrdered = true;
            // 가장 최근 주문의 ID를 사용 (리뷰 작성시 참조용)
            orderId = ordersWithProduct[0]._id;
            orderCount = ordersWithProduct.length;
            setOrderCount(orderCount);
          }
        }

        setHasOrderedProduct(hasOrdered);
        setOrderIdForProduct(orderId);

        // 2. 이미 작성한 리뷰 개수 확인
        if (hasOrdered) {
          const myReviews = await getMyReviews(accessToken);

          const reviewsForThisProduct = myReviews.filter(review => String(review.productId) === String(productId));

          const currentReviewCount = reviewsForThisProduct.length;
          setReviewCount(currentReviewCount);

          // 작성한 리뷰 개수가 주문 횟수와 같거나 많으면 더 이상 작성 불가
          setHasWrittenReview(currentReviewCount >= orderCount);
        } else {
          setHasWrittenReview(false);
          setOrderCount(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error('[fetchUserOrdersAndReviews] 오류:', error);
        setHasOrderedProduct(false);
        setOrderIdForProduct(null);
        setHasWrittenReview(false);
        setOrderCount(0);
        setReviewCount(0);
      }
    }

    fetchUserOrdersAndReviews();
  }, [accessToken, productId]);

  /**
   * 리뷰 목록 불러오기
   * 전체 혹은 본인 리뷰 필터링
   */
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      if (showMyReviewsOnly) {
        // 로그인하지 않은 상태에서 내 후기 보기를 누른 경우
        if (!currentUser || !accessToken) {
          setReviews([]);
          setLoading(false);
          return;
        }

        const myReviews = await getMyReviews(accessToken);

        const filtered = myReviews.filter(r => String(r.productId) === String(productId));

        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setReviews(filtered);
      } else {
        const reviewsData = await getReviews(productId);

        reviewsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('[fetchReviews] 오류:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, showMyReviewsOnly, currentUser, accessToken]);

  // 후기 필터링 변경 시 리뷰 다시 로딩
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 리뷰 확장/축소 상태 토글
  const toggleExpand = (reviewId: number) => {
    setExpandedReviewIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  // 탭 정보 (전체/사진/일반)
  const tabInfo = useMemo(
    () =>
      [
        { key: 'all', label: '전체', count: reviews.length },
        { key: 'photos', label: '사진 후기', count: reviews.filter(r => r.images && r.images.length > 0).length },
        { key: 'normal', label: '일반', count: reviews.filter(r => !r.images || r.images.length === 0).length },
      ] as const,
    [reviews],
  );

  // 필터링된 후기 리스트
  const filteredReviews = reviews.filter(review => {
    if (filterTab === 'photos') {
      return review.images && review.images.length > 0;
    }
    if (filterTab === 'normal') {
      return !review.images || review.images.length === 0;
    }
    return true;
  });

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = filteredReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);

  // 후기 작성 버튼 상태와 텍스트
  const canWriteReview = hasOrderedProduct && !hasWrittenReview;
  const getButtonText = () => {
    if (!hasOrderedProduct) return '후기 남기기';
    if (hasWrittenReview) return '후기 작성 완료';
    return `후기 남기기 (${reviewCount}/${orderCount})`;
  };

  const getButtonTooltip = () => {
    if (!hasOrderedProduct) return '구매한 상품에 대해서만 후기를 작성할 수 있습니다.';
    if (hasWrittenReview) return '주문하신 모든 건에 대해 후기를 작성하셨습니다.';
    return undefined;
  };

  return (
    <section className="max-w-full px-6 py-8 bg-background">
      <h2 className="text-lg font-bold mb-2">상품 후기</h2>

      {reviews.length > 0 && (
        <div className="flex justify-center my-6">
          <div className="relative flex gap-4 border border-secondary-green rounded-lg px-1 bg-transparent">
            <div
              className="absolute top-0 left-0 rounded-md bg-secondary-green transition-all duration-300"
              style={{
                width: '116px',
                height: '100%',
                transform: `translateX(${tabInfo.findIndex(t => t.key === filterTab) * 112}px)`,
                zIndex: 0,
              }}
            />
            {tabInfo.map(({ key, label, count }) => {
              const isActive = filterTab === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setFilterTab(key);
                    setCurrentPage(1);
                  }}
                  className={`relative z-10 w-[100px] py-2 px-2 flex flex-col items-center justify-center text-sm transition-colors duration-300 ${isActive ? 'text-white' : 'text-black'} cursor-pointer`}
                >
                  <span className="leading-none text-xs mb-1">{label}</span>
                  <span className="text-xs leading-none">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="min-h-[430px] flex flex-col justify-center">
        {loading ? (
          <div className="text-gray-500 flex-1 flex items-center justify-center text-center">리뷰 로딩 중...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-gray-500 flex-1 flex items-center justify-center text-center">{showMyReviewsOnly && !currentUser ? '로그인 후 내가 남긴 후기를 확인할 수 있습니다.' : showMyReviewsOnly ? '내가 작성한 후기가 없습니다.' : '등록된 리뷰가 없습니다.'}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentReviews.map(review => {
              const imageSrc = (() => {
                const img = review.user.image;
                if (!img) return null;
                if (typeof img === 'string') return `${API_URL}/${img}`;
                if (typeof img === 'object' && 'path' in img) return `${API_URL}/${img.path}`;
                return null;
              })();

              // 내 후기인지 확인
              const isMyReview = currentUser?._id && String(review.user._id) === String(currentUser._id);

              return (
                <div key={review._id} className="border-b border-gray-200 py-3">
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

                  {review.images && review.images.length > 0 && <ReviewImages images={review.images} reviewId={review._id} expanded={expandedReviewIds.has(review._id)} toggleExpand={toggleExpand} openImageModal={openImageModal} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filteredReviews.length > REVIEWS_PER_PAGE && (
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={page => setCurrentPage(page)} />
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          className={`px-4 py-2 text-sm ${!canWriteReview ? 'bg-gray-300 cursor-not-allowed text-gray-400' : 'bg-black text-white hover:bg-gray-800 cursor-pointer'}`}
          onClick={() => {
            if (!canWriteReview) return;
            if (!currentUser) {
              alert('후기를 작성하려면 로그인해주세요.');
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setIsModalOpen(true);
          }}
          disabled={!canWriteReview}
          title={getButtonTooltip()}
        >
          {getButtonText()}
        </button>
        {/* 로그아웃 상태에서도 토글 버튼 표시 */}
        <button
          className="cursor-pointer border px-4 py-2 text-sm hover:bg-gray-100"
          onClick={() => {
            const toggled = !showMyReviewsOnly;
            console.log('[ProductReviews] 내 후기 보기 토글 - 이전:', showMyReviewsOnly, '이후:', toggled);
            setShowMyReviewsOnly(toggled);
            setCurrentPage(1);
          }}
        >
          {showMyReviewsOnly ? '전체 후기 보기' : '내가 남긴 후기 보기'}
        </button>
      </div>

      <ReviewModal
        productId={productId}
        productName={productName}
        orderId={orderIdForProduct ?? ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={() => {
          setCurrentPage(1);
          setHasWrittenReview(true);
          fetchReviews();
        }}
      />

      <ReviewImageModal images={modalReviewImages} currentIndex={modalCurrentImageIdx} isOpen={isImageModalOpen} onClose={closeImageModal} onPrev={showPrevImage} onNext={showNextImage} />
    </section>
  );
}
