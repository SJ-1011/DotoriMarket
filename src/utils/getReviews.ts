import type { Review } from '@/types/Review';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function getReviews(productId: string | number): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/replies/products/${productId}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`리뷰 조회 실패: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (data.ok === 1 && Array.isArray(data.item)) {
      const reviews = data.item as Review[];

      const processedReviews = reviews.map(review => ({
        ...review,
        images: review.extra?.files?.map(file => file.path) ?? [],
      }));

      return processedReviews;
    } else {
      throw new Error('서버 응답 형식 오류');
    }
  } catch (error) {
    console.error('getReviews 에러:', error);
    throw error;
  }
}

export async function getMyReviews(accessToken: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/replies/`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`내 리뷰 조회 실패: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (data.ok === 1 && Array.isArray(data.item)) {
      const reviews = data.item as Review[];

      const processedReviews = reviews.map(review => ({
        ...review,
        productId: review.product!._id,
        images: review.extra?.files?.map(file => file.path) ?? [],
      }));

      return processedReviews;
    } else {
      throw new Error('서버 응답 형식 오류');
    }
  } catch (error) {
    throw error;
  }
}
