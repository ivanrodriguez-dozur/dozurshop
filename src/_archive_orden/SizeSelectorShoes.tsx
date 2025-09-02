'use client';
import { useState } from 'react';

const sizes = Array.from({ length: 9 }, (_, i) => 37 + i);

export default function SizeSelectorShoes({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) {
  const [active, setActive] = useState(value ?? 41);
  return (
    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
      {sizes.map((size) => (
        <button
          key={size}
          aria-label={`Talla ${size}`}
          className={`px-4 py-2 rounded-xl font-bold focus:outline-neon transition-all ${active === size ? 'bg-neon text-black' : 'bg-gray-800 text-white opacity-70'}`}
          onClick={() => {
            setActive(size);
            onChange?.(size);
          }}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
