import type { UserAddress, UserInfo } from '@/types/User';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 공통 PATCH 함수 - 수정, 삭제, 대표배송지 변경 처리
 * @param userId 유저 ID
 * @param accessToken JWT 토큰
 * @param updatedData 수정된 주소 배열
 * @returns { ok, item, message }
 */
export async function patchUserInfo(userId: number, accessToken: string, updatedData: UserInfo): Promise<{ ok: number; item?: UserAddress[]; message?: string }> {
  try {
    const userRes = await fetch(`${API_URL}/users/${userId}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => res.json());

    if (userRes.ok !== 1 || !userRes.item) {
      throw new Error('기존 유저 데이터를 불러오지 못했습니다.');
    }

    const newData = { ...updatedData, extra: { ...userRes.item.extra, ...updatedData.extra } };

    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('patchUserAddresses 에러:', error);
    return { ok: 0, message: '주소 업데이트 실패' };
  }
}
