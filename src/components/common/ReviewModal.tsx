'use client';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { addReview } from '@/data/actions/addReview';
import { useLoginStore } from '@/stores/loginStore';

interface ReviewModalProps {
  productId: string | number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  orderId: string | number;
}

export default function ReviewModal({ productId, productName, isOpen, onClose, onSubmitSuccess, orderId }: ReviewModalProps) {
  const user = useLoginStore(state => state.user);
  const accessToken = user?.token?.accessToken || '';

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setContent('');
      setFiles([]);
      setFilePreviews([]);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  useEffect(() => {
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  }, [files]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const combinedFiles = [...files, ...selectedFiles].slice(0, 5);
    setFiles(combinedFiles);

    e.target.value = '';
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleStarClick = (star: number) => {
    if (rating === star) {
      setRating(0);
    } else {
      setRating(star);
    }
  };

  const handleSubmit = async () => {
    console.log('submit data:', {
      productId,
      orderId,
      rating,
      content,
      files,
      productIdNumber: Number(productId),
      orderIdNumber: Number(orderId),
      contentTrimmed: content.trim(),
    });

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

    console.log('submit data:', {
      orderId: orderId,
      productId: productId,
      rating: rating,
      content: content,
      files: files,
    });
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

      onSubmitSuccess();
      onClose();
    } catch (e) {
      setError('후기 등록 중 오류가 발생했습니다.');
      console.error('addReview error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} onClick={onClose}>
      <div className="bg-white rounded-md p-6 w-full max-w-xl shadow-lg max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">{productName}</h2>
        <h3 className="text-lg  mb-4">상품은 만족하셨나요?</h3>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => handleStarClick(star)} aria-label={`${star}점 별점`} className={`text-3xl cursor-pointer select-none ${star <= rating ? 'text-secondary-green' : 'text-gray-300'}`} disabled={!accessToken || submitting}>
              ★
            </button>
          ))}
        </div>
        <textarea rows={5} placeholder="후기를 작성해 주세요." className="w-full border border-gray-300 px-3 py-2 mb-4 resize-none" value={content} onChange={e => setContent(e.target.value)} disabled={!accessToken || submitting} />
        <div className="mb-4">
          <label className="block mb-2 font-medium">첨부파일 (최대 5개)</label>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} disabled={files.length >= 5 || !accessToken || submitting} className="hidden" />

          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={files.length >= 5 || !accessToken || submitting} className="border border-gray-400  px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 disabled:opacity-50">
            파일 선택
          </button>

          <div className="flex gap-2 mt-2 overflow-x-auto">
            {filePreviews.map((src, idx) => (
              <div key={idx} className="relative w-25 h-25 rounded border border-gray-400 overflow-hidden">
                <img src={src} alt={`첨부 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveFile(idx)} className="absolute top-0 right-1  text-xl font-bold cursor-pointer hover:text-red-600 leading-none" aria-label="첨부 이미지 삭제" disabled={!accessToken || submitting}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={submitting} className="px-4 py-1.5 border  hover:bg-gray-100">
            취소
          </button>
          <button onClick={handleSubmit} disabled={!accessToken || submitting} className="px-4 py-1.5 bg-black text-white  hover:bg-gray-800 disabled:opacity-50">
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
