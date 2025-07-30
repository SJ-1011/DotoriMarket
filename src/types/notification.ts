import { Post } from './Post';
import { ProductImage } from './Product';
import { LoginUser, User } from './User';

export interface Notification {
  _id: number;
  type: 'payment' | 'qna' | 'reply';
  target_id?: number;
  // 상품: 상품이 정상 결제되었습니다.
  // 문의: 문의글에 답변이 달렸습니다.
  // 자유: ㅇㅇㅇ님이 댓글을 남기셨습니다.
  content: string;
  extra: {
    product?: string;
    image?: ProductImage[];
    post?: Post;
    sendUser?: LoginUser;
  };
  user: User;
  channel: string; // 나중에 채널도 수정 (알림 방법)
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
