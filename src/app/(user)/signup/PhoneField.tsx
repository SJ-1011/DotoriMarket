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

  // 세 부분 중 하나라도 에러가 있으면 true
  const hasError = errors.phone1 || errors.phone2 || errors.phone3;

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label>전화번호</label>
      <div className="flex gap-2">
        <input
          type="tel"
          maxLength={3}
          inputMode="numeric"
          onInput={onlyNumber}
          placeholder="010"
          className={`w-1/4 flex-grow p-4 border rounded-xl bg-white ${hasError ? 'border-red-500' : 'border-primary '}`}
          {...register('phone1', {
            required: true,
            minLength: 3,
          })}
        />
        <input
          type="tel"
          maxLength={4}
          inputMode="numeric"
          onInput={onlyNumber}
          placeholder="1234"
          className={`w-1/3 flex-grow p-4 border rounded-xl bg-white ${hasError ? 'border-red-500' : 'border-primary '}`}
          {...register('phone2', {
            required: true,
            minLength: 4,
          })}
        />
        <input
          type="tel"
          maxLength={4}
          inputMode="numeric"
          onInput={onlyNumber}
          placeholder="5678"
          className={`w-1/3 flex-grow p-4 border rounded-xl bg-white ${hasError ? 'border-red-500' : 'border-primary '}`}
          {...register('phone3', {
            required: true,
            minLength: 4,
          })}
        />
      </div>
      {hasError && <p className="ml-2 mt-1 text-sm text-red-500">전화번호를 올바르게 입력해주세요.</p>}
    </div>
  );
}
