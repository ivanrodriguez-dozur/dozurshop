"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, MessageCircle, Share2, ShoppingCart, Play } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import CommentsModal from "./components/CommentsModal";

interface VideoContent {
  id: string;
  title: string;
  url: string;
  author?: string;
  stats: {
    likes?: number;
    comments?: number;
    shares?: number;
    plays?: number;
  };
}

interface ImageContent {
  id: string;
  title: string;
  url: string;
  author?: string;
  stats: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

interface TikTokFeedProps {
  videosContent: VideoContent[];
  boomsContent: VideoContent[];
  photosContent: ImageContent[];
  onProductBannerToggle?: (isVisible: boolean) => void;
}

const TikTokFeed: React.FC<TikTokFeedProps> = ({
  videosContent,
  boomsContent,
  photosContent,
  onProductBannerToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"videos" | "booms" | "fotos">(
    "booms"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interactions, setInteractions] = useState<{[key: string]: {liked: boolean, commented: boolean, shared: boolean}}>({});
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showProductBanner, setShowProductBanner] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const startX = useRef(0);
  const startY = useRef(0);

  const tabs = useMemo(() => ["videos", "booms", "fotos"] as const, []);

  const getCurrentList = () => {
    if (activeTab === "videos") return videosContent;
    if (activeTab === "booms") return boomsContent;
    if (activeTab === "fotos") return photosContent;
    return [];
  };

  const currentList = getCurrentList();

  // Reset al cambiar de tab
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(true); // Siempre reproduce al cambiar de tab
  }, [activeTab]);

  // Autoplay optimizado
  useEffect(() => {
    if (activeTab === "fotos") return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentIndex) {
        v.muted = !soundEnabled;
        if (isPlaying) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      } else {
        v.pause();
      }
    });
  }, [currentIndex, soundEnabled, activeTab, isPlaying]);

  // Scroll PC con wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // No hacer scroll si hay modales abiertos
      if (showCommentsModal || showProductBanner) return;
      
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Scroll lateral cambia de pestaña
        if (e.deltaX > 0 && tabs.indexOf(activeTab) < tabs.length - 1) {
          setActiveTab(tabs[tabs.indexOf(activeTab) + 1]);
        } else if (e.deltaX < 0 && tabs.indexOf(activeTab) > 0) {
          setActiveTab(tabs[tabs.indexOf(activeTab) - 1]);
        }
      } else {
        // Scroll vertical cambia de video
        if (e.deltaY > 0 && currentIndex < currentList.length - 1) {
          setCurrentIndex((i) => i + 1);
          setIsPlaying(true); // Reproduce automáticamente al cambiar video
        } else if (e.deltaY < 0 && currentIndex > 0) {
          setCurrentIndex((i) => i - 1);
          setIsPlaying(true); // Reproduce automáticamente al cambiar video
        }
      }
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: true });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [currentIndex, currentList.length, activeTab, tabs, showCommentsModal, showProductBanner]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // No hacer touch si hay modales abiertos
    if (showCommentsModal || showProductBanner) {
      e.stopPropagation();
      return;
    }
    
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // No hacer swipe si hay modales abiertos
    if (showCommentsModal || showProductBanner) {
      e.stopPropagation();
      return;
    }
    
    const touch = e.changedTouches[0];
    const diffX = startX.current - touch.clientX;
    const diffY = startY.current - touch.clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal → cambio tab
      const idx = tabs.indexOf(activeTab);
      if (diffX > 60 && idx < tabs.length - 1) {
        setActiveTab(tabs[idx + 1]);
      } else if (diffX < -60 && idx > 0) {
        setActiveTab(tabs[idx - 1]);
      }
    } else {
      // Vertical → cambio item
      if (diffY > 60 && currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsPlaying(true); // Reproduce automáticamente al cambiar video
      } else if (diffY < -60 && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setIsPlaying(true); // Reproduce automáticamente al cambiar video
      }
    }
  };

  const handleVideoTap = () => {
    // No hacer tap si hay modales abiertos
    if (showCommentsModal || showProductBanner) return;
    
    if (tapTimeout.current) {
      // Doble tap - marcar como liked con animación
      clearTimeout(tapTimeout.current);
      tapTimeout.current = null;
      
      const currentVideoId = currentList[currentIndex].id;
      setInteractions(prev => ({
        ...prev,
        [currentVideoId]: {
          ...prev[currentVideoId],
          liked: true
        }
      }));
      
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    } else {
      // Tap simple - pausar/reproducir y activar audio al reproducir
      tapTimeout.current = setTimeout(() => {
        const newPlayingState = !isPlaying;
        setIsPlaying(newPlayingState);
        
        // Si se reproduce, activar el audio
        if (newPlayingState) {
          setSoundEnabled(true);
        }
        
        tapTimeout.current = null;
      }, 300);
    }
  };

  const handleLikeClick = () => {
    const currentVideoId = currentList[currentIndex].id;
    setInteractions(prev => ({
      ...prev,
      [currentVideoId]: {
        ...prev[currentVideoId],
        liked: !prev[currentVideoId]?.liked
      }
    }));
  };

  const handleCommentClick = () => {
    const currentVideoId = currentList[currentIndex].id;
    setInteractions(prev => ({
      ...prev,
      [currentVideoId]: {
        ...prev[currentVideoId],
        commented: !prev[currentVideoId]?.commented
      }
    }));
    
    // Abrir modal de comentarios y pausar video
    setShowCommentsModal(true);
    setIsPlaying(false);
  };

  const handleShareClick = () => {
    const currentVideoId = currentList[currentIndex].id;
    setInteractions(prev => ({
      ...prev,
      [currentVideoId]: {
        ...prev[currentVideoId],
        shared: !prev[currentVideoId]?.shared
      }
    }));
  };

  const handleShopClick = () => {
    const newBannerState = !showProductBanner;
    setShowProductBanner(newBannerState);
    
    // Notificar al componente padre sobre el cambio
    if (onProductBannerToggle) {
      onProductBannerToggle(newBannerState);
    }
  };

  const handleCommentsModalClose = () => {
    setShowCommentsModal(false);
    setIsPlaying(true); // Reanudar video al cerrar comentarios
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Tabs */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center space-x-6 p-3 bg-gradient-to-b from-black/40 to-transparent">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-base font-semibold ${
              activeTab === tab
                ? "text-white border-b-2 border-white"
                : "text-white/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="w-full h-full overflow-hidden relative">
        {currentList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            Sin contenido en {activeTab}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentList[currentIndex].id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full relative"
            >
              {activeTab === "fotos" ? (
                <Image
                  src={(currentList[currentIndex] as ImageContent).url}
                  alt={currentList[currentIndex].title}
                  className="w-full h-full object-contain"
                  fill
                  sizes="100vw"
                />
              ) : (
                <>
                  <video
                    ref={el => { videoRefs.current[currentIndex] = el; }}
                    src={(currentList[currentIndex] as VideoContent).url}
                    className="w-full h-full object-contain"
                    playsInline
                    loop
                    autoPlay
                    muted={!soundEnabled}
                    onClick={handleVideoTap}
                  />
                  
                  {/* Animación de like en doble tap */}
                  {showLikeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="animate-bounce">
                        <Flame size={80} className="text-red-500 drop-shadow-lg" strokeWidth={2} />
                      </div>
                    </div>
                  )}

                  {/* Indicador de pausa */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="bg-black/50 rounded-full p-4">
                        <Play size={60} className="text-white" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                  
                  {/* Descripción y reproducciones en la parte inferior izquierda */}
                  <div className="absolute left-6 bottom-32 z-10 max-w-xs">
                    {/* Reproducciones */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Play size={16} strokeWidth={2} className="text-white" />
                      <span className="text-sm text-white opacity-80">
                        {(currentList[currentIndex].stats.plays ?? 0)} reproducciones
                      </span>
                    </div>
                    
                    {/* Descripción del video */}
                    <div className="text-white">
                      <p className="text-sm font-medium mb-1">
                        @{(currentList[currentIndex] as VideoContent).author || 'usuario'}
                      </p>
                      <p className="text-sm opacity-90 line-clamp-3">
                        {currentList[currentIndex].title}
                      </p>
                    </div>
                  </div>

                  {/* Botones de interacción y shop al lado derecho - más abajo */}
                  <div className="absolute right-6 bottom-32 flex flex-col items-center space-y-4 z-10">
                      <button 
                        onClick={handleLikeClick}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          interactions[currentList[currentIndex].id]?.liked 
                            ? 'bg-red-500 text-white scale-110' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`} 
                        title="Fuego"
                      >
                        <Flame size={28} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={handleCommentClick}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          interactions[currentList[currentIndex].id]?.commented 
                            ? 'bg-blue-500 text-white scale-110' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`} 
                        title="Comentar"
                      >
                        <MessageCircle size={28} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={handleShareClick}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          interactions[currentList[currentIndex].id]?.shared 
                            ? 'bg-green-500 text-white scale-110' 
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`} 
                        title="Compartir"
                      >
                        <Share2 size={28} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={handleShopClick}
                        className="bg-yellow-500 p-2 rounded-full text-white hover:bg-yellow-600 transition-all duration-200" 
                        title="Comprar"
                      >
                        <ShoppingCart size={28} strokeWidth={2} />
                      </button>
                  </div>
                </>
              )}

              {/* Overlay */}
              {/* Overlay eliminado para depuración visual */}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Banner publicitario de producto */}
      <AnimatePresence>
        {showProductBanner && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-30"
          >
            <div className="px-4 py-3 flex items-center space-x-3">
              {/* Miniatura del producto */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/assets/1.jpeg" // Placeholder - esto se reemplazará con datos reales
                  alt="Producto"
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                />
              </div>
              
              {/* Información del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  Producto Featured
                </h3>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  Descripción del producto que aparece en el video actual
                </p>
                <div className="mt-1">
                  <span className="text-lg font-bold text-green-600">$29.99</span>
                  <span className="text-sm text-gray-500 ml-2 line-through">$39.99</span>
                </div>
              </div>
              
              {/* Botón de compra */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200">
                Comprar
              </button>
              
              {/* Botón cerrar */}
              <button
                onClick={() => {
                  setShowProductBanner(false);
                  if (onProductBannerToggle) {
                    onProductBannerToggle(false);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de comentarios */}
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={handleCommentsModalClose}
        videoId={currentList[currentIndex]?.id || ''}
        videoTitle={currentList[currentIndex]?.title || ''}
      />
    </div>
  );
}

export default TikTokFeed;
