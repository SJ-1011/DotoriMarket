import { STATIONERY_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../../CategoryPage';

export default function StationeryPage({ params }: { params: { id: string } }) {
  const detailArray = STATIONERY_CATEGORIES.map((name, index) => ({
    name,
    address: `/stationery/${(index + 1).toString().padStart(2, '0')}`,
  }));

  // 페이지 넘버
  const pageNumber = Number(params.id) - 1;
  // 페이지 제목 ex. 스튜디오 지브리, 핑구 등...
  const title = STATIONERY_CATEGORIES[pageNumber];
  return (
    <>
      <CategoryPage category="stationery" title={title} detail={params.id} categoryName="문구" detailArray={detailArray} />
    </>
  );
}
