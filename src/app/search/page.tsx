'use client';
import { useState } from 'react';

import PanelSuperior from '@/app/home/components/PanelSuperior';
import ProductCard from '@/components/ProductCard';
import { fetchProducts } from '@/lib/products';

import { Product } from '@/app/home/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async () => {
    const products = await fetchProducts();
    setResults(products.filter((p: Product) => p.name.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <main className="min-h-screen pb-20">
      <PanelSuperior pageTitle="Dozur Shop" />
      <div className="p-4">
        <input
          aria-label="Buscar productos"
          className="w-full p-2 rounded-xl border border-gray-700 bg-black text-white focus:outline-neon"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="mt-2 w-full bg-neon text-black rounded-xl py-2 font-bold"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
      <div className="px-4 grid grid-cols-2 gap-4">
        {results.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
