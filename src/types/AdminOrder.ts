import { Product } from './Product';
import { OrderCost } from './Order';
import { UserExtra, UserImage } from './User';

// 배송코드
export type OrderStateCode = 'OS010' | 'OS020' | 'OS030' | 'OS040' | 'OS050';

export const ORDER_STATE_LABEL: Record<OrderStateCode, string> = {
  OS010: '주문접수',
  OS020: '배송준비중',
  OS030: '배송중',
  OS040: '배송완료',
  OS050: '취소',
};

// 상품 (관리자용) 기존 Product + review_id + 단일 image
export interface AdminOrderProduct extends Product {
  review_id?: number;
  image?: {
    path: string;
    name: string;
    originalname: string;
  };
}

// 구매자 정보
export interface AdminOrderUser {
  _id: number;
  name: string;
  email: string;
  birthday?: string;
  phone: string;
  loginType: string;
  image?: UserImage;
  extra?: UserExtra;
}

// 배송지 정보
export interface AdminOrderAddress {
  name: string;
  value: string;
  details?: string;
}

// 관리자 주문 타입
export interface AdminOrder {
  _id: number;
  user_id: number;
  user: AdminOrderUser;
  products: AdminOrderProduct[];
  address: AdminOrderAddress;
  memo: string;
  state: OrderStateCode;
  createdAt: string;
  updatedAt: string;
  cost: OrderCost;
}

// API 응답 타입
export interface AdminOrderResponse {
  ok: number;
  item: AdminOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
