'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ProductInfo({ product }: { product: Product }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const randomWidth = (Math.floor(Math.random() * 11) + 10) * 10; // 100 ~ 200 (10단위)
    const randomHeight = Math.floor(Math.random() * 101) + 50; // 50 ~ 150 (1단위)
    setWidth(randomWidth);
    setHeight(randomHeight);
  }, []);

  return (
    <section className="max-w-full px-4 py-6 bg-background">
      <div className="product-detail space-y-8 text-center px-6 py-8">
        {/* 상품명 */}
        <h3 className="text-lg font-bold mb-4">{product.name}</h3>

        {/* 랜덤 크기 정보 */}
        <p className="text-sm text-gray-500 mb-24">
          {width} x {height}mm
        </p>

        {/* 설명 */}
        <div className="text-sm leading-relaxed space-y-2 mb-20">
          <p>일본 직수입 정품</p>
          <p>매일 함께하기 좋은 실용적인 아이템입니다.</p>
          <p>{product.name} 하나면 어디서든 돋보일 거예요 :)</p>
          <p>소장가치가 높아 선물용으로도 매우 적합하며, 디테일 하나하나 신경 쓴 제품입니다.</p>
          <p>오래도록 사용하실 수 있도록 내구성까지 고려해 제작되었습니다.</p>
        </div>

        {/* 이미지 */}
        <div className="flex flex-col items-center gap-8 mt-8">
          {product.mainImages.map((image, index) => {
            const imgSrc = `${API_URL}/${image.path.replace(/^\/+/, '')}`;
            return (
              <div key={index} className="w-full max-w-[500px]">
                <Image src={imgSrc} alt={image.originalname || image.name || `상품 이미지 ${index + 1}`} width={500} height={345} style={{ objectFit: 'contain' }} unoptimized sizes="(max-width: 768px) 100vw, 500px" priority={index === 0} />
              </div>
            );
          })}
        </div>

        <div className="text-sm leading-relaxed space-y-2 mt-24 mb-20">
          <p>
            정성껏 제작한 이 제품은 높은 품질과 세심한 디자인으로,
            <br />
            오랫동안 소중하게 함께하실 수 있을 거예요.
          </p>
          <p>매일의 일상은 물론, 특별한 순간에도 따뜻한 마음을 더해줄 아이템입니다.</p>
        </div>

        {/* 이미지 */}
        <div className="flex flex-col items-center gap-8 mt-8">
          {product.mainImages.map((image, index) => {
            const imgSrc = `${API_URL}/${image.path.replace(/^\/+/, '')}`;
            return (
              <div key={index} className="w-full max-w-[500px]">
                <Image src={imgSrc} alt={image.originalname || image.name || `상품 이미지 ${index + 1}`} width={500} height={345} style={{ objectFit: 'contain' }} unoptimized sizes="(max-width: 768px) 100vw, 500px" priority={index === 0} />
              </div>
            );
          })}
        </div>

        <div className="text-sm text-gray space-y-3 mt-40 ">
          <p>
            제품 특성상 공정 과정에서 미세한 스크래치와 얼룩,
            <br />
            잔기스, 도색미스 등이 있을 수 있으니 구매 전 꼭 참고 바랍니다.
            <br />
            이로 인한 교환이나 반품은 불가하오니 양해 부탁드립니다.
          </p>
        </div>
      </div>
    </section>
  );
}
