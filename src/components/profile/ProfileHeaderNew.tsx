'use client'

import { motion } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'
import { FaCamera, FaEdit, FaTrophy, FaCoins, FaFire, FaStar, FaChartLine } from 'react-icons/fa'
import { useState } from 'react'

export default function ProfileHeader() {
  const { user: gameUser, getRankInfo, getXpForNextLevel } = useGamificationStore()
  const rankInfo = getRankInfo()
  const xpForNext = getXpForNextLevel()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [isEditingCover, setIsEditingCover] = useState(false)
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  
  // Calcular progreso del nivel actual
  const currentLevelXp = ((gameUser?.level || 1) - 1) * 1000
  const nextLevelXp = (gameUser?.level || 1) * 1000
  const progressXp = (gameUser?.totalXp || 0) - currentLevelXp
  const progressPercentage = Math.min((progressXp / 1000) * 100, 100)

  if (!gameUser?.name) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="h-56 bg-gray-200 rounded-t-xl"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Imagen de Portada - Más ancha y que baje más */}
      <div className="relative h-56 group">
        <div className="w-full h-full bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900">
          {/* Overlay para oscurecer la imagen */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Botón para editar portada */}
          <motion.button
            className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditingCover(true)}
          >
            <FaCamera className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="relative px-6 pb-6">
        {/* Foto de perfil - Redonda y centrada */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="relative group">
            <motion.div 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                {gameUser?.avatar || gameUser?.name?.[0]?.toUpperCase() || '?'}
              </div>
            </motion.div>
            
            {/* Botón para cambiar foto de perfil */}
            <motion.button
              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditingAvatar(true)}
            >
              <FaCamera className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* Nombre del usuario - Editable */}
        <div className="text-center mb-2">
          {isEditingName ? (
            <input
              type="text"
              defaultValue={gameUser?.name || 'Usuario'}
              className="text-2xl font-bold text-gray-900 text-center bg-transparent border-b-2 border-blue-500 focus:outline-none"
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center group">
              <h1 className="text-2xl font-bold text-gray-900">
                {gameUser?.name || 'Usuario'}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Descripción pequeña - Editable */}
        <div className="text-center mb-6">
          {isEditingBio ? (
            <textarea
              defaultValue={gameUser?.bio || 'Escribe algo sobre ti...'}
              className="w-full text-center text-gray-600 bg-transparent border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 resize-none"
              rows={2}
              onBlur={() => setIsEditingBio(false)}
              autoFocus
            />
          ) : (
            <div className="group">
              <p 
                className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200"
                onClick={() => setIsEditingBio(true)}
              >
                {gameUser?.bio || 'Escribe algo sobre ti...'}
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas: Puntos, Coins, Nivel */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Puntos XP */}
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FaChartLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {(gameUser?.totalXp || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Puntos XP
            </div>
          </motion.div>

          {/* Coins */}
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <FaCoins className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {(gameUser?.totalCoins || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Coins
            </div>
          </motion.div>

          {/* Nivel */}
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <FaTrophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {gameUser?.level || 1}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">
              Nivel
            </div>
          </motion.div>
        </div>

        {/* Barra de progreso del nivel - Dinámica con efectos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso al Nivel {(gameUser?.level || 1) + 1}
            </span>
            <span className="text-sm text-gray-500">
              {progressXp.toLocaleString()} / 1,000 XP
            </span>
          </div>
          
          <div className="relative">
            {/* Fondo de la barra */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              {/* Barra de progreso con gradiente */}
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Efecto brillante */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </motion.div>
            </div>
            
            {/* Indicador de porcentaje */}
            <div className="mt-1 text-right">
              <span className="text-xs text-gray-500">
                {Math.round(progressPercentage)}% completado
              </span>
            </div>
          </div>
        </div>

        {/* Rango actual */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <FaStar className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {rankInfo?.name || 'Novato'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
