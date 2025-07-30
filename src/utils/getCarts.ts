import axios from 'axios';
import type { CartResponse } from '@/types/Cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function getCarts(token: string): Promise<CartResponse> {
  try {
    const res = await axios.get(`${API_URL}/carts/`, {
      headers: {
        'client-id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('[getCarts] 장바구니 데이터 가져오기 실패:', err);
    throw new Error('장바구니 데이터를 가져올 수 없습니다.');
  }
}
