const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function deleteReview(reviewId: string | number, accessToken: string) {
  const res = await fetch(`${API_URL}/replies/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('리뷰 삭제에 실패했습니다.');
  }

  return await res.json();
}
