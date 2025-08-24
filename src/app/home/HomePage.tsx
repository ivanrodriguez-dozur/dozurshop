"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShopping } from "./hooks/useShopping";
import { useFavoritesStore } from '../../store/favorites';
import ProductDetail from './ProductDetail';
import CartView from './components/CartView';
import { useProducts } from "./hooks/useProducts";
import BannerPublicitario from "../../components/BannerPublicitario";
import HeaderAvanzado from "../../components/HeaderAvanzado";
import ProductGrid from "./components/ProductGrid";
import ProductCard from "../../components/ProductCard";
import { suggestedIcons } from "../../components/suggestedIcons";

// Mapeo de key de icono a categoría de producto
const iconKeyToCategory: Record<string, string> = {
  "ver todo": "all",
  "zapatillas": "calzado",
  "camisas": "ropa",
  "pantalonetas": "ropa",
  "medias": "ropa",
  "accesorios": "accesorios"
};
import { useToast } from "../context/ToastContext";
// import BottomNav from "./BottomNav";
import { Product } from './types';
import Modal from './components/Modal';
import ProductSuggestionList from './components/ProductSuggestionList';

export default function HomePage() {
  const router = useRouter();
  const {
    cart,
    addToCart,
    cartCount
  } = useShopping();

  const {
    products,
    filteredProducts,
    activeCategory,
    setActiveCategory,
    popularProducts,
    searchProducts
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'popular' | 'cart' | 'profile'>('home');
  const { showToast } = useToast();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState("");


  const handleAddToCart = (item: { product: Product; quantity: number; size: string; color: string }) => {
    addToCart(item.product, item.quantity, item.size, item.color);
    showToast("Agregado al carrito");
  };

  const favProducts = useFavoritesStore(state => state.favorites);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  // Array de ids para ProductGrid
  const favoriteIds = favProducts.map(f => f.id);
  // handleFavorite ahora recibe Product
  const handleFavorite = (product: Product) => {
    toggleFavorite(product);
    const isFav = favProducts.some(f => f.id === product.id);
    showToast(isFav ? "Eliminado de favoritos" : "Agregado a favoritos");
  };


  const productToShow: Product | null =
    selectedProduct
      ? products.find((p: Product) => p.id === selectedProduct) || null
      : null;

  return (
    <div>
      <HeaderAvanzado pageTitle="Dozur Shop" />
      <Modal open={showNotifications} onClose={() => setShowNotifications(false)} side>
        <h2 style={{ color: '#b5ff00', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Notificaciones</h2>
        <div style={{ color: '#fff', fontSize: 16 }}>No tienes notificaciones nuevas</div>
      </Modal>
      <Modal open={showSearchModal} onClose={() => setShowSearchModal(false)}>
        <h2 style={{ color: '#b5ff00', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Buscar productos</h2>
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

  <div className="bg-white min-h-screen text-black" style={{ minHeight: '100vh', height: '100vh', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', padding: 0, margin: 0 }}>

        {activeTab === 'home' && (
          <>
            <BannerPublicitario />
            {/* Etiqueta Populares */}
            <div style={{ fontWeight: 700, fontSize: 20, margin: '18px 0 8px 8px', color: '#111' }}>Populares</div>
            {/* Carrusel de productos populares */}
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 12, marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', gap: 16 }}>
                {popularProducts.map(product => (
                  <div key={product.id} style={{ minWidth: 220, maxWidth: 240 }}>
                    <ProductCard
                      product={product}
                      onFavorite={handleFavorite}
                      isFavorite={favProducts.some(f => f.id === product.id)}
                      onProductClick={() => router.push(`/product/${product.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Etiquetas de categorías como iconos en círculo */}
            <div style={{
              display: 'flex',
              gap: 24,
              margin: '0 0 18px 0',
              overflowX: 'auto',
              flexWrap: 'nowrap',
              paddingBottom: 4,
            }}
            className="category-tags-row"
            >
              {suggestedIcons.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(iconKeyToCategory[key] || "all")}
                  style={{
                    background: activeCategory === (iconKeyToCategory[key] || "all") ? '#181818' : '#b5ff00',
                    color: activeCategory === (iconKeyToCategory[key] || "all") ? '#b5ff00' : '#181818',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    minWidth: 56,
                    minHeight: 56,
                    maxWidth: 56,
                    maxHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                    boxShadow: activeCategory === (iconKeyToCategory[key] || "all") ? '0 0 0 2px #b5ff00' : 'none',
                    flex: '0 0 auto',
                  }}
                  className="category-icon-btn-pc category-icon-btn-mobile"
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                >
                  {icon && typeof icon === 'function' ? icon({}) : null}
                </button>
              ))}
            </div>
            {/* Productos en grilla */}
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
          <CartView
            cart={cart}
            // onUpdateQuantity={updateCartQuantity}
            onClose={() => setActiveTab('home')}
          />
        )}
      </div>
  {/* BottomNav eliminado por falta de implementación */}
    </div>
  );
}
