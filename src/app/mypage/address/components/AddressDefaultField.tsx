'use client';

import { useFormContext } from 'react-hook-form';
import { AddressFormState } from '../edit/[id]/EditAddress';

export default function AddressDefaultField() {
  const { register } = useFormContext<AddressFormState>();

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      <div className="flex flex-row flex-nowrap items-center gap-4">
        <input type="checkbox" id="isDefault" {...register('isDefault')} />
        <label htmlFor="isDefault">기본 배송지로 저장</label>
      </div>
    </div>
  );
}
