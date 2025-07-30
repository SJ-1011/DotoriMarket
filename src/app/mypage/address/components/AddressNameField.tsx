'use client';

import { useFormContext } from 'react-hook-form';
import { AddressFormState } from '../edit/[id]/EditAddress';

export default function AddressNameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddressFormState>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="addressName">
        배송지명 <span className="text-red">*</span>
      </label>
      <input
        type="text"
        id="addressName"
        placeholder="예) 집, 회사"
        {...register('deliveryName', {
          required: '배송지명을 입력해 주세요.',
        })}
        className={`p-4 border flex-1 rounded-xl bg-white w-full ${errors.deliveryName ? 'border-red-500' : 'border-primary'}`}
      />
      {errors.deliveryName && <p className="ml-2 mt-1 text-sm text-red-500">{errors.deliveryName.message}</p>}
    </div>
  );
}
