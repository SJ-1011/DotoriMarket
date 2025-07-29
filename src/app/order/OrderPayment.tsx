'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Payment {
  id: string;
  label: string;
  icon: string;
}
interface PaymentProps {
  onPaymentChange: (method: string, bank?: string) => void;
}

const METHODS: Payment[] = [
  { id: 'toss', label: '토스 페이', icon: '/order-tosspay.png' },
  { id: 'kakao', label: '카카오 페이', icon: '/order-kakaopay.png' },
  { id: 'naver', label: '네이버 페이', icon: '/order-naverpay.png' },
  { id: 'card', label: '신용카드', icon: '' },
];

const BANKS = ['KB국민카드', '신한카드', '삼성카드', '현대카드', 'BC카드', '롯데카드', '하나카드', '우리카드', 'NH카드', '씨티카드'];

export default function PaymentMethods({ onPaymentChange }: PaymentProps) {
  const [selected, setSelected] = useState('toss');
  const [selectedBank, setSelectedBank] = useState('');

  const handleMethodChange = (method: string) => {
    setSelected(method);
    onPaymentChange(method, method === 'card' ? selectedBank : undefined);
  };

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank);
    onPaymentChange(selected, bank);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-3 rounded-xl bg-white text-dark-gray">
      <h2 className="text-base sm:text-lg font-semibold">결제 수단</h2>

      <ul className="space-y-2">
        {METHODS.map(method => (
          <li key={method.id} className="flex flex-col">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 my-1">
              {/*  라디오 버튼 */}
              <input type="radio" name="payment" value={method.id} checked={selected === method.id} onChange={() => handleMethodChange(method.id)} className="w-4 h-4 accent-black" />

              <span className="flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer" onClick={() => handleMethodChange(method.id)}>
                {method.icon && <Image src={method.icon} alt={method.label} width={28} height={28} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />}
                <span className="text-sm sm:text-base">{method.label}</span>
              </span>
            </div>

            {/* 신용카드 선택 */}
            {selected === 'card' && method.id === 'card' && (
              <select value={selectedBank} onChange={e => handleBankChange(e.target.value)} className="mt-1 w-64 border p-2">
                <option value="">카드사를 선택해주세요.</option>
                {BANKS.map(bank => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
