'use client';

import { EditFormValues, User } from '@/types';
import { useFormContext } from 'react-hook-form';

export default function BirthdayField({ userInfo }: { userInfo: User }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditFormValues>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 생년월일 */}
      <label htmlFor="name">생년월일</label>
      <input type="date" id="birthday" defaultValue={`${userInfo?.birthday}`} className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.birthday ? 'border-red-500' : ''}`} {...register('birthday', { required: '생년월일을 입력해주세요.' })} />
      {errors.birthday && <p className="ml-2 mt-1 text-sm text-red-500">{errors.birthday.message}</p>}
    </div>
  );
}
