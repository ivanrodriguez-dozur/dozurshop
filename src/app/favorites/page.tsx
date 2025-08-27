
// Página de Favoritos mejorada con carrusel y grilla 2x2
"use client";


import { useFavoritesStore } from "../../store/favorites";
import { useCartStore } from "../../store/cart";
import { useContext } from "react";
import { useToast } from "../context/ToastContext";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";



export default function Favoritos() {
  const [scrolled, setScrolled] = useState(false);
  // Cambia el color de fondo de todo el body en desktop cuando hay scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const body = document.body;
    const html = document.documentElement;
    if (scrolled && window.innerWidth >= 900) {
      body.style.background = '#e0f7fa';
      html.style.background = '#e0f7fa';
    } else {
      body.style.background = '#f7f7f7';
      html.style.background = '#f7f7f7';
    }
    return () => {
      body.style.background = '';
      html.style.background = '';
    };
  }, [scrolled]);

  // Detectar movimiento de scroll horizontal
  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    const handleScroll = () => {
      if (ref.scrollLeft > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, []);
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { add } = useCartStore();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const toast = useToast();

  // Colores de fondo para las tarjetas
  const bgColors = [
    "#ffe0e6",
    "#e0f7fa",
    "#fff9c4",
    "#e1bee7",
    "#c8e6c9",
    "#f8bbd0",
    "#d7ccc8",
    "#b3e5fc",
    "#f0f4c3",
    "#d1c4e9",
  ];

  // --- TikTok-like snap scroll ---
  // Snap scroll al producto más cercano al dejar de hacer scroll
  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    let timeout: NodeJS.Timeout;
    const handleSnap = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Encuentra el producto más cercano al centro de la pantalla
        const cards = Array.from(ref.querySelectorAll('.snap-card')) as HTMLElement[];
        if (cards.length === 0) return;
        const refRect = ref.getBoundingClientRect();
        const refCenter = refRect.top + refRect.height / 2;
        let minDist = Infinity;
        let closestIdx = 0;
        cards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.top + cardRect.height / 2;
          const dist = Math.abs(cardCenter - refCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
          }
        });
        // Scroll suave al producto más cercano
        if (cards[closestIdx]) {
          cards[closestIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120); // Espera a que termine el scroll
    };
    ref.addEventListener('scroll', handleSnap);
    return () => ref.removeEventListener('scroll', handleSnap);
  }, [favorites.length]);

  const goToProduct = (slug?: string) => {
    if (!slug) {
      alert('No slug for product');
      console.warn('No slug for product', slug);
      return;
    }
    console.log('Navigating to', `/product/${slug}`);
    router.push(`/product/${slug}`);
  };

  // Mostrar el último favorito primero
  const reversedFavorites = [...favorites].reverse();

  // Estado para mostrar la flecha de swipe
  const [showSwipeInfo, setShowSwipeInfo] = useState(true);
  useEffect(() => {
    if (!showSwipeInfo) return;
    const timeout = setTimeout(() => setShowSwipeInfo(false), 2500);
    return () => clearTimeout(timeout);
  }, [showSwipeInfo]);

  // Handler para ocultar la flecha al hacer swipe/click
  const hideSwipeInfo = () => setShowSwipeInfo(false);

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: scrolled ? '#e0f7fa' : '#f7f7f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'background 0.3s',
      }}
    >
      {/* Flecha e info de swipe */}
      {showSwipeInfo && reversedFavorites.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: 24,
            transform: 'translateY(-50%)',
            zIndex: 100,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            boxShadow: '0 2px 8px #0002',
            padding: '10px 18px 10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontSize: 16,
            color: '#333',
            userSelect: 'none',
            transition: 'opacity 0.3s',
          }}
          onClick={hideSwipeInfo}
        >
          <span style={{ fontSize: 22, color: '#00bcd4', marginRight: 4 }}>←</span>
          <span>Desliza para ver info</span>
        </div>
      )}
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          maxWidth: 700,
          margin: '0 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: 'calc(100vh - 40px)',
          scrollSnapType: 'y mandatory',
        }}
      >
        {reversedFavorites.length === 0 ? (
          <div style={{ fontSize: 22, color: '#888', textAlign: 'center' }}>No tienes productos favoritos.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
            {reversedFavorites.map((product, idx) => (
              <div
                key={product.id}
                className="snap-card"
                style={{
                  background: bgColors[idx % bgColors.length],
                  margin: '16px 0',
                  borderRadius: 18,
                  minWidth: 420,
                  maxWidth: 500,
                  minHeight: 520,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 16px #0001',
                  scrollSnapAlign: 'center',
                }}
              >
                <div
                  style={{ width: 420, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'pan-y', userSelect: 'none' }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalles de ${product.name}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToProduct(product.slug); }}
                  onTouchStart={e => {
                    (e.currentTarget as HTMLElement & { _touchStartX?: number })._touchStartX = e.touches[0].clientX;
                  }}
                  onTouchEnd={e => {
                    const startX = (e.currentTarget as HTMLElement & { _touchStartX?: number })._touchStartX;
                    const endX = e.changedTouches[0].clientX;
                    if (startX - endX > 60) { // swipe left
                      goToProduct(product.slug);
                      hideSwipeInfo();
                    }
                  }}
                  onMouseDown={e => {
                    (e.currentTarget as HTMLElement & { _mouseStartX?: number })._mouseStartX = e.clientX;
                  }}
                  onMouseUp={e => {
                    const startX = (e.currentTarget as HTMLElement & { _mouseStartX?: number })._mouseStartX;
                    const endX = e.clientX;
                    if (startX - endX > 60) { // swipe left with mouse
                      goToProduct(product.slug);
                      hideSwipeInfo();
                    }
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: 14,
                      background: '#fff',
                      boxShadow: '0 2px 8px #0002',
                    }}
                  />
                </div>
                <ProductCard
                  product={product}
                  onFavorite={() => toggleFavorite(product)}
                  onAddToCart={() => {
                    add(product);
                    toast.show('Producto agregado al carrito');
                  }}
                  isFavorite={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}