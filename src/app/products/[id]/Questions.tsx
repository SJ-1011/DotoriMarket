'use client';
import { useEffect, useState } from 'react';
import { getPosts } from '@/utils/getPosts';
import { useLoginStore } from '@/stores/loginStore';
import Pagination from '@/components/common/Pagination';

interface Question {
  id: string;
  user: string;
  title: string;
  question: string;
  answers?: string[];
  createdAt: string;
}

const QUESTIONS_PER_PAGE = 5;

interface ProductQuestionsProps {
  productId: string | number;
  productName: string;
}

// 아이디 마스킹 함수 (첫 글자 + '**')
function maskUserId(userId: string) {
  if (!userId) return '';
  return userId[0] + '**';
}

export default function ProductQuestions({ productId, productName }: ProductQuestionsProps) {
  const { user } = useLoginStore();
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyQuestionsOnly, setShowMyQuestionsOnly] = useState(false);

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
            title: post.title || '제목 없음',
            question: post.content,
            answers: post.replies?.map(reply => reply.content) || [],
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

  const filteredQuestions = showMyQuestionsOnly ? questions.filter(q => q.user === user?.name) : questions;
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);

  if (loading) return <div className="px-4 py-6 text-gray-500">문의 로딩 중...</div>;

  return (
    <section className="max-w-full px-6 py-8 bg-background">
      <h2 className="text-lg font-bold mb-2">상품 문의 ({filteredQuestions.length})</h2>

      <div className="mb-6 min-h-[430px]">
        {filteredQuestions.length === 0 ? (
          <div className="text-gray-500 mb-6">등록된 문의가 없습니다.</div>
        ) : (
          <div className="mb-6">
            {currentQuestions.map(q => {
              const isExpanded = expandedIds.includes(q.id);
              return (
                <div key={q.id} className={`border-b border-gray-300 py-2 hover:bg-[#f4f1ed] ${isExpanded ? 'bg-[#f4f1ed]' : ''}`}>
                  <button className="w-full text-left px-4 py-3 bg-transparent cursor-pointer flex flex-col items-start " onClick={() => setExpandedIds(prev => (prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]))}>
                    {/* 제목 */}
                    <span className="text-sm text-gray-800 truncate">
                      {q.title.slice(0, 40)}
                      {q.title.length > 40 ? '...' : ''}
                    </span>

                    {/* 작성자 및 답변 상태*/}
                    <span className="mt-1 text-xs text-gray-600">
                      {q.answers && q.answers.length > 0 ? '답변 완료' : '답변 예정'} | {maskUserId(q.user)} | {new Date(q.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </button>

                  {/* 내용 */}
                  {isExpanded && (
                    <div className="bg-transparent px-4 py-4 text-sm ">
                      <p className="font-semibold mb-2">주문 상품: {productName}</p>
                      <p className="text-gray-800 whitespace-pre-line mb-4">{q.question}</p>
                      <hr className="my-3" />
                      {q.answers && q.answers.length > 0 ? (
                        q.answers.map((answer, idx) => (
                          <div key={idx} className="mb-4">
                            <p className="font-semibold mt-6 mb-2">답변 {idx + 1}</p>
                            <p className="whitespace-pre-line">{answer}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">아직 답변이 등록되지 않았습니다.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={page => setCurrentPage(page)} />

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
        <button
          className="cursor-pointer border px-4 py-2 text-sm hover:bg-gray-100"
          onClick={() => {
            setShowMyQuestionsOnly(prev => !prev);
            setCurrentPage(1);
          }}
        >
          {showMyQuestionsOnly ? '전체 문의 보기' : '내가 남긴 문의 보기'}
        </button>
      </div>
    </section>
  );
}
