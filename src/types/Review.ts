import type { FileUpload } from './file';
import type { UserImage } from './User';

export interface ReviewExtra {
  files: FileUpload[];
}

export interface Review {
  _id: number;
  productId: number | string;
  product?: {
    _id: number | string;
    image?: {
      path: string;
      name: string;
      originalname?: string;
    };
    name: string;
  };
  user: {
    _id: number;
    name: string;
    image?: string | UserImage;
  };
  rating: number;
  content: string;
  createdAt: string;
  extra?: ReviewExtra;
  images?: string[];
}
