'use client';

import { useLoginStore } from '@/stores/loginStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ResidentCard from './ResidentCard';
import { useUserStore } from '@/stores/userStore';
import Skeleton from '@/components/common/Skeleton';

export default function MypageInfo() {
  const [name, setName] = useState('회원');
  const [userType, setUserType] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  const user = useLoginStore(state => state.user);
  const setUserId = useUserStore(state => state.setId);
  const fetchUser = useUserStore(state => state.fetchUser);
  const userState = useUserStore(state => state.user);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      setIsLoading(true);
      setUserId(user._id);
      await fetchUser(); // 상태 갱신
      setIsLoading(false);
    };

    init();
  }, [user]);

  useEffect(() => {
    if (userState) {
      setName(userState.name);
      setUserType(userState.type);
    }
  }, [userState]);

  // useEffect(() => {
  //     try {
  //       if (!user) return;
  //       const fetchData = async () => {
  //         if (!user) return;
  //         const res = await getUserById(user?._id);

  //         if (!res.ok) throw res.message;
  //         setName(res.item.name);
  //         setUserType(res.item.type);
  //       };

  //       fetchData();
  //     } catch (error) {
  //       alert(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  // }, [user]);

  return (
    <section className="flex flex-col lg:flex-row flex-nowrap gap-12 sm:gap-6 w-full sm:max-w-[800px] lg:max-w-[1200px] items-center lg:items-stretch mx-auto my-8 py-12 sm:py-8">
      <div className="flex flex-col flex-nowrap w-[90%] sm:w-[600px] lg:w-[350px] bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8">
        {isLoading ? (
          <>
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-48" height="h-6" className="mb-8" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-2xl" className="mb-2" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-2xl" />
          </>
        ) : (
          <>
            <p className="text-primary-dark font-bold pb-2">{userType == 'user' ? '일반 회원' : '관리자'}</p>
            <p className="text-2xl pb-12 font-test">
              <strong>{name}</strong>님
              <br />
              안녕하세요!🐿️
            </p>
            <div className="flex flex-col flex-nowrap gap-2">
              <Link href="/cart" className="w-full text-center bg-primary text-white p-4 rounded-2xl mb-2">
                장바구니
              </Link>
              <Link href="/mypage/logout" className="w-full text-center border border-primary p-4 rounded-2xl">
                로그아웃
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col lg:flex-row flex-nowrap w-[98%] sm:w-[600px] lg:flex-1 bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.1)] p-8">
        {isLoading ? (
          <>
            <Skeleton width="w-24" height="h-4" className="mb-2" />
            <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[500px] lg:h-[275px] mx-auto" />
          </>
        ) : (
          <>
            <p className="text-primary-dark font-bold pb-4 text-xl text-nowrap">나의 주민증</p>
            <div className="w-full flex justify-center">
              <ResidentCard />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
