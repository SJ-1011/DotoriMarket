'use client';

import { EditFormValues, User } from '@/types';
import { useFormContext } from 'react-hook-form';

interface EmailFieldProps {
  userInfo: User;
  onCheck: () => void;
  message: string | null;
}

export default function EmailField({ userInfo, onCheck, message }: EmailFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditFormValues>();

  return (
    <div>
      <label htmlFor="email">이메일</label>
      <div className="flex flex-col flex-nowrap">
        <div className="flex flex-col sm:flex-row flex-nowrap py-2 sm:items-center gap-4 sm:gap-8 lg:gap-4">
          <input
            type="email"
            id="email"
            defaultValue={`${userInfo?.email}`}
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 주소를 입력해주세요.',
              },
            })}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white ${errors.email ? 'border-red-500' : ''}`}
          />
          <button type="button" onClick={onCheck} className="p-4 border text-white rounded-xl bg-primary cursor-pointer">
            중복확인
          </button>
        </div>
        {/* 에러 메시지 우선, 없으면 중복확인 결과 메시지 출력 */}
        {errors.email ? <p className="ml-2 mt-1 text-sm text-red-500">{errors.email.message}</p> : message && <p className="ml-2 mt-1 text-sm text-green-500">{message}</p>}
      </div>
    </div>
  );
}
