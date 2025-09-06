"use client";
import { useEffect, useState } from 'react';

interface GameCoverProps {
  onStart: () => void;
  gameName: string;
}

export default function GameCover({ onStart, gameName }: GameCoverProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  // Generar partículas flotantes
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(() => {
      onStart();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Patrón de fondo de matriz estilo gamer */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Fondo de partículas animadas */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      {/* Efectos de luces neón mejorados */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
        <div className="absolute top-40 right-10 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-6 animate__animated animate__fadeInUp">
        {/* Logo/Título principal */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-2xl animate__animated animate__bounceInDown mb-4 leading-tight">
            {gameName}
          </h1>
          <div className="flex justify-center space-x-3 text-3xl md:text-5xl animate__animated animate__bounceInUp" style={{animationDelay: '0.5s'}}>
            <span className="animate-bounce text-yellow-400" style={{animationDelay: '0s'}}>🧩</span>
            <span className="animate-bounce text-red-400" style={{animationDelay: '0.2s'}}>⚡</span>
            <span className="animate-bounce text-pink-400" style={{animationDelay: '0.4s'}}>🎯</span>
            <span className="animate-bounce text-purple-400" style={{animationDelay: '0.6s'}}>🏆</span>
            <span className="animate-bounce text-cyan-400" style={{animationDelay: '0.8s'}}>🔥</span>
          </div>
        </div>

        {/* Subtitle épico */}
        <div className="mb-8 animate__animated animate__fadeInUp" style={{animationDelay: '1s'}}>
          <p className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-3 drop-shadow-lg">
            🔥 EL DESAFÍO DEFINITIVO 🔥
          </p>
          <p className="text-base md:text-xl text-blue-200 font-bold mb-2">
            Decodifica los enigmas con emojis
          </p>
          <p className="text-sm md:text-lg text-purple-200 font-medium">
            ¿Tienes lo necesario para ser el GOAT? 🐐
          </p>
        </div>

        {/* Características del juego */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate__animated animate__fadeInUp" style={{animationDelay: '1.5s'}}>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">⚽</div>
            <div className="text-xs md:text-sm text-white font-bold">31+ Enigmas</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">🏆</div>
            <div className="text-xs md:text-sm text-white font-bold">Desafíos Épicos</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">🎮</div>
            <div className="text-xs md:text-sm text-white font-bold">Súper Adictivo</div>
          </div>
          <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="text-2xl md:text-3xl mb-1">🔥</div>
            <div className="text-xs md:text-sm text-white font-bold">Modo Pro</div>
          </div>
        </div>

        {/* Botón de inicio épico */}
        <div className="animate__animated animate__bounceIn" style={{animationDelay: '2s'}}>
          <button
            onClick={handleStart}
            className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-2xl md:text-3xl font-black rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              <span>🚀</span>
              <span>INICIAR DESAFÍO</span>
              <span>🚀</span>
            </span>
            
            {/* Efectos de brillo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
          </button>
          
          {/* Texto de motivación */}
          <p className="text-white/80 text-sm md:text-base mt-4 animate-pulse">
            ¡Toca para demostrar tu nivel! 💪
          </p>
        </div>
      </div>

      {/* Indicador de scroll (opcional) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
