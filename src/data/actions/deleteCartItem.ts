const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function deleteCartItem(id: number, token: string) {
  const res = await fetch(`${API_URL}/carts/${id}`, {
    method: 'DELETE',
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('장바구니 항목 삭제 실패');
  }

  return res.json();
}
