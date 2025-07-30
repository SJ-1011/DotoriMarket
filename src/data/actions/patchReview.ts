const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface Extra {
  title?: string;
  files?: {
    path: string;
    name: string;
    originalname?: string;
  }[];
}

interface PatchReviewParams {
  reviewId: number | string;
  rating: number;
  content: string;
  extra?: Extra;
}

export async function patchReview(params: PatchReviewParams, accessToken: string): Promise<{ ok: number; item: { _id: number; rating: number; content: string; extra?: Extra; updatedAt: string } }> {
  const { reviewId, rating, content, extra } = params;

  if (!reviewId) {
    throw new Error('수정할 리뷰 ID가 없습니다.');
  }
  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  const body: { rating: number; content: string; extra?: Extra } = {
    rating,
    content,
  };
  if (extra) {
    body.extra = extra;
  }

  const res = await fetch(`${API_URL}/replies/${reviewId}`, {
    method: 'PATCH',
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`리뷰 수정 실패: ${res.status} - ${errorText}`);
  }

  const json = await res.json();

  return json;
}
