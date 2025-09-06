"use client";
import { useDrag } from 'react-dnd';

interface PuzzlePiecesProps {
  pieces: any[];
  onPieceSelect: (pieceId: number) => void;
}

export default function PuzzlePieces({ pieces, onPieceSelect }: PuzzlePiecesProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6">
      <h3 className="text-xl font-black text-center mb-4 text-gray-800">
        🧩 Piezas Disponibles
      </h3>
      
      <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {pieces.map((piece) => (
          <DraggablePiece
            key={piece.id}
            piece={piece}
            onClick={() => onPieceSelect(piece.id)}
          />
        ))}
      </div>

      {pieces.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-2">🎉</div>
          <div className="text-gray-600 font-bold">
            ¡Todas las piezas colocadas!
          </div>
        </div>
      )}
    </div>
  );
}

function DraggablePiece({ piece, onClick }: any) {
  const [{ isDragging }, drag] = useDrag({
    type: 'puzzle-piece',
    item: { id: piece.id, correctPosition: piece.correctPosition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`
        w-20 h-20 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
        ${isDragging ? 'opacity-50 rotate-12' : 'opacity-100'}
        border-2 border-gray-300 hover:border-blue-500 bg-white
      `}
    >
      <div className="w-full h-full rounded-md overflow-hidden relative group">
        <img 
          src={piece.imageData} 
          alt="Pieza del puzzle"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay con número de pieza */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-bold">#{piece.correctPosition + 1}</span>
        </div>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}
