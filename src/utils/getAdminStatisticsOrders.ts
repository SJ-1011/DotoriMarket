import type { ApiResPromise } from '@/types/api';

interface Statistics {
  totalQuantity: number;
  totalSales: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 로그인한 사용자의 알림 목록을 가져옵니다.
 */
export async function getAdminStatisticsOrders(token: string): ApiResPromise<Statistics> {
  try {
    const requests = await fetch(`${API_URL}/admin/statistics/orders`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }).then(res => res.json());

    return requests;
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제로 내가 쓴 글을 불러오지 못했습니다.',
    };
  }
}
