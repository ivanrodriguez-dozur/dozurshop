import { useDrag } from 'react-dnd'

import Image from 'next/image'

import { useTouchDrag } from '../hooks/useTouchDrag'

interface PuzzlePiece {
  id: number
  position: { x: number; y: number }
  correctPosition: { x: number; y: number }
}

interface DraggablePieceProps {
  piece: PuzzlePiece
  imageUrl: string
  gridSize: number
  onMovePiece?: (pieceId: number, newPosition: { x: number; y: number }) => void
}

export default function DraggablePiece({ piece, imageUrl, gridSize, onMovePiece }: DraggablePieceProps) {
  // Drag and drop para desktop
  const [{ isDragging: isDraggingDesktop }, drag] = useDrag(() => ({
    type: 'PUZZLE_PIECE',
    item: { id: piece.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  // Touch drag para móviles
  const { isDragging: isDraggingMobile, dragPosition, startPosition, dragHandlers, dragRef } = useTouchDrag(piece.id, {
    onDragEnd: (pieceId, position) => {
      onMovePiece?.(pieceId, position)
    }
  })

  const isDragging = isDraggingDesktop || isDraggingMobile
  const pieceSize = 240 / gridSize // Tamaño más grande para las piezas disponibles

  return (
    <div
      ref={(node) => {
        drag(node);
        dragRef.current = node;
      }}
      className={`
        puzzle-draggable-piece
        relative cursor-grab active:cursor-grabbing transform transition-all duration-200 select-none
        ${isDragging ? 'scale-110 rotate-2 z-50' : 'hover:scale-105 hover:-translate-y-1'}
        bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border-2 border-white/30
        hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-400/20
        touch-manipulation
      `}
      style={{
        width: pieceSize,
        height: pieceSize,
        opacity: isDraggingMobile ? 0.3 : isDraggingDesktop ? 0.7 : 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        transform: isDraggingMobile 
          ? `scale(0.9)` 
          : undefined,
        zIndex: isDragging ? 9999 : 1,
        transition: isDraggingMobile ? 'none' : 'all 0.2s ease',
        // Solo bloquear touch cuando realmente se está arrastrando
        touchAction: isDraggingMobile ? 'none' : 'auto',
      }}
      {...dragHandlers}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Imagen de la pieza */}
      <div 
        className="relative w-full h-full overflow-hidden rounded-lg"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: `-${piece.correctPosition.x * pieceSize}px -${piece.correctPosition.y * pieceSize}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Número de la pieza */}
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
        {piece.id}
      </div>

      {/* Indicador de arrastre */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-400/30 rounded-xl flex items-center justify-center border-2 border-blue-400">
          <div className="text-2xl animate-bounce">🎯</div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse rounded-xl"></div>
        </div>
      )}

      {/* Feedback visual especial para móvil */}
      {isDraggingMobile && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Arrastra a una casilla
            </div>
            <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-xl animate-pulse"></div>
          </div>
          
          {/* Pieza fantasma que sigue el dedo */}
          <div
            className="fixed pointer-events-none z-[10000]"
            style={{
              left: dragPosition.x + startPosition.x - pieceSize/2,
              top: dragPosition.y + startPosition.y - pieceSize/2,
              width: pieceSize,
              height: pieceSize,
              transform: 'scale(1.2) rotate(5deg)',
              transition: 'none',
            }}
          >
            <div 
              className="w-full h-full rounded-xl shadow-2xl border-2 border-blue-400"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundPosition: `-${piece.correctPosition.x * 100}% -${piece.correctPosition.y * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 bg-blue-400/20 rounded-xl"></div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {piece.id}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Efecto de partículas en hover */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse" />
        <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400/60 rounded-full animate-ping" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-pulse delay-100" />
      </div>
    </div>
  )
}
