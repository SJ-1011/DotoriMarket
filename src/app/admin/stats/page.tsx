import StatsClient from './StatsClient';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-green mb-2">📊 판매 실적 조회</h1>
          <p className="text-base sm:text-lg ">기간별 상품 판매 실적을 확인해보세요</p>
        </div>

        <StatsClient />
      </div>
    </div>
  );
}
