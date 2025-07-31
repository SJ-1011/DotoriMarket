import { Product } from '../types/Product';

// 상품별 통계 데이터 타입
export interface ProductStatistics {
  _id: number | string;
  totalQuantity: number;
  totalSales: number;
  product: Product;
}
//일자별 통계 데이터 타입
export interface DayStatistics {
  date: string;
  totalQuantity: number;
  totalSales: number;
}
// 통계 조회 파라미터 타입
export interface StatisticsParams {
  start: string;
  finish: string;
  by: string; // 상품별 : product 일자별 day
}
