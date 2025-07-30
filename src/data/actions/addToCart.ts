import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function addToCart(productId: number, quantity: number, token: string) {
  try {
    const res = await axios.post(
      `${API_URL}/carts`,
      { product_id: productId, quantity },
      {
        headers: {
          'Client-Id': CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error('장바구니 추가 실패:', err);
    throw err;
  }
}
