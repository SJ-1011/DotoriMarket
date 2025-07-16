export interface UserExtra {
  birthday?: string;
}

export interface UserImage {
  path: string;
  name: string;
  originalname: string;
}

export interface User {
  _id: number | string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  loginType: string;
  image: UserImage | null;
  createdAt: string;
  updatedAt: string;
  extra?: UserExtra;
}
