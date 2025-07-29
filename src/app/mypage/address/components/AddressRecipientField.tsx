'use client';

import { useFormContext } from 'react-hook-form';
import { AddressFormState } from '../edit/[id]/EditAddress';

export default function AddressRecipientField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddressFormState>();
  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <label htmlFor="addressName">
        수령인 <span className="text-red">*</span>
      </label>
      <input type="text" id="addressName" {...register('recipient', { required: '수령인을 입력해 줏세요.' })} className={`p-4 border border-primary flex-1 rounded-xl bg-white w-full ${errors.recipient ? 'border-red-500' : ''}`} />
      {errors.recipient && <p className="ml-2 mt-1 text-sm text-red-500">{errors.recipient.message}</p>}
    </div>
  );
}
