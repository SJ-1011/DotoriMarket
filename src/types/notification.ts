import { ProductImage } from './Product';
import { User } from './User';

export interface Notification {
  _id: number;
  type: 'payment' | 'qna'; // 나중에 타입 수정
  target_id?: number;
  content: string;
  extra: {
    product: string;
    image?: ProductImage[];
  };
  user: User;
  channel: string; // 나중에 채널도 수정 (알림 방법)
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
