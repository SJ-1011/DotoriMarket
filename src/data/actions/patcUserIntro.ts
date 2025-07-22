import type { ApiResPromise } from '@/types/api';
import type { User } from '@/types/User';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 특정 유저의 한줄 소개(intro)를 수정합니다.
 * @param userId - 수정할 유저 ID
 * @param intro - 새로운 한줄 소개 내용
 * @param token - JWT 토큰
 * @returns {Promise<ApiRes<User>>} - 수정된 유저 정보 응답
 */
export async function patchUserIntro(userId: number, intro: string, token: string): ApiResPromise<User> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ extra: { intro } }),
    });
    return res.json();
  } catch (error) {
    console.error('patchUserIntro 에러:', error);
    return { ok: 0, message: '한줄 소개 수정에 실패했습니다.' };
  }
}
