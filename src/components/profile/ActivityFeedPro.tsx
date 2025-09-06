'use client'

import { motion } from 'framer-motion'
import { useGamificationStore } from '@/store/gamificationStore'

export default function ActivityFeedPro() {
  const { getRecentActivities } = useGamificationStore()
  const activities = getRecentActivities ? getRecentActivities() : []

  const mockActivities = [
    {
      id: 1,
      type: 'purchase',
      title: 'Compra realizada',
      description: 'Zapatillas Nike Air Max 270',
      xp: 150,
      coins: 75,
      timestamp: '2 min ago',
      icon: '🛒',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 2,
      type: 'level_up',
      title: 'Subiste de nivel',
      description: '¡Ahora eres nivel 12!',
      xp: 0,
      coins: 100,
      timestamp: '1 hora ago',
      icon: '🎉',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 3,
      type: 'streak',
      title: 'Racha mantenida',
      description: '7 días consecutivos activo',
      xp: 50,
      coins: 25,
      timestamp: '5 horas ago',
      icon: '🔥',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 4,
      type: 'favorite',
      title: 'Producto favorito',
      description: 'Agregaste iPhone 15 Pro a favoritos',
      xp: 10,
      coins: 5,
      timestamp: '1 día ago',
      icon: '❤️',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 5,
      type: 'share',
      title: 'Producto compartido',
      description: 'Compartiste MacBook Air M2',
      xp: 25,
      coins: 10,
      timestamp: '2 días ago',
      icon: '🔗',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ]

  const displayActivities = activities.length > 0 ? activities : mockActivities

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
          <span>Ver todo</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${activity.borderColor} ${activity.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer group`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg ${activity.bgColor} border ${activity.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-lg">{activity.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    
                    {/* Rewards */}
                    <div className="flex items-center space-x-4">
                      {activity.xp > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-blue-600">+{activity.xp} XP</span>
                        </div>
                      )}
                      {activity.coins > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-yellow-600">+{activity.coins} Coins</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <button className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
          <span>Cargar más actividades</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">🛒</span>
            <span className="text-sm font-medium text-gray-700">Comprar</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">❤️</span>
            <span className="text-sm font-medium text-gray-700">Favoritos</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-medium text-gray-700">Compartir</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-lg">💰</span>
            <span className="text-sm font-medium text-gray-700">Recompensas</span>
          </button>
        </div>
      </div>
    </div>
  )
}
