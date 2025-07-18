import axios from 'axios';
import type { ApiResPromise } from '@/types';
import type { UserAddress } from '@/types/User';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * addAddress 함수 내부 전용 payload 타입
 */
interface AddAddressPayload {
  extra: {
    address: UserAddress[];
  };
  address?: string; // isDefault true일 때만 필요
}

/**
 * 배송지 추가 함수 (axios 단일 파일 버전)
 * @param userId - 유저 ID
 * @param accessToken - 로그인한 유저의 액세스 토큰
 * @param newAddress - 추가할 배송지 정보 (UserAddress)
 * @returns 추가 결과를 반환하는 Promise
 * @description
 * 기존 배송지 배열을 가져와 새 주소를 추가한 후 서버에 업데이트합니다.
 */
export async function addAddress(userId: number, accessToken: string, newAddress: UserAddress): ApiResPromise<{ ok: number }> {
  try {
    const authAPI = axios.create({
      baseURL: API_URL,
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { data: user } = await authAPI.get(`/users/${userId}`);
    const currentAddresses: UserAddress[] = user.item.extra?.address || [];
    const updatedAddresses = [...currentAddresses, newAddress];
    const payload: AddAddressPayload = {
      extra: {
        address: updatedAddresses,
      },
    };

    if (newAddress.isDefault) {
      payload.address = newAddress.value;
    }

    const { data: result } = await authAPI.patch(`/users/${userId}`, payload);
    return result;
  } catch (error) {
    console.error('🚨 addAddress Error (axios):', error);
    throw error;
  }
}
