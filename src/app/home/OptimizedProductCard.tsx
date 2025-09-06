'use client';
import Image from 'next/image';
import React, { memo, useCallback } from 'react';

import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onFavorite: (productId: string) => void;
  onSelect?: () => void;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, size: string, color: string) => void;
  isFavorite: boolean;
  isInCart?: boolean;
  onClick?: () => void;
}

// Memoización personalizada para evitar re-renders innecesarios
const areEqual = (prevProps: ProductCardProps, nextProps: ProductCardProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.isInCart === nextProps.isInCart
  );
};

const OptimizedProductCard: React.FC<ProductCardProps> = memo(
  ({
    product,
    onFavorite,
    onSelect,
    onProductClick,
    onAddToCart,
    isFavorite,
    isInCart,
    onClick,
  }) => {
    const handleCardClick = useCallback(() => {
      if (onProductClick) {
        onProductClick(product);
      } else if (onSelect) {
        onSelect();
      } else if (onClick) {
        onClick();
      }
    }, [onProductClick, onSelect, onClick, product]);

    const handleAddToCartClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAddToCart) {
          onAddToCart(product, 1, product.sizes[0] || 'M', product.colors[0] || 'blue');
        }
      },
      [onAddToCart, product]
    );

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavorite(product.id);
      },
      [onFavorite, product.id]
    );

    return (
      <div
        style={{
          background: 'transparent',
          borderRadius: 32,
          padding: 0,
          marginBottom: 0,
          boxShadow: 'none',
          position: 'relative',
          cursor: 'pointer',
          width: 260,
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleCardClick}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 32,
            overflow: 'hidden',
            background: '#181818',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
          }}
        >
          {(() => {
            const DEFAULT_IMAGE = 'https://placehold.co/220x220?text=Sin+Imagen';
            import { buildSupabasePublicUrl } from '@/lib/resolveImageUrl';
            const raw =
              product.image_url && product.image_url.trim() !== '' ? product.image_url : '';
            const imageUrl = raw ? buildSupabasePublicUrl(raw) : DEFAULT_IMAGE;
            return (
              <Image
                src={imageUrl}
                alt={product.name}
                width={220}
                height={220}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  borderRadius: 32,
                }}
                loading="lazy"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
                unoptimized={true}
              />
            );
          })()}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: '#000',
            color: '#fff',
            borderRadius: 12,
            padding: '2px 12px',
            fontWeight: 700,
            fontSize: 16,
            zIndex: 2,
          }}
        >
          ${product.price.toLocaleString('es-CO')}
        </div>
        <div style={{ marginTop: 12, fontWeight: 600, color: '#fff', fontSize: 16 }}>
          {product.name}
        </div>
        {product.description && (
          <div
            style={{
              marginTop: 6,
              color: '#bbb',
              fontSize: 13,
              minHeight: 32,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.description}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <button
            onClick={handleFavoriteClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
            onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Corazón eliminado */}
          </button>

          {onAddToCart && (
            <button
              onClick={handleAddToCartClick}
              style={{
                background: isInCart ? '#b5ff00' : 'rgba(181, 255, 0, 0.2)',
                color: isInCart ? '#181818' : '#b5ff00',
                border: 'none',
                borderRadius: '12px',
                padding: '6px 8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {isInCart ? '✓' : '+'}
            </button>
          )}
        </div>
      </div>
    );
  },
  areEqual
);

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
