import type { AdminOrderResponse } from '@/types/AdminOrder';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  state?: string;
  user_id?: number;
  custom?: string;
  sort?: -1 | 1;
}

/**
 * 관리자 주문 목록을 서버에서 페이지네이션으로 가져옵니다.
 */
export async function getAdminOrders(accessToken: string, params: GetAdminOrdersParams = {}): Promise<AdminOrderResponse> {
  try {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
      ...(params.state && { state: params.state }),
      ...(params.user_id && { user_id: String(params.user_id) }),
      ...(params.custom && { custom: params.custom }),
      ...(params.sort && { sort: String(params.sort) }),
    });

    const res = await fetch(`${API_URL}/seller/orders?${query.toString()}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('관리자 주문 목록 불러오기 실패:', error);
    return { ok: 0, item: [] };
  }
}
