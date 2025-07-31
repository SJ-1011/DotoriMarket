export default function OrderCompleteUserInfo({ name, phone, address, memo, details }: { name: string; phone: string; address: string; memo: string; details: string }) {
  const displayAddress = address.replace(/^\d{5}\s*/, '');

  return (
    <div>
      <h2 className="text-sm sm:text-base lg:text-lg font-bold py-2">배송 정보</h2>

      <div className="border-t-2 border-primary bg-white">
        <table className="w-full border text-center border-[#F3E4D8] text-xs sm:text-sm lg:text-base">
          <tbody>
            <tr className="border-b border-[#F3E4D8]">
              <td className="font-semibold border-r border-[#F3E4D8] p-3 sm:p-4 lg:p-5">이름</td>
              <td className="p-3 sm:p-4 lg:p-5">{name}</td>
            </tr>
            <tr className="border-b border-[#F3E4D8]">
              <td className=" font-semibold border-r border-[#F3E4D8] p-3 sm:p-4 lg:p-5 ">전화번호</td>
              <td className="p-3 sm:p-4 lg:p-5">{phone}</td>
            </tr>
            <tr className="border-b border-[#F3E4D8]">
              <td className="font-semibold border-r border-[#F3E4D8] p-3 sm:p-4 lg:p-5">주소</td>
              <td className="p-3 sm:p-4 lg:p-5">
                {displayAddress} {details}
              </td>
            </tr>
            <tr>
              <td className=" font-semibold border-r border-[#F3E4D8] p-3 sm:p-4 lg:p-5">배송 메모</td>
              <td className="p-3 sm:p-4 lg:p-5">{memo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
