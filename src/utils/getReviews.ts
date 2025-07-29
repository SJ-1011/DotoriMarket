import type { Review } from '@/types/Review';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

// 특정 상품 리뷰 조회
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

// 내 리뷰 조회
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

// 전체 리뷰 조회
export async function getAllReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/replies/all`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`전체 리뷰 조회 실패: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    if (data.ok === 1 && Array.isArray(data.item)) {
      const reviews = data.item as Review[];

      const processedReviews = reviews.map(review => ({
        ...review,
        images:
          review.extra?.files?.map(file => {
            if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
              return file.path;
            }
            const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            return `${baseUrl}/${file.path}`;
          }) ?? [],
      }));

      return processedReviews;
    } else {
      throw new Error('서버 응답 형식 오류');
    }
  } catch (error) {
    throw error;
  }
}
