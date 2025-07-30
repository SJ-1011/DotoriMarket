const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function deleteCartItems(ids: number[], token: string) {
  const res = await fetch(`${API_URL}/carts`, {
    method: 'DELETE',
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ carts: ids }),
  });

  if (!res.ok) {
    throw new Error('장바구니 여러 항목 삭제 실패');
  }

  return res.json();
}
