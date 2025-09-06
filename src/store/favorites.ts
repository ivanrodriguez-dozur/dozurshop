import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Product } from '../app/home/types';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product, onXpGained?: (action: string) => void) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product, onXpGained) =>
        set((state) => {
          const exists = state.favorites.some((f) => f.id === product.id);
          const action = exists ? 'removed' : 'added';
          
          // Callback para XP si se proporciona
          if (onXpGained) {
            const xpAction = exists 
              ? 'Producto removido de favoritos' 
              : 'Producto agregado a favoritos';
            onXpGained(xpAction);
          }
          
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
