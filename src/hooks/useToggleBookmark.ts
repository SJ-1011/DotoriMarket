'use client';

import { useState } from 'react';
import { addBookmark } from '@/data/actions/addBookmark';
import { deleteBookmark } from '@/data/actions/deleteBookmark';

export function useToggleBookmark(initialBookmarkId: number | undefined, productId: number, accessToken?: string) {
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState<number | undefined>(initialBookmarkId);

  const toggle = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    e?.preventDefault();

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      if (isLiked) {
        await deleteBookmark(bookmarkId!, accessToken);
        setBookmarkId(undefined);
        setIsLiked(false);
      } else {
        const res = await addBookmark(productId, 'product', accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      setIsLiked(prev => !prev);
    }
  };

  return { isLiked, toggle };
}
