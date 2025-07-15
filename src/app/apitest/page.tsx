import { getUsers } from '@/utils/getUsers';
import type { User } from '@/types/User';

import { getProducts } from '@/utils/getProducts';
import type { Product } from '@/types/Product';
import Image from 'next/image';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default async function Page() {
  /////회원 정보 조회
  const resUsers = await getUsers();
  if (resUsers.ok === 0) {
    return <p style={{ color: 'red' }}>⚠️ {resUsers.message}</p>;
  }
  // api.ts에 ServerValidationError 부분 넣었기 떄문에 ok === 1 로직으로 검증 먼저 해야함
  const users: User[] = resUsers.item;

  /////상품 목록 조회
  const resProducts = await getProducts();

  if (resProducts.ok === 0) {
    return <p>상품 목록 로딩 실패: {resProducts.message}</p>;
  }
  const products: Product[] = resProducts.item;
  console.log(products);
  return (
    <>
      {/* 회원 정보 */}
      <div>
        <h1>유저 목록</h1>
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.name} ({user.email}) / 생일: {user.extra?.birthday}
            </li>
          ))}
        </ul>
      </div>
      {/* 상품 목록  */}
      <div>
        <ul>
          {products.map(product => (
            <li key={product._id}>
              {product.name} - {product.price}원<br />
              <Image src={`${API_URL}/${product.mainImages[0].path}`} alt={product.mainImages[0]?.originalname} width={100} height={100} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// {
//   "ok": 1,
//   "item": [
//     {
//       "_id": 4,
//       "seller_id": 3,
//       "price": 45000,
//       "shippingFees": 3500,
//       "show": true,
//       "active": true,
//       "name": "레고 테크닉 42151 부가티 볼리드",
//       "quantity": 100,
//       "buyQuantity": 89,
//       "mainImages": [
//         {
//           "path": "files/openmarket/sample-bugatti.png",
//           "name": "sample-bugatti.png",
//           "originalname": "부가티.png"
//         }
//       ],
//       "createdAt": "2025.07.14 19:08:39",
//       "updatedAt": "2025.07.14 04:08:39",
//       "extra": {
//         "isNew": false,
//         "isBest": true,
//         "category": [
//           "PC03",
//           "PC0303"
//         ],
//         "sort": 1
//       },
//       "seller": {
//         "_id": 3,
//         "email": "s2@market.com",
//         "name": "어피치",
//         "phone": "01033334444",
//         "address": "서울시 강남구 도곡동 789",
//         "image": "user-apeach.webp",
//         "extra": {
//           "confirm": false,
//           "birthday": "11-24",
//           "membershipClass": "MC02",
//           "addressBook": [
//             {
//               "id": 2,
//               "name": "가게",
//               "value": "서울시 강남구 학동 234"
//             }
//           ]
//         }
//       },
//       "replies": 0,
//       "bookmarks": 2,
//       "rating": 4.5,
//       "myBookmarkId": 2,
//       "options": 0
//     }
//   ],
//   "pagination": {
//     "page": 1,
//     "limit": 0,
//     "total": 1,
//     "totalPages": 1
//   }
// }
