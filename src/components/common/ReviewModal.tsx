'use client';
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { addReview } from '@/data/actions/addReview';
import { patchReview } from '@/data/actions/patchReview';
import { useLoginStore } from '@/stores/loginStore';
import { FileUpload } from '@/types';
import { uploadFile } from '@/data/actions/file';

interface ReviewModalProps {
  productId: string | number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  orderId: string | number;
  reviewToEdit?: {
    reviewId: string | number;
    rating: number;
    content: string;
    images?: string[];
  };
}

interface ExistingFile {
  path: string;
  name: string;
  originalname?: string;
}

export default function ReviewModal({ productId, productName, isOpen, onClose, onSubmitSuccess, orderId, reviewToEdit }: ReviewModalProps) {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken || '';

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때, 수정할 후기 데이터가 있으면 상태 초기화
  useEffect(() => {
    if (isOpen) {
      if (reviewToEdit) {
        setRating(reviewToEdit.rating);
        setContent(reviewToEdit.content);

        // 기존 이미지 URL 배열을 객체 배열로 변환
        const convertedImages = (reviewToEdit.images ?? []).map(url => {
          try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            const name = path.split('/').pop() || 'unknown.jpg';
            return { path, name, originalname: name };
          } catch {
            return { path: url, name: url, originalname: url };
          }
        });
        setExistingImages(convertedImages);
      } else {
        setRating(0);
        setContent('');
        setExistingImages([]);
      }
      setFiles([]);
      setFilePreviews([]);
      setError('');
    }
  }, [isOpen, reviewToEdit]);

  // 업로드된 파일 변경 시 미리보기 URL 생성 및 정리
  useEffect(() => {
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);

    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 파일 선택 핸들러 (최대 5개)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const combinedFiles = [...files, ...selectedFiles].slice(0, 5);
    setFiles(combinedFiles);

    e.target.value = '';
  };

  // 파일 및 기존 이미지 삭제 핸들러
  const handleRemoveFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };
  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  // 별점 선택 토글
  const handleStarClick = (star: number) => {
    setRating(rating === star ? 0 : star);
  };

  // 후기 제출 처리
  const handleSubmit = async () => {
    // 입력값 검증
    if (!orderId || isNaN(Number(orderId))) {
      setError('유효한 주문 ID가 필요합니다.');
      return;
    }
    if (!productId || isNaN(Number(productId))) {
      setError('유효한 상품 ID가 필요합니다.');
      return;
    }
    if (rating === 0) {
      setError('별점을 선택해 주세요.');
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setError('후기 내용은 최소 10자 이상이어야 합니다.');
      return;
    }
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 새로 추가한 파일이 있으면 업로드 진행
      let uploadedFiles: FileUpload[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('attach', file));

        const res = await uploadFile(formData);
        if (res.ok) {
          uploadedFiles = res.item || [];
        } else {
          setError(res.message || '파일 업로드 실패');
          setSubmitting(false);
          return;
        }
      }

      // 기존 이미지 + 새로 업로드한 이미지 합치기
      const allFiles = [...existingImages, ...uploadedFiles];

      if (reviewToEdit?.reviewId) {
        // 후기 수정 API 호출 (기존 이미지 포함)
        await patchReview(
          {
            reviewId: reviewToEdit.reviewId,
            rating,
            content: content.trim(),
            extra: {
              files: allFiles,
            },
          },
          accessToken,
        );
      } else {
        // 신규 후기 등록 API 호출
        await addReview(
          {
            productId: Number(productId),
            orderId: Number(orderId),
            rating,
            content: content.trim(),
            files,
          },
          accessToken,
        );
      }

      onSubmitSuccess();
      onClose();
    } catch (e) {
      setError('후기 등록 중 오류가 발생했습니다.');
      console.error('ReviewModal handleSubmit error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} onClick={onClose}>
      <div className="bg-white rounded-md p-6 w-full max-w-xl shadow-lg max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">{productName}</h2>
        <h3 className="text-lg mb-4">{reviewToEdit ? '후기 수정' : '상품은 만족하셨나요?'}</h3>

        {/* 별점 선택 */}
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => handleStarClick(star)} aria-label={`${star}점 별점`} className={`text-3xl cursor-pointer select-none ${star <= rating ? 'text-secondary-green' : 'text-gray-300'}`} disabled={!accessToken || submitting}>
              ★
            </button>
          ))}
        </div>

        {/* 후기 내용 입력 */}
        <textarea
          rows={5}
          placeholder="후기를 작성해 주세요."
          className="w-full border border-gray-300 px-3 py-2 mb-1 resize-none"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={!accessToken || submitting}
          maxLength={50} // 글자 수 제한 50자
        />
        {/* 글자 수 표시 */}
        <div className="text-right text-sm text-gray-500 mb-4">{content.length} / 50</div>

        {/* 첨부파일 */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">첨부파일 (최대 5개)</label>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} disabled={files.length + existingImages.length >= 5 || !accessToken || submitting} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={files.length + existingImages.length >= 5 || !accessToken || submitting} className="border border-gray-400 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 disabled:opacity-50">
            파일 선택
          </button>

          <div className="flex gap-2 mt-2 overflow-x-auto">
            {/* 기존 이미지 미리보기 */}
            {existingImages.map((file, idx) => (
              <div key={`existing-${idx}`} className="relative w-25 h-25 rounded border border-gray-400 overflow-hidden">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}/${file.path}`} alt={`기존 첨부 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute top-0 right-1 text-xl font-bold cursor-pointer hover:text-red-600 leading-none" aria-label="기존 첨부 이미지 삭제" disabled={!accessToken || submitting}>
                  ×
                </button>
              </div>
            ))}

            {/* 새로 추가한 파일 미리보기 */}
            {filePreviews.map((src, idx) => (
              <div key={`new-${idx}`} className="relative w-25 h-25 rounded border border-gray-400 overflow-hidden">
                <img src={src} alt={`첨부 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveFile(idx)} className="absolute top-0 right-1 text-xl font-bold cursor-pointer hover:text-red-600 leading-none" aria-label="첨부 이미지 삭제" disabled={!accessToken || submitting}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-4 py-1.5 border hover:bg-gray-100 cursor-pointer">
            취소
          </button>
          <button onClick={handleSubmit} disabled={!accessToken || submitting} className="px-4 py-1.5 bg-black text-white hover:bg-gray-800 cursor-pointer disabled:opacity-50">
            {submitting ? (reviewToEdit ? '수정 중...' : '등록 중...') : reviewToEdit ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
