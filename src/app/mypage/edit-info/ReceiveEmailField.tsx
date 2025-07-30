'use client';

import { useFormContext } from 'react-hook-form';
import { EditFormValues, User } from '@/types';
import { useEffect } from 'react';

export default function ReceiveEmailField({ userInfo }: { userInfo: User }) {
  const { register, setValue } = useFormContext<EditFormValues>();

  // 서버에서 받은 값으로 초기값 설정
  const receiveEmail = userInfo.extra?.receiveEmail ?? true;

  // 컴포넌트 마운트 시 초기값 설정
  // (필수는 아님 — FormProvider의 defaultValues로 설정했다면 생략 가능)
  useEffect(() => {
    setValue('receiveEmail', receiveEmail);
  }, [receiveEmail, setValue]);

  return (
    <div className="flex flex-col flex-nowrap gap-2">
      {/* 이메일 수신 여부 */}
      <span>이메일 수신 여부</span>
      <div className="flex flex-row flex-nowrap items-center gap-4 p-4">
        <input type="radio" id="receive" value="true" {...register('receiveEmail')} />
        <label htmlFor="receive">수신함</label>
        <input type="radio" id="noreceive" value="false" {...register('receiveEmail')} />
        <label htmlFor="noreceive">수신하지 않음</label>
      </div>
    </div>
  );
}
