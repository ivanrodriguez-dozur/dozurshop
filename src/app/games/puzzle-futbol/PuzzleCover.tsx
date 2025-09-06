"use client";
import { useEffect, useState } from 'react';

interface PuzzleCoverProps {
  onStart: () => void;
  gameName: string;
}

export default function PuzzleCover({ onStart, gameName }: PuzzleCoverProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [puzzlePieces, setPuzzlePieces] = useState<Array<{id: number, x: number, y: number, rotation: number}>>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360
    }));
    setPuzzlePieces(newPieces);
  }, []);

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(() => {
      onStart();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Fondo con piezas de puzzle animadas */}
      <div className="absolute inset-0">
        {puzzlePieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-8 h-8 opacity-20"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              transform: `rotate(${piece.rotation}deg)`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`
            }}
          >
            🧩
          </div>
        ))}
      </div>

      {/* Efectos de luz */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
        <div className="absolute top-40 right-10 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 text-center px-6 animate__animated animate__fadeInUp">
        {/* Título principal */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-2xl animate__animated animate__bounceInDown mb-4 leading-tight">
            {gameName}
          </h1>
          <div className="flex justify-center space-x-3 text-3xl md:text-5xl animate__animated animate__bounceInUp" style={{animationDelay: '0.5s'}}>
            <span className="animate-bounce text-cyan-400" style={{animationDelay: '0s'}}>🧩</span>
            <span className="animate-bounce text-purple-400" style={{animationDelay: '0.2s'}}>⚡</span>
            <span className="animate-bounce text-pink-400" style={{animationDelay: '0.4s'}}>🎯</span>
            <span className="animate-bounce text-yellow-400" style={{animationDelay: '0.6s'}}>🏆</span>
            <span className="animate-bounce text-green-400" style={{animationDelay: '0.8s'}}>🔥</span>
          </div>
        </div>

        {/* Subtítulo épico */}
        <div className="mb-8 animate__animated animate__fadeInUp" style={{animationDelay: '1s'}}>
          <p className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3 drop-shadow-lg">
            🧩 ARMA LA LEYENDA 🧩
          </p>
          <p className="text-base md:text-xl text-cyan-200 font-bold mb-2">
            Reconstruye a los jugadores más icónicos
          </p>
          <p className="text-sm md:text-lg text-purple-200 font-medium">
            ¿Puedes completar el rompecabezas del GOAT? 🐐
          </p>
        </div>

        {/* Características */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate__animated animate__fadeInUp" style={{animationDelay: '1.5s'}}>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">🧩</div>
            <div className="text-xs md:text-sm text-white font-bold">Multi-nivel</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">⏱️</div>
            <div className="text-xs md:text-sm text-white font-bold">Contra Tiempo</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">💡</div>
            <div className="text-xs md:text-sm text-white font-bold">Sistema Pistas</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">🏆</div>
            <div className="text-xs md:text-sm text-white font-bold">Recompensas</div>
          </div>
        </div>

        {/* Botón de inicio */}
        <div className="animate__animated animate__bounceIn" style={{animationDelay: '2s'}}>
          <button
            onClick={handleStart}
            className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-2xl md:text-3xl font-black rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <span>🧩</span>
              <span>ARMAR PUZZLE</span>
              <span>🧩</span>
            </span>
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
          </button>
          
          <p className="text-white/80 text-sm md:text-base mt-4 animate-pulse">
            ¡Demuestra tu habilidad mental! 🧠
          </p>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Agregar animaciones personalizadas
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
