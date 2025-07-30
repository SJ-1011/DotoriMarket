const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 주문 상태를 수정하는 함수입니다.
 * @param orderId - 수정할 주문 ID
 * @param newState - 변경할 주문 상태 코드
 * @param token - 관리자 인증 토큰 (Bearer Token)
 */
export async function patchOrderState(orderId: number, newState: string, token: string) {
  const res = await fetch(`${API_URL}/seller/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Client-Id': CLIENT_ID,
    },
    body: JSON.stringify({ state: newState }),
  });

  if (!res.ok) {
    throw new Error('주문 상태 수정 실패');
  }

  return res.json();
}
