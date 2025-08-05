const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function deleteProduct(_id: string, token: string) {
  const res = await fetch(`${API_URL}/seller/products/${_id}`, {
    method: 'DELETE',
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('상품 삭제 실패');
  }

  return res.json();
}
