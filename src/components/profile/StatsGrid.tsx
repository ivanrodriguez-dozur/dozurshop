'use client'

import { motion } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'

export default function StatsGrid() {
  const { user, getMultiplier } = useGamificationStore()
  const multiplier = getMultiplier()

  const stats = [
    {
      label: 'XP Total',
      value: user.totalXp.toLocaleString(),
      icon: '⚡',
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Coins',
      value: user.totalCoins.toLocaleString(),
      icon: '🪙',
      color: 'from-yellow-500 to-orange-500',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Nivel Actual',
      value: user.level.toString(),
      icon: '🎯',
      color: 'from-purple-500 to-pink-500',
      change: 'Nivel máximo',
      trend: 'stable'
    },
    {
      label: 'Multiplicador',
      value: `${multiplier}x`,
      icon: '🚀',
      color: 'from-green-500 to-teal-500',
      change: `Rango ${user.rank}`,
      trend: 'up'
    },
    {
      label: 'Racha Diaria',
      value: `${user.dailyStreak} días`,
      icon: '🔥',
      color: 'from-orange-500 to-red-500',
      change: user.dailyStreak > 0 ? '+1 día' : 'Inactivo',
      trend: user.dailyStreak > 0 ? 'up' : 'down'
    },
    {
      label: 'Actividad',
      value: 'Hoy',
      icon: '📅',
      color: 'from-indigo-500 to-purple-500',
      change: 'Último acceso',
      trend: 'stable'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div 
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        📊 Estadísticas Detalladas
      </motion.h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden"
          >
            {/* Carta principal */}
            <div className={`relative bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
              {/* Efectos de fondo */}
              <div className="absolute inset-0 bg-black/10" />
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />

              <div className="relative z-10">
                {/* Header con icono */}
                <div className="flex items-center justify-between mb-3">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    {stat.icon}
                  </motion.span>
                  
                  {/* Indicador de tendencia */}
                  <div className="flex items-center space-x-1">
                    {stat.trend === 'up' && (
                      <motion.span 
                        className="text-green-300 text-xs"
                        animate={{ y: [-2, 0, -2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ↗️
                      </motion.span>
                    )}
                    {stat.trend === 'down' && (
                      <span className="text-red-300 text-xs">↘️</span>
                    )}
                    {stat.trend === 'stable' && (
                      <span className="text-gray-300 text-xs">➡️</span>
                    )}
                  </div>
                </div>

                {/* Valor principal */}
                <motion.div 
                  className="mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  <span className="text-2xl font-bold block leading-tight">
                    {stat.value}
                  </span>
                </motion.div>

                {/* Label y cambio */}
                <div>
                  <span className="text-sm font-medium text-white/90 block">
                    {stat.label}
                  </span>
                  <span className="text-xs text-white/70">
                    {stat.change}
                  </span>
                </div>
              </div>

              {/* Efecto de brillo al hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
                whileHover={{ 
                  opacity: 1,
                  x: [-100, 100],
                  transition: { duration: 0.6 }
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen de rendimiento */}
      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              🎯 Rendimiento General
            </h3>
            <p className="text-sm text-gray-600">
              Estás en el rango <strong>{user.rank}</strong> con un multiplicador de <strong>{multiplier}x</strong>
            </p>
          </div>
          
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {Math.round((user.level / 10) * 100)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                Score Global
              </div>
              <div className="text-xs text-gray-500">
                Top {Math.round(Math.random() * 20 + 5)}%
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
