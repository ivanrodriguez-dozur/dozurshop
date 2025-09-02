import type { ReactNode } from 'react';
import './globals.css';

import BottomDock from '@/components/BottomDock';

import { ToastProvider } from './context/ToastContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <ToastProvider>
          {children}
          {/* Mostrar BottomDock solo si no estamos en la página de bienvenida */}
          {typeof window !== 'undefined' && window.location.pathname !== '/' ? <BottomDock /> : null}
        </ToastProvider>
      </body>
    </html>
  );
}
