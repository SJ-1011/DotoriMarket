'use client';
import { useFormContext } from 'react-hook-form';
import type { SignupFormValues } from './SignupForm';

export default function PhoneField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const onlyNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="mb-8">
      <label className="block font-semibold mb-2">전화번호</label>
      <div className="flex gap-2">
        <input type="tel" maxLength={3} inputMode="numeric" onInput={onlyNumber} placeholder="010" className={`w-1/4 px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.phone1 ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`} {...register('phone1', { required: '전화번호 앞자리를 입력해주세요.' })} />
        <input type="tel" maxLength={4} inputMode="numeric" onInput={onlyNumber} placeholder="1234" className={`w-1/3 px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.phone2 ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`} {...register('phone2', { required: '전화번호 중간자리를 입력해주세요.' })} />
        <input type="tel" maxLength={4} inputMode="numeric" onInput={onlyNumber} placeholder="5678" className={`w-1/3 px-3 py-2 placeholder:text-sm border rounded focus:outline-none ${errors.phone3 ? 'border-red-500' : 'border-primary-light focus:border-primary-dark'}`} {...register('phone3', { required: '전화번호 뒷자리를 입력해주세요.' })} />
      </div>
      {errors.phone1 && <p className="ml-2 mt-1 text-sm text-red-500">{errors.phone1.message}</p>}
      {errors.phone2 && <p className="ml-2 mt-1 text-sm text-red-500">{errors.phone2.message}</p>}
      {errors.phone3 && <p className="ml-2 mt-1 text-sm text-red-500">{errors.phone3.message}</p>}
    </div>
  );
}
