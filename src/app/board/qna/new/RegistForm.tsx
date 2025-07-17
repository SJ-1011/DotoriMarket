'use client';

import { createPost } from '@/actions/post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useActionState, useEffect } from 'react';

export default function RegistForm({ boardType }: { boardType: string }) {
  const [state, formAction, isLoading] = useActionState(createPost, null);
  console.log(isLoading, state);
  console.log(`board/${boardType}`);
  //  const router = useRouter();
  // useEffect(() => {
  //   if(!user){
  //     // 렌더링 중에 페이지를 이동하면 에러가 발생하므로 렌더링 완료 후 이동한다.
  //     router.replace(`/login?redirect=${boardType}/new`);
  //   }
  // }, [user]);

  return (
    <form action={formAction}>
      {/* 로그인 된 사용자일 경우 서버 액션에 accessToken 전달 */}
      {/* <input type="hidden" name="accessToken" value={ user?.token?.accessToken ?? ''} /> */}
      <input type="hidden" name="type" value={boardType} />
      <div className="my-4">
        <label className="block mb-2 font-bold text-xs sm:text-sm lg:text-base-xl content-center " htmlFor="title">
          제목
        </label>
        <input id="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md text-xs sm:text-sm lg:text-base-xl dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1  focus:ring-2 focus:ring-[#A97452]" name="title" />
        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.title?.msg}</p>
      </div>
      <div className="my-4">
        <label className="block text-lg content-center" htmlFor="content">
          내용
        </label>
        <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-[#A97452] focus:border-1 focus:ring-2 focus:ring-[#A97452]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" name="content"></textarea>
        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.content?.msg}</p>
      </div>

      <div className="flex justify-end my-6 gap-2">
        <button type="submit" className="px-4 py-2 w-20 sm:w-24 lg:w-28 rounded-xl bg-[#A97452] text-white text-xs sm:text-sm lg:text-base hover:bg-[#966343] transition-colors" disabled={isLoading}>
          등록
        </button>
        <Link href={`/board/${boardType}`}>
          <button className="px-4 py-2 rounded-xl w-20 sm:w-24 lg:w-28 bg-white text-[#A97452] text-xs sm:text-sm lg:text-base hover:bg-[#F5EEE6] transition-colors border-2 border-[#A97452]" disabled={isLoading}>
            취소
          </button>
        </Link>
      </div>
    </form>
  );
}
