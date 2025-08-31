import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Configuración editable del banner
const bannerConfig = {
  images: [
    'https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/1.jpg',
    'https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/10.jpg',
    'https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/2.jpg',
  ],
  title: 'Bienvenido Micrero! Los Mejores descuentos se van pronto', // Edita este texto a tu gusto
  timerSeconds: 24 * 60 * 60, // Tiempo inicial del reloj en segundos (ejemplo: 24 horas)
  bannerHeight: 160, // Alto del banner en px
  bannerRadius: 20, // Border radius del banner en px
  bannerMarginX: 16, // Margen horizontal
  bannerMarginBottom: 20, // Margen inferior
  bannerPaddingX: 24, // Padding horizontal
  bannerPaddingY: 22, // Padding vertical
  gradients: [
    'linear-gradient(90deg, #eff307ff 0%, #181818 100%)',
    'linear-gradient(90deg, #00ff73ff 0%, #181818 100%)',
    'linear-gradient(90deg, #00ccffff 0%, #181818 100%)',
    'linear-gradient(90deg, #3c0af0ff 0%, #181818 100%)',
  ],
  // --- Personalización del reloj ---
  // Puedes editar el tamaño del reloj cambiando el padding (espaciado interno) aquí:
  // Ejemplo: '2px 8px' (vertical horizontal). A menor padding, más pequeño y pegado el reloj.
  // Puedes cambiar la posición del reloj usando Tailwind o estilos en el div que lo contiene (por ejemplo, agregando margin o usando justify-start/end en el flex padre).
  clockBoxPadding: '2px 8px', // Padding de la caja del reloj (tamaño)
};

/**
 * BannerPublicitario
 *
 * Este componente muestra un banner publicitario simple con:
 * - Imagen rotativa (puedes cambiar las imágenes en bannerConfig.images)
 * - Texto principal editable
 * - Reloj regresivo (puedes cambiar el tiempo en bannerConfig.timerSeconds)
 * - Fondo con gradiente animado (puedes editar los colores en bannerConfig.gradients)
 *
 * Edita el texto, imágenes y estilos a tu gusto para personalizar el banner.
 */
export default function BannerPublicitario() {
  // Colores visibles para el reloj
  const clockColors = ['#fbff00ff', '#00ff9dff', '#2196f3', '#e91e63', '#00e676', '#ffeb3b'];
  const [clockColorIndex, setClockColorIndex] = useState(0);

  // Cambia el color del reloj cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setClockColorIndex((prev) => (prev + 1) % clockColors.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const [timer, setTimer] = useState(bannerConfig.timerSeconds);
  const [gradient, setGradient] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);

  // Timer regresivo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cambia el gradiente cada 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setGradient((g) => (g + 1) % bannerConfig.gradients.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cambia la imagen cada 20s
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIdx((idx) => (idx + 1) % bannerConfig.images.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Formatea el tiempo en formato hh:mm:ss
  function formatTime(s: number) {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  return (
    <div
      className="flex flex-row items-center relative overflow-hidden shadow-lg box-border"
      style={{
        width: '100%',
        minHeight: bannerConfig.bannerHeight,
        maxHeight: bannerConfig.bannerHeight + 20,
        borderRadius: bannerConfig.bannerRadius,
        marginLeft: bannerConfig.bannerMarginX,
        marginRight: bannerConfig.bannerMarginX,
        marginBottom: bannerConfig.bannerMarginBottom,
        paddingLeft: bannerConfig.bannerPaddingX,
        paddingRight: bannerConfig.bannerPaddingX,
        paddingTop: bannerConfig.bannerPaddingY,
        paddingBottom: bannerConfig.bannerPaddingY,
        background: bannerConfig.gradients[gradient],
        transition: 'background 1.5s cubic-bezier(0.4,0,0.2,1)',
        boxSizing: 'border-box',
      }}
    >
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-white text-2xl font-bold whitespace-pre-line mb-2">
          {bannerConfig.title}
        </h2>
        <div
          className="text-lg font-mono font-bold flex items-center justify-center"
          style={{
            color: '#181818',
            background: clockColors[clockColorIndex],
            borderRadius: '8px',
            padding: bannerConfig.clockBoxPadding,
            border: `2px solid ${clockColors[clockColorIndex]}`,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            transition: 'background 0.5s, border 0.5s, color 0.5s',
            width: 'fit-content',
            minWidth: '80px',
            letterSpacing: '2px',
            userSelect: 'none',
          }}
        >
          {formatTime(timer)}
        </div>
      </div>
      <div className="flex-shrink-0 ml-6">
        <Image
          src={bannerConfig.images[imageIdx]}
          alt="Banner"
          width={120}
          height={135}
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
