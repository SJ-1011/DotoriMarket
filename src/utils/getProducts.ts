// src/utils/getProducts.ts

import type { ApiResPromise } from '@/types/api';
import type { Product } from '@/types/Product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

/**
 * 상품 목록을 조회합니다.
 * @returns {Promise<ApiRes<Product[]>>} 상품 목록 API 응답
 */
export async function getProducts(): ApiResPromise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?showSoldOut=true`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 상품 목록을 불러오지 못했습니다.' };
  }
}

/**
 * 사용자가 좋아요(북마크)한 상품 목록을 조회합니다.
 * @param {string} accessToken 유저 액세스 토큰
 * @returns {Promise<ApiRes<Product[]>>} 좋아요한 상품 목록 API 응답
 */
export async function getLikedProducts(accessToken: string): ApiResPromise<Product[]> {
  if (!accessToken) {
    console.error('로그인 후 다시 시도해주세요.');
    return {
      ok: 0,
      message: '로그인 정보가 없습니다. 다시 로그인해주세요.',
    };
  }

  try {
    const res = await fetch(`${API_URL}/bookmarks/product`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store', // 최신 데이터 가져오기
    });
    return res.json();
  } catch (error) {
    console.error('북마크 API 호출 중 오류:', error);
    return {
      ok: 0,
      message: '좋아요한 상품 목록을 불러오지 못했습니다.',
    };
  }
}

/**
 * 상품 목록을 조회합니다.
 * @returns {Promise<ApiRes<Product[]>>} 상품 목록 API 응답
 */
export async function getProductsCategory(category: string, details?: string): ApiResPromise<Product[]> {
  let query;
  switch (category) {
    case 'new':
      query = { 'extra.isNew': true };
      break;
    case 'popular':
      query = { 'extra.isBest': true };
      break;
    case 'character':
      if (details) query = { 'extra.category.1': `PC01${details}` };
      else query = { 'extra.category.0': 'PC01' };
      break;
    case 'miniature':
      query = { 'extra.category.0': 'PC02' };
      break;
    case 'stationery':
      if (details) query = { 'extra.category.1': `PC03${details}` };
      else query = { 'extra.category.0': 'PC03' };
      break;
    case 'living-accessories':
      if (details) query = { 'extra.category.1': `PC04${details}` };
      else query = { 'extra.category.0': 'PC04' };
      break;
  }
  try {
    const res = await fetch(`${API_URL}/products?showSoldOut=true&custom=${encodeURIComponent(JSON.stringify(query))}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 상품 목록을 불러오지 못했습니다.' };
  }
}

/**
 * 상품 ID로 단일 상품 조회
 * @param {string | number} id - 상품 ID
 * @returns {Promise<ApiRes<Product>>} 상품 상세 정보
 */
export async function getProductById(id: string | number): ApiResPromise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '상품 정보를 불러오지 못했습니다.',
    };
  }
}

/**
 * 검색 상품 목록을 조회합니다.
 * @returns {Promise<ApiRes<Product[]>>} 상품 목록 API 응답
 */
export async function getSearchProducts(query: string): ApiResPromise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?showSoldOut=true&keyword=${query}`, {
      headers: {
        'Client-Id': CLIENT_ID,
      },
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '일시적인 네트워크 문제로 상품 목록을 불러오지 못했습니다.' };
  }
}
