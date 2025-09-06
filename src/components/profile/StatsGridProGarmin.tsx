'use client'

import { motion } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'

export default function StatsGridPro() {
  const { user, getRankInfo } = useGamificationStore()
  const rankInfo = getRankInfo()

  // Calcular progreso del nivel
  const currentLevelXp = ((user?.level || 1) - 1) * 1000
  const nextLevelXp = (user?.level || 1) * 1000
  const levelProgress = ((user?.totalXp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100

  const stats = [
    {
      title: 'Total XP',
      value: (user?.totalXp || 0).toLocaleString(),
      icon: '⚡',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Coins',
      value: (user?.totalCoins || 0).toLocaleString(),
      icon: '🪙',
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Nivel',
      value: (user?.level || 1).toString(),
      icon: '🏆',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Próximo: ' + ((user?.level || 1) + 1),
      changeColor: 'text-purple-600'
    },
    {
      title: 'Racha',
      value: (user?.dailyStreak || 0).toString() + ' días',
      icon: '🔥',
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+2 días',
      changeColor: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <span className={`text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
              <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progreso del nivel - Estilo Garmin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Progreso de Nivel</h3>
          <span className="text-sm text-gray-500">
            Nivel {user?.level || 1} → {(user?.level || 1) + 1}
          </span>
        </div>
        
        {/* Barra de progreso circular estilo Garmin */}
        <div className="relative flex items-center justify-center mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Círculo de fondo */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Círculo de progreso */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 50 * (1 - levelProgress / 100)
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            {/* Gradiente */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Texto central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{Math.round(levelProgress)}%</span>
            <span className="text-xs text-gray-500">Completado</span>
          </div>
        </div>

        {/* Detalles del progreso */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-800">{currentLevelXp.toLocaleString()}</p>
            <p className="text-xs text-gray-500">XP Inicial</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-blue-600">
              {((user?.totalXp || 0) - currentLevelXp).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">XP Actual</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{(nextLevelXp - currentLevelXp).toLocaleString()}</p>
            <p className="text-xs text-gray-500">XP Objetivo</p>
          </div>
        </div>
      </motion.div>

      {/* Rank actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{rankInfo.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-800">Rango Actual</h3>
              <p className={`text-lg font-bold text-${rankInfo.color}-600`}>
                {rankInfo.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Próximo rango en</p>
            <p className="text-lg font-semibold text-gray-800">
              {(nextLevelXp - (user?.totalXp || 0)).toLocaleString()} XP
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
