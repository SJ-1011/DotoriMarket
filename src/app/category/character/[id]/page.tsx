import { CHARACTER_CATEGORIES } from '@/constants/categories';
import CategoryPage from '../../CategoryPage';
import { CategoryProps } from '@/types/category';

export default async function CharacterPage({ params }: CategoryProps) {
  const detailArray = CHARACTER_CATEGORIES.map((name, index) => ({
    name,
    address: `/character/${(index + 1).toString().padStart(2, '0')}`,
  }));

  const { id } = await params;
  // 페이지 넘버
  const pageNumber = Number(id) - 1;
  // 페이지 제목 ex. 스튜디오 지브리, 핑구 등...
  const title = CHARACTER_CATEGORIES[pageNumber];
  return (
    <>
      <CategoryPage category="character" title={title} detail={id} categoryName="캐릭터" detailArray={detailArray} />
    </>
  );
}
