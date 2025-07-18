'use client';

import { useState } from 'react';

export default function AddAddressPage() {
  const [form, setForm] = useState({
    deliveryName: '',
    recipient: '',
    postcode: '',
    address: '',
    detailAddress: '',
    phone: '',
    mobile: '',
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('새 배송지 등록 데이터:', form);
    // TODO: API 호출해서 저장 처리
  };

  return (
    <div className="w-full p-2 sm:p-4 mt-4 text-dark-gray">
      <div className="mb-2 sm:mb-4 lg:mb-4">
        <h2 className="font-bold text-base sm:text-lg lg:text-xl">배송 주소록 관리</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">배송지명 *</label>
          <input type="text" name="deliveryName" value={form.deliveryName} onChange={handleChange} className="border w-full p-2 rounded" placeholder="예) 집, 회사" required />
        </div>
        <div>
          <label className="block mb-1">성명 *</label>
          <input type="text" name="recipient" value={form.recipient} onChange={handleChange} className="border w-full p-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1">주소 *</label>
          <input type="text" name="postcode" value={form.postcode} onChange={handleChange} className="border w-full p-2 rounded mb-2" placeholder="우편번호" required />
          <input type="text" name="address" value={form.address} onChange={handleChange} className="border w-full p-2 rounded mb-2" placeholder="기본 주소" required />
          <input type="text" name="detailAddress" value={form.detailAddress} onChange={handleChange} className="border w-full p-2 rounded" placeholder="상세 주소" />
        </div>
        <div>
          <label className="block mb-1">휴대전화 *</label>
          <input type="text" name="mobile" value={form.mobile} onChange={handleChange} className="border w-full p-2 rounded" placeholder="010-0000-0000" required />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="mr-2" />
          <label>기본 배송지로 저장</label>
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            등록
          </button>
          <button type="button" className="border px-4 py-2 rounded" onClick={() => history.back()}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
