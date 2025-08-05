export default function UnauthorizedPage() {
  return (
    <div className="text-center p-12">
      <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
      <p className="text-gray-500">관리자만 접근 가능한 페이지입니다.</p>
    </div>
  );
}
