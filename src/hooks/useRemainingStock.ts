'use client';

export function useRemainingStock(quantity: number, buyQuantity: number) {
  return Math.max(quantity - buyQuantity, 0);
}
