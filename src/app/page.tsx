import Carousel from '@/components/main/Carousel';
import CategorySlider from '@/components/main/CategorySlider';
import SectionTitle from '@/components/main/SectionTitle';
import ReviewSlider from '@/components/main/ReviewSlider';
import StoryCardList from '@/components/main/StoryCardList';
import NewProductsSection from '@/components/main/NewProductsSection';
import DotBackgroundWrapper from '@/components/common/DotBackgroundWrapper';
import PopularSection from '@/components/main/PopularSection';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';

export default async function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* 캐러셀 섹션 */}
      <Carousel />

      <DotBackgroundWrapper>
        <section className="w-full flex flex-col flex-nowrap justify-center items-center">
          {/* 인기 캐릭터 상품 섹션 */}
          <div className="mb-20 mt-10 w-full sm:w-[600px] lg:w-[800px]">
            <SectionTitle title="도토리섬 인기 캐릭터 상품" />
            <CategorySlider />
          </div>

          {/* 신상품 섹션 */}
          <div className="mb-20 w-full">
            <SectionTitle title="도토리섬 신상품 둘러보기" />
            <NewProductsSection />
          </div>

          {/* 인기상품 섹션 */}
          <div className="mb-20 w-full">
            <SectionTitle title="도토리섬 인기상품 TOP10" />
            <PopularSection />
          </div>

          {/* 베스트 포토리뷰 섹션 */}
          <div className="mb-30 w-full sm:w-[700px] lg:w-[1000px]">
            <SectionTitle title="도토리섬 베스트 포토리뷰" />
            <ReviewSlider />
          </div>

          {/* 이야기 섹션 */}
          <div className="mb-40 w-[400px] sm:w-[600px] lg:w-[900px]">
            <SectionTitle title="도토리섬 이야기" />
            <StoryCardList />
          </div>

          <ScrollToTopButton />
        </section>
      </DotBackgroundWrapper>
    </main>
  );
}
