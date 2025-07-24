'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function PasswordField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호를 입력하세요"
        className={`flex-grow p-4 border rounded-xl bg-white ${errors.password ? 'border-red-500' : 'border-primary '}`}
        {...register('password', {
          required: '비밀번호를 입력해주세요.',
          minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
        })}
      />
      {errors.password && <p className="ml-2 mt-1 text-sm text-red-500">{errors.password.message}</p>}
    </div>
  );
}
