export interface PuzzlePiece {
  id: number
  position: { x: number; y: number }
  correctPosition: { x: number; y: number }
}

export interface Puzzle {
  id: string
  nombre: string
  descripcion: string
  imagen_completa_url: string
  dificultad: 'fácil' | 'medio' | 'difícil'
  piezas: number
  categoria: string
  coins_reward: number
  is_active: boolean
  created_at: string
}

export interface PuzzleGameState {
  pieces: PuzzlePiece[]
  isCompleted: boolean
  moves: number
  timeElapsed: number
}
