import Image from 'next/image';

export default function Footer() {
  return (
    <div
      className="grid grid-cols-1 gap-6
    md:grid-cols-2 md:grid-rows-4
    lg:grid-cols-3 lg:grid-rows-3 lg:gap-8"
    >
      {/* 로고 이미지 */}
      <div className="md:col-span-2 lg:col-span-3">
        <Image src="/logo.png" alt="도토리섬 로고" width={70} height={70} priority />
      </div>

      {/* C.S Center */}
      <div>
        <h2>C.S Center</h2>
        <div className="">
          <p>월요일~금요일 / 09:00 - 18:00</p>
          <p>주말시간 / 12:00 - 13:00</p>
          <p>주말 공휴일 휴무</p>
        </div>
      </div>

      {/* Company */}
      <div>Company</div>

      {/* Return address */}
      <div>Return address</div>

      {/* SNS */}
      <div>SNS</div>

      {/* 1:1 문의 FAQ */}
      <div className="md:col-span-2 lg:col-span-2">1:1 문의 FAQ</div>
    </div>
  );
}
