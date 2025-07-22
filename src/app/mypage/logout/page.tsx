'use client';
import { useLoginStore } from '@/stores/loginStore';

//로그아웃 페이지(굳이 페이지로 안해도 될 것 같지만 일단 만들겠습니다)
export default function Logout() {
  const { logout, user, isLogin } = useLoginStore();
  return (
    <div>
      <h2>로그아웃 페이지 입니다.</h2>

      {/* 현재 상태 출력 */}
      <div
        style={{
          margin: '20px 0',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3>현재 로그인 상태:</h3>
        <p>
          <strong>isLogin:</strong> {isLogin ? 'true' : 'false'}
        </p>
        <p>
          <strong>user:</strong>
        </p>
        <pre
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <button
        className="w-full max-w-xl flex justify-between items-center px-6 py-3 border-2 rounded-2xl border-[#A97452] text-[#A97452] bg-white text-xs sm:text-sm lg:text-base font-semibold hover:bg-[#F5EEE6] transition-colors"
        onClick={() => {
          logout();
          console.log('로그아웃 실행됨 - 상태 확인:', { user, isLogin });
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
