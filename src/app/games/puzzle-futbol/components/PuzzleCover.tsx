'use client'

interface PuzzleCoverProps {
  onStart: () => void
  onBack: () => void
}

export default function PuzzleCover({ onStart, onBack }: PuzzleCoverProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-800 via-purple-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Partículas flotantes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-cyan-400/30 rounded-full"></div>
          </div>
        ))}

        {/* Ondas de luz */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full animate-ping animation-duration-3000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-400/20 to-transparent rounded-full animate-ping animation-duration-4000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        {/* Icono principal */}
        <div className="mb-8 relative">
          <div className="text-8xl animate-bounce mb-4">🧩</div>
          <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">⚽</div>
          <div className="absolute -bottom-2 -left-4 text-3xl animate-pulse">🏆</div>
        </div>

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 animate-pulse">
            PUZZLE
          </h1>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            FÚTBOL
          </h2>
        </div>

        {/* Descripción */}
        <div className="mb-8 space-y-2">
          <p className="text-white/90 text-lg font-semibold">
            🎯 Arma los rompecabezas de jugadores icónicos
          </p>
          <p className="text-cyan-300 text-sm">
            ✨ Arrastra y suelta las piezas en su lugar correcto
          </p>
          <p className="text-purple-300 text-sm">
            🏅 Gana coins por cada puzzle completado
          </p>
        </div>

        {/* Estadísticas del juego */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-2xl mb-1">🎮</div>
            <div className="text-xs text-white/80">4 Puzzles</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs text-white/80">Varios niveles</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-xs text-white/80">Hasta 150 coins</div>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 
                       text-white font-black py-4 px-8 rounded-2xl text-xl shadow-2xl
                       transform transition-all duration-300 hover:scale-105 active:scale-95
                       border-2 border-white/20 backdrop-blur-sm"
          >
            🧩 COMENZAR PUZZLE
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 
                       rounded-xl transition-all duration-300 border border-white/30
                       backdrop-blur-sm"
          >
            ← Volver a Juegos
          </button>
        </div>

        {/* Consejos */}
        <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-yellow-300 text-sm font-semibold mb-2">💡 Consejo:</div>
          <p className="text-white/80 text-xs">
            Usa la imagen de referencia como guía y arrastra las piezas desde el panel lateral hasta el tablero principal.
          </p>
        </div>
      </div>
    </div>
  )
}
