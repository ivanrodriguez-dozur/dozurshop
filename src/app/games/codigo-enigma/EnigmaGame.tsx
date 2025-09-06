
"use client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import emojiData from 'unicode-emoji-json';

// Conjunto completo de emojis comunes organizados por categorías
const EMOJI_POOL = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '🤗', '🤭', '🤫', '🤔', '🙄', '😏', '😒', '🙁', '😞', '😔', '😟', '😕', '🤐', '🤨', '😐', '😑', '😶', '😶‍🌫️', '🫣', '🤯', '🤠'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🐐', '🐄', '🐪', '🐘', '🦏', '🦛', '🦓', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐄'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '⚽️'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿'],
  symbols: ['⭐', '🌟', '💫', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌛', '🌜', '🌚', '🌝', '🌞', '🪐', '💫', '⭐', '🌟', '☄️', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈'],
  objects: ['👑', '💎', '💍', '💄', '💋', '👄', '🦷', '👅', '👂', '🦻', '👃', '👣', '👁️', '👀', '🧠', '🫀', '🫁', '🩸', '🦴', '🦵', '🦶', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '🧔‍♂️', '🧔‍♀️', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🧑‍🦱', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️'],
  numbers: ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣', '⏏️', '⏯️', '⏮️', '⏭️', '⏪', '⏩', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️'],
};

// Función para obtener todos los emojis disponibles
const getAllEmojis = () => {
  const packageEmojis = Object.keys(emojiData);
  const customEmojis = Object.values(EMOJI_POOL).flat();
  
  // Emojis comunes que podrían faltar en el paquete
  const commonMissing = ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱'];
  
  // Combinar y eliminar duplicados
  const allEmojis = Array.from(new Set([...packageEmojis, ...customEmojis, ...commonMissing]));
  
  console.log(`Total emojis disponibles: ${allEmojis.length} (paquete: ${packageEmojis.length}, custom: ${customEmojis.length}, extra: ${commonMissing.length})`);
  
  return allEmojis;
};

