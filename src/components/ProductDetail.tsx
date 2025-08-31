'use client';
import Image from 'next/image';
import { useState } from 'react';

import { Product } from '../app/home/types';
import { buildSupabasePublicUrl } from '../lib/resolveImageUrl';

import AddToCartBar from './AddToCartBar';
import SizeSelectorClothes from './SizeSelectorClothes';
import SizeSelectorShoes from './SizeSelectorShoes';

export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState<string | number | null>(null);
  if (!product) return <div className="text-white p-8">Cargando…</div>;
  return (
    <main className="bg-white min-h-screen pb-20">
      <div className="p-4">
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
        <div className="mt-2 text-white text-xl font-bold">{product.name}</div>
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
          /* CAMBIAR: lógica para agregar al carrito */
        }}
      />
    </main>
  );
}
