"use client";

import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/store/gamificationStore';
import { motion } from 'framer-motion';
import StatsGridProGarmin from '@/components/profile/StatsGridProGarmin';

export default function ProfilePage() {
  const { loadUserData, isLoading, user, getRankInfo } = useGamificationStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [tempValues, setTempValues] = useState({
    name: '',
    bio: ''
  });
  
  const rankInfo = getRankInfo();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (user) {
      setTempValues({
        name: user.name || 'Usuario',
        bio: user.bio || 'Agregar descripción...'
      });
    }
  }, [user]);

  // Calcular progreso del nivel
  const currentLevelXp = ((user?.level || 1) - 1) * 1000;
  const nextLevelXp = (user?.level || 1) * 1000;
  const levelProgress = Math.min(100, Math.max(0, ((user?.totalXp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100));

  const toggleEdit = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveEdit = (field: string) => {
    // Aquí iría la lógica para guardar en el store/database
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Foto de portada editable */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => toggleEdit('cover')}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Foto de perfil centrada */}
      <div className="relative -mt-16 flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user?.avatar || user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => toggleEdit('avatar')}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nombre editable */}
      <div className="text-center mt-4 px-4">
        {isEditing.name ? (
          <div className="flex items-center justify-center space-x-2">
            <input
              type="text"
              value={tempValues.name}
              onChange={(e) => setTempValues(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 text-center focus:outline-none"
              autoFocus
            />
            <button 
              onClick={() => saveEdit('name')}
              className="text-green-600 hover:text-green-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => toggleEdit('name')}
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {user?.name || 'Usuario'}
          </button>
        )}
      </div>

      {/* Estadísticas básicas en línea */}
      <div className="flex justify-center items-center space-x-8 mt-6 px-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{(user?.totalXp || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Puntos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{(user?.totalCoins || 0).toLocaleString()}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Coins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{user?.level || 1}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Level</div>
        </div>
      </div>

      {/* Barra de progreso animada */}
      <div className="mt-6 px-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Nivel {user?.level || 1} → {(user?.level || 1) + 1}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(levelProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">
            {(nextLevelXp - (user?.totalXp || 0)).toLocaleString()} XP para el siguiente nivel
          </span>
        </div>
      </div>

      {/* Botones de secciones */}
      <div className="flex justify-center space-x-4 mt-8 px-4">
        <button
          onClick={() => toggleSection('stats')}
          className={`flex-1 max-w-[120px] py-3 px-4 rounded-lg font-medium transition-all ${
            activeSection === 'stats'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">📊</span>
            <span className="text-xs">Estadísticas</span>
          </div>
        </button>
        
        <button
          onClick={() => toggleSection('wallet')}
          className={`flex-1 max-w-[120px] py-3 px-4 rounded-lg font-medium transition-all ${
            activeSection === 'wallet'
              ? 'bg-green-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
          }`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">💳</span>
            <span className="text-xs">Wallet</span>
          </div>
        </button>
        
        <button
          onClick={() => toggleSection('shop')}
          className={`flex-1 max-w-[120px] py-3 px-4 rounded-lg font-medium transition-all ${
            activeSection === 'shop'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="flex flex-col items-center space-y-1">
            <span className="text-lg">🛍️</span>
            <span className="text-xs">Shop</span>
          </div>
        </button>
      </div>

      {/* Contenido desplegable */}
      {activeSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6 mx-4 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {activeSection === 'stats' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">📊</span>
                Estadísticas Detalladas
              </h3>
              <StatsGridProGarmin />
            </div>
          )}

          {activeSection === 'wallet' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-green-600 mr-2">💳</span>
                Wallet & Información
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3">Métodos de Pago</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <span className="text-sm">****4532</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Activa</span>
                    </div>
                    <button className="w-full p-3 border-dashed border-2 border-gray-300 rounded text-gray-500 hover:border-green-500">
                      + Agregar tarjeta
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3">Direcciones</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded border">
                      <p className="text-sm font-medium">Casa</p>
                      <p className="text-xs text-gray-600">Calle Example 123</p>
                    </div>
                    <button className="w-full p-3 border-dashed border-2 border-gray-300 rounded text-gray-500 hover:border-green-500">
                      + Agregar dirección
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'shop' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-purple-600 mr-2">🛍️</span>
                Mi Shop
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3">Carrito Actual</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <div>
                        <p className="text-sm font-medium">Producto Demo</p>
                        <p className="text-xs text-gray-600">Qty: 2</p>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">$59.99</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3">Historial</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-white rounded border">
                      <div>
                        <p className="text-sm font-medium">Pedido #12345</p>
                        <p className="text-xs text-gray-600">15 Ago 2024</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="h-20"></div> {/* Espaciado final */}
    </div>
  );
}
