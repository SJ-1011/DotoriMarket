import type { ApiResPromise } from '@/types/api';
import type { Notification } from '@/types/notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 로그인한 사용자의 알림 목록을 가져옵니다.
 * @returns {Promise<ApiRes<Notification[]>>} - 사용자 게시글 목록 응답 객체
 */
export async function getUserNotifications(token: string): ApiResPromise<Notification[]> {
  try {
    const requests = await fetch(`${API_URL}/notifications`, {
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
