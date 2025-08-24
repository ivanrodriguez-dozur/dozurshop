import React from "react";
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClose: () => void;
}

export default function CartView({ cart, onUpdateQuantity, onClose }: CartViewProps) {
  return (
    <div style={{ color: '#b5ff00', padding: 24 }}>
      {cart.length === 0 ? 'Carrito vacío' : 'Carrito con productos'}
      <button onClick={onClose} style={{ marginLeft: 16 }}>Cerrar</button>
    </div>
  );
}
