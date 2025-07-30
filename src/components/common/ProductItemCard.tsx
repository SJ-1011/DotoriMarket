import { Product } from '@/types/Product';
import ProductCard from './ProductCard';

interface LikedProduct extends Product {
  bookmarkId: number;
}

interface ProductItemCardProps {
  products: Product[] | null;
  likedProducts?: LikedProduct[] | null;
  isAdmin?: boolean;
  showCheckbox?: boolean;
  selectedIds?: number[];
  onSelect?: (id: number) => void;
}

export default function ProductItemCard({ products, likedProducts, isAdmin = false, showCheckbox = false, selectedIds = [], onSelect }: ProductItemCardProps) {
  return (
    <>
      {products &&
        products.map(product => {
          const liked = likedProducts?.find(likedProduct => likedProduct._id === product._id);
          const bookmarkId = liked ? liked.bookmarkId : 0;
          return <ProductCard key={product._id} product={product} bookmarkId={bookmarkId} isAdmin={isAdmin} showCheckbox={showCheckbox} isSelected={selectedIds.includes(Number(product._id))} onSelect={onSelect} />;
        })}
    </>
  );
}
