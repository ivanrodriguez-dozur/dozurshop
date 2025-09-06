'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSwipeable } from 'react-swipeable'
import Link from 'next/link'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { supabase } from '@/lib/supabaseClient'

import GameHeader from '../components/GameHeader'
import PuzzleCover from './components/PuzzleCover'
import PuzzleBoard from './components/PuzzleBoard'
import PuzzlePieces from './components/PuzzlePieces'
import AttemptsShop from './components/AttemptsShop'
import HintShop from './components/HintShop'
import { useCoinsStore } from '@/store/coins'

interface Puzzle {
  id: string
  nombre: string
  descripcion?: string
  imagen_completa_url: string
  dificultad: string
  piezas: number
  categoria: string
  coins_reward: number
}

interface PuzzlePiece {
  id: number
  position: { x: number; y: number }
  correctPosition: { x: number; y: number }
}

// Función para generar piezas mezcladas
function generateScrambledPieces(piecesCount: number): PuzzlePiece[] {
  const gridSize = Math.sqrt(piecesCount)
  const pieces: PuzzlePiece[] = []
  
  // Crear piezas en posiciones correctas
  for (let i = 0; i < piecesCount; i++) {
    const x = i % gridSize
    const y = Math.floor(i / gridSize)
    pieces.push({
      id: i + 1,
      position: { x: -1, y: -1 }, // Inicialmente fuera del tablero
      correctPosition: { x, y }
    })
  }
  
  // Mezclar las piezas aleatoriamente
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    // Actualizar IDs para que sean secuenciales después del mezclado
    pieces[i].id = i + 1;
    pieces[j].id = j + 1;
  }
  
  return pieces
}

