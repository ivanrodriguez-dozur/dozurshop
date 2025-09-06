// Componente de avatar y nombre de usuario (edita aquí el nombre y la imagen)
'use client';
import Image from 'next/image';

export default function Avatar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Image
        src="/avatar.jpg"
        alt="Avatar"
        width={40}
        height={40}
        style={{ borderRadius: '50%', border: '2px solid #b5ff00' }}
      />
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Jobby</span>
    </div>
  );
}
