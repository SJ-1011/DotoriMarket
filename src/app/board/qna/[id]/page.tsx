import { getPost, getPosts, getReplies } from '@/utils/getPosts';
import { notFound } from 'next/navigation';
import QNADetailClient from './QNADetailClient';

export default async function QNADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // 서버에서 데이터 병렬 페칭
    const [postRes, qnaRes, replyRes] = await Promise.all([getPost(Number(id)), getPosts('qna'), getReplies(Number(id))]);

    if (!postRes.ok) {
      notFound();
    }

    const post = postRes.item;
    const posts = qnaRes.ok === 1 ? qnaRes.item : [];
    const reply = replyRes.ok ? replyRes.item : [];

    // 클라이언트 컴포넌트에 데이터 전달
    return <QNADetailClient id={id} post={post} posts={posts} reply={reply} />;
  } catch (error) {
    console.error('Error fetching QNA detail:', error);
    notFound();
  }
}
