const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export interface PatchProductData {
  name?: string;
  price?: number;
  shippingFees?: number;
  extra?: Record<string, unknown>;
}

export async function patchProduct(
  _id: string,
  data: PatchProductData,
  accessToken: string,
): Promise<{
  ok: number;
  item: {
    _id: number;
    price?: number;
    name?: string;
    shippingFees?: number;
    mainImages?: string[];
    updatedAt: string;
  };
}> {
  if (!_id) {
    throw new Error('상품 ID가 필요합니다.');
  }
  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_URL}/seller/products/${_id}`, {
    method: 'PATCH',
    headers: {
      'Client-Id': CLIENT_ID,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`상품 수정 실패: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  return json;
}
