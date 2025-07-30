'use client';

import { EditFormValues, User } from '@/types';
import { useFormContext } from 'react-hook-form';

export default function PhoneField({ userInfo }: { userInfo: User }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditFormValues>();

  const onlyNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  // 세 부분 중 하나라도 에러가 있으면 true
  const hasError = errors.phone1 || errors.phone2 || errors.phone3;
  const phoneData = userInfo.phone;
  let firstPhone, secondPhone, lastPhone;
  if (phoneData.length === 7) {
    firstPhone = phoneData.slice(0, 3);
    secondPhone = phoneData.slice(3, 6);
    lastPhone = phoneData.slice(6);
  } else {
    firstPhone = phoneData.slice(0, 3);
    secondPhone = phoneData.slice(3, 7);
    lastPhone = phoneData.slice(7);
  }

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 휴대전화 */}
      <label htmlFor="phone">휴대전화</label>
      <div>
        <div className="flex gap-4">
          <select defaultValue={firstPhone || '010'} {...register('phone1', { required: true })} className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}>
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
            <option value="019">019</option>
          </select>

          <input
            type="tel"
            defaultValue={secondPhone}
            maxLength={4}
            inputMode="numeric"
            onInput={onlyNumber}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}
            {...register('phone2', {
              required: true,
              minLength: 4,
            })}
          />
          <input
            type="tel"
            defaultValue={lastPhone}
            maxLength={4}
            inputMode="numeric"
            onInput={onlyNumber}
            className={`p-4 border border-primary flex-1 rounded-xl bg-white w-1/3 ${hasError ? 'border-red-500' : ''}`}
            {...register('phone3', {
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
