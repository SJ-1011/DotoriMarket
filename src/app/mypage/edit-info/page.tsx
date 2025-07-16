'use client';

//회원 정보 수정 페이지
export default function EditInfo() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <section className="p-4">
        <h2 className="font-bold text-2xl py-4">회원 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[9.375rem_auto]">
            {/* 이메일 */}
            <label htmlFor="email" className="flex items-center border-t border-gray">
              이메일
            </label>
            <div className="flex flex-row flex-nowrap py-4 items-center gap-12 border-t border-gray">
              <input type="email" name="email" id="email" placeholder={`${'abc1234@gmail.com(원래 이메일 정보)'}`} className="border p-4 w-96" />
              <button type="button" className="rounded-lg bg-black text-white p-2 cursor-pointer">
                인증하기
              </button>
            </div>

            {/* 비밀번호 */}
            <label htmlFor="password" className="flex items-center border-t border-gray">
              비밀번호
            </label>
            <div className="flex flex-row flex-nowrap py-4 items-center gap-12 border-t border-gray">
              <input type="password" name="password" id="password" placeholder={`${'새로운 비밀번호를 입력하세요.'}`} className="border p-4 w-96" />
              <span className="text-sm">영문 소문자/숫자/특수문자 포함 8~15자</span>
            </div>

            {/* 비밀번호 확인 */}
            <label htmlFor="passwordCheck" className="flex items-center border-t border-gray">
              비밀번호 확인
            </label>
            <div className="flex flex-row flex-nowrap py-4 items-center gap-12 border-t border-gray">
              <input type="password" name="passwordCheck" id="passwordCheck" placeholder={`${'새로운 비밀번호를 입력하세요.'}`} className="border p-4 w-96" />
              <span className="text-sm">영문 소문자/숫자/특수문자 포함 8~15자</span>
            </div>

            {/* 이름 */}
            <label htmlFor="name" className="flex items-center border-t border-gray">
              이름
            </label>
            <div className="flex flex-row flex-nowrap py-4 items-center gap-12 border-t border-gray">
              <input type="text" name="name" id="name" placeholder={`${'이선진(원래 이름)'}`} className="border p-4 w-96" />
            </div>

            {/* 주소 */}
            <label htmlFor="address1" className="flex items-center border-t border-gray">
              주소
            </label>
            <div className="flex flex-col flex-nowrap gap-2 py-4 border-t border-gray">
              <div className="flex flex-row flex-nowrap items-center gap-4">
                <input type="text" name="address1" id="address1" placeholder={`${'10101'}`} className="border p-4 w-60" />
                <button type="button" className="border bg-light-yellow p-4 w-32">
                  주소 검색
                </button>
              </div>
              <div className="flex flex-row flex-nowrap items-center">
                <input type="text" name="address2" id="address2" placeholder={`${'서울특별시 무슨구 무슨로 123'}`} className="border p-4 w-96" />
              </div>
              <div className="flex flex-row flex-nowrap items-center">
                <input type="text" name="address3" id="address3" placeholder={`${'무슨아파트 101동 101호'}`} className="border p-4 w-96" />
              </div>
            </div>

            {/* 일반 전화 */}
            <label htmlFor="call1" className="flex items-center border-t border-gray">
              일반 전화
            </label>
            <div className="flex flex-row flex-nowrap items-center gap-4 border-t border-gray">
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="call1" name="call1" placeholder="02" className="border p-4 w-24" />
              </div>
              <span>-</span>
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="call2" name="call2" placeholder="1234" className="border p-4 w-32" />
              </div>

              <span>-</span>
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="call3" name="call3" placeholder="5678" className="border p-4 w-32" />
              </div>
            </div>

            {/* 휴대 전화 */}
            <label htmlFor="phone1" className="flex items-center border-t border-gray">
              휴대 전화
            </label>
            <div className="flex flex-row flex-nowrap items-center gap-4 border-t border-gray">
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="phone1" name="phone1" placeholder="010" className="border p-4 w-24" />
              </div>
              <span>-</span>
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="phone2" name="phone2" placeholder="1234" className="border p-4 w-32" />
              </div>

              <span>-</span>
              <div className="flex flex-row flex-nowrap py-4 items-center">
                <input type="number" id="phone3" name="phone3" placeholder="5678" className="border p-4 w-32" />
              </div>
            </div>

            {/* 이메일 수신 여부 */}
            <span className="flex items-center border-y border-gray">이메일 수신 여부</span>
            <div className="flex flex-row flex-nowrap items-center gap-4 border-y border-gray py-4">
              {/* TODO 기존 정보를 가져와서 checked */}
              <input type="radio" id="receive" name="receive" />
              <label htmlFor="receive">수신함</label>
              <input type="radio" id="noreceive" name="receive" />
              <label htmlFor="noreceive">수신하지 않음</label>
            </div>
          </div>

          <button type="button" className="text-sm p-2 bg-white border border-gray text-gray m-4 cursor-pointer">
            회원 탈퇴
          </button>

          <div className="flex flex-row flex-nowrap justify-center items-center gap-8 p-4">
            <button type="submit" className="p-4  bg-gray text-white cursor-pointer">
              회원 정보 수정
            </button>
            <button type="button" className="p-4 bg-white border border-gray text-gray cursor-pointer">
              취소
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
