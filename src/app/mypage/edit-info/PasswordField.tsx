'use client';

import { EditFormValues } from '@/types';
import { useFormContext } from 'react-hook-form';

export default function PasswordField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 비밀번호 */}
      <label htmlFor="password">
        비밀번호 <span className="text-red">*</span> <span className="text-gray">영문 소문자/숫자/특수문자 포함 8~15자</span>
      </label>
      <div>
        <input
          type="password"
          id="password"
          placeholder={`${'새로운 비밀번호를 입력하세요.'}`}
          className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.password ? 'border-red-500' : ''}`}
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
            maxLength: { value: 15, message: '비밀번호는 최대 15자 이하이어야 합니다.' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\:;"'<>,.?/~`]).{8,15}$/,
              message: '영문 소문자, 숫자, 특수문자를 포함한 8~15자로 입력해주세요.',
            },
          })}
        />
        {errors.password && <p className="ml-2 mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>
    </div>
  );
}
