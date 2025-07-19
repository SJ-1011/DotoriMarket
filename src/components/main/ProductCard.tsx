interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="p-4 border rounded shadow">
      <h3>{product.name}</h3>
      <p>{product.price}원</p>
    </div>
  );
}
