'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FavoriteBorderIcon from '@/components/icon/FavoriteBorderIcon';
import { Post } from '@/types/Post';
import { useLoginStore } from '@/stores/loginStore';
import { addBookmark } from '@/data/actions/addBookmark';
import { deleteBookmark } from '@/data/actions/deleteBookmark';
import Favorite from '@/components/icon/FavoriteIcon';
import FavoriteBorder from '@/components/icon/FavoriteBorderIcon';

interface Props {
  post: Post;
  apiUrl: string;
  clientId: string;
  bookmarkId?: number; // 상위에서 전달받는 북마크 ID (있으면 좋아요된 상태)
}

export default function CommunityPostCard({ post, apiUrl, clientId, bookmarkId: initialBookmarkId }: Props) {
  const user = useLoginStore(state => state.user);

  // 좋아요 여부 및 bookmarkId 상태
  const [isLiked, setIsLiked] = useState(!!initialBookmarkId);
  const [bookmarkId, setBookmarkId] = useState<number | undefined>(initialBookmarkId);
  const [bookmarkCount, setBookmarkCount] = useState(post.bookmarks ?? 0);
  console.log(clientId);
  // bookmarkId가 props로 바뀌면 상태 동기화
  useEffect(() => {
    setIsLiked(!!initialBookmarkId);
    setBookmarkId(initialBookmarkId);
  }, [initialBookmarkId]);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user?.token?.accessToken) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      if (isLiked && bookmarkId !== undefined) {
        setIsLiked(false);
        setBookmarkCount(prev => prev - 1);
        await deleteBookmark(bookmarkId, user.token.accessToken);
        setBookmarkId(undefined);
      } else {
        const res = await addBookmark(post._id as number, 'post', user.token.accessToken);
        if (res.ok) {
          setBookmarkId(res.item._id);
          setIsLiked(true);
          setBookmarkCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패', error);
      // rollback UI
      setIsLiked(prev => !prev);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E5CBB7] overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/board/community/${post._id}`} className="block relative aspect-square">
        <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} className="transition-transform hover:scale-105" />
      </Link>

      <div className="p-2">
        {/* 작성자 프로필 */}
        <div className="flex items-center mb-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
            <Image src={`${apiUrl}/${post.user.image?.path}`} alt={post.user.name} fill style={{ objectFit: 'cover' }} />
          </div>
          <span className="font-semibold text-xs text-gray-800">{post.user.name}</span>
        </div>

        {/* 게시글 내용 */}
        {post.content && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.content}</p>}

        {/* 하트 + 댓글 수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={handleLikeToggle} className="flex items-center space-x-1" aria-label="북마크 토글">
              {isLiked ? <Favorite svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-red' }} /> : <FavoriteBorder svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray' }} />}

              <span className="text-xs text-gray-600">{bookmarkCount}</span>
            </button>

            {/* 댓글 수 (아이콘은 동일) */}
            <div className="flex items-center space-x-1">
              <FavoriteBorderIcon svgProps={{ className: 'w-4 h-4 sm:w-3 sm:h-3 text-gray-400' }} />
              <span className="text-xs text-gray-600">{post.repliesCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
