'use client';
import { useEffect, useState } from 'react';
import { getPosts } from '@/utils/getPosts'; // 전체 문의글 가져오는 함수 사용

interface Question {
  id: string;
  user: string;
  question: string;
  answer?: string;
  createdAt: string;
}

const QUESTIONS_PER_PAGE = 5;

export default function ProductQuestions({ productId }: { productId: string | number }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchAllQuestions() {
      setLoading(true);
      try {
        const res = await getPosts('qna'); // 전체 문의글 가져오기
        if (res.ok) {
          // productId와 일치하는 글만 필터링
          const filteredPosts = res.item.filter(post => String(post.extra?.productId) === String(productId));
          const questionList: Question[] = filteredPosts.map(post => ({
            id: String(post._id),
            user: post.user.name,
            question: post.content,
            answer: post.replies && post.replies.length > 0 ? post.replies[0].content : undefined,
            createdAt: post.createdAt,
          }));
          setQuestions(questionList);
          setCurrentPage(1);
        } else {
          console.error('API 응답 에러:', res.message);
          setQuestions([]);
        }
      } catch (error) {
        console.error('문의 불러오기 실패', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllQuestions();
  }, [productId]);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);

  if (loading) return <div className="px-4 py-6 text-gray-500">문의 로딩 중...</div>;

  return (
    <section className="max-w-full px-4 py-6 bg-background">
      <h2 className="text-lg font-bold mb-4">상품 문의 ({questions.length})</h2>

      {questions.length === 0 ? (
        <div className="text-gray-500 mb-6">등록된 문의가 없습니다.</div>
      ) : (
        <div className="space-y-4 mb-6">
          {currentQuestions.map(q => (
            <div key={q.id} className="bg-white border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">{q.question.slice(0, 40) + (q.question.length > 40 ? '...' : '')}</p>
                <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="bg-gray-50 border rounded-md p-3 text-sm">
                <p className="font-medium mb-2">주문 상품 관련 문의</p>
                <p className="text-gray-800 mb-2 whitespace-pre-line">{q.question}</p>
                {q.answer ? (
                  <div className="mt-3 border-t pt-2 text-sm text-green-700">
                    <p className="font-semibold">답변</p>
                    <p className="whitespace-pre-line">{q.answer}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">아직 답변이 등록되지 않았습니다.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mb-6">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1 border rounded disabled:opacity-50">
            이전
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-3 py-1 border rounded disabled:opacity-50">
            다음
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          className="cursor-pointer bg-black text-white px-4 py-2 hover:bg-gray-800 text-sm"
          onClick={() => {
            const query = new URLSearchParams({ productId: String(productId) });
            window.location.href = `/board/qna/new?${query}`;
          }}
        >
          상품 문의하기
        </button>
        <button className="cursor-pointer border px-4 py-2 text-sm hover:bg-gray-100" onClick={() => (window.location.href = '/board/qna')}>
          내가 남긴 문의 보기
        </button>
      </div>
    </section>
  );
}
