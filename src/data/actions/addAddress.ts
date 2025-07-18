import axios from 'axios';
import type { ApiResPromise } from '@/types';
import type { UserAddress } from '@/types/User';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface AddAddressPayload {
  extra: {
    address: UserAddress[];
  };
  address?: string; // isDefault true일 때만 필요
}

export async function addAddress(
  userId: number,
  accessToken: string,
  newAddress: Omit<UserAddress, 'id'>, // id 없는 상태로 받음
): ApiResPromise<{ ok: number }> {
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

    // 새 id 생성 (마지막 id + 1)
    const lastId = currentAddresses.length > 0 ? currentAddresses[currentAddresses.length - 1].id : 0;

    const newAddressWithId: UserAddress = {
      ...newAddress,
      id: lastId + 1,
    };

    // 기존 기본배송지 해제는 새 주소가 기본배송지일 때만
    const updatedAddresses = newAddressWithId.isDefault
      ? [
          ...currentAddresses.map(addr => ({
            ...addr,
            isDefault: false,
          })),
          newAddressWithId,
        ]
      : [...currentAddresses, newAddressWithId];

    const payload: AddAddressPayload = {
      extra: {
        address: updatedAddresses,
      },
    };

    if (newAddressWithId.isDefault) {
      payload.address = newAddressWithId.value;
    }

    const { data: result } = await authAPI.patch(`/users/${userId}`, payload);
    return result;
  } catch (error) {
    console.error('🚨 addAddress Error (axios):', error);
    throw error;
  }
}
