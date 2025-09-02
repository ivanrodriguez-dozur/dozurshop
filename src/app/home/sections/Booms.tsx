import React, { useRef, useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import HorizontalScroll from "../components/HorizontalScroll";

type Boom = {
  id: string;
  title: string;
  video_url: string;
  is_published: boolean;
  cover?: string;
  user?: string;
  likes?: number;
};

export default function Booms({ booms, onSeeAll }: { booms: Boom[]; onSeeAll?: () => void }) {
  return (
    <section className="mb-8">
      <SectionHeader title="Booms destacados" onSeeAll={onSeeAll} />
      <HorizontalScroll>
        {booms.map((boom) => (
          <BoomVideoCard key={boom.id} boom={boom} />
        ))}
      </HorizontalScroll>
    </section>
  );
}

function BoomVideoCard({ boom }: { boom: Boom }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      video.play();
      setIsPlaying(true);
    };
    const handlePause = () => {
      video.pause();
      setIsPlaying(false);
    };

    // Detectar si es touch (móvil)
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      // PC: play/pause on hover
      const onMouseEnter = () => handlePlay();
      const onMouseLeave = () => handlePause();
      video.addEventListener("mouseenter", onMouseEnter);
      video.addEventListener("mouseleave", onMouseLeave);
      return () => {
        video.removeEventListener("mouseenter", onMouseEnter);
        video.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    // Móvil: play/pause on visibility
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
      observer.observe(video);
      return () => {
        observer && observer.disconnect();
      };
    }
  }, []);

  return (
    <div
      style={{
        minWidth: 220,
        maxWidth: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="rounded-xl overflow-hidden shadow bg-black relative"
        style={{ width: 220, height: 390, display: "flex", flexDirection: "column" }}
      >
        <video
          ref={videoRef}
          src={boom.video_url}
          poster={boom.cover}
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: 340,
            objectFit: "cover",
            borderRadius: 12,
            background: "#000",
          }}
        />
        <div
          className="p-2"
          style={{
            background: "rgba(0,0,0,0.7)",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <div className="text-white font-bold text-base truncate">{boom.title}</div>
          {(boom.user || boom.likes) && (
            <div className="text-xs text-gray-300">
              {boom.user ? boom.user : ""}
              {boom.user && boom.likes ? " · " : ""}
              {boom.likes ? `${boom.likes} likes` : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
