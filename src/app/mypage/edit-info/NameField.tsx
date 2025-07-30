'use client';

import { EditFormValues, User } from '@/types';
import { useFormContext } from 'react-hook-form';

export default function NameField({ userInfo }: { userInfo: User }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditFormValues>();
  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 이름 */}
      <label htmlFor="name">이름</label>
      <input type="text" id="name" defaultValue={`${userInfo?.name}`} className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.name ? 'border-red-500' : ''}`} {...register('name', { required: '이름을 입력해주세요.' })} />
      {errors.name && <p className="ml-2 mt-1 text-sm text-red-500">{errors.name.message}</p>}
    </div>
  );
}
