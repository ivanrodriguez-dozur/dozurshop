"use client";
import React, { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import Image from "next/image";

/**
 * HeaderAvanzado
 *
 * Este componente muestra:
 * - El nombre de la página (editable, ver prop pageTitle)
 * - Un botón de búsqueda (lupa) que abre un modal con sugerencias y búsqueda inteligente
 * - Un botón de notificaciones (campana) con contador rojo y modal de notificaciones
 *
 * Instrucciones de edición:
 * - Cambia el texto de pageTitle para personalizar el nombre de la página
 * - Modifica el array notifications para cambiar las notificaciones
 * - Modifica el array searchSuggestions para cambiar las sugerencias de búsqueda
 * - Puedes personalizar los estilos y la lógica según tus necesidades
 */
export default function HeaderAvanzado({ pageTitle = "Mi Tienda" }: { pageTitle?: string }) {
  // Notificaciones de ejemplo
  const [notifications, setNotifications] = useState([
    { id: 1, text: "¡Oferta especial en zapatillas!" },
    { id: 2, text: "Nuevo producto: Camiseta deportiva" },
    { id: 3, text: "Tu pedido ha sido enviado" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchSuggestions = [
    "Nike Air Max",
    "Adidas Superstar",
    "Puma Runner",
    "Camiseta Deportiva",
    "Short Running",
    "Medias Pro",
    "Gorra Classic",
  ];
  // Filtrado inteligente de sugerencias
  const filteredSuggestions = searchValue
    ? searchSuggestions.filter(s => s.toLowerCase().includes(searchValue.toLowerCase()))
    : searchSuggestions;

  return (
  <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
      {/* Nombre de la página editable */}
      <div className="flex items-center gap-3">
  <span className="font-bold text-lg" style={{ color: '#000000ff' }}>{pageTitle}</span>
      </div>
  <div className="flex gap-4 items-center">
        {/* Lupa de búsqueda */}
        <button aria-label="Buscar" onClick={() => setShowSearch(true)} className="relative focus:outline-neon">
          <FaSearch className="w-6 h-6" style={{ color: '#000000ff' }} />
        </button>
        {/* Campana de notificaciones con contador */}
        <button aria-label="Notificaciones" onClick={() => setShowNotifications(true)} className="relative focus:outline-neon">
          <FaBell className="w-6 h-6" style={{ color: '#000000ff' }} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {notifications.length}
            </span>
          )}
        </button>
      </div>
      {/* Modal de búsqueda */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 w-screen h-screen">
          <div className="absolute inset-0 z-40" onClick={() => setShowSearch(false)} />
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-50">
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
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    className="text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800"
                    onClick={() => {
                      setSearchValue(s);
                      setShowSearch(false);
                    }}
                  >
                    {s}
                  </button>
                ))
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">No se encontraron resultados</div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal de notificaciones */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 w-screen h-screen">
          <div className="absolute inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-50">
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
                <li className="text-gray-400 text-sm text-center py-4">No tienes notificaciones</li>
              ) : (
                notifications.map(n => (
                  <li key={n.id} className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700 shadow-sm">
                    {n.text}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
