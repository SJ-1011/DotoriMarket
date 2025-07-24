'use client';
import { useLoginStore } from '@/stores/loginStore';
import { usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
//테스트 후 필요하면 hydration
// import useHasHydrated from '@/hooks/useHasHydrated'; // 또는 위 함수 직접 포함
// import { useEffect } from 'react';

export default function QnaWriteButton() {
  // const hasHydrated = useHasHydrated();
  const isLogin = useLoginStore(state => state.isLogin);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기

  const handleClick = () => {
    if (isLogin) {
      router.push('/qna/new');
    } else {
      router.push(`/login?redirect=${pathname}`); // 로그인 후 다시 돌아오게
    }
  };
  //필요하면 hydration
  // console.log(isLogin);
  // useEffect(() => {
  //   if (hasHydrated) {
  //     console.log('Hydration 이후 로그인 상태:', isLogin);
  //   }
  // }, [hasHydrated, isLogin]);
  // if (!hasHydrated) {
  //   return null; // hydration 전까지 아무 것도 렌더링하지 않음
  // }
  // <button type="button" className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors">

  //비로그인 상태에서 로그인 후 다시 new페이지로 랜딩하려면 callback으로 url을 전달해줘야할듯?
  return (
    <button onClick={handleClick} className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors">
      글쓰기
    </button>
  );
}
