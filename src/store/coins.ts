import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CoinsState {
  coins: number
  totalEarned: number
  totalSpent: number
  lastFreeCoins: string | null
  
  // Acciones
  addCoins: (amount: number, reason?: string) => void
  spendCoins: (amount: number, reason?: string) => boolean
  canAfford: (amount: number) => boolean
  getDailyFreeCoins: () => boolean
  
  // Historial
  addTransaction: (type: 'earn' | 'spend', amount: number, reason: string) => void
}

interface Transaction {
  id: string
  type: 'earn' | 'spend'
  amount: number
  reason: string
  timestamp: string
}

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      coins: 100, // Coins iniciales
      totalEarned: 100,
      totalSpent: 0,
      lastFreeCoins: null,
      
      addCoins: (amount: number, reason = 'Recompensa') => {
        set((state) => ({
          coins: state.coins + amount,
          totalEarned: state.totalEarned + amount
        }))
        get().addTransaction('earn', amount, reason)
      },
      
      spendCoins: (amount: number, reason = 'Compra') => {
        const { coins } = get()
        if (coins >= amount) {
          set((state) => ({
            coins: state.coins - amount,
            totalSpent: state.totalSpent + amount
          }))
          get().addTransaction('spend', amount, reason)
          return true
        }
        return false
      },
      
      canAfford: (amount: number) => get().coins >= amount,
      
      getDailyFreeCoins: () => {
        const today = new Date().toDateString()
        const { lastFreeCoins } = get()
        
        if (lastFreeCoins !== today) {
          get().addCoins(50, 'Coins diarios gratis')
          set({ lastFreeCoins: today })
          return true
        }
        return false
      },
      
      addTransaction: (type: 'earn' | 'spend', amount: number, reason: string) => {
        // En una implementación real, esto se enviaría a la base de datos
        console.log(`💰 ${type === 'earn' ? '+' : '-'}${amount} coins - ${reason}`)
      }
    }),
    {
      name: 'coins-storage',
      version: 1,
    }
  )
)
