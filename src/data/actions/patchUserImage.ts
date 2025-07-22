import type { ApiResPromise } from '@/types/api';
import type { User, UserImage } from '@/types/User';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 특정 유저의 프로필 이미지를 수정합니다.
 * @param userId - 수정할 유저의 고유 ID
 * @param image - 새로 업데이트할 이미지 객체 (path, name, originalname 포함)
 * @param token - 인증용 JWT 토큰 (Bearer)
 * @returns {Promise<ApiRes<User>>} - 유저 정보 응답 객체
 */
export async function patchUserImage(userId: number, image: UserImage, token: string): ApiResPromise<User> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    });
    return res.json();
  } catch (error) {
    console.error('patchUserImage 에러:', error);
    return { ok: 0, message: '일시적인 네트워크 문제로 이미지 변경에 실패했습니다.' };
  }
}
