'use client';

import { useEffect, useState, useActionState } from 'react';
import Image from 'next/image';
import { PostReply } from '@/types/Post';
import { getReplies } from '@/utils/getPosts';
import MypageIcon from '@/components/icon/MypageIcon';
import { createReply } from '@/data/actions/post';
import { ApiRes } from '@/types/api';
import { useLoginStore } from '@/stores/loginStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  postId: number;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt, postId }: ImageModalProps) {
  const [comments, setComments] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false); // 로그인 에러 상태 추가
  const user = useLoginStore(state => state.user);
  const isLogin = useLoginStore(state => state.isLogin);
  const [state, formAction, isPending] = useActionState(async (prevState: ApiRes<PostReply> | null, formData: FormData) => {
    const res = await createReply(prevState, formData);
    return res;
  }, null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getReplies(postId)
      .then(res => {
        if (res.ok === 1) setComments(res.item);
        else setComments([]);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [isOpen, postId]);

  useEffect(() => {
    if (state?.ok === 1 && state.item) {
      setComments(prev => [...prev, state.item]);
    }
  }, [state]);

  // 댓글 입력창 클릭 핸들러(비로그인 상태에서 댓글 남기기 방지)
  const handleInputClick = () => {
    if (!isLogin) {
      setLoginError(true);
      // 3초 후 에러 메시지 자동 제거
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  // 댓글 입력창에 포커스가 들어올 때 로그인 체크하는 핸들러
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isLogin) {
      e.target.blur(); // 포커스 제거
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur" onClick={onClose}>
      <div className="flex bg-transparent rounded-lg overflow-hidden shadow-2xl max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* 이미지 영역 */}
        <div className="bg-black flex items-center justify-center w-[600px] h-[600px] max-w-[80vw] max-h-[80vh] relative">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" unoptimized priority />
        </div>
        {/* 댓글 영역 */}
        <div className="bg-white w-[360px] max-w-[90vw] h-[600px] max-h-[80vh] flex flex-col p-0">
          <div className="font-bold text-xl text-gray-800 border-b border-gray-300 pb-2 px-6 pt-6">댓글</div>
          {/* 댓글 리스트 (border 없음) */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {loading ? (
              <p className="text-gray-500">댓글 로딩 중...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400">댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map(comment => (
                  <li key={comment._id} className="flex items-center gap-3">
                    {/* 프로필 이미지 or 기본 아이콘 */}
                    {comment.user.image ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image src={`${API_URL}/${comment.user.image.path}`} alt={`${comment.user.name} 프로필`} width={28} height={28} className="object-cover w-full h-full" unoptimized />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 flex-shrink-0">
                        <MypageIcon svgProps={{ className: 'w-5 h-5 text-gray-400' }} />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{comment.user.name}</div>
                      <div className="text-gray-700">{comment.content}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* 댓글 입력 영역에만 위 구분선 */}
          <div className="border-t border-gray-200 px-6 py-3 bg-white flex-shrink-0">
            <form
              action={formAction}
              className="flex items-center"
              onSubmit={e => {
                if (!isLogin) {
                  e.preventDefault();
                  setLoginError(true);
                  setTimeout(() => setLoginError(false), 3000);
                  return;
                }
                const input = e.currentTarget.elements.namedItem('content') as HTMLInputElement;
                if (!input.value.trim()) {
                  e.preventDefault();
                }
              }}
              autoComplete="off"
            >
              <input type="text" name="content" placeholder={isLogin ? '댓글을 입력해주세요' : '로그인 후 댓글을 작성할 수 있습니다'} className={`flex-grow border-0 focus:ring-0 focus:outline-none text-gray-800 bg-transparent ${!isLogin ? 'cursor-pointer' : ''}`} disabled={isPending || !isLogin} spellCheck={false} autoComplete="off" onClick={handleInputClick} onFocus={handleInputFocus} readOnly={!isLogin} />
              <input type="hidden" name="_id" value={postId} />
              <input type="hidden" name="type" value="community" />
              <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
              <button type="submit" className={`ml-2 text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-700`} disabled={isPending || !isLogin}>
                게시
              </button>
            </form>
            {/* 로그인 에러 메시지 */}
            {loginError && <p className="text-red-500 text-sm mt-1">로그인이 필요합니다.</p>}
            {/* 기존 에러 출력 */}
            {state?.ok === 0 && <p className="text-red-500 text-sm mt-1">{state.message || '댓글 작성 실패'}</p>}
          </div>
        </div>
      </div>
      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" aria-label="모달 닫기">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">클릭하거나 ESC를 눌러 닫기</div>
    </div>
  );
}
