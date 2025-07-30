'use client';

import { EditFormValues } from '@/types';
import { useFormContext } from 'react-hook-form';

export default function PasswordConfirmField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<EditFormValues>();
  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 비밀번호 확인 */}
      <label htmlFor="passwordCheck">
        비밀번호 확인 <span className="text-red">*</span>
      </label>
      <div>
        <input
          type="password"
          id="passwordCheck"
          placeholder={`${'비밀번호를 다시 입력하세요.'}`}
          className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.passwordConfirm ? 'border-red-500' : ''}`}
          {...register('passwordConfirm', {
            required: '비밀번호 확인을 입력해주세요.',
            validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다.',
          })}
        />
        {errors.passwordConfirm && <p className="ml-2 mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>}
      </div>
    </div>
  );
}
