'use client';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import KakaotalkIcon from '@/components/icon/KakaotalkIcon';
import NaverIcon from '@/components/icon/NaverIcon';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <Header />
      <main className="bg-background py-10">
        <section className="sm:bg-white sm:rounded-2xl lg:rounded-3xl text-xs sm:text-sm lg:text-base w-full sm:w-[30rem] lg:w-[40rem] h-full mx-auto px-10 sm:p-10 sm:pb-80 lg:pb-96">
          <Image src="/login-logo.png" alt="도토리섬 로그인" width={100} height={100}></Image>
          <h2 className="text-xl lg:text-2xl font-bold my-4">로그인</h2>
          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-nowrap gap-4">
            <div className="flex flex-col flex-nowrap gap-2">
              <label htmlFor="email">이메일</label>
              <input type="email" id="email" name="email" placeholder="이메일을 입력해주세요." className="p-4 border border-black rounded-xl bg-white" />
            </div>
            <div className="flex flex-col flex-nowrap gap-2">
              <label htmlFor="password">비밀번호</label>
              <input type="password" id="password" name="password" placeholder="비밀번호를 입력해주세요." className="p-4 border border-black rounded-xl bg-white" />
            </div>
            <button type="submit" className="p-4 w-full bg-secondary-green text-white rounded-xl mt-4 cursor-pointer">
              로그인
            </button>
          </form>

          <ul className="flex flex-row flex-nowrap justify-center items-center gap-4 p-8">
            <li className="cursor-pointer">아이디 찾기</li>
            <li className="cursor-pointer">비밀번호 찾기</li>
          </ul>

          <button type="button" className="p-4 w-full bg-[#06be34] text-white rounded-xl mt-4 relative flex items-center justify-center text-center cursor-pointer">
            <NaverIcon className="absolute left-4 w-8 h-8" />
            네이버 로그인
          </button>
          <button type="button" className="p-4 w-full bg-[#FFE812]  text-black rounded-xl mt-4 relative flex items-center justify-center text-center cursor-pointer">
            <KakaotalkIcon className="absolute left-4 w-8 h-8" />
            카카오 로그인
          </button>

          <Link href="/" className="p-4 block text-center w-full border-2 border-secondary-green text-secondary-green rounded-xl mt-8 lg:mt-12 cursor-pointer">
            회원 가입
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
