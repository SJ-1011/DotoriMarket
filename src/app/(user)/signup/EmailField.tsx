'use client';

import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

interface EmailFieldProps {
  onCheck: () => void;
  message: string | null;
}

export default function EmailField({ onCheck, message }: EmailFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="email">이메일</label>
      <div className="flex items-center gap-2">
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          className={`flex-grow p-4 border rounded-xl bg-white ${errors.email ? 'border-red-500' : 'border-primary '}`}
          {...register('email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '올바른 이메일 주소를 입력해주세요.',
            },
          })}
        />
        <button type="button" onClick={onCheck} className="bg-primary text-sm text-white px-4 py-3 rounded-xl cursor-pointer">
          중복 확인
        </button>
      </div>
      {/* 에러 메시지 우선, 없으면 중복확인 결과 메시지 출력 */}
      {errors.email ? <p className="ml-2 mt-1 text-sm text-red-500">{errors.email.message}</p> : message && <p className="ml-2 mt-1 text-sm text-green-500">{message}</p>}
    </div>
  );
}
