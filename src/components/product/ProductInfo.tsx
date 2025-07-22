export default function ProductInfo({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <h2 className="text-xl font-semibold mb-2">상품 설명</h2>
      <p>{content}</p>
    </div>
  );
}
