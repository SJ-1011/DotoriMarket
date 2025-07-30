'use client';

import { useEffect, useState, useActionState, useCallback } from 'react';
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
  images: string[]; // 단일 imageSrc 대신 이미지 배열
  imageAlt: string;
  postId: number;
}

export default function ImageModal({ isOpen, onClose, images, imageAlt, postId }: ImageModalProps) {
  const [comments, setComments] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스

  const user = useLoginStore(state => state.user);
  const isLogin = useLoginStore(state => state.isLogin);

  const [state, formAction, isPending] = useActionState(async (prevState: ApiRes<PostReply> | null, formData: FormData) => {
    const res = await createReply(prevState, formData);
    return res;
  }, null);

  // 이전/다음 이미지로 이동
  const goToPrevious = useCallback(() => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  // 키보드 이벤트 (좌우 화살표키)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, images.length, goToNext, goToPrevious, onClose]);

  // 모달이 열릴 때마다 첫 번째 이미지로 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

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

  const handleInputClick = () => {
    if (!isLogin) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isLogin) {
      e.target.blur();
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
          {/* 현재 이미지 */}
          <div className="w-full h-full relative">
            <Image src={images[currentImageIndex]} alt={`${imageAlt} ${currentImageIndex + 1}`} fill className="object-cover" unoptimized priority />
          </div>

          {/* 이전 버튼 */}
          {currentImageIndex > 0 && (
            <button onClick={goToPrevious} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10" aria-label="이전 이미지">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* 다음 버튼 */}
          {currentImageIndex < images.length - 1 && (
            <button onClick={goToNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all z-10" aria-label="다음 이미지">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* 이미지 인디케이터 (여러 이미지가 있을 때만 표시) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} aria-label={`${index + 1}번째 이미지로 이동`} />
              ))}
            </div>
          )}

          {/* 이미지 카운터 */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* 댓글 영역 */}
        <div className="bg-white w-[360px] max-w-[90vw] h-[600px] max-h-[80vh] flex flex-col p-0">
          <div className="font-bold text-xl text-gray-800 border-b border-gray-300 pb-2 px-6 pt-6">댓글</div>

          {/* 댓글 리스트 */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {loading ? (
              <p className="text-gray-500">댓글 로딩 중...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400">댓글이 없습니다.</p>
            ) : (
              <ul className="space-y-4">
                {comments.map(comment => (
                  <li key={comment._id} className="flex items-center gap-3">
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

          {/* 댓글 입력 영역 */}
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
              <button type="submit" className="ml-2 text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-700" disabled={isPending || !isLogin}>
                게시
              </button>
            </form>

            {/* 에러 메시지 */}
            {loginError && <p className="text-red-500 text-sm mt-1">로그인이 필요합니다.</p>}
            {state?.ok === 0 && <p className="text-red-500 text-sm mt-1">{state.message || '댓글 작성 실패'}</p>}
          </div>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" aria-label="모달 닫기">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 안내 텍스트 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">{images.length > 1 ? '← → 키나 스와이프로 이미지 전환 • ESC나 클릭으로 닫기' : '클릭하거나 ESC를 눌러 닫기'}</div>
    </div>
  );
}
