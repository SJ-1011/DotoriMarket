import Carousel from '@/components/main/Carousel';
import CategorySlider from '@/components/main/CategorySlider';
import SectionTitle from '@/components/main/SectionTitle';
import ProductGrid from '@/components/common/ProductGrid';
import ReviewSlider from '@/components/main/ReviewSlider';
import StoryCard from '@/components/main/StoryCard';
import ProductCard from '@/components/main/ProductCard';

const newProducts = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  name: `신상품 ${i + 1}`,
  price: (i + 1) * 1000,
}));

const storyProducts = Array.from({ length: 3 }, (_, i) => ({
  id: i + 100,
  title: `이야기 ${i + 1}`,
  summary: `이야기 ${i + 1}의 간단한 요약입니다.`,
}));

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Carousel />

      <section className="w-full px-4 max-w-screen-xl">
        <SectionTitle title="도토리섬 인기 캐릭터 상품" />
        <CategorySlider />

        <SectionTitle title="도토리섬 신상품 둘러보기" />
        <ProductGrid>
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>

        <SectionTitle title="도토리섬 베스트 포토리뷰" />
        <ReviewSlider />

        <SectionTitle title="도토리섬 이야기" />
        <ProductGrid>
          {storyProducts.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ProductGrid>
      </section>
    </main>
  );
}
