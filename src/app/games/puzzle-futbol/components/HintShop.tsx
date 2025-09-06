'use client'

import { useState } from 'react'
import { useCoinsStore } from '@/store/coins'

interface HintShopProps {
  isOpen: boolean
  onClose: () => void
  onPurchaseHint: (type: 'peek' | 'highlight') => void
}

const HINT_OPTIONS = [
  {
    id: 'peek',
    name: 'Vistazo Rápido',
    cost: 20,
    description: 'Ve la imagen completa por 3 segundos',
    icon: '👁️',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'highlight',
    name: 'Piezas Marcadas',
    cost: 30,
    description: 'Resalta las piezas en sus posiciones correctas',
    icon: '💡',
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function HintShop({ isOpen, onClose, onPurchaseHint }: HintShopProps) {
  const { coins, spendCoins, canAfford } = useCoinsStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePurchase = async (hint: typeof HINT_OPTIONS[0]) => {
    if (!canAfford(hint.cost)) return
    
    setPurchasing(hint.id)
    
    // Simular delay de compra
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (spendCoins(hint.cost, `Pista: ${hint.name}`)) {
      onPurchaseHint(hint.id as 'peek' | 'highlight')
      setPurchasing(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 max-w-sm w-full mx-4 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💡</div>
          <h2 className="text-2xl font-bold text-white mb-2">¿Necesitas Ayuda?</h2>
          <p className="text-gray-300 text-sm">
            Compra una pista para resolver el puzzle más fácil
          </p>
          
          {/* Coins display */}
          <div className="flex items-center justify-center mt-4 bg-black/30 rounded-full px-4 py-2">
            <div className="text-2xl mr-2">🪙</div>
            <span className="text-xl font-bold text-yellow-400">{coins}</span>
            <span className="text-gray-400 ml-1">coins</span>
          </div>
        </div>

        {/* Hint Options */}
        <div className="space-y-4 mb-6">
          {HINT_OPTIONS.map((hint) => {
            const isAffordable = canAfford(hint.cost)
            const isPurchasing = purchasing === hint.id
            
            return (
              <div
                key={hint.id}
                className={`
                  rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  ${isAffordable ? 'border-white/20 hover:border-white/40' : 'border-red-500/50 opacity-60'}
                `}
              >
                <div className={`bg-gradient-to-r ${hint.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-3xl mr-3">{hint.icon}</div>
                      <div>
                        <h3 className="text-white font-bold">{hint.name}</h3>
                        <p className="text-white/80 text-sm">{hint.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(hint)}
                    disabled={!isAffordable || isPurchasing}
                    className={`
                      w-full mt-3 py-2 rounded-xl font-bold transition-all duration-300
                      ${isAffordable 
                        ? 'bg-white text-gray-900 hover:bg-gray-100 active:scale-95' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }
                      ${isPurchasing ? 'animate-pulse' : ''}
                    `}
                  >
                    {isPurchasing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                        Comprando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-xl mr-2">🪙</span>
                        {hint.cost} coins
                      </div>
                    )}
                  </button>
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
            ⭐ Las pistas te ayudan a resolver puzzles difíciles
          </p>
        </div>
      </div>
    </div>
  )
}
