// Datos de ejemplo para los puzzles de fútbol
export const PUZZLE_DATA = [
  {
    id: 1,
    player_name: 'Lionel Messi',
    image_url: 'https://images.unsplash.com/photo-1574732513018-c95ff2ea9c6f?w=400',
    difficulty: 'medio',
    category: 'jugadores',
    coins_reward: 100,
    pieces_count: 9,
    scrambled_pieces: JSON.stringify([
      { id: 1, position: { x: 2, y: 1 }, correctPosition: { x: 0, y: 0 } },
      { id: 2, position: { x: 0, y: 0 }, correctPosition: { x: 1, y: 0 } },
      { id: 3, position: { x: 1, y: 2 }, correctPosition: { x: 2, y: 0 } },
      { id: 4, position: { x: 2, y: 0 }, correctPosition: { x: 0, y: 1 } },
      { id: 5, position: { x: 1, y: 1 }, correctPosition: { x: 1, y: 1 } },
      { id: 6, position: { x: 0, y: 2 }, correctPosition: { x: 2, y: 1 } },
      { id: 7, position: { x: 2, y: 2 }, correctPosition: { x: 0, y: 2 } },
      { id: 8, position: { x: 0, y: 1 }, correctPosition: { x: 1, y: 2 } },
      { id: 9, position: { x: 1, y: 0 }, correctPosition: { x: 2, y: 2 } }
    ])
  },
  {
    id: 2,
    player_name: 'Cristiano Ronaldo',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    difficulty: 'medio',
    category: 'jugadores',
    coins_reward: 100,
    pieces_count: 9,
    scrambled_pieces: JSON.stringify([
      { id: 1, position: { x: 1, y: 2 }, correctPosition: { x: 0, y: 0 } },
      { id: 2, position: { x: 2, y: 0 }, correctPosition: { x: 1, y: 0 } },
      { id: 3, position: { x: 0, y: 1 }, correctPosition: { x: 2, y: 0 } },
      { id: 4, position: { x: 1, y: 0 }, correctPosition: { x: 0, y: 1 } },
      { id: 5, position: { x: 2, y: 2 }, correctPosition: { x: 1, y: 1 } },
      { id: 6, position: { x: 0, y: 0 }, correctPosition: { x: 2, y: 1 } },
      { id: 7, position: { x: 2, y: 1 }, correctPosition: { x: 0, y: 2 } },
      { id: 8, position: { x: 0, y: 2 }, correctPosition: { x: 1, y: 2 } },
      { id: 9, position: { x: 1, y: 1 }, correctPosition: { x: 2, y: 2 } }
    ])
  },
  {
    id: 3,
    player_name: 'Neymar Jr',
    image_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
    difficulty: 'facil',
    category: 'jugadores',
    coins_reward: 75,
    pieces_count: 4,
    scrambled_pieces: JSON.stringify([
      { id: 1, position: { x: 1, y: 0 }, correctPosition: { x: 0, y: 0 } },
      { id: 2, position: { x: 0, y: 1 }, correctPosition: { x: 1, y: 0 } },
      { id: 3, position: { x: 0, y: 0 }, correctPosition: { x: 0, y: 1 } },
      { id: 4, position: { x: 1, y: 1 }, correctPosition: { x: 1, y: 1 } }
    ])
  },
  {
    id: 4,
    player_name: 'Kylian Mbappé',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    difficulty: 'dificil',
    category: 'jugadores',
    coins_reward: 150,
    pieces_count: 16,
    scrambled_pieces: JSON.stringify([
      { id: 1, position: { x: 3, y: 0 }, correctPosition: { x: 0, y: 0 } },
      { id: 2, position: { x: 0, y: 1 }, correctPosition: { x: 1, y: 0 } },
      { id: 3, position: { x: 2, y: 2 }, correctPosition: { x: 2, y: 0 } },
      { id: 4, position: { x: 1, y: 3 }, correctPosition: { x: 3, y: 0 } },
      { id: 5, position: { x: 3, y: 1 }, correctPosition: { x: 0, y: 1 } },
      { id: 6, position: { x: 2, y: 0 }, correctPosition: { x: 1, y: 1 } },
      { id: 7, position: { x: 0, y: 2 }, correctPosition: { x: 2, y: 1 } },
      { id: 8, position: { x: 1, y: 1 }, correctPosition: { x: 3, y: 1 } },
      { id: 9, position: { x: 2, y: 3 }, correctPosition: { x: 0, y: 2 } },
      { id: 10, position: { x: 0, y: 0 }, correctPosition: { x: 1, y: 2 } },
      { id: 11, position: { x: 3, y: 3 }, correctPosition: { x: 2, y: 2 } },
      { id: 12, position: { x: 1, y: 0 }, correctPosition: { x: 3, y: 2 } },
      { id: 13, position: { x: 0, y: 3 }, correctPosition: { x: 0, y: 3 } },
      { id: 14, position: { x: 3, y: 2 }, correctPosition: { x: 1, y: 3 } },
      { id: 15, position: { x: 1, y: 2 }, correctPosition: { x: 2, y: 3 } },
      { id: 16, position: { x: 2, y: 1 }, correctPosition: { x: 3, y: 3 } }
    ])
  }
];

// Función para obtener un puzzle aleatorio
export function getRandomPuzzle() {
  return PUZZLE_DATA[Math.floor(Math.random() * PUZZLE_DATA.length)];
}
