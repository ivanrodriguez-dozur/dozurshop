import React, { useRef } from "react";
import SectionHeader from "../components/SectionHeader";
import HorizontalScroll from "../components/HorizontalScroll";
import Image from "next/image";

type Photo = {
  id: string;
  image_url: string;
  is_published: boolean;
  alt?: string;
  user?: string;
};


// Paleta de colores para cada foto
const COLORS = [
  '#181818',
  '#b5ff00',
  '#00e0ff',
  '#ff00c8',
  '#ffb300',
  '#ff3b3b',
  '#00ffb3',
  '#a366ff',
  '#ff6f00',
  '#00ff6f',
];

export default function Photos({ photos, onSeeAll }: { photos: Photo[]; onSeeAll?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = React.useState(COLORS[0]);

  // Cambia el fondo según la foto más visible
  const handleScroll = () => {
    if (!sectionRef.current) return;
    const container = sectionRef.current;
    const children = Array.from(container.querySelectorAll('.photo-card')) as HTMLDivElement[];
    let maxVisible = 0;
    let visibleIdx = 0;
    children.forEach((child, idx) => {
      const rect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // Calcular el ancho visible de la foto
      const visibleWidth = Math.min(rect.right, containerRect.right) - Math.max(rect.left, containerRect.left);
      if (visibleWidth > maxVisible) {
        maxVisible = visibleWidth;
        visibleIdx = idx;
      }
    });
    setBgColor(COLORS[visibleIdx % COLORS.length]);
  };

  return (
    <section className="mb-8" style={{ transition: 'background 0.4s', background: bgColor }}>
      <SectionHeader title="Fotos" onSeeAll={onSeeAll} />
      <div
        ref={sectionRef}
        onScroll={handleScroll}
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: 16,
          padding: '12px 0',
          transition: 'background 0.4s',
          display: 'flex',
          gap: 32,
        }}
        className="scrollbar-hide"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card" style={{ minWidth: 260, maxWidth: 320, background: 'none' }}>
            <div className="rounded-xl overflow-hidden shadow relative" style={{ background: 'none' }}>
              <Image
                src={photo.image_url}
                alt={photo.alt || "Foto"}
                width={320}
                height={400}
                style={{ width: '100%', height: 340, objectFit: 'cover', background: 'none' }}
                unoptimized={true}
              />
              {photo.user && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-xs text-gray-200">{photo.user}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
