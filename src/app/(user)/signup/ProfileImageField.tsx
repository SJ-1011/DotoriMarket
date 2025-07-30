'use client';

import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { useState } from 'react';
import type { SignupFormValues } from './SignupForm';

export default function ProfileImageField() {
  const { register } = useFormContext<SignupFormValues>();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="attach">프로필 이미지</label>
      <div className="flex items-start gap-4 mt-3">
        <input
          type="file"
          id="attach"
          accept="image/*"
          {...register('attach')}
          onChange={e => {
            register('attach').onChange(e);
            onFileChange(e);
          }}
          className="hidden"
        />
        <label htmlFor="attach" className="bg-primary text-sm text-white px-4 py-3 rounded-xl cursor-pointer">
          파일 선택
        </label>
        {previewSrc && (
          <div className="w-[12.5rem] h-[12.5rem] relative rounded border border-primary-light overflow-hidden">
            <Image src={previewSrc} alt="프로필 이미지 미리보기" fill style={{ objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
}
