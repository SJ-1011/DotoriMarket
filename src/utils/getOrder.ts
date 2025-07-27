import type { ApiRes } from '@/types/api';
import type { OrderResponse } from '@/types/Order';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;

export async function getOrderById(id: string, token: string): Promise<ApiRes<OrderResponse>> {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  return res.json();
}
