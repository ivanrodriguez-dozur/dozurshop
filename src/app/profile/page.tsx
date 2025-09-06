"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import StatsGridProGarmin from '@/components/profile/StatsGridProGarmin';
import { useGamificationStore } from '@/store/gamificationStore';

export default function ProfilePage() {
  const { 
    loadUserData, 
    isLoading, 
    user, 
    updateProfile, 
    uploadCoverPhoto, 
    uploadProfilePhoto,
    signIn,
    signUp,
    signOut
  } = useGamificationStore();
  
  console.log('ProfilePage renderizado. Estado del usuario:', user)
  console.log('isLoading:', isLoading)
  console.log('Funciones disponibles:', { signIn: !!signIn, signUp: !!signUp, signOut: !!signOut })
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [tempValues, setTempValues] = useState({
    name: '',
    bio: '',
    email: '',
    phone: ''
  });
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  
  // Log cuando cambie authMode
  useEffect(() => {
    console.log('🎯 authMode cambió a:', authMode)
  }, [authMode])

  useEffect(() => {
    console.log('useEffect ejecutado, cargando datos del usuario...')
    loadUserData();
    
    // Test completo de conexión a Supabase
    import('@/lib/testSupabase').then(({ testSupabaseConnection }) => {
      testSupabaseConnection().then(result => {
        console.log('Resultado del test de Supabase:', result)
      })
    })
  }, [loadUserData]);

  useEffect(() => {
    if (user) {
      setTempValues({
        name: user.name || 'Usuario',
        bio: user.bio || 'Agregar descripción...',
        email: user.email || '',
        phone: user.phone || ''
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

  const saveEdit = async (field: string) => {
    const updates: any = {};
    updates[field] = tempValues[field as keyof typeof tempValues];
    
    const result = await updateProfile(updates);
    if (result.success) {
      setIsEditing(prev => ({ ...prev, [field]: false }));
    } else {
      alert('Error al guardar: ' + result.error);
    }
  };

  const handleFileUpload = async (file: File, type: 'cover' | 'avatar') => {
    if (type === 'cover') {
      const result = await uploadCoverPhoto(file);
      if (!result.success) {
        alert('Error al subir imagen: ' + result.error);
      }
    } else {
      const result = await uploadProfilePhoto(file);
      if (!result.success) {
        alert('Error al subir imagen: ' + result.error);
      }
    }
  };

  const handleAuth = async (mode: 'login' | 'register') => {
    console.log('🚀 handleAuth ejecutado con modo:', mode)
    console.log('📝 Datos del formulario:', authForm)
    
    // Validación básica
    if (!authForm.email || !authForm.password) {
      alert('Por favor completa todos los campos')
      return
    }
    
    if (mode === 'register' && !authForm.name) {
      alert('Por favor ingresa tu nombre')
      return
    }
    
    setAuthLoading(true)
    let result;
    
    try {
      if (mode === 'login') {
        console.log('🔑 Ejecutando signIn...')
        result = await signIn(authForm.email, authForm.password);
      } else {
        console.log('📝 Ejecutando signUp...')
        result = await signUp(authForm.email, authForm.password, authForm.name);
      }
      
      console.log('📊 Resultado de autenticación:', result)
      
      if (result.success) {
        console.log('✅ Autenticación exitosa, limpiando formulario...')
        setAuthMode(null);
        setAuthForm({ email: '', password: '', name: '' });
        
        if (result.message) {
          alert(result.message)
        }
      } else {
        console.error('❌ Error en autenticación:', result.error)
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('💥 Error capturado en handleAuth:', error)
      alert('Error inesperado: ' + error);
    }
    
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
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

  // Si no está autenticado, mostrar botones de auth
  if (!user?.isAuthenticated) {
    console.log('🔍 Renderizando pantalla de no autenticado')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Modal de autenticación */}
        {authMode && (
          <>
            {/* Overlay para bloquear otros elementos */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 10000 }} onClick={() => setAuthMode(null)}></div>
            <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none" style={{ zIndex: 10001 }}>
              <div className="bg-white rounded-xl p-6 w-full max-w-md pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                
                <div className="space-y-4">
                  {authMode === 'register' && (
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={authForm.name}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  )}
                  
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        console.log('🎯 Botón del modal clickeado con modo:', authMode)
                        handleAuth(authMode)
                      }}
                      disabled={authLoading}
                      className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {authLoading ? 'Cargando...' : authMode === 'login' ? 'Entrar' : 'Registrarse'}
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('❌ Botón cancelar clickeado')
                        setAuthMode(null)
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                  
                  <p className="text-center text-sm text-gray-600">
                    {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                      onClick={() => {
                        console.log('🔄 Cambiando modo de auth')
                        setAuthMode(authMode === 'login' ? 'register' : 'login')
                      }}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      {authMode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pantalla de bienvenida cuando no hay modal */}
        {!authMode && (
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Bienvenido a DozurShop</h1>
            <p className="text-gray-600 mb-8">Para acceder a tu perfil y funciones de gamificación, necesitas iniciar sesión</p>
            
            <div className="space-y-4">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🔴 Botón Iniciar Sesión clickeado - EVENTO CAPTURADO')
                  setAuthMode('login')
                }}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
                style={{ zIndex: 1000, position: 'relative' }}
              >
                Iniciar Sesión
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🟢 Botón Crear Cuenta clickeado - EVENTO CAPTURADO')
                  setAuthMode('register')
                }}
                className="w-full border border-blue-600 text-blue-600 p-3 rounded-lg font-medium hover:bg-blue-50 cursor-pointer"
                style={{ zIndex: 1000, position: 'relative' }}
              >
                Crear Cuenta
              </button>
            </div>
            
            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-400">
              Debug: authMode = {authMode || 'null'}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Foto de portada editable */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
        {user?.coverPhoto && (
          <img 
            src={user.coverPhoto} 
            alt="Portada" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        {user?.isAuthenticated && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleSignOut}
              className="bg-red-500/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-500/30 transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            
            <label className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'cover');
                }}
                className="hidden"
              />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </label>
          </div>
        )}
      </div>

      {/* Foto de perfil centrada */}
      <div className="relative -mt-16 flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Perfil" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          {user?.isAuthenticated && (
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'avatar');
                }}
                className="hidden"
              />
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </label>
          )}
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
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-gray-800">{user?.name || 'Usuario'}</span>
            {user?.isAuthenticated && (
              <button 
                onClick={() => toggleEdit('name')}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Información de contacto editable */}
      {user?.isAuthenticated && (
        <div className="mt-4 px-4 space-y-2">
          {/* Email */}
          <div className="text-center">
            {isEditing.email ? (
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="email"
                  value={tempValues.email}
                  onChange={(e) => setTempValues(prev => ({ ...prev, email: e.target.value }))}
                  className="text-sm text-gray-600 bg-transparent border-b border-gray-300 text-center focus:outline-none focus:border-blue-500"
                  placeholder="Correo electrónico"
                />
                <button 
                  onClick={() => saveEdit('email')}
                  className="text-green-600 hover:text-green-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => toggleEdit('email')}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span>{user?.email || 'Agregar correo'}</span>
              </button>
            )}
          </div>

          {/* Teléfono */}
          <div className="text-center">
            {isEditing.phone ? (
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="tel"
                  value={tempValues.phone}
                  onChange={(e) => setTempValues(prev => ({ ...prev, phone: e.target.value }))}
                  className="text-sm text-gray-600 bg-transparent border-b border-gray-300 text-center focus:outline-none focus:border-blue-500"
                  placeholder="Número de teléfono"
                />
                <button 
                  onClick={() => saveEdit('phone')}
                  className="text-green-600 hover:text-green-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => toggleEdit('phone')}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{user?.phone || 'Agregar teléfono'}</span>
              </button>
            )}
          </div>
        </div>
      )}

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
                Wallet & Información Personal
              </h3>
              
              {/* Botones de autenticación si no está logueado */}
              {!user?.isAuthenticated && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                  <h4 className="font-medium text-blue-800 mb-3 text-center">
                    🔐 Acceso Requerido
                  </h4>
                  <p className="text-sm text-blue-600 text-center mb-4">
                    Inicia sesión o crea una cuenta para acceder a tu wallet
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setAuthMode('login')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => setAuthMode('register')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              )}
              
              {/* Botón de cerrar sesión si está logueado */}
              {user?.isAuthenticated && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Sesión Activa</h4>
                      <p className="text-sm text-red-600">Conectado como {user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                {/* Información personal oculta/privada */}
                {user?.isAuthenticated && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Información Personal Privada
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">🔒 Privado</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-700">Nombre</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{user?.name || 'No definido'}</span>
                          <button 
                            onClick={() => toggleEdit('name')}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-700">Email</span>
                        <div className="flex items-center space-x-2">
                          {isEditing.email ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="email"
                                value={tempValues.email}
                                onChange={(e) => setTempValues(prev => ({ ...prev, email: e.target.value }))}
                                className="text-sm text-gray-600 bg-transparent border-b border-blue-500 focus:outline-none"
                              />
                              <button onClick={() => saveEdit('email')} className="text-green-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-gray-600">••••••@••••.com</span>
                              <button 
                                onClick={() => toggleEdit('email')}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-700">Teléfono</span>
                        <div className="flex items-center space-x-2">
                          {isEditing.phone ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="tel"
                                value={tempValues.phone}
                                onChange={(e) => setTempValues(prev => ({ ...prev, phone: e.target.value }))}
                                className="text-sm text-gray-600 bg-transparent border-b border-blue-500 focus:outline-none"
                              />
                              <button onClick={() => saveEdit('phone')} className="text-green-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm text-gray-600">••• ••• ••••</span>
                              <button 
                                onClick={() => toggleEdit('phone')}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Métodos de pago */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Métodos de Pago
                  </h4>
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
                
                {/* Direcciones */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Direcciones
                  </h4>
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
                
                {/* Balance de coins */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <span className="text-yellow-600 mr-2">🪙</span>
                    Balance de Coins
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{user?.totalCoins || 0}</div>
                    <div className="text-sm text-gray-600">Coins disponibles</div>
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

      <div className="h-20"></div>
    </div>
  );
}