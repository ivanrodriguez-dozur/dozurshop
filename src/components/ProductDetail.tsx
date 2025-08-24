"use client";
import { useEffect, useState } from 'react';
import { fetchProduct } from '../lib/products';
import SizeSelectorShoes from './SizeSelectorShoes';
import SizeSelectorClothes from './SizeSelectorClothes';
import AddToCartBar from './AddToCartBar';
import Image from 'next/image';

import { Product } from '../app/home/types';

export default function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string | number | null>(null);
  useEffect(() => {
    fetchProduct(slug).then(setProduct);
  }, [slug]);
  if (!product) return <div className="text-white p-8">Cargando…</div>;
  return (
    <main className="bg-white min-h-screen pb-20">
      <div className="p-4">
        <Image src={product.image} alt={product.name} width={320} height={320} className="rounded-xl mx-auto bg-white" />
        <div className="flex items-center justify-between mt-4">
          <span className="bg-black text-white px-3 py-1 rounded-xl text-lg font-bold">${product.price}</span>
          <span className="text-gray-400 text-sm">10k Reviews</span>
        </div>
        <div className="mt-2 text-white text-xl font-bold">{product.name}</div>
        <div className="text-gray-400 text-sm mb-2">{product.brand}</div>
        <div className="text-white text-sm mb-4">{product.description}</div>
        {product.category === 'shoes' ? (
          <SizeSelectorShoes value={size} onChange={setSize} />
        ) : (
          <SizeSelectorClothes value={size} onChange={setSize} />
        )}
      </div>
      <AddToCartBar onAdd={qty => {/* CAMBIAR: lógica para agregar al carrito */}} />
    </main>
  );
}
