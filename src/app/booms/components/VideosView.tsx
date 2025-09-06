import React, { useRef, useState } from "react";

interface VideoItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  author?: string;
}

interface VideosViewProps {
  videos: VideoItem[];
}

const VideosView: React.FC<VideosViewProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentVideo = videos[currentIndex];

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSoundToggle = () => {
    setSoundEnabled((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = soundEnabled;
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex w-full h-screen bg-black items-center justify-center">
      {/* Descripción a la izquierda */}
      <div className="flex flex-col justify-center items-start w-1/4 h-full px-6 text-white">
        <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
        <p className="text-base opacity-80 mb-4">{currentVideo.description}</p>
        <span className="text-sm opacity-60">{currentVideo.author}</span>
      </div>
      {/* Video y controles */}
      <div className="relative flex flex-col items-center justify-center w-2/4 h-full">
        <video
          ref={videoRef}
          src={currentVideo.url}
          className="w-full h-[calc(100vh*0.7)] object-contain bg-black rounded-xl shadow-lg"
          style={{ aspectRatio: "16/9" }}
          autoPlay
          loop
          muted={!soundEnabled ? false : false}
          onClick={handleVideoClick}
        />
        {/* Controles de navegación */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-4 z-10">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="bg-white/20 px-3 py-1 rounded text-white">Prev</button>
          <button onClick={handleNext} disabled={currentIndex === videos.length - 1} className="bg-white/20 px-3 py-1 rounded text-white">Next</button>
        </div>
        {/* Botones de interacción tipo YouTube */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-6 z-10">
          <button className="bg-white/20 p-3 rounded-full text-white" title="Like">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button className="bg-white/20 p-3 rounded-full text-white" title="Comment">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button className="bg-white/20 p-3 rounded-full text-white" title="Share">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/><path d="M16 12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6"/></svg>
          </button>
          {/* Shop debajo de compartir */}
          <button className="bg-green-500 p-3 rounded-full text-white mt-2" title="Shop">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
          </button>
          {/* Botón de audio */}
          <button className="bg-white/20 p-3 rounded-full text-white mt-2" title="Audio" onClick={handleSoundToggle}>
            {soundEnabled ? (
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5v14l-7-7h4V5h3z"/><path d="M19 12a7 7 0 0 0-7-7"/></svg>
            ) : (
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5v14l-7-7h4V5h3z"/><path d="M19 12a7 7 0 0 0-7-7"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideosView;
