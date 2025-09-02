"use client";

import React, { memo, useMemo } from "react";
import { IconType } from "react-icons";
import { FaBookmark, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { BoomUI } from "@/store/boomStore"; // ajusta la ruta si es otra

type Props = {
  boom: BoomUI;
  index: number;
  isLiked: boolean;
  isSaved: boolean;
  isMobile: boolean;
  onLike: (idx: number) => void;
  onSave: (idx: number) => void;
  onShare: (idx: number) => void;
  onComment: (idx: number) => void;
  commentsCount?: number;
};

/** Botón de acción compacto con contador debajo */
function ActionButton({
  icon: Icon,
  label,
  color,
  active,
  onClick,
  count,
  size = 28,
}: {
  icon: IconType;
  label: string;
  color: string;
  active?: boolean;
  onClick: () => void;
  count?: number;
  size?: number;
}) {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onClick();
  };
  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{
        background: "none",
        border: "none",
        color: active ? color : "#fff",
        fontSize: size,
        cursor: "pointer",
        touchAction: "manipulation",
      }}
    >
      <Icon />
      {typeof count === "number" && (
        <div
          style={{
            fontSize: 12,
            color: "#fff",
            marginTop: 2,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          {count}
        </div>
      )}
    </button>
  );
}

/** Componente principal de acciones del video */
function VideoActionsBase({
  boom,
  index,
  isLiked,
  isSaved,
  isMobile,
  onLike,
  onSave,
  onShare,
  onComment,
  commentsCount,
}: Props) {
  // Posicionar columna un poco más baja en mobile
  const topPos = useMemo(() => (isMobile ? "62%" : "50%"), [isMobile]);

  // Conteos defensivos
  const likes = boom.likes ?? 0;
  const comments = boom.comments ?? 0;
  const saves = boom.saves ?? 0;
  const shares = boom.shares ?? 0;

  return (
   <div
  style={{
    position: "absolute",
    right: 24,
    top: topPos,
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 28,
    alignItems: "center",
    zIndex: 200,            // <- más alto
    pointerEvents: "auto",  // <- se asegura que reciba taps
  }}
>
      {/* 🔥 Like (fuego) con contador */}
<button
  type="button"
  aria-label="Me gusta"
  title="Me gusta"
  onPointerDown={(e) => e.stopPropagation()}
  onClick={(e) => {
    e.stopPropagation();
    onLike(index);
  }}
  style={{
    background: "none",
    border: "none",
    color: isLiked ? "#ff6b00" : "#fff",
    fontSize: 32,
    cursor: "pointer",
    lineHeight: 1,
    touchAction: "manipulation",
  }}
>
  <span role="img" aria-label="fuego">🔥</span>
  <div
    style={{
      fontSize: 14,
      color: "#fff",
      marginTop: 2,
      textAlign: "center",
    }}
  >
    {boom.likes ?? 0}
  </div>
</button>

      {/* Comentarios */}
      <ActionButton
        icon={FaCommentDots}
        label="Comentar"
        color="#fff"
        onClick={() => onComment(index)}
        count={typeof commentsCount === 'number' ? commentsCount : comments}
      />

      {/* Guardar */}
      <ActionButton
        icon={FaBookmark}
        label="Guardar"
        color="#f8c807ff"
        active={isSaved}
        onClick={() => onSave(index)}
        count={saves}
      />

      {/* Compartir */}
      <ActionButton
        icon={FaShareAlt}
        label="Compartir"
        color="#fff"
        onClick={() => onShare(index)}
        count={shares}
      />
    </div>
  );
}

/** memo para evitar re-renders cuando cambien otros booms */
const VideoActions = memo(VideoActionsBase, (prev, next) => {
  return (
    prev.index === next.index &&
    prev.isLiked === next.isLiked &&
    prev.isSaved === next.isSaved &&
    prev.isMobile === next.isMobile &&
    prev.boom.id === next.boom.id &&
    prev.boom.likes === next.boom.likes &&
    prev.boom.comments === next.boom.comments &&
    prev.boom.saves === next.boom.saves &&
    prev.boom.shares === next.boom.shares
  );
});

VideoActions.displayName = "VideoActions";
export default VideoActions;