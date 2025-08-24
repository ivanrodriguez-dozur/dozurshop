import { useState } from "react";
import { Product } from "../types";

// CAMBIAR: Puedes expandir la lógica de carrito y favoritos aquí
export function useShopping() {
  const [cart, setCart] = useState<{ product: Product; quantity: number; size: string; color: string }[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToCart = (product: Product, quantity = 1, size = '', color = '') => {
    setCart(prev => [...prev, { product, quantity, size, color }]);
  };

  const removeFromCart = (productId: string, size = '', color = '') => {
    setCart(prev => prev.filter(item => item.product.id !== productId || item.size !== size || item.color !== color));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId]);
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    toggleFavorite,
    cartCount,
    cartTotal,
  };
}
