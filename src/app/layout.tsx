import type { ReactNode } from 'react';
import './globals.css';
import 'animate.css';

import BottomDock from '@/components/BottomDock';
import XpNotificationWrapper from '@/components/XpNotificationWrapper';
import { ToastProvider } from './context/ToastContext';
import { BottomDockProvider } from './context/BottomDockContext';

function BottomDockWrapper() {
  // Este hook solo funciona en cliente
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // Mostrar BottomDock en todas las páginas excepto en la bienvenida ('/')
  return pathname !== '/' ? <BottomDock /> : null;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <ToastProvider>
          <BottomDockProvider>
            {children}
            <BottomDockWrapper />
            <XpNotificationWrapper />
          </BottomDockProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
