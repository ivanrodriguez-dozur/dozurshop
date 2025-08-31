"use client";

import React, { useEffect, useState } from 'react';
import { Home, Heart, ShoppingCart, Flame, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { useCartStore } from '../store/cart';
import { useFavoritesStore } from '../store/favorites';

const items = [
  { icon: Home, label: 'Home', route: '/home' },
  { icon: Heart, label: 'Favoritos', route: '/favorites' },
  { icon: Flame, label: 'Booms', route: '/booms' },
  { icon: ShoppingCart, label: 'Carrito', route: '/carrito' },
  { icon: User, label: 'Perfil', route: '/profile' },
];

export default function BottomDock() {
  const router = useRouter();
  const pathname = usePathname();
  const { items: cartItems } = useCartStore();
  const { favorites } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Evitamos renderizar contenido dependiente del cliente durante SSR
  if (!mounted) return null;
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const favCount = favorites.length;
  return (
    <nav
      className="fixed left-0 right-0 z-30 flex justify-center pointer-events-none"
      style={{ bottom: 12 }}
    >
      <div
        className="bg-black border border-gray-800 flex justify-around items-center h-16 rounded-full shadow-lg pointer-events-auto"
        style={{
          width: '92%',
          maxWidth: 420,
          minWidth: 260,
          padding: '0 18px',
          gap: 0,
        }}
      >
        {items.map(({ icon: Icon, label, route }) => (
          <button
            key={route}
            aria-label={label}
            onClick={() => router.push(route)}
            className={`flex items-center justify-center focus:outline-neon transition-colors duration-200 rounded-full ${pathname === route ? 'bg-neon' : ''}`}
            style={{
              width: 48,
              height: 48,
              margin: '0 2px',
              background: pathname === route ? '#b5ff00' : 'transparent',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Icon className="w-7 h-7" color={pathname === route ? '#181818' : '#fff'} />
            {label === 'Carrito' && cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  background: '#ff3b3b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #ff3b3b55',
                  padding: '0 6px',
                }}
              >
                {cartCount}
              </span>
            )}
            {label === 'Favoritos' && favCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  background: '#ff3b3b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #ff3b3b55',
                  padding: '0 6px',
                }}
              >
                {favCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
