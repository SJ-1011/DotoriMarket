'use client';

import { createPost } from '@/actions/post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useActionState, useEffect } from 'react';

export default function RegistForm({ boardType }: { boardType: string }) {
  const [state, formAction, isLoading] = useActionState(createPost, null);
  console.log(isLoading, state);
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
        <input id="title" type="text" placeholder="제목을 입력하세요." className="w-full py-2 px-2 border rounded-md font-bold text-xs sm:text-sm lg:text-base-xl dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-[#A97452] focus:ring-2 focus:ring-[#A97452]" name="title" />
        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.title?.msg}</p>
      </div>
      <div className="my-4">
        <label className="block text-lg content-center" htmlFor="content">
          내용
        </label>
        <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" name="content"></textarea>
        <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{state?.ok === 0 && state.errors?.content?.msg}</p>
      </div>
      <hr />
      <div className="flex justify-end my-6">
        <button type="submit" disabled={isLoading}>
          등록
        </button>
        {/* <LinkButton href={`/${boardType}`} bgColor="gray">취소</LinkButton> */}
      </div>
    </form>
  );
}
