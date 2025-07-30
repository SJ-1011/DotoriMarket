'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function PasswordConfirmField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="passwordConfirm">비밀번호 확인</label>
      <input
        id="passwordConfirm"
        type="password"
        placeholder="비밀번호를 다시 입력하세요"
        className={`flex-grow p-4 border rounded-xl bg-white ${errors.passwordConfirm ? 'border-red-500' : 'border-primary '}`}
        {...register('passwordConfirm', {
          required: '비밀번호 확인을 입력해주세요.',
          validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다.',
        })}
      />
      {errors.passwordConfirm && <p className="ml-2 mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>}
    </div>
  );
}
