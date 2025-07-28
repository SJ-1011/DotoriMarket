'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/data/actions/file';
import { useActionState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import { createPost } from '@/data/actions/post';

export default function ImagePostForm({ boardType }: { boardType: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false); // 업로드 진행중
  const [state, formAction, isLoading] = useActionState(createPost, null);
  const user = useLoginStore(state => state.user);
  console.log(state);
  // 박스 클릭 → 파일선택창 열림(업로드 중에는 무시)
  const onClickBox = () => {
    if (!isUploading && !isLoading) {
      setUploadError('');
      fileRef.current?.click();
    }
  };

  // 파일 선택시: 미리보기 생성 후 업로드까지 전부 자동 진행
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setImagePath('');
      setImageName('');
      return;
    }

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // 업로드 비동기
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('attach', file);
      const res = await uploadFile(formData);

      if (res.ok === 1 && res.item.length > 0) {
        setImagePath(res.item[0].path);
        setImageName(res.item[0].originalname || res.item[0].name);
      } else {
        setUploadError('이미지 업로드 실패');
        setImagePath('');
        setImageName('');
      }
    } catch {
      setUploadError('이미지 업로드 실패. 다시 시도해주세요.');
      setPreview(null);
      setImagePath('');
      setImageName('');
    }
    setIsUploading(false);
  }

  // 제출할 때 업로드 결과 없으면 막기
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!imagePath) {
      e.preventDefault();
      setUploadError('이미지 첨부는 필수입니다!');
      fileRef.current?.focus();
    }
  };

  return (
    <form action={formAction} onSubmit={onSubmit} className="max-w-xl mx-auto p-4 relative">
      {/* 오버레이/로딩 원 */}
      {(isUploading || isLoading) && (
        <div className="absolute inset-0 z-10 bg-grey bg-opacity-30 flex flex-col items-center justify-center">
          {/* 로딩 원(스피너) */}
          <div className="w-12 h-12 border-4 border-[#A97452] border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-white font-semibold text-sm">이미지 업로드 중...</span>
        </div>
      )}

      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />
      <input type="hidden" name="type" value={boardType} />

      {/* 파일 선택 input */}
      <input type="file" ref={fileRef} name="attach" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading || isLoading} />

      {/* 업로드 박스 */}
      <div
        onClick={onClickBox}
        className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-gray-50 cursor-pointer transition
    ${preview ? '' : 'hover:bg-[#F5EEE6] hover:border-[#A97452]'} ${isUploading || isLoading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {preview ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <img src={preview} alt="미리보기" className="max-h-36 object-contain rounded" />
            {/* ❌ 삭제 버튼 */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setPreview(null);
                setImagePath('');
                setImageName('');
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="absolute top-0.5 right-1.5 text-red-500 text-2xl hover:text-red-600 transition"
              aria-label="이미지 삭제"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center gap-1 text-center px-3 select-none">
            <span className="text-xl mb-1">🖼️</span>
            이미지를 선택해주세요. <br />
          </div>
        )}
      </div>

      {/* 에러/결과 */}
      {uploadError && <p className="mt-2 text-red-500 text-sm">{uploadError}</p>}
      {imageName && <div className="mt-2 p-2 border border-green-400 bg-green-50 rounded text-green-700 text-sm truncate">업로드된 이미지: {imageName}</div>}
      {imagePath && <input type="hidden" name="product.image" value={imagePath} />}
      {imageName && <input type="hidden" name="product.name" value={imageName} />}

      {/* 제목/내용 등 나머지 입력 */}
      <div className="my-4">
        <label htmlFor="title" className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl">
          제목
        </label>
        <input id="title" name="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md text-xs sm:text-sm lg:text-base-xl dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452]" disabled={isUploading || isLoading} />
      </div>
      <div className="my-4">
        <label htmlFor="content" className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl">
          내용
        </label>
        <textarea id="content" name="content" rows={5} placeholder="내용을 입력하세요" className="w-full p-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" disabled={isUploading || isLoading} />
      </div>
      <div className="flex justify-end mt-6">
        <button type="submit" disabled={isLoading || isUploading} className="px-4 py-2 rounded-xl bg-[#A97452] text-white text-sm sm:text-base hover:bg-[#966343] transition-colors disabled:opacity-50">
          등록
        </button>
      </div>
    </form>
  );
}
