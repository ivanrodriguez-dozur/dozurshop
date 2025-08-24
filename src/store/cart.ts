import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string | number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string, size: string | number) => void;
  update: (id: string, size: string | number, qty: number) => void;
  total: number;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set(state => {
        const exists = state.items.find(i => i.id === item.id && i.size === item.size);
        if (exists) {
          return { items: state.items.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + item.qty } : i) };
        }
        return { items: [...state.items, item] };
      }),
      remove: (id, size) => set(state => ({ items: state.items.filter(i => i.id !== id || i.size !== size) })),
      update: (id, size, qty) => set(state => ({ items: state.items.map(i => i.id === id && i.size === size ? { ...i, qty } : i) })),
      total: 0,
      clear: () => set({ items: [] }),
    }),
    { name: 'cart', partialize: state => ({ items: state.items }) }
  )
);

// CAMBIAR: lógica de totales y persistencia si es necesario
