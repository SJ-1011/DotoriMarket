// src/utils/getPosts.ts

import type { ApiResPromise } from '@/types/api';
import type { Post, BoardType } from '@/types/Post';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 주어진 게시판 타입의 게시글 목록을 fetch합니다.
 * @param boardType - 'community' | 'notice' | 'qna'
 */
export async function getPosts(boardType: BoardType): ApiResPromise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?type=${boardType}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'force-cache',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 게시글 목록을 불러오지 못했습니다.' };
  }
}
