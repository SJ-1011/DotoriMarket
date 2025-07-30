import { Product } from '@/types/Product';
import ProductCard from './ProductCard';
import ProductCardLarge from './ProductCardLarge';

interface LikedProduct extends Product {
  bookmarkId: number;
}

interface ProductItemCardProps {
  products: Product[] | null;
  likedProducts?: LikedProduct[] | null;
  type?: 'large' | null;
}

export default function ProductItemCard({ products, likedProducts, type }: ProductItemCardProps) {
  if (type === 'large') {
    return (
      <>
        {products &&
          products.map((product, index) => {
            const liked = likedProducts?.find(likedProduct => likedProduct._id === product._id);
            const bookmarkId = liked ? liked.bookmarkId : 0;
            return (
              <li key={product._id}>
                <ProductCardLarge product={product} bookmarkId={bookmarkId} index={index + 1} />
              </li>
            );
          })}
      </>
    );
  } else
    return (
      <>
        {products &&
          products.map(product => {
            const liked = likedProducts?.find(likedProduct => likedProduct._id === product._id);
            const bookmarkId = liked ? liked.bookmarkId : 0;
            return <ProductCard key={product._id} product={product} bookmarkId={bookmarkId} />;
          })}
      </>
    );
}
