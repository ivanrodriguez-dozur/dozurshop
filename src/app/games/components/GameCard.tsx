import { useRouter } from 'next/navigation';

import type { Game } from '../types';

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  const router = useRouter();
  
  return (
    <div
      onClick={() => router.push(`/games/${game.id}`)}
      className="group relative cursor-pointer w-64 max-w-full mx-auto"
    >
      {/* Tarjeta principal */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border border-gray-100">
        
        {/* Imagen vertical */}
        {game.image && (
          <div className="relative overflow-hidden rounded-t-2xl">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-72 object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay sutil al hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Contenido inferior más gamer */}
        <div className="relative p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          {/* Efectos de luces neón */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>
          
          {/* Solo mostrar descripción si existe, sin repetir título */}
          {game.description && (
            <p className="text-xs text-gray-300 text-center mb-3 line-clamp-1 relative z-10">
              {game.description}
            </p>
          )}

          {/* Stats del juego */}
          <div className="flex justify-center items-center space-x-4 mb-3 relative z-10">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400 text-xs">⚡</span>
              <span className="text-white text-xs font-bold">PIENSA</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-red-400 text-xs">🔥</span>
              <span className="text-white text-xs font-bold">DESCIFRA</span>
            </div>
          </div>

          {/* Botón de jugar épico */}
          <div className="flex justify-center relative z-10">
            <button className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-black py-3 px-6 rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-xl shadow-lg text-sm tracking-wider">
              <span className="flex items-center space-x-2">
                <span className="text-yellow-400 group-hover:animate-bounce">🚀</span>
                <span>JUGAR AHORA</span>
                <span className="text-yellow-400 group-hover:animate-bounce">🚀</span>
              </span>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 via-white/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            </button>
          </div>
        </div>

        {/* Indicador de estado */}
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Activo
        </div>
      </div>
    </div>
  );
}
