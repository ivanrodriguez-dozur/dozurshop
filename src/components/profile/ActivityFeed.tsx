'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useGamificationStore } from '@/store/gamificationStore'

interface Transaction {
  id: string
  action_type: string
  xp_earned: number
  coins_earned: number
  description: string
  created_at: string
}

export default function ActivityFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'xp' | 'coins'>('all')
  const { user } = useGamificationStore()

  useEffect(() => {
    loadTransactions()
  }, [user.id])

  const loadTransactions = async () => {
    if (!user.id) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'xp') return transaction.xp_earned > 0
    if (filter === 'coins') return transaction.coins_earned !== 0
    return true
  })

  const getActivityIcon = (actionType: string) => {
    const icons = {
      'like': '❤️',
      'comment': '💬',
      'share': '📤',
      'game_win': '🏆',
      'purchase': '🛒',
      'daily_login': '📅',
      'achievement': '🎖️',
      'level_up': '⬆️',
      'registro': '🎉',
      'default': '✨'
    }
    return icons[actionType] || icons.default
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <motion.span 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🎯
            </motion.span>
            <span>Actividad Reciente</span>
          </h2>
          
          {/* Filtros */}
          <div className="flex space-x-2">
            {['all', 'xp', 'coins'].map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterType === 'all' ? 'Todo' : filterType === 'xp' ? 'XP' : 'Coins'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <motion.div 
              className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <motion.div 
            className="text-center p-8 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-4xl block mb-2">🎮</span>
            <p>¡Empieza a interactuar para ver tu actividad!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="p-4 space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {/* Icono de actividad */}
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white"
                    whileHover={{ rotate: 10 }}
                  >
                    <span className="text-lg">
                      {getActivityIcon(transaction.action_type)}
                    </span>
                  </motion.div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{getTimeAgo(transaction.created_at)}</span>
                      {transaction.xp_earned > 0 && (
                        <motion.span 
                          className="flex items-center space-x-1 text-blue-600"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span>⚡</span>
                          <span>+{transaction.xp_earned}</span>
                        </motion.span>
                      )}
                      {transaction.coins_earned !== 0 && (
                        <motion.span 
                          className={`flex items-center space-x-1 ${
                            transaction.coins_earned > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span>🪙</span>
                          <span>{transaction.coins_earned > 0 ? '+' : ''}{transaction.coins_earned}</span>
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Indicador de ganancia */}
                  {(transaction.xp_earned > 0 || transaction.coins_earned > 0) && (
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div 
        className="bg-gray-50 p-4 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredTransactions.length} actividades {filter !== 'all' ? `(${filter})` : ''}
          </span>
          <motion.button 
            onClick={loadTransactions}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Actualizar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
