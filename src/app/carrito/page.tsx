// Página de Carrito
"use client";

import { useCartStore } from "../../store/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Carrito() {
  const { items, add, remove, update, clear } = useCartStore();
  const router = useRouter();

  // Calcular totales
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = 250000;
  const delivery = subtotal >= freeShippingThreshold ? 0 : 10000;
  const discount = 0.1; // 10%
  const total = subtotal + delivery - subtotal * discount;

  const [showInfo, setShowInfo] = useState(false);
  return (
  <div style={{ maxWidth: 480, margin: '0 auto', padding: 24, paddingBottom: 110 }}>
      <h1 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, textAlign: 'center' }}>Carrito</h1>
      {items.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', marginTop: 60 }}>Tu carrito está vacío.</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {items.map(item => (
              <div key={item.id + '-' + item.size} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 12, position: 'relative', cursor: 'pointer' }} onClick={() => router.push(`/product/${item.slug ?? item.id}`)}>
                <Image src={item.image} alt={item.name} width={64} height={64} style={{ borderRadius: 12, background: '#f5f5f5' }} />
                <div style={{ flex: 1, marginLeft: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
                  {/* <div style={{ color: '#888', fontSize: 13 }}>{item.category || ''}</div> */}
                  <div style={{ fontWeight: 700, fontSize: 17, marginTop: 2 }}>${item.price.toLocaleString('es-CO')}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); update(item.id, item.size, Math.max(1, item.qty - 1)); }} style={{ border: 'none', background: '#eee', borderRadius: 12, width: 32, height: 32, fontSize: 20, fontWeight: 700, marginRight: 4 }}>-</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                <button onClick={e => { e.stopPropagation(); update(item.id, item.size, item.qty + 1); }} style={{ border: 'none', background: '#181818', color: '#fff', borderRadius: 12, width: 32, height: 32, fontSize: 20, fontWeight: 700, marginLeft: 4 }}>+</button>
                <button onClick={e => { e.stopPropagation(); remove(item.id, item.size); }} style={{ border: 'none', background: 'none', marginLeft: 10, color: '#ff3b3b', fontSize: 22, cursor: 'pointer' }} title="Eliminar">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3b3b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 10v6M15 10v6"/><path d="M5 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, background: '#fafafa', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Subtotal :</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Delivery Fee
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#eee',
                      color: '#888',
                      fontWeight: 700,
                      fontSize: 15,
                      textAlign: 'center',
                      lineHeight: '18px',
                      cursor: 'pointer',
                      marginLeft: 2
                    }}
                    onClick={() => setShowInfo(v => !v)}
                    title="Más información"
                  >
                    ?
                  </span>
                  {showInfo && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '110%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#fff',
                        color: '#181818',
                        border: '1px solid #eee',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px #0002',
                        padding: '8px 14px',
                        fontSize: 13,
                        minWidth: 180,
                        zIndex: 10,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      * Envío gratis por compras superiores a $250.000
                    </span>
                  )}
                </span>
              </span>
              <span>{delivery === 0 ? <span style={{ color: '#00b300', fontWeight: 700 }}>Gratis*</span> : `$${delivery.toLocaleString('es-CO')}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Discount :</span>
              <span style={{ color: '#ff3b3b' }}>10%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginTop: 10 }}>
              <span>Total :</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
            <button style={{ width: '100%', marginTop: 24, background: '#ffd600', color: '#181818', fontWeight: 700, fontSize: 20, border: 'none', borderRadius: 16, padding: '14px 0', boxShadow: '0 2px 8px #ffd60055', cursor: 'pointer' }}>Check out</button>
          </div>
        </>
      )}
    </div>
  );
}
