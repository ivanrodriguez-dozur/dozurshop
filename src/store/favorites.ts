import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Product } from '../app/home/types';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.id === product.id);
          return {
            favorites: exists
              ? state.favorites.filter((f) => f.id !== product.id)
              : [...state.favorites, product],
          };
        }),
    }),
    { name: 'favorites' }
  )
);