// Utilidad para obtener N emojis aleatorios distintos de una lista
function getRandomEmojis(count: number, exclude: string[] = []) {
  const allEmojis = getAllEmojis().filter(e => !exclude.includes(e));
  const shuffled = allEmojis.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

import GameHeader from '../components/GameHeader';

import EmojiAnswerBar from './EmojiAnswerBar';
import EmojiPicker from './EmojiPicker';
import GameCover from './GameCover';
import ProgressBarFeedback from './ProgressBarFeedback';



type Game = {
  name: string;
  coins_reward?: number;
};
type Enigma = {
  pista: string;
  subpista?: string;
  respuesta: string;
};

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función para generar emojis aleatorios incluyendo siempre los de la respuesta
function generateEmojiOptions(answerEmojis: string[], totalCount: number = 25) {
  // GARANTIZAR que los emojis de la respuesta siempre estén incluidos
  console.log('Generando opciones para:', answerEmojis);
  
  // Obtener emojis aleatorios del paquete y pool personalizado (excluyendo los de la respuesta)
  const availableCount = Math.max(1, totalCount - answerEmojis.length);
  const randomEmojis = getRandomEmojis(availableCount, answerEmojis);
  
  // Combinar: SIEMPRE los de la respuesta + aleatorios
  const allOptions = [...answerEmojis, ...randomEmojis];
  
  // Si aún no tenemos suficientes, agregar del pool personalizado
  const extraEmojis = Object.values(EMOJI_POOL).flat();
  
  while (allOptions.length < totalCount) {
    const randomExtra = extraEmojis[Math.floor(Math.random() * extraEmojis.length)];
    if (!allOptions.includes(randomExtra)) {
      allOptions.push(randomExtra);
    }
    // Evitar bucle infinito
    if (extraEmojis.length === 0) break;
  }
  
  // Mezclar todas las opciones
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  
  console.log('Opciones generadas:', allOptions.slice(0, totalCount));
  console.log('Incluye todos los de respuesta:', answerEmojis.every(emoji => allOptions.includes(emoji)));
  
  return allOptions.slice(0, totalCount);
}

export default function EnigmaGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<number|null>(null);
  const [showSubclue, setShowSubclue] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [freeAvailable] = useState<boolean>(true); // Simulación
  const [game, setGame] = useState<Game|null>(null);
  const [enigmas, setEnigmas] = useState<Enigma[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [emojiOptions, setEmojiOptions] = useState<string[]>([]);
  const [backgroundGradient, setBackgroundGradient] = useState<string>('from-yellow-100 to-yellow-300');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showCover, setShowCover] = useState<boolean>(true);

  useEffect(() => {
    // Cargar datos del juego
    supabase
      .from('games')
      .select('*')
      .eq('slug', 'codigo-enigma')
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error cargando juego:', error);
        } else {
          console.log('Juego cargado:', data);
          setGame(data);
        }
      });

    // Cargar enigmas activos
    supabase
      .from('enigmas')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error cargando enigmas:', error);
        } else {
          console.log('Enigmas cargados:', data?.length || 0);
          setEnigmas(data || []);
        }
      });
  }, [setGame, setEnigmas]);

  const enigma = enigmas[current];
  
  const answer: string[] = useMemo(() => {
    if (!enigma?.respuesta) return [];
    
    // Usar Intl.Segmenter para dividir correctamente los emojis complejos
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      const segments = Array.from(segmenter.segment(enigma.respuesta));
      return segments.map(seg => seg.segment).filter(seg => seg.trim() !== '');
    }
    
    // Fallback: usar regex para emojis complejos y simples
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Regional_Indicator}{2}|\p{Emoji})/gu;
    const matches = enigma.respuesta.match(emojiRegex) || [];
    return matches.filter(emoji => emoji.trim() !== '');
  }, [enigma]);

  // DEBUG: Verificar emojis de la respuesta (solo para desarrollo)
  useEffect(() => {
    if (!answer || answer.length === 0) return;
    console.log('Respuesta actual:', answer);
  }, [answer]);

  const answerLength = answer.length; // Usar la longitud real de la respuesta

  // Generar las opciones de emojis solo una vez por enigma
  useEffect(() => {
    if (!enigma || !answer || answer.length === 0) {
      setEmojiOptions([]);
      return;
    }
    
    // Usar la nueva función que siempre incluye los emojis de la respuesta
    const options = generateEmojiOptions(answer, 25);
    setEmojiOptions(options);
  }, [enigma, answer, setEmojiOptions]);
  const COIN_COST = game?.coins_reward || 5;

  // Configurar gestos de swipe para móvil y tablet
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextEnigma(),
    onSwipedRight: () => previousEnigma(),
    trackMouse: false, // Solo en dispositivos táctiles
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 50, // Sensibilidad del swipe
  });

  // Colores de fondo aleatorios para cada intento
  const backgroundColors = [
    'from-yellow-100 to-yellow-300',
    'from-blue-100 to-blue-300', 
    'from-green-100 to-green-300',
    'from-purple-100 to-purple-300',
    'from-pink-100 to-pink-300',
    'from-indigo-100 to-indigo-300',
    'from-red-100 to-red-300',
    'from-orange-100 to-orange-300'
  ];

  function getRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  }

  function nextEnigma() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const nextIndex = (current + 1) % enigmas.length;
    setCurrent(nextIndex);
    setSelected([]);
    setFeedback(null);
    setLoading(false);
    setShowSubclue(false);
    setAttempts(0);
    // Cambiar color de fondo
    setBackgroundGradient(getRandomBackground());
    
    // Reset transition después de la animación
    setTimeout(() => setIsTransitioning(false), 300);
  }

  function previousEnigma() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const prevIndex = current === 0 ? enigmas.length - 1 : current - 1;
    setCurrent(prevIndex);
    setSelected([]);
    setFeedback(null);
    setLoading(false);
    setShowSubclue(false);
    setAttempts(0);
    // Cambiar color de fondo
    setBackgroundGradient(getRandomBackground());
    
    // Reset transition después de la animación
    setTimeout(() => setIsTransitioning(false), 300);
  }

  function handleSelect(emoji: string) {
    // Verificar que el emoji no esté vacío y no se repita
    if (selected.length < answerLength && emoji && emoji.trim() !== '' && !selected.includes(emoji)) {
      setSelected([...selected, emoji]);
    }
  }
  function handleRemove() {
    setSelected(selected.slice(0, -1));
  }
  function handleSubmit() {
    if (selected.length !== answerLength) return;
    setLoading(true);
    
    setTimeout(() => {
      // Porcentaje de acierto
      let correct = 0;
      for (let i = 0; i < answerLength; i++) {
        if (selected[i] === answer[i]) correct++;
      }
      const percent = Math.round((correct / answerLength) * 100);
      
      setFeedback(percent);
      setLoading(false);
      setShowSubclue(true);
      setAttempts(attempts + 1);
      
      // Cambiar color de fondo después de cada intento
      setBackgroundGradient(getRandomBackground());
    }, 1200);
  }
  function handleReset() {
    setSelected([]);
    setFeedback(null);
    setLoading(false);
    // Cambiar color de fondo en cada reset
    setBackgroundGradient(getRandomBackground());
  }

  if (!game || enigmas.length === 0) {
    return <div className="text-center py-10 text-lg text-gray-600">Cargando juego...</div>;
  }

  // Mostrar portada primero
  if (showCover) {
    return <GameCover onStart={() => setShowCover(false)} gameName={game.name} />;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${backgroundGradient} p-4 pb-24 relative transition-all duration-500`}>
      {/* Header usuario y coins */}
      <div className="w-full max-w-lg mb-4">
        <GameHeader />
      </div>
      {/* Celebración si gana */}
      {feedback === 100 && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none animate__animated animate__tada">
          <div className="text-6xl mb-2 animate__animated animate__bounceIn">🎉🎉</div>
          <div className="text-3xl font-bold text-yellow-600 animate__animated animate__fadeInDown">¡Felicidades, acertaste todo!</div>
        </div>
      )}
      
      {/* Contenedor principal con swipe */}
      <div 
        {...swipeHandlers} 
        className={`w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center border-4 border-yellow-300 relative transition-all duration-300 ${
          isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
        }`}
      >
        {/* Navegación moderna para PC / Indicador para móvil */}
        <div className="flex justify-between items-center w-full mb-6">
          {/* Botón Anterior - Solo visible en PC */}
          <button 
            onClick={previousEnigma}
            disabled={isTransitioning}
            className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 group"
          >
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Indicador de swipe para móvil/tablet + contador */}
          <div className="flex flex-col items-center">
            <div className="md:hidden text-xs text-gray-400 mb-1 flex items-center space-x-2">
              <span>←</span>
              <span>Desliza para cambiar</span>
              <span>→</span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Indicadores de puntos */}
              <div className="flex space-x-1">
                {enigmas.slice(Math.max(0, current - 2), current + 3).map((_, index) => {
                  const actualIndex = Math.max(0, current - 2) + index;
                  return (
                    <div
                      key={actualIndex}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        actualIndex === current 
                          ? 'bg-yellow-500 w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  );
                })}
              </div>
              {/* Contador moderno */}
              <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full shadow-inner">
                <span className="text-blue-600">{current + 1}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-600">{enigmas.length}</span>
              </div>
            </div>
          </div>

          {/* Botón Siguiente - Solo visible en PC */}
          <button 
            onClick={nextEnigma}
            disabled={isTransitioning}
            className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 group"
          >
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Contenido del juego */}
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{game.name}</h2>
        <div className="mb-2 text-lg text-gray-800 text-center">{enigma.pista}</div>
        {showSubclue && enigma.subpista && (
          <div className="mb-2 text-base text-yellow-800 text-center animate__animated animate__fadeInDown">{enigma.subpista}</div>
        )}
        
        <EmojiAnswerBar answer={selected} onRemove={handleRemove} max={answerLength} />
        <EmojiPicker emojis={emojiOptions} onSelect={handleSelect} selected={selected} />
        
        <div className="flex flex-col items-center space-y-3 mt-4">
          <button
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 transform hover:-translate-y-1"
            onClick={handleSubmit}
            disabled={selected.length !== answerLength || loading}
          >
            {freeAvailable && attempts === 0 ? '✨ Intento Gratis' : `🪙 Intentar por ${COIN_COST} coins`}
          </button>
          
          {loading && <ProgressBarFeedback percent={feedback ?? 0} loading={loading} />}
          {feedback !== null && !loading && (
            <ProgressBarFeedback percent={feedback} loading={false} />
          )}
          
          <button 
            className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors duration-200 hover:scale-105 transform" 
            onClick={handleReset}
          >
            🔄 Borrar respuesta
          </button>
        </div>
      </div>
    </div>
  );
}
