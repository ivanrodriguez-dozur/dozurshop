"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

type VideoProps = {
  src: string;
  poster?: string | null;
  isActive: boolean;
  soundEnabled: boolean;
  /** Si es false, no se asigna el src (no descarga) y solo se muestra el poster */
  shouldLoad?: boolean;
};

const VideoFullScreen = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ src, poster, isActive, soundEnabled, shouldLoad = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0); // para forzar recarga tras error

    useImperativeHandle(ref, () => videoRef.current);

    // Asignar o quitar el src según shouldLoad (evita descargas fuera de ventana)
    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      // limpiar handlers previos
      const onLoaded = () => setIsLoaded(true);
      const onError = () => setHasError(true);
      v.addEventListener("loadeddata", onLoaded);
      v.addEventListener("error", onError);

      if (shouldLoad) {
        // asignamos el src solo cuando debe cargar
        if (v.getAttribute("src") !== src) {
          v.setAttribute("src", src);
          setIsLoaded(false);
          setHasError(false);
          // En algunos navegadores hace falta load() para coger el nuevo src
          try { v.load(); } catch {}
        }
      } else {
        // quitamos el src y liberamos el buffer
        if (v.getAttribute("src")) {
          v.removeAttribute("src");
          try { v.load(); } catch {}
        }
        setIsLoaded(false);
        setHasError(false);
      }

      return () => {
        v.removeEventListener("loadeddata", onLoaded);
        v.removeEventListener("error", onError);
      };
    }, [shouldLoad, src, reloadKey]);

    // Control de play/pause + sonido
    useEffect(() => {
      const v = videoRef.current;
      if (!v || !shouldLoad) return;

      if (isActive) {
        v.muted = !soundEnabled;
        v.volume = soundEnabled ? 1 : 0;
        v.play().catch(() => {
          // si falla autoplay, lo dejamos en mute
          v.muted = true;
          v.play().catch(() => {});
        });
      } else {
        v.pause();
      }
    }, [isActive, soundEnabled, shouldLoad]);

    // UI cuando NO debe cargar (solo poster, cero coste de red)
    if (!shouldLoad) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {poster ? (
            <img
              src={poster}
              alt="Poster"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              padding: "6px 10px",
              borderRadius: 12,
              background: "rgba(0,0,0,.45)",
              color: "#fff",
              fontSize: 12,
            }}
          >
            Desliza para reproducir
          </div>
        </div>
      );
    }

    // UI de error con reintento
    if (hasError) {
      return (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            gap: 12,
          }}
        >
          <div>Error cargando el video</div>
          <button
            onClick={() => {
              setHasError(false);
              setReloadKey((k) => k + 1);
            }}
            style={{
              padding: "8px 16px",
              background: "#ff6b00",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    // Video normal cuando debe cargar
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
          background: "#000",
        }}
        tabIndex={0}
        role="button"
        aria-label="Ver video"
      >
        <video
          key={reloadKey} // fuerza recreate en reintentos
          ref={videoRef}
          // src se setea por efecto (según shouldLoad) para evitar precarga
          poster={poster ?? undefined}
          loop
          playsInline
          // @ts-ignore: Safari iOS
          webkit-playsinline="true"
          controls={false}
          // cuando está activo dejamos "auto", si no "metadata"
          preload={isActive ? "auto" : "metadata"}
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            background: "#000",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 180ms ease",
          }}
        />

        {!isLoaded && (
          <div
            style={{
              position: "absolute",
              color: "#fff",
              fontSize: 13,
              opacity: 0.8,
            }}
          >
            Cargando…
          </div>
        )}
      </div>
    );
  }
);

VideoFullScreen.displayName = "VideoFullScreen";
export default VideoFullScreen;