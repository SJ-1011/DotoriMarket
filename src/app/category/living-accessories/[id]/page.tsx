import { LIVING_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../../CategoryPage';

export default function LivingAccessoriesPage({ params }: { params: { id: string } }) {
  const detailArray = LIVING_CATEGORIES.map((name, index) => ({
    name,
    address: `/living-accessories/${(index + 1).toString().padStart(2, '0')}`,
  }));

  // 페이지 넘버
  const pageNumber = Number(params.id) - 1;
  // 페이지 제목 ex. 스튜디오 지브리, 핑구 등...
  const title = LIVING_CATEGORIES[pageNumber];
  return (
    <>
      <CategoryPage category="living-accessories" title={title} detail={params.id} categoryName="리빙&소품" detailArray={detailArray} />
    </>
  );
}
