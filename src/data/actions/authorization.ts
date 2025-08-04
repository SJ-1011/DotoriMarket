import { LoginUser } from '@/types';

type RefreshToken =
  | { ok: 1; accessToken: string }
  | {
      ok: 0;
      message: string;
      errorName?: string;
    };

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function refreshToken(user: LoginUser): Promise<RefreshToken> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${user.token.refreshToken}`,
      },
    });
    return res.json();
  } catch (error) {
    // 네트워크 오류 처리
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}
