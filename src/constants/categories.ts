// 캐릭터 상품
export const CHARACTER_CATEGORIES = ['스튜디오 지브리', '디즈니/픽사', '산리오', '미피', '핑구', '짱구는 못말려', '치이카와', '스누피'];

// 문구 상품
export const STATIONERY_CATEGORIES = ['필기류', '스티커', '마스킹테이프', '다이어리/달력', '포스터/엽서', '메모지/노트'];

// 리빙&소품 상품
export const LIVING_CATEGORIES = ['키링', '미용&악세사리'];

export const CATEGORY_MAP: Record<string, { label: string; href: string }> = {
  PC01: { label: '캐릭터', href: '/category/character' },
  PC02: { label: '미니어처', href: '/category/miniature' },
  PC03: { label: '문구', href: '/category/stationery' },
  PC04: { label: '리빙&소품', href: '/category/living-accessories' },
  new: { label: '신상품', href: '/category/new' },
  popular: { label: '인기상품', href: '/category/popular' },
};
