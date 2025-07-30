// app/board/qna/edit/[id]/page.tsx
import { getPost } from '@/utils/getPosts';
import { notFound } from 'next/navigation';
import EditQnaForm from './EditQnaForm';

export default async function EditQnaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const postRes = await getPost(Number(id));

    if (!postRes.ok) {
      notFound();
    }

    const post = postRes.item;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#A97452] mb-6">문의 수정하기</h1>
          <EditQnaForm post={post} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    notFound();
  }
}
