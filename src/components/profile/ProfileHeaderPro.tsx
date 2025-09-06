'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { useGamificationStore } from '@/store/gamificationStore'

export default function ProfileHeaderPro() {
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
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-32 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="absolute inset-0 bg-black/20" />
        <button className="absolute top-4 right-4 p-2 bg-black/30 rounded-lg backdrop-blur-sm hover:bg-black/50 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="relative -mt-12 mb-4">
          <motion.div 
            className="relative inline-block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center border-4 border-gray-900 shadow-xl">
              {gameUser?.avatar ? (
                <img 
                  src={gameUser.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-white">
                  {gameUser?.name?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </motion.div>
          
          {/* Live Badge - Style TikTok */}
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded-full text-xs font-medium text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <motion.h1 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {gameUser?.name || 'Usuario'}
              </motion.h1>
              <button className="p-1 hover:bg-gray-800 rounded">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            
            {/* Rank Badge - Profesional */}
            <div className="inline-flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg mb-2">
              <span className="text-sm">{rankInfo.icon}</span>
              <span className="text-sm font-medium text-gray-300">{rankInfo.name}</span>
              <span className="text-xs text-gray-500">Nivel {gameUser?.level || 1}</span>
            </div>
            
            {/* Bio/Description */}
            <p className="text-sm text-gray-400 mb-2">
              Miembro desde hace 2 meses • Comprador activo
            </p>
          </div>
        </div>

        {/* Stats Row - Modern Style */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* XP */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-3 text-center hover:bg-gray-800/70 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg font-bold text-blue-400">
              {(gameUser?.totalXp || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">XP</div>
          </motion.div>
          
          {/* Coins */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-3 text-center hover:bg-gray-800/70 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg font-bold text-yellow-400">
              {(gameUser?.totalCoins || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Coins</div>
          </motion.div>
          
          {/* Streak */}
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-3 text-center hover:bg-gray-800/70 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg font-bold text-orange-400">
              {gameUser?.dailyStreak || 0}
            </div>
            <div className="text-xs text-gray-400">Racha</div>
          </motion.div>
        </div>

        {/* Level Progress - Clean Design */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Próximo Nivel {(gameUser?.level || 1) + 1}
            </span>
            <span className="text-sm text-gray-500">
              {xpForNext} XP restantes
            </span>
          </div>
          
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                 style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) ${progressPercentage/2}%, transparent ${progressPercentage}%)` }} 
            />
          </div>
          
          {/* Progress percentage */}
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar Perfil</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  )
}
