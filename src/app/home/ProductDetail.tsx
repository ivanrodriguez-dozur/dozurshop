"use client";
import Image from "next/image";
import { Product } from "./types";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

const colors = [
  { name: 'blue', code: '#4A90E2' },
  { name: 'black', code: '#181818' },
  { name: 'red', code: '#E94F4F' },
  { name: 'green', code: '#7ED957' }
];

// Utilidad para escapar entidades HTML problemáticas
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: { product: Product; quantity: number; size: string; color: string }) => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

// Detalle de producto (edita aquí el diseño y la info)
export default function ProductDetail({ product, onBack, onAddToCart, onFavorite, isFavorite }: ProductDetailProps) {
  if (!product) return null;
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('blue');
  const { showToast } = useToast();
  // Galería de imágenes (solo una imagen disponible)
  const images: string[] = [product.image_url];
  const [currentImg, setCurrentImg] = useState(0);
  // Lógica de tallas según tipo
  let sizes: (string|number)[] = [];
  if (product.category === 'ropa') sizes = ['XS', 'S', 'M', 'L', 'XL'];
  else if (product.category === 'calzado' || product.category === 'zapatillas') sizes = Array.from({length: 9}, (_,i)=>34+i);
  else sizes = ['Única'];
  const [size, setSize] = useState<string | number>(sizes[0]);
  // Swipe gallery handlers
  const handlePrevImg = () => setCurrentImg(i => (i === 0 ? images.length - 1 : i - 1));
  const handleNextImg = () => setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));
  // Favoritos
  const handleFavorite = () => {
    onFavorite();
    showToast(!isFavorite ? "Agregado a favoritos" : "Eliminado de favoritos");
  };
  // Add to cart
  const handleAddToCart = () => {
    onAddToCart({ product, quantity, size: String(size), color });
    showToast("Agregado al carrito");
  };
  return (
    <div style={{background: '#fff', minHeight: '100vh', color: '#181818', position: 'relative', paddingBottom: 90}}>
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 0 18px'}}>
        <button
          onClick={onBack}
          style={{background: 'none', border: 'none', color: '#181818', fontSize: 26, cursor: 'pointer', fontWeight: 700, transition: 'transform 0.15s'}}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >&larr;</button>
        <button
          onClick={handleFavorite}
          style={{background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.15s'}}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" style={{display: 'block'}}>
            <path
              d="M16 28s-8.5-6.7-11.3-10.1C2.1 15.2 2 12.1 4.2 9.9c2.2-2.2 5.7-2.2 7.9 0L16 13.8l3.9-3.9c2.2-2.2 5.7-2.2 7.9 0 2.2 2.2 2.1 5.3-.5 8C24.5 21.3 16 28 16 28z"
              fill={isFavorite ? '#b5ff00' : 'none'}
              stroke="#181818"
              strokeWidth="2"
              style={{transition: 'fill 0.2s'}}
            />
          </svg>
        </button>
      </div>
      {/* Imagen de producto */}
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '18px 0 0 0', position: 'relative', overflow: 'hidden'}}>
        {/* Galería deslizable */}
        <button onClick={handlePrevImg} style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.7)',border:'none',borderRadius:16,padding:8,zIndex:2,cursor:'pointer',fontSize:22,display:images.length>1?'block':'none'}}>‹</button>
        {(() => {
          const supabaseUrl = "https://ktpajrnflcqwgaoaywuu.supabase.co/storage/v1/object/public/products/";
          const imageUrl = images[currentImg] && !images[currentImg].startsWith("http")
            ? supabaseUrl + images[currentImg]
            : images[currentImg];
          return (
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={340}
              style={{
                width: '100%',
                maxWidth: 500,
                height: 340,
                objectFit: 'contain',
                borderRadius: 24,
                background: '#f5f5f5',
                boxShadow: '0 2px 16px #0001',
                margin: '0 auto',
                display: 'block',
                transition: 'all 0.3s'
              }}
            />
          );
        })()}
        <button onClick={handleNextImg} style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.7)',border:'none',borderRadius:16,padding:8,zIndex:2,cursor:'pointer',fontSize:22,display:images.length>1?'block':'none'}}>›</button>
        {/* Puntos indicadores */}
        {images.length > 1 && (
          <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:3}}>
            {images.map((_,i)=>(
              <span key={i} style={{width:10,height:10,borderRadius:'50%',background:i===currentImg?'#b5ff00':'#ddd',display:'block',transition:'background 0.2s'}} />
            ))}
          </div>
        )}
        <div style={{
          position: 'absolute',
          left: 18,
          bottom: 18,
          background: '#000',
          color: '#fff',
          borderRadius: 12,
          padding: '4px 16px',
          fontWeight: 700,
          fontSize: 22,
          zIndex: 2,
          boxShadow: '0 2px 8px #0002'
        }}>
          ${product.price.toLocaleString('es-CO')}
        </div>
      </div>
      {/* Info producto */}
      <div style={{padding: '24px 24px 0 24px'}}>
        <h2 style={{fontWeight: 700, fontSize: 24, margin: '18px 0 6px 0'}}>{product.name}</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
          <span style={{color: '#888', fontSize: 15}}>Wake Official</span>
          <span style={{color: '#b5ff00', fontSize: 13, fontWeight: 600}}>&#9679;</span>
          <span style={{color: '#888', fontSize: 15}}>{product.reviews}</span>
        </div>
          <div style={{color: '#222', fontSize: 16, marginBottom: 18, lineHeight: 1.5}}
            dangerouslySetInnerHTML={{ __html: typeof product.description === 'string' ? escapeHtml(product.description) : product.description }}
          />
        {/* Selector de talla según categoría */}
        {/* Selector de talla según tipo */}
        {sizes.length > 0 && (
          <div style={{margin: '18px 0 10px 0'}}>
            <div style={{fontWeight: 600, fontSize: 15, marginBottom: 6}}>Talla</div>
            <div style={{display: 'flex', gap: 10, flexWrap:'wrap'}}>
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    background: size === s ? '#b5ff00' : '#f5f5f5',
                    color: size === s ? '#181818' : '#888',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: size === s ? '0 2px 8px #b5ff0033' : 'none',
                    transition: 'all 0.2s, transform 0.15s'
                  }}
                  onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                  onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >{s}</button>
              ))}
            </div>
          </div>
        )}
        {/* Selector de color */}
        <div style={{margin: '10px 0 18px 0'}}>
          <div style={{fontWeight: 600, fontSize: 15, marginBottom: 6}}>Color</div>
          <div style={{display: 'flex', gap: 14}}>
            {colors.map(c => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: color === c.name ? '3px solid #b5ff00' : '2px solid #eee',
                  background: c.code,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: color === c.name ? '0 2px 8px #b5ff0033' : 'none',
                  transition: 'all 0.2s, transform 0.15s'
                }}
                onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Botonera inferior fija */}
      <div style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        background: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '16px 18px',
        zIndex: 110
      }}>
        <div className="quantity-selector" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          background: '#f5f5f5',
          borderRadius: 999,
          padding: '12px 80px',
          marginRight: 12,
          minWidth: 320,
          maxWidth: 420,
          justifyContent: 'center',
          width: 'auto',
        }}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="quantity-btn"
            style={{background: '#181818', color: '#fff', border: 'none', borderRadius: 16, width: 48, height: 48, fontSize: 28, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.15s'}}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >-</button>
          <span className="quantity-value" style={{fontSize: 24, fontWeight: 700, minWidth: 28, textAlign: 'center'}}>{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="quantity-btn"
            style={{background: '#181818', color: '#fff', border: 'none', borderRadius: 16, width: 48, height: 48, fontSize: 28, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.15s'}}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
            onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >+</button>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            background: '#b5ff00',
            color: '#181818',
            border: 'none',
            borderRadius: 16,
            padding: '16px 0',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #b5ff0033',
            width: '100%',
            maxWidth: 400,
            margin: '0 auto',
            display: 'block',
            transition: 'transform 0.15s',
          }}
          className="add-to-cart-btn"
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >Add to Cart</button>
        <style>{`
          @media (max-width: 599px) {
            .add-to-cart-btn {
              width: 95vw !important;
              font-size: 18px !important;
            }
            .quantity-selector {
              gap: 6px !important;
              padding: 8px 18px !important;
              min-width: 110px !important;
              max-width: 170px !important;
              border-radius: 999px !important;
            }
            .quantity-btn {
              width: 28px !important;
              height: 28px !important;
              font-size: 16px !important;
              border-radius: 8px !important;
            }
            .quantity-value {
              font-size: 15px !important;
              min-width: 10px !important;
            }
          }
          @media (min-width: 600px) {
            .add-to-cart-btn {
              width: 100% !important;
              max-width: 400px !important;
              font-size: 18px !important;
            }
            .quantity-selector {
              min-width: 140px !important;
              max-width: 220px !important;
              padding: 8px 28px !important;
              border-radius: 999px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
