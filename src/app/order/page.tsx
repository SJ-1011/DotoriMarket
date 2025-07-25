'use client';

import { useForm, FormProvider } from 'react-hook-form';
import type { OrderForm } from '@/types/Order';
import OrderUserInfo from './OrderUserInfo';

export default function Order() {
  const methods = useForm<OrderForm>({
    defaultValues: {
      products: [],
      address: { name: '', value: '' },
      memo: '',
    },
  });

  const handleSubmit = (data: OrderForm) => {
    console.log('✅ 최종 API 전송 데이터:', data);
  };

  return (
    <div className="bg-background py-8">
      <div className="max-w-[1080px] mx-auto p-4 ">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
            <OrderUserInfo
              onFetched={({ name, value, memo }) => {
                methods.setValue('address', { name, value });
                methods.setValue('memo', memo);
              }}
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
              주문하기
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
