import { LoginUser } from '@/types';
import { ProductImage } from '@/types/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
/**
 * 결제 알림을 생성하는 함수
 * @param {string} product - 상품명
 * @param {ProductImage} image - 상품 이미지 정보
 * @param {LoginUser} user - 로그인 유저 정보
 * @returns {Promise<ApiRes<Post>>} - 생성 결과 응답 객체
 * @throws {Error} - 네트워크 오류 발생 시
 * @description
 * 결제 완료 알림을 생성하고, 성공 시 POST 이후 반환된 Res객체를 받습니다.
 * 실패 시 에러 메시지를 반환합니다.
 */
export async function createPaymentNotification(product: string, image: ProductImage, user: LoginUser) {
  const body = {
    type: 'payment',
    target_id: user?._id,
    content: '상품이 정상 결제되었습니다.',
    extra: {
      product: product,
      image: [{ path: image.path, name: image.name, originalname: image.originalname }],
    },
  };

  try {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${user.token.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    console.log('알림 추가 성공!');
    return data;
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 등록에 실패했습니다.' };
  }
}
