import React, { useRef, useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import HorizontalScroll from "../components/HorizontalScroll";

type LongVideo = {
  id: string;
  title: string;
  video_url: string;
  is_published: boolean;
  cover?: string;
  user?: string;
  views?: number;
};

export default function LongVideos({ videos, onSeeAll }: { videos: LongVideo[]; onSeeAll?: () => void }) {
  return (
    <section className="mb-8">
      <SectionHeader title="Videos largos" onSeeAll={onSeeAll} />
      <HorizontalScroll>
        {videos.map((video) => (
          <LongVideoCard key={video.id} video={video} />
        ))}
      </HorizontalScroll>
    </section>
  );
}

function LongVideoCard({ video }: { video: LongVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handlePlay = () => {
      vid.play();
      setIsPlaying(true);
    };
    const handlePause = () => {
      vid.pause();
      setIsPlaying(false);
    };

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      const onMouseEnter = () => handlePlay();
      const onMouseLeave = () => handlePause();
      vid.addEventListener("mouseenter", onMouseEnter);
      vid.addEventListener("mouseleave", onMouseLeave);
      return () => {
        vid.removeEventListener("mouseenter", onMouseEnter);
        vid.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    let observer: IntersectionObserver | null = null;
    if (isTouch) {
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) handlePlay();
            else handlePause();
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(vid);
      return () => {
        observer && observer.disconnect();
      };
    }
  }, []);

  return (
    <div key={video.id} style={{ minWidth: 320, maxWidth: 400 }}>
      <div className="rounded-lg overflow-hidden shadow bg-black relative">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.cover}
          muted
          loop
          playsInline
          style={{ width: '100%', height: 220, objectFit: 'cover' }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="text-white font-bold text-base truncate">{video.title}</div>
          {(video.user || video.views) && (
            <div className="text-xs text-gray-300">
              {video.user ? video.user : ''}
              {video.user && video.views ? ' · ' : ''}
              {video.views ? `${video.views} vistas` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
