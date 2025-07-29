'use client';

import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { UserAddress } from '@/types/User';

interface Props {
  name: string;
  recipient: string;
  phone: string;
  address: string;
  details: string;
  addresses: UserAddress[];
  onAddAddress: () => void;
}

export default function OrderUserInfo({ name, recipient, phone, address, details, addresses, onAddAddress }: Props) {
  const { setValue, register, watch } = useFormContext();
  const [showAddressList, setShowAddressList] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    name: string;
    recipient: string;
    phone: string;
    value: string;
    details: string;
  } | null>(null);

  const memo = watch('memo');
  const predefinedOptions = ['문 앞에 놓아주세요', '부재 시 연락 부탁드려요', '배송 전 미리 연락부탁드려요'];
  const isPredefined = predefinedOptions.includes(memo);
  const isInitial = useRef(true);

  const handleMemoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    isInitial.current = false;
    const value = e.target.value;
    if (value === '직접 입력') {
      setValue('memo', '');
    } else {
      setValue('memo', value);
    }
  };

  const memoOption = isInitial.current && memo === '' ? '' : isPredefined ? memo : '직접 입력';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-3 rounded-xl bg-white text-dark-gray">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold">배송정보</h2>
        <div className="flex gap-2">
          {/* 배송지 추가 버튼 (목록일 때만 표시) */}
          {showAddressList && (
            <button type="button" onClick={onAddAddress} className="text-xs sm:text-sm lg:text-base border px-2 py-1 cursor-pointer border-primary rounded hover:bg-light">
              배송지 추가
            </button>
          )}

          {/* 기존 기본 주소 보기/목록 전환 버튼 */}
          <button type="button" onClick={() => setShowAddressList(prev => !prev)} className="text-xs border px-2 py-1 sm:text-sm lg:text-base border-primary rounded cursor-pointer">
            {showAddressList ? '기본 주소 보기' : '배송지 목록'}
          </button>
        </div>
      </div>

      {/* 기본 UI */}
      {!showAddressList && (
        <>
          <div className="space-y-2 text-sm lg:text-base">
            <p className="font-semibold">
              [{selectedAddress?.name ?? name}] {selectedAddress?.recipient ?? recipient}
            </p>
            <p>{selectedAddress?.phone ?? phone}</p>
            <p>
              {selectedAddress?.value ?? address} {selectedAddress?.details || details || ''}
            </p>
          </div>

          {/* 메모 설정 UI */}
          <div className="mt-3 space-y-2 sm:space-y-3 lg:space-y-4">
            <select value={memoOption} onChange={handleMemoChange} className="w-full border border-primary text-xs sm:text-sm lg:text-base rounded px-1 py-1 sm:px-2 sm:py-2 cursor-pointer">
              <option value="" disabled hidden>
                -- 메시지 선택 (선택사항) --
              </option>
              {predefinedOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              <option value="직접 입력">직접 입력</option>
            </select>

            {memoOption === '직접 입력' && (
              <>
                <textarea {...register('memo')} placeholder="배송 시 요청사항을 입력해주세요" className="w-full border text-xs sm:text-sm lg:text-base border-primary rounded px-2 py-2 sm:px-3 h-24" maxLength={50} />
                <p className="text-right text-xs text-gray">{memo?.length || 0}/50</p>
              </>
            )}
          </div>
        </>
      )}

      {/* 배송지 목록 UI */}
      {showAddressList && (
        <div className="pt-2 space-y-2 text-xs sm:text-sm lg:text-base">
          {addresses.map(addr => (
            <div
              key={addr.id}
              className={`p-3 space-y-1 sm:space-y-2 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedId === addr.id ? 'border-primary bg-light' : !selectedId && addr.isDefault ? 'border-primary' : 'border-gray-300'}`}
              onClick={() => {
                setValue('user', { name: addr.recipient, phone: addr.mobile }, { shouldValidate: true });
                setValue('address', { name: addr.name, value: addr.value, details: addr.detailAddress ?? '' }, { shouldValidate: true });
                setSelectedId(addr.id);
                setSelectedAddress({
                  name: addr.name,
                  recipient: addr.recipient,
                  phone: addr.mobile,
                  value: addr.value,
                  details: addr.detailAddress ?? '',
                });
                setShowAddressList(false);
              }}
            >
              <p className="font-semibold">
                [{addr.name}] {addr.recipient}
              </p>
              <p>{addr.mobile}</p>
              <p>
                {addr.value} {addr.detailAddress ?? ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
