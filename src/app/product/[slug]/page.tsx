import { notFound } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import ProductDetailClient from "./ProductDetailClient";


export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) return notFound();

  return <ProductDetailClient product={product} />;
}

// Descripción para futuros cambios:
// - Este archivo es la página de detalle de producto ("Product Detail")
// - Recibe el slug/id del producto por URL y muestra la información usando el componente ProductDetail
// - Puedes modificar el diseño, agregar lógica de favoritos, reviews, etc. aquí
