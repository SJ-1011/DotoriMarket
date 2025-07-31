'use client';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';

//테스트 후 필요하면 hydration
// import useHasHydrated from '@/hooks/useHasHydrated'; // 또는 위 함수 직접 포함
// import { useEffect } from 'react';

export default function CommunityWriteButton() {
  // const hasHydrated = useHasHydrated();
  const isLogin = useLoginStore(state => state.isLogin);
  const router = useRouter();
  const writePageUrl = '/board/community/new';
  const handleClick = () => {
    if (isLogin) {
      router.push(writePageUrl);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(writePageUrl)}`);
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

  //비로그인 상태에서 로그인 후 다시 new페이지로 랜딩하려면 callback으로 url을 전달해줘야할듯?
  return (
    <button type="button" className="w-full sm:px-4 sm:py-2 sm:w-24 lg:w-28 sm:rounded-md cursor-pointer sm:bg-[#A97452] sm:text-white text-sm lg:text-base sm:hover:bg-[#966343] sm:transition-colors" onClick={handleClick}>
      글쓰기
    </button>
  );
}
