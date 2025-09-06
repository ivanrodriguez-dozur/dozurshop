'use client'

import { useState, useEffect } from 'react'

interface XpNotificationProps {
  xp: number
  message: string
  show: boolean
  onHide: () => void
}

export default function XpNotification({ xp, message, show, onHide }: XpNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onHide])

  if (!show) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-spin">
            ⚡
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-yellow-300">
                +{xp}
              </span>
              <span className="text-sm font-medium">XP</span>
            </div>
            <div className="text-xs text-white/80 mt-1">
              {message}
            </div>
          </div>
          
          <div className="text-lg animate-pulse">
            🎉
          </div>
        </div>
        
        {/* Barra de progreso simple */}
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  )
}
