'use client';
import { useRef } from 'react';

import { Product } from '@/app/home/types';
import { useFavoritesStore } from '@/store/favorites';

import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [] }: { products?: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite } = useFavoritesStore((state) => ({
    favorites: state.favorites,
    toggleFavorite: state.toggleFavorite,
  }));
  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };
  return (
    <div className="relative">
      <button
        aria-label="Izquierda"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-1 hidden md:block"
        onClick={() => scroll('left')}
      >
        &lt;
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {products.map((p: Product) => (
          <div key={p.id} className="snap-start min-w-[160px]">
            <ProductCard
              product={p}
              isFavorite={favorites.some((f) => f.id === p.id)}
              onFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
      <button
        aria-label="Derecha"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-1 hidden md:block"
        onClick={() => scroll('right')}
      >
        &gt;
      </button>
    </div>
  );
}
