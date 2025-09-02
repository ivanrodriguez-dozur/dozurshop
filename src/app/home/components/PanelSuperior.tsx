'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

import { buildSupabasePublicUrl } from '@/lib/resolveImageUrl';
import { useProducts } from '@/app/home/hooks/useProducts';


function PanelSuperior(props) {
  // Marcar todas como leídas al abrir el modal de notificaciones
  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };
  // Declarar todos los useState y hooks primero
  const [searchValue, setSearchValue] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: '¡Oferta especial en zapatillas!', leida: false },
    { id: 2, text: 'Nuevo producto: Camiseta deportiva', leida: false },
    { id: 3, text: 'Tu pedido ha sido enviado', leida: false },
  ]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [showAvatarAnim, setShowAvatarAnim] = React.useState(false);
  const [avatarIndex, setAvatarIndex] = React.useState(0);
  const avatars = [
    '/assets/avatar1.png',
    '/assets/avatar2.png',
    '/assets/avatar3.png',
    '/assets/avatar4.png',
    '/assets/avatar5.png',
  ];

  // Hooks externos
  const router = useRouter();
  const { products = [], popularProducts = [] } = useProducts
    ? useProducts()
    : { products: [], popularProducts: [] };

  // Lógica que depende de los estados
  const recomendados = products.slice(0, 4);
  const filteredSuggestions = searchValue
    ? products.filter((p) => p.name && p.name.toLowerCase().includes(searchValue.toLowerCase()))
    : [];



  return (
    <>
      {showCelebration && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Confetti SVGs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => {
              const left = Math.random() * 100;
              const top = Math.random() * 80;
              const size = 24 + Math.random() * 16;
              const rotate = Math.random() * 360;
              const color = `hsl(${Math.random() * 360},90%,60%)`;
              return (
                <svg
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: size,
                    height: size,
                    transform: `rotate(${rotate}deg)`,
                  }}
                  viewBox="0 0 32 32"
                >
                  <circle cx="16" cy="16" r="12" fill={color} opacity="0.8" />
                  <text
                    x="16"
                    y="21"
                    textAnchor="middle"
                    fontSize="18"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    ★
                  </text>
                </svg>
              );
            })}
          </div>
          {/* Avatar animado */}
          {showAvatarAnim && (
            <div
              className="fixed left-1/2 top-1/2 z-[10000] flex items-center justify-center"
              style={{ transform: 'translate(-50%,-50%)' }}
            >
              <img
                src={avatars[avatarIndex]}
                alt="avatar"
                className="animate-grow-disappear border-4 border-yellow-400 rounded-full shadow-2xl"
                style={{ width: 80, height: 80, background: '#fff' }}
              />
            </div>
          )}
        </div>
      )}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
      >
        {/* Nombre de la página editable */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg" style={{ color: '#000000ff' }}>
            {props.pageTitle}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          {/* Lupa de búsqueda */}
          <button
            aria-label="Buscar"
            onClick={() => setShowSearch(true)}
            className="relative focus:outline-neon cursor-pointer"
          >
            <FaSearch className="w-6 h-6" style={{ color: '#000000ff' }} />
          </button>
          {/* Campana de notificaciones con contador */}
          <button
            aria-label="Notificaciones"
            onClick={handleOpenNotifications}
            className="relative focus:outline-neon cursor-pointer"
          >
            <FaBell className="w-6 h-6" style={{ color: '#000000ff' }} />
            {notifications.some((n) => !n.leida) && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {notifications.filter((n) => !n.leida).length}
              </span>
            )}
          </button>
        </div>
        {/* Modal de búsqueda con sugerencias, recomendados y populares */}
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 w-screen h-screen">
            <div className="absolute inset-0 z-40" onClick={() => setShowSearch(false)} />
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-50"
              style={{ maxHeight: 'calc(100dvh - 110px)', marginBottom: 80, overflowY: 'auto' }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setShowSearch(false)}
                aria-label="Cerrar búsqueda"
              >
                ×
              </button>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Buscar productos, marcas, etc."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  autoFocus
                />
              </div>
              {/* Resultados por nombre */}
              <div className="flex flex-col gap-2 mb-4">
                {searchValue && filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((p) => (
                    <button
                      key={p.id}
                      className="text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 flex items-center gap-2"
                      onClick={() => {
                        setShowSearch(false);
                        router.push(`/product/${p.slug ?? p.id}`);
                      }}
                    >
                      <Image
                        src={buildSupabasePublicUrl(p.image_url)}
                        alt={p.name}
                        width={32}
                        height={32}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                      <span>{p.name}</span>
                    </button>
                  ))
                ) : searchValue ? (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No se encontraron resultados
                  </div>
                ) : null}
              </div>
              {/* Recomendados */}
              <div className="mb-2 mt-2">
                <div className="font-semibold text-gray-700 mb-2">Recomendados</div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {recomendados.map((p) => (
                    <div
                      key={p.id}
                      className="flex-shrink-0 cursor-pointer"
                      style={{ width: 90 }}
                      onClick={() => {
                        setShowSearch(false);
                        router.push(`/product/${p.slug ?? p.id}`);
                      }}
                    >
                      <Image
                        src={buildSupabasePublicUrl(p.image_url)}
                        alt={p.name}
                        width={80}
                        height={80}
                        style={{ borderRadius: 12, objectFit: 'cover', margin: '0 auto' }}
                      />
                      <div className="text-xs text-center mt-1 text-gray-800">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Populares */}
              <div className="mb-2 mt-2">
                <div className="font-semibold text-gray-700 mb-2">Populares</div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {popularProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex-shrink-0 cursor-pointer"
                      style={{ width: 90 }}
                      onClick={() => {
                        setShowSearch(false);
                        router.push(`/product/${p.slug ?? p.id}`);
                      }}
                    >
                      <Image
                        src={buildSupabasePublicUrl(p.image_url)}
                        alt={p.name}
                        width={80}
                        height={80}
                        style={{ borderRadius: 12, objectFit: 'cover', margin: '0 auto' }}
                      />
                      <div className="text-xs text-center mt-1 text-gray-800">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal de notificaciones */}
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 w-screen h-screen">
            <div className="absolute inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-50"
              style={{ maxHeight: 'calc(100dvh - 110px)', marginBottom: 80, overflowY: 'auto' }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                onClick={() => setShowNotifications(false)}
                aria-label="Cerrar notificaciones"
              >
                ×
              </button>
              <div className="mb-4 font-semibold text-lg text-gray-800">Notificaciones</div>
              <ul className="space-y-3">
                {notifications.length === 0 ? (
                  <li className="text-gray-400 text-sm text-center py-4">
                    No tienes notificaciones
                  </li>
                ) : (
                  notifications.map((n) => (
                    <li
                      key={n.id}
                      className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700 shadow-sm"
                    >
                      {n.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
  /* Animaciones CSS sugeridas (agrega en tu CSS global):
	.animate-confetti { animation: confetti-fall 1.2s linear forwards; }
	@keyframes confetti-fall { 0% { opacity:1; transform:translateY(-40px) scale(1);} 100% { opacity:0; transform:translateY(120vh) scale(1.2);} }
	.animate-grow-disappear { animation: grow-disappear 1.2s cubic-bezier(.7,1.7,.7,1) forwards; }
	@keyframes grow-disappear { 0% { transform:scale(1);} 80% { transform:scale(2.5);} 100% { opacity:0; transform:scale(3);} }
	*/
}

export default PanelSuperior;
