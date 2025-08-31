'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useFavoritesStore } from '../../store/favorites';
import BannerPublicitario from '../../components/BannerPublicitario';
import ProductCard from '../../components/ProductCard';
import { useToast } from '../context/ToastContext';

import { useShopping } from './hooks/useShopping';
import ProductDetail from './ProductDetail';
import CartView from './components/CartView';
import { useProducts } from './hooks/useProducts';
import PanelSuperior from './components/PanelSuperior';
import ProductGrid from './components/ProductGrid';
import { etiquetas, estilosEtiquetas } from './etiquetas';

// import BottomNav from "./BottomNav";
import { Product } from './types';
import Modal from './components/Modal';
import ProductSuggestionList from './components/ProductSuggestionList';

export default function HomePage() {
  // Ref para la grilla de productos
  const gridRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { cart, addToCart, cartCount } = useShopping();

  const {
    products,
    filteredProducts,
    activeCategory,
    setActiveCategory,
    popularProducts,
    searchProducts,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'popular' | 'cart' | 'profile'>('home');
  const { showToast } = useToast();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleAddToCart = (item: {
    product: Product;
    quantity: number;
    size: string;
    color: string;
  }) => {
    addToCart(item.product, item.quantity, item.size, item.color);
    showToast('Agregado al carrito');
  };

  const favProducts = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  // Array de ids para ProductGrid
  const favoriteIds = favProducts.map((f) => f.id);
  // handleFavorite ahora recibe Product
  const handleFavorite = (product: Product) => {
    toggleFavorite(product);
    const isFav = favProducts.some((f) => f.id === product.id);
    showToast(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

  const productToShow: Product | null = selectedProduct
    ? products.find((p: Product) => p.id === selectedProduct) || null
    : null;

  return (
    <div>
      <PanelSuperior pageTitle="Dozur Shop" />
      <Modal open={showNotifications} onClose={() => setShowNotifications(false)} side>
        <h2 style={{ color: '#b5ff00', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
          Notificaciones
        </h2>
        <div style={{ color: '#fff', fontSize: 16 }}>No tienes notificaciones nuevas</div>
      </Modal>
      <Modal open={showSearchModal} onClose={() => setShowSearchModal(false)}>
        <h2 style={{ color: '#b5ff00', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
          Buscar productos
        </h2>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #333',
            backgroundColor: '#222',
            color: '#fff',
            fontSize: 16,
            marginBottom: 16,
          }}
        />
        <ProductSuggestionList
          products={searchProducts(searchValue)}
          onSelect={(id) => {
            setSelectedProduct(String(id));
            setShowSearchModal(false);
          }}
        />
      </Modal>

      <div
        className="bg-white min-h-screen text-black"
        style={{
          minHeight: '100vh',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          padding: 0,
          margin: 0,
        }}
      >
        {activeTab === 'home' && (
          <>
            <BannerPublicitario />
            {/* Etiqueta Populares */}
            <div style={{ fontWeight: 700, fontSize: 20, margin: '18px 0 8px 8px', color: '#111' }}>
              Populares
            </div>
            {/* Carrusel de productos populares */}
            <div
              style={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingBottom: 12,
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'inline-flex', gap: 16 }}>
                {popularProducts.map((product) => (
                  <div key={product.id} style={{ minWidth: 220, maxWidth: 240 }}>
                    <ProductCard
                      product={product}
                      onFavorite={handleFavorite}
                      isFavorite={favProducts.some((f) => f.id === product.id)}
                      onProductClick={() => router.push(`/product/${product.slug ?? product.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Etiquetas de categorías como iconos en círculo (selección individual, separación y vibración) */}
            {/* Etiquetas de categorías (editable en etiquetas.ts) */}
            {/* Etiquetas de categorías (solo icono, colores configurables en etiquetas.ts) */}
            <div
              className="w-full overflow-x-auto scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', paddingLeft: 18, marginBottom: 8 }}
            >
              <div className="flex flex-nowrap py-2" style={{ gap: 24 }}>
                {etiquetas.map(({ icon, categoria, descripcion }) => {
                  // Solo una categoría puede estar activa a la vez
                  const isActive = activeCategory === categoria;
                  return (
                    <button
                      key={categoria}
                      className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] p-0 rounded-full ${
                        isActive
                          ? `${estilosEtiquetas.colores.activo.bg} ${estilosEtiquetas.colores.activo.text} ${estilosEtiquetas.colores.activo.border} scale-105`
                          : `${estilosEtiquetas.colores.inactivo.bg} ${estilosEtiquetas.colores.inactivo.text} ${estilosEtiquetas.colores.inactivo.border}`
                      } shadow ${estilosEtiquetas.colores.hover} transition-transform duration-200 transform hover:scale-110 focus:outline-none`}
                      onClick={() => {
                        if (!isActive) {
                          if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
                            window.navigator.vibrate(30);
                          }
                          setActiveCategory(categoria);
                          // Scroll suave a la grilla de productos
                          setTimeout(() => {
                            if (gridRef.current) {
                              gridRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              });
                            }
                          }, 80); // Pequeño delay para UX
                        }
                      }}
                      title={descripcion}
                      style={{ flex: '0 0 auto' }}
                    >
                      <span
                        className={`${isActive ? estilosEtiquetas.icono.activo : estilosEtiquetas.icono.inactivo} mb-1`}
                      >
                        {icon && typeof icon === 'function' ? React.createElement(icon) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Productos en grilla */}
            <div ref={gridRef} />
            <ProductGrid
              products={filteredProducts}
              favorites={favoriteIds}
              onProductClick={(id) => router.push(`/product/${id}`)}
              onFavorite={handleFavorite}
              ProductCardComponent={ProductCard}
            />
          </>
        )}
        {activeTab === 'popular' && (
          <ProductGrid
            products={popularProducts}
            favorites={favoriteIds}
            onProductClick={(id) => router.push(`/product/${id}`)}
            onFavorite={handleFavorite}
            title="Productos Populares"
            ProductCardComponent={ProductCard}
          />
        )}
        {activeTab === 'cart' && (
          <CartView cart={cart} onUpdateQuantity={() => {}} onClose={() => setActiveTab('home')} />
        )}
      </div>
      {/* BottomNav eliminado por falta de implementación */}
    </div>
  );
}
