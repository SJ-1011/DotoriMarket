import type { AdminOrderUser, AdminOrderAddress } from '@/types/AdminOrder';

export default function BuyerInfo({ user, address }: { user: AdminOrderUser; address: AdminOrderAddress }) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm sm:text-base lg:text-lg text-dark-gray font-bold mb-2">구매자 정보</h2>
      <p className="text-xs sm:text-sm lg:text-base ">이름: {user.name}</p>
      <p className="text-xs sm:text-sm lg:text-base ">연락처: {user.phone}</p>
      <p className="text-xs sm:text-sm lg:text-base ">이메일: {user.email}</p>
      <p className="text-xs sm:text-sm lg:text-base ">
        배송지: {address.value} {address.details}
      </p>
    </div>
  );
}
