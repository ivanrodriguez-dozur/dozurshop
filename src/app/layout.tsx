
"use client";

import './globals.css';
import type { ReactNode } from 'react';

import BottomDock from '../components/BottomDock';
import { ToastProvider } from './context/ToastContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white">
        <ToastProvider>
          {children}
          <BottomDock />
        </ToastProvider>
      </body>
    </html>
  );
}
