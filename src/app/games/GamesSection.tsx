
"use client";
import { useState, useEffect } from 'react';

import { gamesList } from './data/gamesList';
import GameCard from './components/GameCard';
import GameHeader from './components/GameHeader';
import GameCoinsBadge from './components/GameCoinsBadge';
import type { Game } from './types';

export default function GamesSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [selected, setSelected] = useState(0);
  
  useEffect(() => {
    // Usar datos locales en lugar de Supabase por ahora
    setGames(gamesList);
  }, []);

  const game = games[selected];

  if (games.length === 0) {
    return <div className="text-center py-10 text-lg text-gray-400">Cargando juegos...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#181818] to-[#232323] flex flex-col items-center p-4">
      {/* Header usuario y coins */}
      <div className="w-full mb-6">
        <GameHeader />
      </div>

      {/* Nombre del juego */}
      <h1 className="text-3xl font-bold text-center text-white mb-2">{game?.name}</h1>

      {/* Carrusel horizontal de juegos */}
      <div className="flex gap-6 overflow-x-auto w-full justify-center mb-4 pb-2 scrollbar-hide">
        {games.map((g, i) => (
          <div key={g.id} onClick={() => setSelected(i)} style={{ minWidth: 260, maxWidth: 320 }}>
            <GameCard game={g} />
          </div>
        ))}
      </div>

      {/* Descripción y coins */}
      <div className="w-full max-w-md bg-[#232323] rounded-xl p-4 shadow text-white flex flex-col items-center">
        <p className="mb-2 text-center text-lg">{game?.description}</p>
        <GameCoinsBadge coins={game?.coins || 0} />
      </div>
    </div>
  );
}
