'use client';

import { getUserAddress } from '@/utils/getUsers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/loginStore';
import { useFormContext } from 'react-hook-form';

interface Props {
  onFetched: (address: { name: string; value: string; memo: string }) => void;
}

export default function OrderUserInfo({ onFetched }: Props) {
  const router = useRouter();
  const loginUser = useLoginStore(state => state.user);
  const { register, setValue, watch } = useFormContext();

  const [user, setUser] = useState<null | {
    name: string;
    phone: string;
    address: string;
  }>(null);
  const [memoOption, setMemoOption] = useState('');
  const memoValue = watch('memo', '');
  const memoOptions = ['-- 메시지 선택 (선택사항) --', '문 앞에 놓아주세요', '부재 시 연락 부탁드려요', '배송 전 미리 연락부탁드려요', '직접 입력'];

  useEffect(() => {
    async function fetchUser() {
      if (!loginUser?._id || !loginUser.token?.accessToken) return;

      const res = await getUserAddress(loginUser._id, loginUser.token.accessToken);

      if (res.ok && res.item) {
        const defaultAddress = res.item.find(a => a.isDefault);
        const selectedAddress = defaultAddress ?? res.item[0];

        if (selectedAddress) {
          setUser({
            name: selectedAddress.recipient,
            phone: loginUser.phone,
            address: selectedAddress.value,
          });

          onFetched({
            name: selectedAddress.name,
            value: selectedAddress.value,
            memo: memoOption !== '직접 입력' ? memoOption : memoValue,
          });
          return;
        }
      }

      alert('배송지가 등록되어 있지 않습니다. 배송지를 먼저 등록해주세요.');
      router.push('/mypage/address/add');
    }
    fetchUser();
  }, [loginUser]);

  function formatUserInfo(phone: string, address: string) {
    const formattedPhone = phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    const match = address.match(/^(\d{5})\s*(.+)$/);
    const formattedAddress = match ? `[${match[1]}] ${match[2]}` : address;

    return {
      phone: formattedPhone,
      address: formattedAddress,
    };
  }

  const handleMemoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMemoOption(value);

    if (value !== '직접 입력') {
      setValue('memo', value);
    } else {
      setValue('memo', '');
    }
  };

  if (!user) return <p>유저 정보 로드 중...</p>;
  const { phone, address } = formatUserInfo(user.phone, user.address);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-3 rounded-xl sm:rounded-2xl sm:space-y-4 lg:space-y-4 lg:rounded-3xl bg-white">
      <div className="space-y-2 text-xs sm:text-sm lg:text-base">
        <p className="font-semibold text-sm sm:text-base lg:text-lg">{user.name}</p>
        <p>{phone}</p>
        <p>{address}</p>
      </div>

      <div className="space-y-2 sm:space-y-2 lg:space-y-4 text-xs sm:text-sm lg:text-base">
        <select value={memoOption} onChange={handleMemoChange} className="w-full border border-primary focus:outline-none focus:ring-0 focus:border-primary rounded px-1 py-1 sm:px-2 sm:py-2 lg:px-2 lg:py-2">
          <option value="" disabled hidden>
            -- 메시지 선택 (선택사항) --
          </option>
          {memoOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {memoOption === '직접 입력' && <textarea {...register('memo')} value={memoValue} onChange={e => setValue('memo', e.target.value)} placeholder="배송 시 요청사항을 입력해주세요" className="w-full border border-primary rounded px-4 py-2 h-24" maxLength={50} />}
        {memoOption === '직접 입력' && <p className="text-right text-xs sm:text-sm lg:text-base text-gray">{memoValue.length}/50</p>}
      </div>
    </div>
  );
}
