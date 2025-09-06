'use client'

import { motion } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'

export default function StatsGridPro() {
  const { user, getMultiplier } = useGamificationStore()
  const multiplier = getMultiplier()

  const stats = [
    {
      label: 'XP Total',
      value: (user?.totalXp || 0).toLocaleString(),
      icon: '📊',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Coins',
      value: (user?.totalCoins || 0).toLocaleString(),
      icon: '💰',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Nivel Actual',
      value: (user?.level || 1).toString(),
      icon: '🎯',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      change: 'Nuevo',
      trend: 'up'
    },
    {
      label: 'Racha Diaria',
      value: `${user?.dailyStreak || 0} días`,
      icon: '🔥',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      change: '+2',
      trend: 'up'
    },
    {
      label: 'Multiplicador',
      value: `${multiplier}x`,
      icon: '⚡',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      change: 'Activo',
      trend: 'up'
    },
    {
      label: 'Rank',
      value: user?.rank || 'Novato',
      icon: '👑',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      change: 'Elite',
      trend: 'up'
    }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Estadísticas</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
          <span>Ver todo</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 rounded-xl border ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer group`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  {stat.trend === 'up' ? (
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>

              {/* Progress Bar (for applicable stats) */}
              {(stat.label === 'XP Total' || stat.label === 'Nivel Actual') && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-${stat.color.split('-')[1]}-400`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              )}

              {/* Action Button */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                  <span>Ver detalles</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Weekly Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Resumen Semanal</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">XP ganados</span>
              <span className="font-medium text-gray-900">+1,240 XP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coins obtenidos</span>
              <span className="font-medium text-gray-900">+320 Coins</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Días activos</span>
              <span className="font-medium text-gray-900">5/7 días</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Objetivos</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Próximo nivel</span>
              <span className="font-medium text-blue-600">76% completado</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Racha objetivo</span>
              <span className="font-medium text-orange-600">30 días</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coins objetivo</span>
              <span className="font-medium text-yellow-600">10,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
