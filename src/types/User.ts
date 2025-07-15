export interface UserExtra {
  birthday?: string;
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
  image: string;
  createdAt: string;
  updatedAt: string;
  extra?: UserExtra;
}
