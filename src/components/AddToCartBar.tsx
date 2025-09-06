'use client';
import { useState } from 'react';
import { useGamificationStore } from '@/store/gamificationStore';

export default function AddToCartBar({
  onAdd,
  max = 10,
}: {
  onAdd?: (qty: number) => void;
  max?: number;
}) {
  const [qty, setQty] = useState(1);
  const { addXp } = useGamificationStore();
  
  const handleAddToCart = () => {
    onAdd?.(qty);
    // Dar XP por agregar productos al carrito
    const xpAmount = qty * 3; // 3 XP por producto agregado
    addXp(xpAmount, `${qty} producto(s) agregado(s) al carrito`);
  };
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-black px-4 py-3 flex items-center justify-between border-t border-gray-800 z-40">
      <div className="flex items-center gap-2">
        <button
          aria-label="Menos"
          className="bg-gray-800 text-white rounded-full w-8 h-8 text-xl"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="text-white font-bold text-lg w-8 text-center">{qty}</span>
        <button
          aria-label="Más"
          className="bg-gray-800 text-white rounded-full w-8 h-8 text-xl"
          onClick={() => setQty((q) => Math.min(max, q + 1))}
        >
          +
        </button>
      </div>
      <button
        aria-label="Agregar al carrito"
        className="ml-4 bg-neon text-black font-bold px-6 py-2 rounded-xl shadow-soft focus:outline-neon"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
