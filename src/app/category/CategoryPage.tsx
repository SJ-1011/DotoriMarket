'use client';

import ProductGrid from '@/components/common/ProductGrid';
import { Product } from '@/types/Product';
import { getLikedProducts, getProducts, getProductsCategory } from '@/utils/getProducts';
import ProductItemCard from '@/components/common/ProductItemCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/loginStore';
import Loading from '@/app/loading';
import Image from 'next/image';
import FilterIcon from '@/components/icon/FilterIcon';

interface LikedProduct extends Product {
  bookmarkId: number;
}

interface CategoryPageProps {
  category: string;
  title: string;
  detailArray?: detailArray[];
  detail?: string;
  categoryName?: string;
}

interface detailArray {
  name: string;
  address: string;
}

export default function CategoryPage({ category, title, detailArray, detail, categoryName }: CategoryPageProps) {
  // 유저 로그인 정보 (찜목록 갱신)
  const user = useLoginStore(state => state.user);
  // 상품 목록
  const [products, setProducts] = useState<Product[] | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);
  // 찜목록
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  // 정렬 상태
  const [sortOption, setSortOption] = useState('latest');
  // 데스크탑 정렬 상태 열림/닫힘
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (input: React.ChangeEvent<HTMLSelectElement> | string) => {
    let value;
    if (typeof input === 'string') value = input;
    else {
      value = input.target.value;
    }
    setSortOption(value);
    console.log('선택된 정렬 기준:', value);
  };

  // 정렬
  useEffect(() => {
    if (!products) return;
    const copy = [...products];

    switch (sortOption) {
      case 'latest':
        setProducts(copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        break;
      case 'popular':
        setProducts(
          copy.sort((a, b) => {
            const aLeft = a.quantity - a.buyQuantity;
            const bLeft = b.quantity - b.buyQuantity;
            return aLeft - bLeft;
          }),
        );
        break;
      case 'lowPrice':
        setProducts(copy.sort((a, b) => a.price - b.price));
        break;
      case 'highPrice':
        setProducts(copy.sort((a, b) => b.price - a.price));
        break;
      default:
        setProducts(copy);
    }

    setIsOpen(false);
  }, [sortOption]);

  // 상품 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 전체 상품 조회
        if (category === 'all') {
          const res = await getProducts();
          if (res.ok) {
            setProducts(res.item);
          }
        }
        // 카테고리 상품 조회
        else {
          let res;
          if (detail) res = await getProductsCategory(category, detail);
          else res = await getProductsCategory(category);
          if (res.ok) {
            setProducts(res.item);
          }
        }
      } catch {
        console.log('실패');
      }
    };

    fetchProducts();
  }, []);

  // 북마크 가져오기
  useEffect(() => {
    if (!user?.token?.accessToken) {
      setLoading(false);
      return;
    }
    const fetchLiked = async () => {
      setLoading(true);
      try {
        const res = await getLikedProducts(user.token.accessToken);
        const products = Object.values(res)
          .filter((v): v is { _id: number; product: Product } => typeof v === 'object' && v !== null && 'product' in v && '_id' in v)
          .map(v => ({
            ...v.product,
            bookmarkId: v._id,
          }));

        setLikedProducts(products);
        console.log('북마크 상품', likedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user]);

  // 정렬
  const sortState = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '낮은가격순', value: 'lowPrice' },
    { label: '높은가격순', value: 'highPrice' },
  ];

  return (
    <main className="flex flex-col-reverse sm:flex-row px-4 sm:max-w-[664px] lg:max-w-[1000px] mx-auto py-4 sm:py-12">
      <section className="w-full text-xs sm:text-sm lg:text-base">
        {/* 페이지 제목 */}
        {/* TODO Props로 세부 카테고리일 경우 하위 카테고리 추가 */}
        <nav aria-label="Breadcrumb">
          <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>&gt;</li>
            {!detail ? (
              <li>
                <Link href={`/category/${category}`}>{title}</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href={`/category/${category}`}>{categoryName}</Link>
                </li>
                <li>&gt;</li>
                <li>
                  <Link href={`/category/${category}/${detail}`}>{title}</Link>
                </li>
              </>
            )}
          </ol>
        </nav>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">{title}</h2>

        {/* 세부 카테고리 */}
        {detailArray && (
          <aside>
            <div className="w-full overflow-x-auto scrollbar-hide">
              <ul className=" flex flex-row flex-nowrap sm:flex-wrap sm:justify-center items-center gap-2 overflow-x-auto w-max sm:w-full">
                {detailArray.map((item, index) => {
                  // 첫번째 줄
                  if (index === 2)
                    return (
                      <>
                        {/* 이름과 타이틀이 겹칠때 */}
                        {item.name == title ? (
                          <li key={index} className="bg-primary text-white rounded-lg sm:rounded-2xl px-4 py-2">
                            <Link href={`/category/${item.address}`}>{item.name}</Link>
                          </li>
                        ) : (
                          <li key={index} className="border border-primary rounded-lg sm:rounded-2xl px-4 py-2">
                            <Link href={`/category/${item.address}`}>{item.name}</Link>
                          </li>
                        )}
                        <li key={'empty'} className="hidden sm:block sm:w-full sm:h-0" />
                      </>
                    );
                  // 두번째 줄
                  return (
                    <>
                      {/* 이름과 타이틀이 겹칠때 */}
                      {item.name == title ? (
                        <li key={index} className="bg-primary text-white rounded-lg sm:rounded-2xl px-4 py-2">
                          <Link href={`/category/${item.address}`}>{item.name}</Link>
                        </li>
                      ) : (
                        <li key={index} className="border border-primary rounded-lg sm:rounded-2xl px-4 py-2">
                          <Link href={`/category/${item.address}`}>{item.name}</Link>
                        </li>
                      )}
                    </>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        <div className="flex flex-row flex-nowrap justify-between items-center py-4 relative">
          <p>TOTAL {products ? products.length : 0} ITEMS</p>
          <select value={sortOption} onChange={handleChange} className="sm:hidden">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="lowPrice">낮은가격순</option>
            <option value="highPrice">높은가격순</option>
          </select>
          <button type="button" className="hidden cursor-pointer sm:flex sm:flex-row sm:flex-nowrap sm:gap-4 sm:items-center" onClick={() => setIsOpen(!isOpen)}>
            <p>{sortState.find(item => item.value == `${sortOption}`)?.label}</p>
            <FilterIcon svgProps={{ className: 'w-8 h-8' }} />
          </button>
          {isOpen && (
            // TODO 여기에 이벤트 걸어서 정렬 로직 만들기
            <ul className="absolute bg-white p-4 flex flex-col flex-nowrap gap-2 right-0 top-12 z-10 border border-primary">
              {sortState.map((option, index) => (
                <li
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setSortOption(option.value);
                    handleChange(option.value);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {loading ? (
          <Loading />
        ) : products?.length ? (
          <ProductGrid>{likedProducts ? <ProductItemCard products={products} likedProducts={likedProducts}></ProductItemCard> : <ProductItemCard products={products}></ProductItemCard>}</ProductGrid>
        ) : (
          <div className="flex flex-col flex-nowrap justify-center items-center gap-4 w-full mx-auto">
            <Image src="/sad-dotori.png" alt="상품 없음" width={247} height={249}></Image>
            <p>해당하는 상품이 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}
