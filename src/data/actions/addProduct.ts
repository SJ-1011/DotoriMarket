import type { ApiRes, ApiResPromise, FileUpload } from '@/types';
import { uploadFile } from '@/data/actions/file';
import type { ProductImage, ProductExtra } from '@/types/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface AddProductParams {
  name: string;
  price: number;
  quantity: number;
  content: string;
  shippingFees: number;
  extra?: ProductExtra;
  mainImage: File;
}

interface ProductItem {
  _id: number;
}

export async function addProduct(params: AddProductParams, accessToken: string): ApiResPromise<ProductItem> {
  try {
    if (!params.name || params.name.trim().length < 2) {
      throw new Error('상품명을 2자 이상 입력해주세요.');
    }

    const formData = new FormData();
    formData.append('attach', params.mainImage);

    const uploadResult = await uploadFile(formData);
    if (uploadResult.ok !== 1) {
      throw new Error('대표 이미지 업로드 실패');
    }

    const uploadedImage: FileUpload = uploadResult.item[0];
    const productImage: ProductImage = {
      name: uploadedImage.name,
      path: uploadedImage.path,
    };

    const body = {
      name: params.name,
      price: params.price,
      quantity: params.quantity,
      content: params.content,
      shippingFees: params.shippingFees,
      mainImages: productImage,
      extra: params.extra || {},
    };

    const res = await fetch(`${API_URL}/seller/products`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`상품 등록 실패: ${res.status} - ${errorText}`);
    }

    const json = (await res.json()) as ApiRes<ProductItem>;
    return json;
  } catch (error) {
    console.error('[addProduct] 에러:', error);
    throw error;
  }
}
