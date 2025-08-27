"use client";
import React from 'react';
import ProductDetail from '../../home/ProductDetail';
import { useFavoritesStore } from '../../../store/favorites';
import { useCartStore } from '../../../store/cart';

import { Product } from '../../../home/types';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { add } = useCartStore();

  // Handler para agregar al carrito
  const handleAddToCart = ({ product: prod, quantity, size, color }: { product: Product; quantity: number; size: string; color: string }) => {
    add({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image_url,
      size,
      qty: quantity,
    });
  };

  // Handler para favoritos
  const handleFavorite = () => toggleFavorite(product);

  const isFavorite = favorites.some((f: Product) => f.id === product.id);

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
