import { Product } from './Product';

export interface OrderExtra {
  memo?: string;
}

export interface OrderCost {
  products: number;
  shippingFees: number;
  discount: {
    products: number;
    shippingFees: number;
  };
  total: number;
}

export interface Order {
  _id: number | string;
  user_id: number;
  products: Product[];
  state: string;
  createdAt: string;
  updatedAt: string;
  cost: OrderCost;
}

export interface OrderForm {
  products: {
    _id: number | string;
    quantity: number;
  }[];
  address: {
    name: string;
    value: string;
  };
  memo?: string;
}
