'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

import { useToast } from '@/app/context/ToastContext';
import BannerPublicitario from '@/components/BannerPublicitario';
import { useFavoritesStore } from '@/store/favorites';
import ProductCard from '@/components/ProductCard';

import CartView from './components/CartView';
import PanelSuperior from './components/PanelSuperior';
import Modal from './components/Modal';
import ProductSuggestionList from './components/ProductSuggestionList';
import { useProducts } from './hooks/useProducts';
import { useShopping } from './hooks/useShopping';
import { Product } from './types';

import FeaturedProducts from './sections/FeaturedProducts';
import Booms from './sections/Booms';
import LongVideos from './sections/LongVideos';
import Photos from './sections/Photos';

export default function HomePage() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { cart } = useShopping();

  const {
    filteredProducts,
    activeCategory,
    setActiveCategory,
    popularProducts,
    searchProducts,
  } = useProducts();

  // const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'popular' | 'cart' | 'profile'>('home');
  const { showToast } = useToast();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const favProducts = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const favoriteIds = favProducts.map((f) => f.id);

  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  type Boom = {
    id: string;
    title: string;
    video: string;
    cover: string;
    user: string;
    likes: number;
  };
  type LongVideo = {
    id: string;
    title: string;
    video: string;
    cover: string;
    user: string;
    views: number;
  };
  type Photo = {
    id: string;
    url: string;
    alt?: string;
    user?: string;
  };

  const [boomsArray, setBoomsArray] = useState<Boom[]>([]);
  const [longVideosArray, setLongVideosArray] = useState<LongVideo[]>([]);
  const [photosArray, setPhotosArray] = useState<Photo[]>([]);

  useEffect(() => {
    // Booms
    supabase.from('booms').select('*').then(({ data }) => {
      if (data) setBoomsArray(data as Boom[]);
    });
    // Videos largos
    supabase.from('fulltime').select('*').then(({ data }) => {
      if (data) setLongVideosArray(data as LongVideo[]);
    });
    // Fotos
    supabase.from('gallery').select('*').then(({ data }) => {
      if (data) setPhotosArray(data as Photo[]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFavorite = (product: Product) => {
    toggleFavorite(product);
    const isFav = favProducts.some((f) => f.id === product.id);
    showToast(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
  };

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
          onSelect={() => setShowSearchModal(false)}
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
            <FeaturedProducts
              products={popularProducts}
              onFavorite={handleFavorite}
              isFavorite={(id) => favProducts.some((f) => f.id === id)}
              onProductClick={(product) => router.push(`/product/${product.slug ?? product.id}`)}
            />
            <Booms booms={boomsArray} onSeeAll={() => {}} />
            <LongVideos videos={longVideosArray} onSeeAll={() => {}} />
            <Photos photos={photosArray} onSeeAll={() => {}} />
          </>
        )}
        {activeTab === 'popular' && (
          <ProductGridSection
            products={popularProducts}
            favorites={favoriteIds}
            onProductClick={(id) => router.push(`/product/${id}`)}
            onFavorite={handleFavorite}
            ProductCardComponent={ProductCard}
            gridRef={gridRef}
          />
        )}
        {activeTab === 'cart' && (
          <CartView cart={cart} onUpdateQuantity={() => {}} onClose={() => setActiveTab('home')} />
        )}
      </div>
    </div>
  );
}