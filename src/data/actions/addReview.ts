import type { ApiResPromise } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface AddReviewParams {
  productId: number;
  orderId: number;
  rating: number;
  content: string;
  files?: File[];
}

/**
 * 리뷰 추가 함수
 * @param params - 리뷰 정보 (productId, orderId, rating, content, files)
 * @param accessToken - 로그인 유저 토큰
 * @returns 추가된 리뷰 정보 반환 Promise
 * @description 서버에 리뷰를 POST 요청으로 등록합니다. 파일은 FormData로 처리합니다.
 */
export async function addReview(params: AddReviewParams, accessToken: string): ApiResPromise<{ reviewId: number }> {
  try {
    if (!params.orderId) {
      // orderId 없으면 에러
      throw new Error('구매한 상품에만 리뷰를 남길 수 있습니다.');
    }
    if (params.content.trim().length < 10) {
      throw new Error('리뷰 내용은 최소 10자 이상이어야 합니다.');
    }

    const formData = new FormData();
    formData.append('productId', String(params.productId));
    formData.append('orderId', String(params.orderId));
    formData.append('rating', String(params.rating));
    formData.append('content', params.content);
    if (params.files) {
      params.files.forEach(file => {
        formData.append('files', file);
      });
    }

    const res = await fetch(`${API_URL}/replies`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('서버 응답 내용:', errorText);
      throw new Error(`리뷰 등록 실패: ${res.status}  - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('addReview 함수에서 에러 발생:', error);
    throw error;
  }
}
