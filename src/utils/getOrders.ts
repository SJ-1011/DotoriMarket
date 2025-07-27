import { ApiResPromise } from '@/types';
import { Order } from '@/types/Order';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 주문 내역을 불러옵니다.
 * @returns {Promise<ApiRes<Order[]>>} - 주문 내역 목록 응답 객체
 */
export async function getOrders(accessToken: string): ApiResPromise<Order[]> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 유저 목록을 불러오지 못했습니다.' };
  }
}
