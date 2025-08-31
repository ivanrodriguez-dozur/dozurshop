import { notFound } from 'next/navigation';

import { supabase } from '../../../../lib/supabaseClient';

import ProductDetailClient from './ProductDetailClient';

// Definir el tipo correcto para los props de la página dinámica


interface PageProps {
  params: Promise<{ slug: string }>;
}


export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
    return null;
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: any }) {
  return <ProductDetailClient product={product} />;
}



// Descripción para futuros cambios:
// - Este archivo es la página de detalle de producto ("Product Detail")
// - Recibe el slug/id del producto por URL y muestra la información usando el componente ProductDetail
// - Puedes modificar el diseño, agregar lógica de favoritos, reviews, etc. aquí
