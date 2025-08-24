"use client";

import { notFound } from "next/navigation";
import ProductDetail from "../../home/ProductDetail";
import { useProducts } from "../../home/hooks/useProducts";
import { useFavoritesStore } from "../../../store/favorites";
import { useCartStore } from "../../../store/cart";

// Página de detalle de producto para rutas dinámicas
// Aquí puedes personalizar la estructura y lógica de la página de detalle
// El diseño base es similar al ejemplo proporcionado (ver imagen adjunta)


export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { products } = useProducts();
  const product = products.find(
    (p) => p.slug === params.slug || p.id === params.slug
  );
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { add } = useCartStore();
  if (!product) return notFound();

  // Handler para agregar al carrito
  const handleAddToCart = ({ product, quantity, size, color }: { product: any; quantity: number; size: string; color: string }) => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      qty: quantity
    });
  };

  // Handler para favoritos
  const handleFavorite = () => toggleFavorite(product);

  const isFavorite = favorites.some(f => f.id === product.id);

  return (
    <ProductDetail
      product={product}
      onBack={() => window.history.back()}
      onAddToCart={handleAddToCart}
      onFavorite={handleFavorite}
      isFavorite={isFavorite}
    />
  );
}

// Descripción para futuros cambios:
// - Este archivo es la página de detalle de producto ("Product Detail")
// - Recibe el slug/id del producto por URL y muestra la información usando el componente ProductDetail
// - Puedes modificar el diseño, agregar lógica de favoritos, reviews, etc. aquí
