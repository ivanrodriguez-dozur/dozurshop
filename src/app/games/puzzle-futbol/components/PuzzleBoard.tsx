'use client'

import { useDrop } from 'react-dnd'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PuzzlePiece {
  id: number
  position: { x: number; y: number }
  correctPosition: { x: number; y: number }
}

interface PuzzleBoardProps {
  gridSize: number
  pieces: PuzzlePiece[]
  onMovePiece: (pieceId: number, newPosition: { x: number; y: number }) => void
  imageUrl: string
  showingHint?: 'peek' | 'highlight' | null
}

export default function PuzzleBoard({ gridSize, pieces, onMovePiece, imageUrl, showingHint }: PuzzleBoardProps) {
  const [showReference, setShowReference] = useState(true)
  const [hintUsed, setHintUsed] = useState(false)

  // Ocultar imagen de referencia después de 8 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReference(false)
    }, 8000) // 8 segundos

    return () => clearTimeout(timer)
  }, [pieces]) // Reset timer cuando cambian las piezas (nuevo puzzle)

  // Función para mostrar pista temporal
  const showHint = () => {
    setShowReference(true)
    setHintUsed(true)
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      setShowReference(false)
    }, 3000)
  }
  const renderDropZone = (x: number, y: number) => {
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: 'PUZZLE_PIECE',
      drop: (item: { id: number }) => {
        onMovePiece(item.id, { x, y })
      },
      canDrop: () => true,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    })

    const currentPiece = pieces.find(piece => 
      piece.position.x === x && piece.position.y === y
    )

    const isCorrect = currentPiece && 
      currentPiece.correctPosition.x === x && 
      currentPiece.correctPosition.y === y

    return (
      <div
        ref={drop as any}
        key={`${x}-${y}`}
        data-drop-zone="true"
        data-x={x}
        data-y={y}
        className={`
          aspect-square border-2 rounded-lg relative overflow-hidden transition-all duration-300
          ${isOver ? 'border-yellow-400 bg-yellow-100/20' : 'border-white/30 bg-white/10'}
          ${canDrop ? 'border-dashed' : 'border-solid'}
          ${isCorrect ? 'border-green-400 bg-green-100/20' : ''}
          ${showingHint === 'highlight' && !currentPiece ? 'ring-4 ring-blue-400 ring-opacity-60 animate-pulse' : ''}
        `}
        style={{
          // Mostrar imagen si: está en posición correcta O si se compró la pista "peek"
          backgroundImage: (currentPiece && isCorrect) || showingHint === 'peek' ? `url(${imageUrl})` : 'none',
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: `-${x * 100}% -${y * 100}%`,
        }}
      >
        {/* Mostrar número de la pieza si está colocada pero no es correcta */}
        {currentPiece && !isCorrect && (
          <div className="absolute inset-0 bg-red-100/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{currentPiece.id}</span>
          </div>
        )}
        
        {/* Placeholder cuando está vacío */}
        {!currentPiece && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
            {showingHint === 'highlight' ? (
              <div className="text-blue-400 font-bold animate-bounce">⬇️</div>
            ) : (
              `${x + 1},${y + 1}`
            )}
          </div>
        )}
        
        {/* Efecto especial para pistas */}
        {showingHint === 'peek' && (
          <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs px-1 rounded">
            💡
          </div>
        )}
        
        {/* Efecto de brillo cuando está correcto */}
        {isCorrect && (
          <div className="absolute inset-0 bg-green-300/20 animate-pulse" />
        )}
        
        {/* Efecto hover */}
        {isOver && (
          <div className="absolute inset-0 bg-yellow-300/20 animate-pulse" />
        )}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl mb-6">
      <h3 className="text-lg font-bold text-center mb-4 text-white">
        🧩 Tablero de Puzzle
      </h3>
      
      <div 
        className="grid gap-1 mx-auto mb-4"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          maxWidth: '320px',
          width: '100%'
        }}
      >
        {Array.from({ length: gridSize }, (_, y) =>
          Array.from({ length: gridSize }, (_, x) => renderDropZone(x, y))
        )}
      </div>

      {/* Imagen de referencia con timer */}
      <div className="text-center">
        {showReference ? (
          <div className="animate-pulse">
            <div className="text-sm text-white/80 mb-2">
              📸 Imagen de referencia (desaparece en unos segundos)
            </div>
            <div className="relative inline-block">
              <Image 
                src={imageUrl} 
                alt="Referencia"
                width={80}
                height={80}
                className="object-cover rounded-lg border-2 border-white/30"
              />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                ⏰
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-sm text-white/60 mb-2">🔒 Imagen oculta</div>
            <button
              onClick={showHint}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-all duration-300"
            >
              👁️ Ver pista (3s) {hintUsed ? '- Usada' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
