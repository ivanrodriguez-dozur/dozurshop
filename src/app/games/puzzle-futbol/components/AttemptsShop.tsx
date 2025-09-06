'use client'

import { useState } from 'react'
import { useCoinsStore } from '@/store/coins'

interface AttemptsShopProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (attempts: number) => void
  currentAttempts: number
  maxAttempts: number
}

const ATTEMPT_PACKAGES = [
  {
    id: 'basic',
    name: 'Paquete Básico',
    attempts: 10,
    cost: 50,
    description: 'Perfecto para seguir jugando',
    color: 'from-blue-500 to-blue-600',
    popular: false
  },
  {
    id: 'premium',
    name: 'Paquete Premium',
    attempts: 25,
    cost: 100,
    description: 'El más popular',
    color: 'from-purple-500 to-purple-600',
    popular: true
  },
  {
    id: 'pro',
    name: 'Paquete Pro',
    attempts: 50,
    cost: 180,
    description: '¡Mejor valor! Ahorra 70 coins',
    color: 'from-gold-500 to-yellow-600',
    popular: false
  }
]

export default function AttemptsShop({ isOpen, onClose, onPurchase, currentAttempts, maxAttempts }: AttemptsShopProps) {
  const { coins, spendCoins, canAfford } = useCoinsStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePurchase = async (packageData: typeof ATTEMPT_PACKAGES[0]) => {
    if (!canAfford(packageData.cost)) return
    
    setPurchasing(packageData.id)
    
    // Simular delay de compra
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (spendCoins(packageData.cost, `Compra ${packageData.name}`)) {
      onPurchase(packageData.attempts)
      setPurchasing(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">¿Sin Intentos?</h2>
          <p className="text-gray-300 text-sm">
            Te quedan {currentAttempts} de {maxAttempts} intentos
          </p>
          
          {/* Coins display */}
          <div className="flex items-center justify-center mt-4 bg-black/30 rounded-full px-4 py-2">
            <div className="text-2xl mr-2">🪙</div>
            <span className="text-xl font-bold text-yellow-400">{coins}</span>
            <span className="text-gray-400 ml-1">coins</span>
          </div>
        </div>

        {/* Packages */}
        <div className="space-y-3 mb-6">
          {ATTEMPT_PACKAGES.map((pkg) => {
            const isAffordable = canAfford(pkg.cost)
            const isPurchasing = purchasing === pkg.id
            
            return (
              <div
                key={pkg.id}
                className={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                  ${pkg.popular ? 'border-purple-400 scale-105' : 'border-white/20'}
                  ${isAffordable ? 'opacity-100' : 'opacity-60'}
                `}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
                    MÁS POPULAR
                  </div>
                )}
                
                <div className={`bg-gradient-to-r ${pkg.color} p-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold text-lg">{pkg.name}</h3>
                      <p className="text-white/80 text-sm">{pkg.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-2xl font-bold text-white">+{pkg.attempts}</span>
                        <span className="text-white/80 ml-1">intentos</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePurchase(pkg)}
                      disabled={!isAffordable || isPurchasing}
                      className={`
                        px-6 py-3 rounded-xl font-bold transition-all duration-300
                        ${isAffordable 
                          ? 'bg-white text-gray-900 hover:bg-gray-100 active:scale-95' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }
                        ${isPurchasing ? 'animate-pulse' : ''}
                      `}
                    >
                      {isPurchasing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                          Comprando...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-xl mr-1">🪙</span>
                          {pkg.cost}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-300"
          >
            Cerrar
          </button>
          
          <p className="text-xs text-gray-400">
            💡 Completa puzzles para ganar más coins
          </p>
        </div>
      </div>
    </div>
  )
}