export default function PuzzleGame() {
  const router = useRouter()
  const [showCover, setShowCover] = useState(true)
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts, setMaxAttempts] = useState(20) // Límite de intentos
  const [gameOver, setGameOver] = useState(false)
  const [showAttemptsShop, setShowAttemptsShop] = useState(false)
  const [showHintShop, setShowHintShop] = useState(false)
  const [showingHint, setShowingHint] = useState<'peek' | 'highlight' | null>(null)

  // Store de coins
  const { coins, addCoins, getDailyFreeCoins } = useCoinsStore()

  // Cargar puzzles desde Supabase
  const loadPuzzles = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando puzzles desde Supabase...')
      
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('is_active', true)
        .order('dificultad', { ascending: true })

      if (error) {
        console.error('❌ Error cargando puzzles:', error)
        setError('Error cargando puzzles de la base de datos')
        return
      }

      console.log('✅ Puzzles cargados:', data?.length)
      setPuzzles(data || [])
      
      // Dar coins gratis diarios
      getDailyFreeCoins()
      
      if (data && data.length === 0) {
        setError('No hay puzzles disponibles. ¿Necesitas poblar la base de datos?')
      }
      
    } catch (error) {
      console.error('💥 Error:', error)
      setError('Error de conexión con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPuzzles()
  }, [])

  const resetGame = () => {
    if (puzzles.length > 0) {
      const currentPuzzle = puzzles[currentPuzzleIndex]
      setPieces(generateScrambledPieces(currentPuzzle.piezas))
      setAttempts(0)
      setGameOver(false)
      setIsCompleted(false)
      // Ajustar max intentos según dificultad
      switch(currentPuzzle.dificultad) {
        case 'fácil':
          setMaxAttempts(30)
          break
        case 'medio':
          setMaxAttempts(20)
          break
        case 'difícil':
          setMaxAttempts(15)
          break
        default:
          setMaxAttempts(20)
      }
    }
  }

  // Inicializar el puzzle actual
  useEffect(() => {
    if (puzzles.length > 0 && currentPuzzleIndex < puzzles.length) {
      resetGame()
    }
  }, [puzzles, currentPuzzleIndex])

  const handleStart = () => {
    setShowCover(false)
  }

  const handleBack = () => {
    router.push('/games')
  }

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1)
      resetGame()
    }
  }

  const handlePrevPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(currentPuzzleIndex - 1)
      resetGame()
    }
  }

  // Mover pieza
  const movePiece = useCallback((pieceId: number, newPosition: { x: number; y: number }) => {
    // Verificar si el juego ya terminó
    if (gameOver) return
    
    // Incrementar intentos
    setAttempts(prev => {
      const newAttempts = prev + 1
      if (newAttempts >= maxAttempts) {
        setGameOver(true)
      }
      return newAttempts
    })
    
    setPieces(prev => 
      prev.map(piece => 
        piece.id === pieceId 
          ? { ...piece, position: newPosition }
          : piece
      )
    )
  }, [gameOver, maxAttempts])

  // Funciones para las tiendas
  const handlePurchaseAttempts = (newAttempts: number) => {
    setMaxAttempts(prev => prev + newAttempts)
    setGameOver(false)
  }

  const handlePurchaseHint = (type: 'peek' | 'highlight') => {
    setShowingHint(type)
    
    if (type === 'peek') {
      // Mostrar imagen completa por 3 segundos
      setTimeout(() => setShowingHint(null), 3000)
    } else if (type === 'highlight') {
      // Mostrar piezas destacadas por 5 segundos
      setTimeout(() => setShowingHint(null), 5000)
    }
  }

  // Verificar si el puzzle está completo
  useEffect(() => {
    if (pieces.length > 0) {
      const isComplete = pieces.every(piece => 
        piece.position.x === piece.correctPosition.x && 
        piece.position.y === piece.correctPosition.y
      )
      
      if (isComplete && !isCompleted) {
        setIsCompleted(true)
        const currentPuzzle = puzzles[currentPuzzleIndex]
        setScore(prev => prev + currentPuzzle.coins_reward)
        
        // Dar coins como recompensa
        const bonusCoins = Math.max(50, currentPuzzle.coins_reward + (maxAttempts - attempts) * 2)
        addCoins(bonusCoins, `Puzzle completado: ${currentPuzzle.nombre}`)
      }
    }
  }, [pieces, isCompleted, puzzles, currentPuzzleIndex])

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPuzzle(),
    onSwipedRight: () => handlePrevPuzzle(),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🧩</div>
          <div className="text-white text-xl">Cargando puzzles épicos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-4">{error}</div>
          <div className="space-y-3">
            <button
              onClick={loadPuzzles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              🔄 Reintentar
            </button>
            <br />
            <Link
              href="/games/puzzle-futbol/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold inline-block"
            >
              🛠️ Panel Admin
            </Link>
            <br />
            <button
              onClick={handleBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              ← Volver a Juegos
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showCover) {
    return <PuzzleCover onStart={handleStart} onBack={handleBack} />
  }

  if (puzzles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">No hay puzzles disponibles</div>
      </div>
    )
  }

  const currentPuzzle = puzzles[currentPuzzleIndex]
  const gridSize = Math.sqrt(currentPuzzle.piezas)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-purple-900 to-indigo-900" {...swipeHandlers}>
        <GameHeader
          title="Puzzle Fútbol"
          score={score}
          onBack={handleBack}
        />

        <div className="px-4 pt-20 pb-24">
          {/* Info del puzzle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPuzzle.nombre}
            </h2>
            <p className="text-white/70 text-sm mb-3">
              {currentPuzzle.descripcion}
            </p>
            <div className="flex justify-center gap-4 text-sm text-white/80 mb-3">
              <span className="bg-white/20 px-3 py-1 rounded-full capitalize">
                {currentPuzzle.dificultad}
              </span>
              <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                {currentPuzzle.piezas} piezas
              </span>
              <span className="bg-green-500/20 px-3 py-1 rounded-full">
                +{currentPuzzle.coins_reward} coins
              </span>
              <span className="bg-yellow-500/20 px-3 py-1 rounded-full flex items-center">
                <span className="mr-1">🪙</span>
                {coins} coins
              </span>
            </div>
            
            {/* Estado del juego */}
            <div className="flex justify-center gap-4 text-sm">
              <div className={`px-3 py-1 rounded-full ${
                attempts > maxAttempts * 0.8 ? 'bg-red-500/20 text-red-300' : 
                attempts > maxAttempts * 0.6 ? 'bg-yellow-500/20 text-yellow-300' : 
                'bg-green-500/20 text-green-300'
              }`}>
                Intentos: {attempts}/{maxAttempts}
              </div>
              {gameOver && (
                <div className="bg-red-500 px-3 py-1 rounded-full text-white font-bold">
                  ¡Juego Terminado!
                </div>
              )}
              {isCompleted && (
                <div className="bg-green-500 px-3 py-1 rounded-full text-white font-bold">
                  ¡Completado! 🎉
                </div>
              )}
            </div>
            
            {/* Botones de tienda */}
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setShowHintShop(true)}
                disabled={isCompleted || gameOver}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center"
              >
                <span className="mr-2">💡</span>
                Pistas
              </button>
              
              {(attempts >= maxAttempts * 0.8 || gameOver) && (
                <button
                  onClick={() => setShowAttemptsShop(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">🎯</span>
                  Más Intentos
                </button>
              )}
            </div>
            
            {/* Botón de reiniciar */}
            {(gameOver || isCompleted) && (
              <button
                onClick={resetGame}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {gameOver ? 'Intentar de Nuevo' : 'Jugar Otra Vez'}
              </button>
            )}
            
            {/* Navegación entre puzzles */}
            {puzzles.length > 1 && (
              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={handlePrevPuzzle}
                  disabled={currentPuzzleIndex === 0}
                  className="bg-white/20 disabled:bg-white/10 disabled:text-white/40 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-white/70 text-sm flex items-center px-3">
                  {currentPuzzleIndex + 1} / {puzzles.length}
                </span>
                <button
                  onClick={handleNextPuzzle}
                  disabled={currentPuzzleIndex === puzzles.length - 1}
                  className="bg-white/20 disabled:bg-white/10 disabled:text-white/40 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>

          {/* Tablero del puzzle */}
          <div className="puzzle-board-container">
            <PuzzleBoard
              gridSize={gridSize}
              pieces={pieces}
              onMovePiece={movePiece}
              imageUrl={currentPuzzle.imagen_completa_url}
              showingHint={showingHint}
            />
          </div>

          {/* Piezas disponibles */}
          <div className="puzzle-pieces-container">
            <PuzzlePieces
              pieces={pieces}
              gridSize={gridSize}
              onMovePiece={movePiece}
              imageUrl={currentPuzzle.imagen_completa_url}
            />
          </div>

          {/* Indicador de progreso */}
          <div className="mt-6 text-center">
            <div className="text-white/80 text-sm mb-2">
              Puzzle {currentPuzzleIndex + 1} de {puzzles.length}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentPuzzleIndex + 1) / puzzles.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Mensaje de completado */}
          {isCompleted && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 mx-4 text-center shadow-2xl">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  ¡Puzzle Completado!
                </h3>
                <p className="text-white/90 mb-4">
                  Has ganado {currentPuzzle.coins_reward} coins
                </p>
                <div className="flex gap-3 justify-center">
                  {currentPuzzleIndex < puzzles.length - 1 && (
                    <button
                      onClick={() => {
                        setIsCompleted(false)
                        handleNextPuzzle()
                      }}
                      className="bg-white/20 px-6 py-2 rounded-full text-white font-semibold"
                    >
                      Siguiente Puzzle
                    </button>
                  )}
                  <button
                    onClick={handleBack}
                    className="bg-white/20 px-6 py-2 rounded-full text-white font-semibold"
                  >
                    Volver a Juegos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tiendas */}
      <AttemptsShop
        isOpen={showAttemptsShop}
        onClose={() => setShowAttemptsShop(false)}
        onPurchase={handlePurchaseAttempts}
        currentAttempts={attempts}
        maxAttempts={maxAttempts}
      />

      <HintShop
        isOpen={showHintShop}
        onClose={() => setShowHintShop(false)}
        onPurchaseHint={handlePurchaseHint}
      />
    </DndProvider>
  )
}
