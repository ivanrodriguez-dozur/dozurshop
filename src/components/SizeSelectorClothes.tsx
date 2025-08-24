"use client";
import { useState } from 'react';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export default function SizeSelectorClothes({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  const [active, setActive] = useState(value ?? 'M');
  return (
    <div className="flex gap-2 py-2">
      {sizes.map(size => (
        <button
          key={size}
          aria-label={`Talla ${size}`}
          className={`px-4 py-2 rounded-xl font-bold focus:outline-neon transition-all ${active === size ? 'bg-neon text-black' : 'bg-gray-800 text-white opacity-70'}`}
          onClick={() => { setActive(size); onChange?.(size); }}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
