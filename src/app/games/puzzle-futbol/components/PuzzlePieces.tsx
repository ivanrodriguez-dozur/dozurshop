'use client'

import { PuzzlePiece } from '../types'

import DraggablePiece from './DraggablePiece'

interface PuzzlePiecesProps {
  pieces: PuzzlePiece[]
  gridSize: number
  onMovePiece: (pieceId: number, newPosition: { x: number; y: number }) => void
  imageUrl: string
}

export default function PuzzlePieces({ pieces, gridSize, onMovePiece, imageUrl }: PuzzlePiecesProps) {
  // Filtrar solo las piezas que no están en su posición correcta
  const availablePieces = pieces.filter(piece => 
    piece.position.x !== piece.correctPosition.x || 
    piece.position.y !== piece.correctPosition.y
  )

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl mt-6">
      <h3 className="text-lg font-bold text-center mb-4 text-white">
        🎲 Piezas Disponibles ({availablePieces.length})
      </h3>
      
      {availablePieces.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-2">🎉</div>
          <div className="text-white font-bold">¡Todas las piezas están colocadas!</div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
          {availablePieces.map(piece => (
            <DraggablePiece
              key={piece.id}
              piece={piece}
              imageUrl={imageUrl}
              gridSize={gridSize}
              onMovePiece={onMovePiece}
            />
          ))}
        </div>
      )}

      {/* Indicador de progreso */}
      <div className="mt-4 text-center">
        <div className="text-sm text-white/80 mb-2">
          Progreso: {pieces.length - availablePieces.length} / {pieces.length}
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ 
              width: `${((pieces.length - availablePieces.length) / pieces.length) * 100}%` 
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
