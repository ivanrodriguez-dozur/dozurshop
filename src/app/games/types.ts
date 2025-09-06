// Tipos para juegos y usuario
export type Game = {
  id: string;
  name: string;
  image: string;
  description: string;
  coins: number;
  slug: string;
  image_url?: string;
  coins_reward?: number;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  coins: number;
};
