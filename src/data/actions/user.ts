import axios from 'axios';
import { ApiRes, User } from '@/types';
import { uploadFile } from '@/data/actions/file';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

export async function createUser(_: ApiRes<User> | null, formData: FormData): Promise<ApiRes<User>> {
  let image: string | undefined;
  const attach = formData.get('attach') as File | null;
  if (attach && attach.size > 0) {
    const fileRes = await uploadFile(formData);
    if (fileRes.ok) {
      image = fileRes.item[0].path;
    } else {
      return fileRes;
    }
  }

  const body = {
    type: (formData.get('type') as string) || 'user',
    name: formData.get('name') as string | null,
    email: formData.get('email') as string | null,
    password: formData.get('password') as string | null,
    birthday: formData.get('birthday') as string | null,
    phone: (formData.get('phone1') as string) + (formData.get('phone2') as string) + (formData.get('phone3') as string),

    ...(image ? { image } : {}),
  };

  try {
    const res = await axios.post<ApiRes<User>>(`${API_URL}/users`, body, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (error) {
    let message = '일시적인 네트워크 문제가 발생했습니다.';
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? message;
    }
    console.error(error);
    return { ok: 0, message };
  }
}
