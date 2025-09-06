'use client'

import { useState } from 'react'
import { seedPuzzles } from '../data/seedPuzzles'

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleSeed = async () => {
    setLoading(true)
    setResult('Ejecutando seeding...')
    
    try {
      const success = await seedPuzzles()
      setResult(success ? '✅ Seeding completado exitosamente!' : '❌ Error en el seeding')
    } catch (error) {
      setResult(`💥 Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🛠️ Panel de Administración
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Poblar tabla de Puzzles
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Esto insertará 6 puzzles de jugadores famosos en la base de datos.
          </p>
        </div>

        <button
          onClick={handleSeed}
          disabled={loading}
          className={`
            w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 active:scale-95'
            }
          `}
        >
          {loading ? '🔄 Ejecutando...' : '🌱 Poblar Puzzles'}
        </button>

        {result && (
          <div className={`
            mt-4 p-3 rounded-lg text-sm font-medium
            ${result.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {result}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <a 
            href="/games" 
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Volver a Juegos
          </a>
        </div>
      </div>
    </div>
  )
}
