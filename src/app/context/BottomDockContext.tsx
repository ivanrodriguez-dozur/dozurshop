"use client";

import React, { createContext, useContext, useState } from 'react';

interface BottomDockContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const BottomDockContext = createContext<BottomDockContextType | undefined>(undefined);

export function BottomDockProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <BottomDockContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </BottomDockContext.Provider>
  );
}

export function useBottomDock() {
  const context = useContext(BottomDockContext);
  if (context === undefined) {
    throw new Error('useBottomDock must be used within a BottomDockProvider');
  }
  return context;
}
