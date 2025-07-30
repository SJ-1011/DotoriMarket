'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function NameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="name">이름</label>
      <input id="name" type="text" placeholder="이름을 입력하세요" className={`flex-grow p-4 border rounded-xl bg-white ${errors.name ? 'border-red-500' : 'border-primary '}`} {...register('name', { required: '이름을 입력해주세요.' })} />
      {errors.name && <p className="ml-2 mt-1 text-sm text-red-500">{errors.name.message}</p>}
    </div>
  );
}
