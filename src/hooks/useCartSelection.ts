import { useState } from 'react';
import type { CartResponse } from '@/types/Cart';

export function useCartSelection(cartData: CartResponse | null) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleAll = () => {
    if (!cartData) return;
    const availableIds = cartData.item.filter(i => i.product.quantity > 0).map(i => i._id);
    const isAllSelected = availableIds.every(id => selectedItems.includes(id));
    setSelectedItems(isAllSelected ? [] : [...new Set([...selectedItems, ...availableIds])]);
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  return { selectedItems, setSelectedItems, toggleAll, toggleItem };
}
