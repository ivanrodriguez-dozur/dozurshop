import React from 'react';
import Image from 'next/image';
import { Product } from '../app/home/types';

interface StyledProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
}

export const StyledProductCard: React.FC<StyledProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <div className="group relative bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-neon/50 transition-all duration-300 hover:shadow-neon">
      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite(String(product.id))}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-neon/20 transition-all duration-300"
      >
  {/* SVG eliminado */}
          className={`w-5 h-5 transition-colors duration-300 ${
            isFavorite ? 'text-neon fill-neon' : 'text-gray-400 hover:text-neon'
          }`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
  {/* SVG eliminado */}
      </button>

      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{product.brand}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">
              ${product.price}
            </span>
          </div>
          
          {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || product.stock === undefined}
            className="flex-1 bg-neon text-black font-bold py-2 px-4 rounded-lg hover:bg-neon/90 transition-all duration-300 hover:shadow-neon-sm disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <button className="px-3 py-2 border border-gray-700 rounded-lg hover:border-neon/50 hover:text-neon transition-all duration-300">
            {/* SVG eliminado */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            {/* SVG eliminado */}
          </button>
        </div>
      </div>
    </div>
  );
};
