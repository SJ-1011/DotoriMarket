'use client';

import { useEffect, useState } from 'react';
import { Post, PostReply } from '@/types/Post';
import DesktopQNADetail from './DesktopQNADetail';
import MobileQNADetail from './MobileQNADetail';

interface QNADetailClientProps {
  id: string;
  post: Post;
  posts: Post[];
  reply: PostReply[];
}

export default function QNADetailClient({ id, post, posts, reply }: QNADetailClientProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize(); // 처음 렌더링 시 창 너비 감지
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return <MobileQNADetail id={id} post={post} posts={posts} reply={reply} />;
  }

  return <DesktopQNADetail id={id} post={post} posts={posts} reply={reply} />;
}
