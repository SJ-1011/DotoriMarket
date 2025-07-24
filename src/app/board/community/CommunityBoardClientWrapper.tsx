'use client';

import { useEffect, useState } from 'react';
import { getLikedPosts } from '@/utils/getPosts';
import { Post } from '@/types/Post';
import CommunityPostCard from './CommunityPostCard';
import { useLoginStore } from '@/stores/loginStore';

interface Props {
  posts: Post[]; // SSR에서 넘어온 전체(또는 image) 게시글 리스트
  apiUrl: string;
  clientId: string;
}

interface BookmarkResponseItem {
  _id: number;
  post: Post;
}

export default function CommunityBoardClientWrapper({ posts, apiUrl, clientId }: Props) {
  const user = useLoginStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [mergedPosts, setMergedPosts] = useState<Array<Post & { bookmarkId?: number }>>([]);

  useEffect(() => {
    if (!user?.token?.accessToken) {
      // 로그인 안 한 경우에도 전체 포스트 보여주되 ‘북마크 정보 없음’
      setMergedPosts(posts);
      setLoading(false);
      return;
    }

    const fetchLiked = async () => {
      setLoading(true);
      try {
        const res = await getLikedPosts(user.token.accessToken);

        const liked = Object.values(res)
          .filter((v): v is BookmarkResponseItem => typeof v === 'object' && v !== null && '_id' in v && 'post' in v)
          .map(v => ({
            postId: v.post._id,
            bookmarkId: v._id,
          }));

        // postId → bookmarkId 맵 생성
        const bookmarkMap = new Map<number, number>();
        liked.forEach(v => {
          bookmarkMap.set(v.postId as number, v.bookmarkId);
        });

        // posts 배열에 bookmarkId 매핑해서 새로운 배열 생성
        const enriched = posts.map(post => ({
          ...post,
          bookmarkId: bookmarkMap.get(post._id as number),
        }));

        setMergedPosts(enriched);
      } catch (error) {
        console.error('북마크 가져오기 실패', error);
        setMergedPosts(posts); // 실패하면 그냥 원본만 보여줌
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user, posts]);

  if (loading) return <p className="text-gray-400 text-sm py-8">로딩 중...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {mergedPosts.map(post => (
        <CommunityPostCard key={post._id} post={post} apiUrl={apiUrl} clientId={clientId} bookmarkId={post.bookmarkId} />
      ))}
    </div>
  );
}
