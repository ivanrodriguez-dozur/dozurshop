"use client";

import { boomVideos } from "../booms/data";
import React, { useRef, useState, useEffect } from "react";

// Componente para video fullscreen con autoplay robusto y botón de volumen
interface VideoFullScreenProps {
  src: string;
  poster: string;
  isActive: boolean;
}

export function VideoFullScreen({ src, poster, isActive }: VideoFullScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, src]);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
      }}
      tabIndex={0}
      role="button"
      aria-label="Ver video"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted={!isActive ? true : false}
        playsInline
        controls={false}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          borderRadius: 0,
          background: "#000",
        }}
      />
    </div>
  );
}


const Page = () => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver to detect which video is visible
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current = cardRefs.current.slice(0, boomVideos.length);
    boomVideos.forEach((_, idx) => {
      const ref = cardRefs.current[idx];
      if (!ref) return;
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
              setVisibleIndex(idx);
            }
          });
        },
        {
          threshold: [0.7],
        }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => {
      observers.forEach((observer, idx) => {
        const ref = cardRefs.current[idx];
        if (ref) observer.unobserve(ref);
        observer.disconnect();
      });
    };
  }, [boomVideos.length]);

  return (
    <div
      ref={scrollRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        background: "#f7f7f7",
      }}
    >
      {boomVideos.map((boom, idx) => (
        <div
          key={boom.id}
          ref={el => (cardRefs.current[idx] = el)}
          className="snap-card"
          style={{
            width: "100vw",
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
          }}
        >
          <VideoFullScreen src={boom.video} poster={boom.cover} isActive={visibleIndex === idx} />
        </div>
      ))}
    </div>
  );
};

export default Page;
