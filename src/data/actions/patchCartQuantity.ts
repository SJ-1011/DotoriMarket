/**
 * 장바구니의 특정 상품 수량을 수정하는 함수입니다.
 * @param cartId - 수정할 장바구니 항목의 ID
 * @param quantity - 변경할 수량 값 (최소 1 이상)
 * @param token - 사용자 인증 토큰 (Bearer Token)
 * @returns 서버로부터의 응답 JSON 객체 (수정된 장바구니 정보 포함)
 */
export async function patchCartQuantity(cartId: number, quantity: number, token: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

  const res = await fetch(`${API_URL}/carts/${cartId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Client-Id': CLIENT_ID,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error('수량 수정 실패');
  }

  return res.json();
}
