"use client";
import Image from "next/image";
import { Product } from "../app/home/types";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onFavorite: (product: Product) => void;
  onProductClick?: (id: string) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onFavorite,
  onProductClick,
}: ProductCardProps) {
  // Fallback por si el producto no tiene image_url
  const DEFAULT_IMAGE = "https://placehold.co/220x220?text=Sin+Imagen";
  const { buildSupabasePublicUrl } = require('../lib/resolveImageUrl');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(product);
  };

  const handleCardClick = () => {
    if (onProductClick) onProductClick(product.id);
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        backgroundColor: "#fff",
        textAlign: "center",
        padding: "16px",
        maxWidth: "180px",
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.2s",
      }}
      onClick={handleCardClick}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 220,
          margin: "0 auto 8px auto",
          cursor: "pointer",
        }}
        onClick={handleCardClick}
      >
        <Image
          src={
            product.image_url && product.image_url.trim() !== ""
              ? buildSupabasePublicUrl(product.image_url)
              : DEFAULT_IMAGE
          }
          alt={product.name}
          width={164}
          height={220}
          style={{
            borderRadius: "14px",
            objectFit: "cover",
            width: "100%",
            height: 220,
            display: "block",
          }}
          onError={(e: any) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
          unoptimized={true}
        />

        {/* Botón corazón arriba a la derecha */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "#fff",
            border: "none",
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 16,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
            zIndex: 2,
            padding: 0,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={
            isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
          }
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#ff6600" : "none"}
            stroke="#ff6600"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-6.2-4.35-9-8.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 7.5C18.2 16.65 12 21 12 21z" />
          </svg>
        </button>

        {/* Precio abajo a la izquierda */}
        <div
          style={{
            position: "absolute",
            left: 8,
            bottom: 8,
            background: "#181818",
            color: "#fff",
            borderRadius: 14,
            padding: "2px 10px",
            fontWeight: 600,
            fontSize: 11,
            boxShadow: "0 1px 4px #0002",
            zIndex: 3,
          }}
        >
          {`$${product.price.toLocaleString("es-CO")}`}
        </div>
      </div>
    </div>
  );
}
