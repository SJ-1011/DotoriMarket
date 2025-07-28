'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Pagination from '@/components/common/Pagination';
import ReviewModal from '@/components/common/ReviewModal';
import ReviewImageModal from './ReviewImageModal';
import { usePathname, useRouter } from 'next/navigation';
import { getReviews, getMyReviews } from '@/utils/getReviews';
import { getOrders } from '@/utils/getOrders';
import type { Order } from '@/types/Order';
import type { Product } from '@/types/Product';
import type { UserImage } from '@/types/User';
import { useLoginStore } from '@/stores/loginStore';

import ReviewFilterTabs from './ReviewFilterTabs';
import ReviewList from './ReviewList';
import { ReviewWriteButton, ReviewToggleButton } from './ReviewWriteButton';

const REVIEWS_PER_PAGE = 5;

export interface ProductReviewsProps {
  productId: string | number;
  productName: string;
  orderId?: string | number;
  orderProducts?: Product[];
}

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

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentUser = useLoginStore(state => state.user);
  const accessToken = currentUser?.token?.accessToken;

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

  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [hasOrderedProduct, setHasOrderedProduct] = useState(false);
  const [orderIdForProduct, setOrderIdForProduct] = useState<string | number | null>(null);

  // 중복 상태 초기화용 함수 분리
  const resetOrderAndReviewState = () => {
    setHasOrderedProduct(false);
    setOrderIdForProduct(null);
    setHasWrittenReview(false);
    setOrderCount(0);
    setReviewCount(0);
  };

  useEffect(() => {
    async function fetchUserOrdersAndReviews() {
      if (!accessToken) {
        resetOrderAndReviewState();
        return;
      }
      try {
        const ordersRes = await getOrders(accessToken);
        let hasOrdered = false;
        let orderId = null;
        let orderCountLocal = 0;

        if (ordersRes.ok && Array.isArray(ordersRes.item)) {
          const orders: Order[] = ordersRes.item;
          const ordersWithProduct = orders.filter(order => order.products.some(p => String(p._id) === String(productId)));

          if (ordersWithProduct.length > 0) {
            hasOrdered = true;
            orderId = ordersWithProduct[0]._id;
            orderCountLocal = ordersWithProduct.length;
            setOrderCount(orderCountLocal);
          }
        }

        setHasOrderedProduct(hasOrdered);
        setOrderIdForProduct(orderId);

        if (hasOrdered) {
          const myReviews = await getMyReviews(accessToken);
          const reviewsForThisProduct = myReviews.filter(review => String(review.productId) === String(productId));
          const currentReviewCount = reviewsForThisProduct.length;
          setReviewCount(currentReviewCount);
          setHasWrittenReview(currentReviewCount >= orderCountLocal);
        } else {
          resetOrderAndReviewState();
        }
      } catch {
        resetOrderAndReviewState();
      }
    }
    fetchUserOrdersAndReviews();
  }, [accessToken, productId]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      if (showMyReviewsOnly) {
        if (!accessToken) {
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
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, showMyReviewsOnly, accessToken]); // currentUser 제거

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleExpand = (reviewId: number) => {
    setExpandedReviewIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) newSet.delete(reviewId);
      else newSet.add(reviewId);
      return newSet;
    });
  };

  const tabInfo = useMemo(
    () =>
      [
        { key: 'all', label: '전체', count: reviews.length },
        { key: 'photos', label: '사진 후기', count: reviews.filter(r => r.images && r.images.length > 0).length },
        { key: 'normal', label: '일반', count: reviews.filter(r => !r.images || r.images.length === 0).length },
      ] as const,
    [reviews],
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (filterTab === 'photos') return review.images && review.images.length > 0;
      if (filterTab === 'normal') return !review.images || review.images.length === 0;
      return true;
    });
  }, [filterTab, reviews]);

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
  const currentReviews = filteredReviews.slice(startIdx, startIdx + REVIEWS_PER_PAGE);

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

  return (
    <section className="max-w-full px-6 py-8 bg-background">
      <h2 className="text-lg font-bold mb-2">상품 후기</h2>

      {reviews.length > 0 && <ReviewFilterTabs tabInfo={tabInfo} filterTab={filterTab} setFilterTab={setFilterTab} setCurrentPage={setCurrentPage} />}

      <div className="min-h-[430px] flex flex-col justify-center">
        <ReviewList reviews={currentReviews} loading={loading} currentUser={currentUser} expandedReviewIds={expandedReviewIds} toggleExpand={toggleExpand} openImageModal={openImageModal} showMyReviewsOnly={showMyReviewsOnly} />
      </div>

      {filteredReviews.length > REVIEWS_PER_PAGE && (
        <div className="mt-6">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={page => setCurrentPage(page)} />
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <ReviewWriteButton
          canWriteReview={canWriteReview}
          getButtonText={getButtonText}
          getButtonTooltip={getButtonTooltip}
          onClick={() => {
            if (!canWriteReview) return;
            if (!currentUser) {
              alert('후기를 작성하려면 로그인해주세요.');
              router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
              return;
            }
            setIsModalOpen(true);
          }}
        />

        <ReviewToggleButton
          showMyReviewsOnly={showMyReviewsOnly}
          onClick={() => {
            setShowMyReviewsOnly(!showMyReviewsOnly);
            setCurrentPage(1);
          }}
        />
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
