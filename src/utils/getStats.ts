import { ProductStatistics, StatisticsParams } from '@/types/stats';
import { ApiResPromise } from '../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

// 상품별 통계 조회 함수
export async function getProductStatistics(params: StatisticsParams, accessToken: string): ApiResPromise<ProductStatistics[]> {
  try {
    // URL 파라미터 생성
    const searchParams = new URLSearchParams({
      start: params.start,
      finish: params.finish,
      by: params.by,
    });

    const res = await fetch(`${API_URL}/admin/statistics/orders?${searchParams.toString()}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const result = await res.json();

    if (res.ok && Array.isArray(result?.item)) {
      return { ok: 1, item: result.item };
    }

    return { ok: 1, item: [] };
  } catch (error) {
    console.error('getProductStatistics 에러:', error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제로 통계 데이터를 불러오지 못했습니다.',
    };
  }
}
