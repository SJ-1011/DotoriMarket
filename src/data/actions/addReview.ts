import type { ApiResPromise, FileUpload } from '@/types';
import { uploadFile } from '@/data/actions/file';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface AddReviewParams {
  productId: number;
  orderId: number;
  rating: number;
  content: string;
  files?: File[];
}

export async function addReview(params: AddReviewParams, accessToken: string): ApiResPromise<{ reviewId: number }> {
  try {
    if (!params.orderId) {
      throw new Error('구매한 상품에만 리뷰를 남길 수 있습니다.');
    }
    if (params.content.trim().length < 10) {
      throw new Error('리뷰 내용은 최소 10자 이상이어야 합니다.');
    }

    let uploadedFiles: FileUpload[] = [];

    if (params.files && params.files.length > 0) {
      const formData = new FormData();
      params.files.forEach(file => formData.append('attach', file));

      console.log('[addReview] 파일 업로드 시작, 파일 개수:', params.files.length);
      const uploadResult = await uploadFile(formData);
      console.log('[addReview] uploadFile 결과:', uploadResult);

      if (uploadResult.ok === 1) {
        uploadedFiles = uploadResult.item;
        console.log('[addReview] 업로드된 파일 정보:', uploadedFiles);
      } else {
        throw new Error('파일 업로드 실패');
      }
    } else {
      console.log('[addReview] 업로드할 파일이 없습니다.');
    }

    const body = {
      order_id: params.orderId,
      product_id: params.productId,
      rating: params.rating,
      content: params.content.trim(),
      extra: {
        files: uploadedFiles,
      },
    };

    console.log('[addReview] 리뷰 등록 요청 바디:', body);

    const res = await fetch(`${API_URL}/replies`, {
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
      console.error('[addReview] 서버 응답 에러:', errorText);
      throw new Error(`리뷰 등록 실패: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    console.log('[addReview] 리뷰 등록 성공 응답:', json);

    return json;
  } catch (error) {
    console.error('[addReview] 함수에서 에러 발생:', error);
    throw error;
  }
}
