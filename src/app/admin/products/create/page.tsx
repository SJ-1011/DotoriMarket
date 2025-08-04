import ProductCreateForm from './ProductCreateForm';

export default function AdminProductPage() {
  return (
    <div className="max-w-2xl w-full px-4 py-12 mx-auto">
      <h1 className="text-xl font-bold mb-6">상품 추가</h1>
      <ProductCreateForm />
    </div>
  );
}
