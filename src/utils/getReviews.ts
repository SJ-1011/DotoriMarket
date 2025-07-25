const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 특정 상품에 대한 리뷰 목록을 가져옵니다.
 * @param productId - 조회할 상품의 ID (문자열 또는 숫자)
 * @returns 리뷰 배열을 담은 Promise
 * @throws API 요청 실패 또는 서버 응답 형식 오류 시 에러 발생
 */
export async function getReviews(productId: string | number) {
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
      return data.item;
    } else {
      throw new Error('서버 응답 형식 오류');
    }
  } catch (error) {
    console.error('getReviews 에러:', error);
    throw error;
  }
}

/**
 * 로그인한 사용자가 작성한 모든 리뷰 목록을 가져옵니다.
 * @param accessToken - 로그인 사용자 인증을 위한 액세스 토큰
 * @returns 사용자가 작성한 리뷰 배열을 담은 Promise
 * @throws API 요청 실패 또는 서버 응답 형식 오류 시 에러 발생
 */
export async function getMyReviews(accessToken: string) {
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
      return data.item;
    } else {
      throw new Error('서버 응답 형식 오류');
    }
  } catch (error) {
    console.error('getMyReviews 에러:', error);
    throw error;
  }
}
