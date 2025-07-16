'use server';

import { uploadFile } from '@/data/actions/file';
import { ApiRes, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function createUser(_: ApiRes<User> | null, formData: FormData): Promise<ApiRes<User>> {
  // 1. 파일 업로드
  let image;
  const attach = formData.get('attach') as File;
  if (attach && attach.size > 0) {
    const fileRes = await uploadFile(formData);
    if (fileRes.ok) {
      image = fileRes.item[0].path;
    } else {
      return fileRes;
    }
  }

  // 2. 요청 바디 생성
  const body = {
    type: formData.get('type') || 'user',
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    birthday: formData.get('birthday'),
    phone: `${formData.get('phone1')}-${formData.get('phone2')}-${formData.get('phone3')}`,
    ...(image ? { image } : {}),
  };

  // 3. API 호출
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
      },
      body: JSON.stringify(body),
    });

    const data: ApiRes<User> = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제가 발생했습니다.' };
  }
}
