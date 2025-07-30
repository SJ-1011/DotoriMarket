'use client';

import { useEffect, useState } from 'react';
import { getPosts, getReplies } from '@/utils/getPosts';
import { useLoginStore } from '@/stores/loginStore';
import Pagination from '@/components/common/Pagination';
import { maskUserId } from '@/utils/mask';
import type { Post, PostReply } from '@/types/Post';

interface Question {
  id: string;
  user: string;
  userId: string;
  title: string;
  question: string;
  answers: string[];
  createdAt: string;
  hasAnswer: boolean;
}

const QUESTIONS_PER_PAGE = 5;

interface ProductQuestionsProps {
  productId: string | number;
  productName: string;
}

export default function ProductQuestions({ productId, productName }: ProductQuestionsProps) {
  const currentUser = useLoginStore(state => state.user);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMyQuestionsOnly, setShowMyQuestionsOnly] = useState(false);

  useEffect(() => {
    async function fetchAllQuestions() {
      setLoading(true);
      try {
        const res = await getPosts('qna');

        if (res.ok) {
          const posts = res.item as Post[];
          const filteredPosts = posts.filter(post => String(post.extra?.productId) === String(productId));
          const questionList: Question[] = [];

          for (const post of filteredPosts) {
            const repliesRes = await getReplies(Number(post._id));
            const replies: PostReply[] = repliesRes.ok ? repliesRes.item : [];

            questionList.push({
              id: String(post._id),
              user: post.user.name,
              userId: String(post.user._id),
              title: post.title || '제목 없음',
              question: post.content,
              answers: replies.map(reply => reply.content),
              createdAt: post.createdAt,
              hasAnswer: replies.length > 0,
            });
          }

          setQuestions(questionList);
          setCurrentPage(1);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error(error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAllQuestions();
  }, [productId]);

  const filteredQuestions = (() => {
    if (!showMyQuestionsOnly) return questions;
    if (!currentUser?._id) return [];

    return questions.filter(q => q.userId === String(currentUser._id));
  })();

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIdx = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIdx, startIdx + QUESTIONS_PER_PAGE);

  return (
    <section className="max-w-full px-6 py-8 bg-background">
      <h2 className="text-lg font-bold mb-2">상품 문의</h2>

      <div className="mb-6 min-h-[430px] flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-center">문의 로딩 중...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-center">{showMyQuestionsOnly && !currentUser ? '로그인 후 내가 남긴 문의를 확인할 수 있습니다.' : showMyQuestionsOnly ? '내가 작성한 문의가 없습니다.' : '등록된 문의가 없습니다.'}</div>
        ) : (
          <div className="w-full flex flex-col justify-start">
            {currentQuestions.map(q => {
              const isExpanded = expandedIds.includes(q.id);
              const isMyQuestion = currentUser?._id && q.userId === String(currentUser._id);

              return (
                <div key={q.id} className={`border-b border-gray-300 py-2 hover:bg-[#f4f1ed] ${isExpanded ? 'bg-[#f4f1ed]' : ''}`}>
                  <button className="w-full text-left px-4 py-3 bg-transparent cursor-pointer flex flex-col items-start" onClick={() => setExpandedIds(prev => (prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]))}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 truncate">
                        {q.title.slice(0, 40)}
                        {q.title.length > 40 ? '...' : ''}
                      </span>
                      {isMyQuestion && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">내 문의</span>}
                    </div>
                    <span className="mt-1 text-xs text-gray-600">
                      {q.hasAnswer ? '답변 완료' : '답변 예정'} | {maskUserId(q.user)} | {new Date(q.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="bg-transparent px-4 py-4 text-sm">
                      <p className="font-semibold mb-2">주문 상품: {productName}</p>
                      <p className="text-gray-800 whitespace-pre-line mb-4">{q.question}</p>
                      <hr className="my-3" />
                      {q.hasAnswer && q.answers.length > 0 ? (
                        q.answers.map((answer, idx) => (
                          <div key={idx} className="mb-4">
                            <p className="font-semibold mt-6 mb-2">도토리섬 관리자</p>
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

      {totalPages > 1 && !loading && <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={page => setCurrentPage(page)} />}

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
            const toggled = !showMyQuestionsOnly;
            setShowMyQuestionsOnly(toggled);
            setCurrentPage(1);
          }}
        >
          {showMyQuestionsOnly ? '전체 문의 보기' : '내가 남긴 문의 보기'}
        </button>
      </div>
    </section>
  );
}
