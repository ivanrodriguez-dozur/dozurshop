"use client";
import { useDrop } from 'react-dnd';

interface PuzzleBoardProps {
  puzzle: any;
  pieces: any[];
  completedPositions: boolean[];
  onPiecePlace: (pieceId: number, position: number) => void;
}

export default function PuzzleBoard({ puzzle, pieces, completedPositions, onPiecePlace }: PuzzleBoardProps) {
  const gridSize = Math.sqrt(puzzle.piezas);
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h3 className="text-xl font-black text-center mb-4 text-gray-800">
        🎯 Tablero Principal
      </h3>
      
      <div 
        className="grid gap-1 mx-auto bg-gray-200 p-2 rounded-xl shadow-inner"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'fit-content',
          aspectRatio: '1/1'
        }}
      >
        {Array.from({ length: puzzle.piezas }).map((_, index) => (
          <PuzzleSlot
            key={index}
            position={index}
            isCompleted={completedPositions[index]}
            piece={pieces.find(p => p.currentPosition === index)}
            onPiecePlace={onPiecePlace}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-600">Progreso</span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((completedPositions.filter(Boolean).length / puzzle.piezas) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${(completedPositions.filter(Boolean).length / puzzle.piezas) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PuzzleSlot({ position, isCompleted, piece, onPiecePlace }: any) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'puzzle-piece',
    drop: (item: any) => {
      onPiecePlace(item.id, position);
    },
    canDrop: (item: any) => item.correctPosition === position,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        w-20 h-20 border-2 rounded-lg transition-all duration-300 flex items-center justify-center
        ${isCompleted 
          ? 'border-green-500 bg-green-100 shadow-lg' 
          : canDrop 
            ? 'border-blue-500 bg-blue-100 border-dashed animate-pulse'
            : isOver 
              ? 'border-yellow-500 bg-yellow-100'
              : 'border-gray-300 bg-gray-100'
        }
      `}
    >
      {piece ? (
        <div className="w-full h-full rounded-md overflow-hidden">
          <img 
            src={piece.imageData} 
            alt="Pieza del puzzle"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="text-gray-400 text-xs font-bold">
          {position + 1}
        </div>
      )}
      
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-green-600 text-lg animate-bounce">✓</div>
        </div>
      )}
    </div>
  );
}
