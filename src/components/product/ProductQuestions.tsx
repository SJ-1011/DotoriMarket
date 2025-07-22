'use client';
import { useEffect, useState } from 'react';

interface Question {
  id: string;
  user: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export default function ProductQuestions({ productId }: { productId: string | number }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/questions?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('문의 불러오기 실패', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [productId]);

  if (loading) return <div>문의 로딩 중...</div>;
  if (questions.length === 0) return <div>등록된 문의가 없습니다.</div>;

  return (
    <div>
      {questions.map(q => (
        <div key={q.id} className="border-b py-2">
          <p className="font-semibold">{q.user} 님의 문의</p>
          <p>{q.question}</p>
          {q.answer && <p className="mt-1 text-green-600">답변: {q.answer}</p>}
          <small className="text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
