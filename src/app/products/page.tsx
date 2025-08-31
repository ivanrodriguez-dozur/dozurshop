'use client';
import PanelSuperior from '../home/components/PanelSuperior';
import ProductCarousel from '../../components/ProductCarousel';
import { fetchProducts } from '../../lib/products';

export default async function ProductsPage({ searchParams }) {
  const products = await fetchProducts();
  const filtered =
    searchParams?.filter === 'popular'
      ? products.filter((p) => p.tags?.includes('popular'))
      : products;
  return (
    <main className="bg-white min-h-screen pb-20">
      <PanelSuperior pageTitle="Dozur Shop" />
      <section className="px-4 mt-4">
        <h2 className="text-black text-lg font-bold mb-2">Productos populares</h2>
        <ProductCarousel products={filtered} />
      </section>
    </main>
  );
}
