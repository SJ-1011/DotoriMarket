'use client';

import { createPost } from '@/actions/post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useActionState, useEffect, useState } from 'react';

//문의 종류 배열
const QNA_TYPES = [
  { type: '상품 문의', value: 'product' },
  { type: '배송 문의', value: 'delivery' },
  { type: '주문/결제', value: 'order' },
  { type: '반품/교환', value: 'return' },
  { type: '환불 문의', value: 'refund' },
  { type: '재입고 문의', value: 'restock' },
  { type: '기타 문의', value: 'etc' },
];

export default function NewQnaForm({ boardType }: { boardType: string }) {
  const [state, formAction, isLoading] = useActionState(createPost, null);
  const [selectedType, setSelectedType] = useState<string>('product');

  // 버튼 1줄, 2줄로 나누기
  const firstRow = QNA_TYPES.slice(0, 3);
  const secondRow = QNA_TYPES.slice(3);
  // 선택에 따라 아래쪽 버튼 텍스트 활성화를 위한 로직. 경우의 수 수정되면 이 부분 바꿔주면 됨
  let selectLabel = '';
  if (selectedType === 'product') selectLabel = '상품 선택';
  else if (selectedType === 'delivery' || selectedType === 'order') selectLabel = '주문 선택';

  //테스트용
  console.log(isLoading, state);
  console.log(`board/${boardType}`);
  //회원쪽 끝나면 작업해봅시다.
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
      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-2 mb-2">
          {firstRow.map(item => (
            <button
              key={item.value}
              type="button"
              className={`px-4 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors
                ${selectedType === item.value ? 'bg-[#A97452] text-white border-[#A97452]' : 'bg-white text-[#A97452] border-[#A97452] hover:bg-[#F5EEE6]'}
              `}
              onClick={() => setSelectedType(item.value)}
            >
              {item.type}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {secondRow.map(item => (
            <button
              key={item.value}
              type="button"
              className={`px-4 py-2 rounded-full font-semibold border-2 text-xs sm:text-sm lg:text-base transition-colors
                ${selectedType === item.value ? 'bg-[#A97452] text-white border-[#A97452]' : 'bg-white text-[#A97452] border-[#A97452] hover:bg-[#F5EEE6]'}
              `}
              onClick={() => setSelectedType(item.value)}
            >
              {item.type}
            </button>
          ))}
        </div>
      </div>
      {/* 실제 서버로 값 전달 */}
      <input type="hidden" name="extra.qnatype" value={selectedType} />

      {/* 선택된 유형에 따라 선택 버튼 노출 */}
      {selectLabel && (
        <div className="mb-6 flex justify-center">
          <button type="button" className="w-full max-w-xl flex justify-between items-center px-6 py-3 border-2 rounded-2xl border-[#A97452] text-[#A97452] bg-white text-xs sm:text-sm lg:text-base font-semibold" disabled>
            {selectLabel}
            <span className="text-xs sm:text-sm lg:text-base font-semibold">&#x25BC;</span>
          </button>
        </div>
      )}
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
        <textarea id="content" rows={15} placeholder="내용을 입력하세요." className="w-full p-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:border-[#A97452] focus:border-1 focus:ring-2 focus:ring-[#A97452]  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" name="content"></textarea>
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
