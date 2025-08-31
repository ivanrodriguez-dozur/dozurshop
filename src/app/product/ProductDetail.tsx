'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { supabase } from '../../../lib/supabaseClient';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <span className="text-white text-lg">Cargando producto...</span>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <span className="text-white text-lg">Producto no encontrado</span>
      </main>
    );
  }

  // Construir la URL pública de Supabase si es necesario
  const supabaseUrl = 'https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/';
  const imageUrl =
    product.image_url && !product.image_url.startsWith('http')
      ? supabaseUrl + product.image_url
      : product.image_url;

  return (
    <main className="bg-black min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button
          aria-label="Back"
          className="text-white text-lg font-semibold"
          onClick={() => window.history.back()}
        >
          &larr;
        </button>
        <h1 className="text-white text-lg font-bold">Product Detail</h1>
        <button aria-label="Favorite" className="text-neon text-lg font-semibold">
          {/* Corazón eliminado */}
        </button>
      </header>
      <section className="text-center">
        <img src={imageUrl} alt={product.name} className="w-full max-w-xs mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold">{product.name}</h2>
        <p className="text-neon text-lg font-semibold">${product.price}</p>
        <p className="text-white text-sm mt-2">{product.reviews ?? 0} Reviews</p>
      </section>
      <section className="mt-6">
        <h3 className="text-white text-lg font-bold mb-2">Descripción</h3>
        <p className="text-white text-sm">{product.description}</p>
      </section>
      {/* Puedes agregar más detalles aquí */}
    </main>
  );
}
