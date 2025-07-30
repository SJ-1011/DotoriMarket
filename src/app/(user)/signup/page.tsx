import { Metadata } from 'next';
import SignupForm from './SignupForm';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `회원가입 - 도토리섬`,
    description: `회원 가입 후 도토리섬의 모든 서비스를 이용하세요.`,
    openGraph: {
      title: `회원가입 - 도토리섬`,
      description: `회원 가입 후 도토리섬의 모든 서비스를 이용하세요.`,
      url: '/signup',
      images: [
        {
          url: '/logo.png',
        },
      ],
    },
  };
}

export default function SignupPage() {
  return (
    <>
      <main className="bg-background py-10">
        <section className="relative sm:bg-white sm:rounded-2xl lg:rounded-3xl text-xs sm:text-sm lg:text-base w-full sm:w-[30rem] lg:w-[40rem] h-full mx-auto px-10 sm:p-10 sm:pb-80 lg:pb-96">
          <Image src="/login-logo.webp" alt="도토리섬 로그인" width={100} height={100} />
          <h2 className="text-xl lg:text-2xl font-bold my-4">회원가입</h2>
          <SignupForm />
        </section>
      </main>
    </>
  );
}
