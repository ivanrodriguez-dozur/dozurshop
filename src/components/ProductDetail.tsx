'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Product } from '@/app/home/types';
import { buildSupabasePublicUrl } from '@/lib/resolveImageUrl';

import AddToCartBar from './AddToCartBar';
import SizeSelectorClothes from './SizeSelectorClothes';
import SizeSelectorShoes from './SizeSelectorShoes';

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onAddToCart?: (args: { product: Product; quantity: number; size: string; color: string }) => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ProductDetail({ product, onBack, onAddToCart, onFavorite, isFavorite }: ProductDetailProps) {
  const [size, setSize] = useState<string | number | null>(null);
  if (!product) return <div className="text-white p-8">Cargando…</div>;
  return (
    <main className="bg-white min-h-screen pb-20">
      <div className="p-4">
        {/* Back button */}
        {onBack && (
          <button onClick={onBack} className="mb-2 text-sm text-blue-500 hover:underline">← Volver</button>
        )}
        <Image
          src={
            product.image_url && product.image_url.trim() !== ''
              ? buildSupabasePublicUrl(product.image_url)
              : 'https://placehold.co/320x320?text=Sin+Imagen'
          }
          alt={product.name}
          width={320}
          height={320}
          className="rounded-xl mx-auto bg-white"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://placehold.co/320x320?text=Sin+Imagen';
          }}
          unoptimized={true}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="bg-black text-white px-3 py-1 rounded-xl text-lg font-bold">
            ${product.price}
          </span>
          <span className="text-gray-400 text-sm">10k Reviews</span>
        </div>
        <div className="mt-2 text-white text-xl font-bold flex items-center gap-2">
          {product.name}
          {onFavorite && (
            <button onClick={onFavorite} aria-label="Favorito" className="ml-2">
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div className="text-gray-400 text-sm mb-2">{product.brand}</div>
        <div className="text-white text-sm mb-4">{product.description}</div>
        {product.category === 'shoes' ? (
          <SizeSelectorShoes
            value={typeof size === 'number' ? size : undefined}
            onChange={(v) => setSize(v)}
          />
        ) : (
          <SizeSelectorClothes
            value={typeof size === 'string' ? size : undefined}
            onChange={(v) => setSize(v)}
          />
        )}
      </div>
      <AddToCartBar
        onAdd={(qty) => {
          if (onAddToCart && size) {
            onAddToCart({ product, quantity: qty, size: String(size), color: '' });
          }
        }}
      />
    </main>
  );
}
