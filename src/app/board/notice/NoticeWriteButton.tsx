'use client';
import { useLoginStore } from '@/stores/loginStore';
import { useRouter } from 'next/navigation';

export default function NoticeWriteButton() {
  const isLogin = useLoginStore(state => state.isLogin);
  const router = useRouter();
  const writePageUrl = '/board/notice/new';

  const handleClick = () => {
    if (isLogin) {
      router.push(writePageUrl);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(writePageUrl)}`);
    }
  };

  return (
    <button type="button" className="w-full sm:px-4 sm:py-2 sm:w-24 lg:w-28 sm:rounded-md cursor-pointer sm:bg-[#A97452] sm:text-white text-sm lg:text-base sm:hover:bg-[#966343] sm:transition-colors" onClick={handleClick}>
      글쓰기
    </button>
  );
}
