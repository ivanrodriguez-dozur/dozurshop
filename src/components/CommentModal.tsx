"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";

type Comment = {
  id: string;
  avatar: string;
  text: string;
  fireCount: number;
  xCount: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  commentCount: number;
  onSend: (text: string) => void;
  onReact: (commentId: string, type: "fire" | "x") => void;
  onGift: () => void;                           // 🎁 sólo en barra inferior
  isMobile: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
};

export default function CommentModal({
  open,
  onClose,
  comments,
  commentCount,
  onSend,
  onReact,
  onGift,
  isMobile,
  videoRef,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ------- Pausar / reanudar video -------
  useEffect(() => {
    if (!videoRef?.current) return;
    if (open) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
  }, [open, videoRef]);

  // ------- Cerrar tocando el fondo -------
  const backdropClick = (e: React.MouseEvent) => {
    // evita cerrar si el click viene desde el panel
    if ((e.target as HTMLElement).dataset?.backdrop === "true") onClose();
  };

  // ------- Deslizar hacia abajo para cerrar -------
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);
  const threshold = 90; // px para cerrar

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    startY.current = e.touches[0].clientY;
    setDragY(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    setDragY(Math.max(0, dy));
  };
  const onTouchEnd = () => {
    if (!isMobile) return;
    if (dragY > threshold) onClose();
    setDragY(0);
    startY.current = null;
  };

  // ------- Teclado móvil: que el input no quede tapado -------
  // usamos 100svh + padding dinámico cuando el input gana foco
  const [bottomPad, setBottomPad] = useState(0);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onFocus = () => {
      // aproximación: dejamos espacio para teclado + safe area
      setBottomPad(20);
      // lleva el input al centro visible
      setTimeout(() => el.scrollIntoView({block: "center"}), 50);
    };
    const onBlur = () => setBottomPad(0);
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, []);

  // ordenar como tu captura: los nuevos abajo
  const list = useMemo(() => [...comments], [comments]);

  if (!open) return null;

  return (
    <div
      data-backdrop="true"
      onClick={backdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        // fondo con blur, tap para cerrar
        background: "rgba(0,0,0,.35)",
        backdropFilter: "blur(2px)",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        role="dialog"
        aria-label="Comentarios"
        className="w-full max-w-lg rounded-t-2xl bg-white shadow-xl flex flex-col"
        style={{
          // 100svh respeta el viewport “pequeño” cuando aparece el teclado iOS
          height: isMobile ? "70svh" : "55vh",
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? "transform 220ms cubic-bezier(.4,1.4,.6,1)" : "none",
          // respeta el notch inferior iOS
          paddingBottom: `calc(${bottomPad}px + env(safe-area-inset-bottom,0px))`,
        }}
      >
        {/* Handle de arrastre */}
        <div className="flex items-center justify-center pt-2">
          <div className="h-1.5 w-12 rounded-full bg-black/15" />
        </div>

        {/* Cabecera */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-bold text-lg">
            Comentarios ({commentCount})
          </span>
          {!isMobile && (
            <button
              onClick={onClose}
              className="text-2xl font-bold text-gray-500 hover:text-red-500"
              aria-label="Cerrar"
            >
              ×
            </button>
          )}
        </div>

        {/* Lista (scroll) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {list.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              Sé el primero en comentar
            </div>
          )}

          {list.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <img
                src={c.avatar}
                alt=""
                className="w-9 h-9 rounded-full bg-gray-200 object-cover"
              />
              <div className="flex-1">
                <div className="px-3 py-2 rounded-2xl bg-gray-100 text-sm text-gray-900">
                  {c.text}
                </div>

                {/* Reacciones: 🔥 y ❌ */}
                <div className="flex gap-4 mt-1 pl-1">
                  <button
                    onClick={() => onReact(c.id, "fire")}
                    className="flex items-center gap-1 text-orange-500 active:scale-95 transition"
                    aria-label="Fuego"
                  >
                    🔥 <span className="text-[13px]">{c.fireCount}</span>
                  </button>
                  <button
                    onClick={() => onReact(c.id, "x")}
                    className="flex items-center gap-1 text-red-500 active:scale-95 transition"
                    aria-label="Malo"
                  >
                    ❌ <span className="text-[13px]">{c.xCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de escribir + 🎁 (regalos sólo aquí) */}
        <form
          className="flex items-center gap-2 px-3 py-3 border-t bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            const val = inputRef.current?.value?.trim();
            if (!val) return;
            onSend(val);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          <button
            type="button"
            onClick={onGift}
            className="text-2xl"
            aria-label="Enviar regalo"
          >
            🎁
          </button>

          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe un comentario…"
              className="w-full rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              inputMode="text"
              autoCapitalize="sentences"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 text-blue-600 font-semibold"
            aria-label="Enviar comentario"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}