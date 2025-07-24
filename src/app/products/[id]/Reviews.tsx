'use client';
import { useEffect, useState } from 'react';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string | number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('리뷰 불러오기 실패', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  if (loading) return <div>리뷰 로딩 중...</div>;
  if (reviews.length === 0) return <div>등록된 리뷰가 없습니다.</div>;

  return (
    <div>
      {reviews.map(review => (
        <div key={review.id} className="border-b py-2">
          <p className="font-semibold">{review.user}</p>
          <p>별점: {review.rating} / 5</p>
          <p>{review.comment}</p>
          <small className="text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
