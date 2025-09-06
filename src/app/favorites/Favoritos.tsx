// Página de Favoritos mejorada con carrusel y grilla 2x2
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useFavoritesStore } from '@/store/favorites';

export default function Favoritos() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Carrusel: agrupa favoritos de a 4 (2x2)
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < favorites.length; i += chunkSize) {
    slides.push(favorites.slice(i, i + chunkSize));
  }
  const totalSlides = slides.length;

  const handlePrev = () => setCarouselIndex((i) => (i === 0 ? totalSlides - 1 : i - 1));
  const handleNext = () => setCarouselIndex((i) => (i === totalSlides - 1 ? 0 : i + 1));

  return (
    <div
      style={{ minHeight: '100vh', background: '#fff', position: 'relative', paddingBottom: 40 }}
    >
      {/* Título en la esquina superior izquierda */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          background: '#fff',
          width: '100vw',
          padding: '18px 0 8px 18px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.99)',
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 32,
            color: '#ff0202ff',
            margin: 0,
            letterSpacing: '-1px',
          }}
        >
          Favoritos
        </h1>
      </div>
      {favorites.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', marginTop: 60 }}>
          No tienes productos favoritos.
        </div>
      ) : (
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', paddingTop: 80 }}>
          {/* Carrusel controles */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: 8,
                  fontSize: 28,
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: '0 2px 8px #0002',
                }}
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: 8,
                  fontSize: 28,
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: '0 2px 8px #0002',
                }}
              >
                ›
              </button>
            </>
          )}
          {/* Carrusel slides */}
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              minHeight: 600,
            }}
          >
            {slides.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridAutoFlow: 'column',
                  gridTemplateRows: '1fr 1fr',
                  gap: 32,
                  width: 'max-content',
                  minWidth: 700,
                  height: 600,
                }}
              >
                {slides[carouselIndex].map((product) => (
                  <div
                    key={product.id}
                    style={{
                      background: '#f5f5f5',
                      borderRadius: 18,
                      boxShadow: '0 2px 12px #0001',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 18,
                      position: 'relative',
                      height: 320,
                      minWidth: 320,
                      maxWidth: 420,
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    {(() => {
                      const DEFAULT = 'https://placehold.co/520x300?text=Sin+Imagen';
                      import { buildSupabasePublicUrl } from '@/lib/resolveImageUrl';
                      const src =
                        product.image_url && product.image_url.trim() !== ''
                          ? buildSupabasePublicUrl(product.image_url)
                          : DEFAULT;
                      return (
                        <Image
                          src={src}
                          alt={product.name}
                          width={520}
                          height={300}
                          style={{
                            objectFit: 'cover',
                            borderRadius: 14,
                            width: '100%',
                            height: 260,
                            marginBottom: 0,
                          }}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = DEFAULT;
                          }}
                          unoptimized={true}
                        />
                      );
                    })()}
                    {/* Precio en la esquina inferior izquierda */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 16,
                        bottom: 16,
                        background: '#181818',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '6px 18px',
                        fontWeight: 700,
                        fontSize: 22,
                        boxShadow: '0 2px 8px #0002',
                        zIndex: 2,
                      }}
                    >
                      {`$${product.price.toLocaleString('es-CO')}`}
                    </div>
                    {/* Corazón para quitar de favoritos, bien alineado arriba derecha */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      style={{
                        position: 'absolute',
                        top: 18,
                        right: 18,
                        background: '#fff',
                        border: 'none',
                        borderRadius: 18,
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0002',
                        zIndex: 2,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#ff6600"
                        stroke="#ff6600"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s-6.2-4.35-9-8.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 7.5C18.2 16.65 12 21 12 21z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Carrito pequeño fijo sobre los productos en la esquina inferior derecha */}
      <button
        onClick={() => router.push('/carrito')}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#b5ff00',
          color: '#181818',
          border: 'none',
          borderRadius: 30,
          width: 48,
          height: 48,
          boxShadow: '0 2px 8px #b5ff0033',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          zIndex: 200,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#181818"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h2l.4 2M7 13h10l4-8H5.4" />
        </svg>
      </button>
    </div>
  );
}
