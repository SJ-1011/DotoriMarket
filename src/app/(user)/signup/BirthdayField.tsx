'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function BirthdayField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="birthday">생년월일</label>
      <input id="birthday" type="date" className={`flex-grow p-4 border rounded-xl bg-white ${errors.birthday ? 'border-red-500' : 'border-primary '}`} {...register('birthday', { required: '생년월일을 입력해주세요.' })} />
      {errors.birthday && <p className="ml-2 mt-1 text-sm text-red-500">{errors.birthday.message}</p>}
    </div>
  );
}
