'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { useGamificationStore } from '@/store/gamificationStore'

export default function ProfileHeader() {
  const { user: gameUser, getXpForNextLevel, getRankInfo } = useGamificationStore()
  const rankInfo = getRankInfo()
  const xpForNext = getXpForNextLevel()
  const progressPercentage = (((gameUser?.totalXp || 0) % 1000) / 1000) * 100
  
  // Return loading state if user data is not available
  if (!gameUser?.name) {
    return (
      <div className="relative bg-gray-900 rounded-2xl p-6 mb-6 animate-pulse">
        <div className="h-48 bg-gray-800 rounded-xl"></div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-6 mb-6"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/20" />
      <motion.div 
        className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360] 
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear" 
        }}
      />
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0] 
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "linear" 
        }}
      />

      <div className="relative z-10">
        {/* Header principal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {gameUser?.avatar || gameUser?.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              {/* Badge de rank */}
              <motion.div 
                className="absolute -top-1 -right-1 text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {rankInfo.icon}
              </motion.div>
            </motion.div>

            {/* Info del usuario */}
            <div>
              <motion.h1 
                className="text-2xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {gameUser?.name || 'Usuario'}
              </motion.h1>
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${rankInfo.color}-500/30 text-white border border-${rankInfo.color}-400/50`}>
                  {rankInfo.name}
                </span>
                <span className="text-white/70 text-sm">
                  Nivel {gameUser?.level || 1}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Stats quick view */}
          <div className="text-right">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Coins */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-lg">🪙</span>
                  <span className="text-lg font-bold text-yellow-300">
                    {(gameUser?.totalCoins || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-white/70">Coins</span>
              </div>

              {/* XP */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="text-lg">⚡</span>
                  <span className="text-lg font-bold text-blue-300">
                    {(gameUser?.totalXp || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-white/70">XP Total</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Barra de progreso de nivel */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white/90">
              Progreso al Nivel {(gameUser?.level || 1) + 1}
            </span>
            <span className="text-sm text-white/70">
              {xpForNext} XP restante
            </span>
          </div>
          
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
            />
            
            {/* Efecto de brillo */}
            <motion.div 
              className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
              animate={{ x: [-32, 300] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut" 
              }}
            />
          </div>
        </motion.div>

        {/* Racha diaria */}
        {(gameUser?.dailyStreak || 0) > 0 && (
          <motion.div 
            className="flex items-center justify-center space-x-2 py-2 px-4 bg-white/10 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="text-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.span>
            <span className="text-white font-semibold">
              Racha de {gameUser?.dailyStreak || 0} días
            </span>
            <span className="text-white/70 text-sm">
              ¡Sigue así!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
