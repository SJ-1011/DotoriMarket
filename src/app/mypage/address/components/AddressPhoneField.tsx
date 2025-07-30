'use client';

import { useFormContext } from 'react-hook-form';
import { AddressFormState } from '../edit/[id]/EditAddress';

export default function AddressPhoneField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddressFormState>();

  const onlyNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  // 세 부분 중 하나라도 에러가 있으면 true
  const hasError = errors.mobile1 || errors.mobile2 || errors.mobile3;

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 휴대전화 */}
      <label htmlFor="phone">휴대전화</label>
      <div className="flex flex-col flex-nowrap gap-2">
        <div className="flex flex-row flex-nowrap gap-4">
          <select {...register('mobile1', { required: true })} className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}>
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>

          <input
            type="tel"
            maxLength={4}
            inputMode="numeric"
            onInput={onlyNumber}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}
            {...register('mobile2', {
              required: true,
              minLength: 4,
            })}
          />
          <input
            type="tel"
            maxLength={4}
            inputMode="numeric"
            onInput={onlyNumber}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}
            {...register('mobile3', {
              required: true,
              minLength: 4,
            })}
          />
        </div>
        {hasError && <p className="ml-2 mt-1 text-sm text-red-500">전화번호를 올바르게 입력해주세요.</p>}
      </div>
    </div>
  );
}
