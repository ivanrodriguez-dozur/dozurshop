'use client'

import { useGamificationStore } from '@/store/gamificationStore'

interface ProfileHeaderProps {
  user: {
    name: string
    avatar?: string
    joinDate: string
  }
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: gameUser, getXpForNextLevel, getRankInfo } = useGamificationStore()
  const rankInfo = getRankInfo()
  const xpForNext = getXpForNextLevel()
  const progressPercentage = ((gameUser.totalXp % 1000) / 1000) * 100

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-6 mb-6 hover:shadow-2xl transition-all duration-500">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" />
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          {/* Avatar y datos básicos */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl border-4 border-white/20 hover:scale-105 transition-transform duration-300">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {/* Badge de nivel */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                LV.{gameUser.level}
              </div>
            </div>
            
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-1 drop-shadow-lg">
                {user.name}
              </h1>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/30">
                  {rankInfo.name}
                </span>
                <span className="text-white/70 text-sm">
                  Miembro desde {user.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats principales */}
          <div className="text-right text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl font-bold text-yellow-300 animate-pulse">
                  {gameUser.coins.toLocaleString()}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wide">
                  Monedas
                </div>
              </div>
              <div className="text-center bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-300">
                  {gameUser.totalXp.toLocaleString()}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wide">
                  XP Total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso de nivel */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-semibold text-sm">
              Progreso del Nivel {gameUser.level}
            </span>
            <span className="text-white/80 text-sm">
              {gameUser.totalXp % 1000} / 1000 XP
            </span>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Efecto brillante */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-center mt-2">
            <span className="text-xs text-white/70">
              {xpForNext > 0 ? `${xpForNext} XP para el siguiente nivel` : '¡Nivel máximo alcanzado!'}
            </span>
          </div>
        </div>

        {/* Efectos decorativos */}
        <div className="absolute top-6 right-6 animate-bounce">
          <span className="text-yellow-400 text-2xl drop-shadow-lg">✨</span>
        </div>
        <div className="absolute top-12 left-24 animate-pulse">
          <span className="text-blue-300 text-lg drop-shadow-lg">💎</span>
        </div>
        <div className="absolute bottom-6 right-12 animate-ping">
          <span className="text-purple-300 text-sm drop-shadow-lg">⭐</span>
        </div>
      </div>
    </div>
  )
}
