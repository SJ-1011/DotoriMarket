'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post, PostReply } from '@/types/Post';
import { getPost, getPosts, getReplies } from '@/utils/getPosts';
import DesktopQNADetail from './DesktopQNADetail';
import { notFound } from 'next/navigation';
import Loading from '@/app/loading';
import MobileQNADetail from './MobileQNADetail';

export default function QNADetailWrapper() {
  const params = useParams();
  const id = params.id as string;

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<PostReply[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize(); // 처음 렌더링 시 창 너비 감지
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const postRes = await getPost(Number(id));
      if (!postRes.ok) {
        notFound();
        return;
      }

      const qnaRes = await getPosts('qna');

      setPost(postRes.item);
      setPosts(qnaRes.ok === 1 ? qnaRes.item : []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReplies(Number(id));
      if (!res.ok) {
        notFound();
        return;
      }
      setReply(res.item);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading || !post) return <Loading />;

  if (isMobile) {
    return <MobileQNADetail id={id} post={post} posts={posts} reply={reply} />;
  }

  return <DesktopQNADetail id={id} post={post} posts={posts} reply={reply} />;
}
