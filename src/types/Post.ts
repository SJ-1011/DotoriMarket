// src/types/Post.ts

export type BoardType = 'community' | 'notice' | 'qna'; //커뮤니티, 공지, 문의 게시판 3개

export interface PostUser {
  _id: number | string;
  name: string;
  image: string;
}

export interface PostProduct {
  image: string | null;
}

//댓글 추가
export interface PostReply {
  _id: number | string;
  user: PostUser;
  content: string;
  like: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: number | string;
  type: BoardType;
  views: number;
  user: PostUser;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bookmarks: number;
  repliesCount: number;
  product: PostProduct;
  replies?: PostReply[];
}
