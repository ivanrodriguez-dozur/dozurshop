import { useState, useRef, useCallback } from 'react'

interface TouchDragOptions {
  onDragStart?: (id: number) => void
  onDragEnd?: (id: number, position: { x: number; y: number }) => void
  onDrag?: (id: number, position: { x: number; y: number }) => void
}

export function useTouchDrag(itemId: number, options: TouchDragOptions = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const dragRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // No prevenir default inmediatamente para permitir scroll
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    currentPos.current = { x: touch.clientX, y: touch.clientY }
    
    // Pequeño delay para determinar si es drag o scroll
    setTimeout(() => {
      setIsDragging(true)
      options.onDragStart?.(itemId)
      
      // Resaltar todas las zonas de drop
      const dropZones = document.querySelectorAll('[data-drop-zone]')
      dropZones.forEach(zone => {
        zone.classList.add('border-yellow-400', 'border-4', 'border-dashed')
      })
    }, 150)
  }, [itemId, options])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y
    
    currentPos.current = { x: touch.clientX, y: touch.clientY }
    setDragPosition({ x: deltaX, y: deltaY })
    options.onDrag?.(itemId, currentPos.current)
  }, [isDragging, itemId, options])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    setIsDragging(false)
    setDragPosition({ x: 0, y: 0 })
    
    // Encontrar el elemento bajo el punto de drop
    const dropElement = document.elementFromPoint(
      currentPos.current.x,
      currentPos.current.y
    )
    
    // Buscar el drop zone más cercano
    let dropZone = dropElement?.closest('[data-drop-zone]')
    
    // Si no encontramos uno directamente, buscar en un radio más amplio
    if (!dropZone) {
      const radius = 50 // Píxeles de tolerancia
      for (let i = -radius; i <= radius; i += 20) {
        for (let j = -radius; j <= radius; j += 20) {
          const testElement = document.elementFromPoint(
            currentPos.current.x + i,
            currentPos.current.y + j
          )
          dropZone = testElement?.closest('[data-drop-zone]')
          if (dropZone) break
        }
        if (dropZone) break
      }
    }
    
    if (dropZone) {
      const x = parseInt(dropZone.getAttribute('data-x') || '0')
      const y = parseInt(dropZone.getAttribute('data-y') || '0')
      options.onDragEnd?.(itemId, { x, y })
      
      // Feedback visual de éxito
      dropZone.classList.add('bg-green-200/50')
      setTimeout(() => {
        dropZone?.classList.remove('bg-green-200/50')
      }, 300)
    } else {
      // Feedback visual de fallo
      console.log('No se encontró zona de drop válida')
    }
    
    // Quitar el resaltado de las zonas de drop
    const dropZones = document.querySelectorAll('[data-drop-zone]')
    dropZones.forEach(zone => {
      zone.classList.remove('border-yellow-400', 'border-4', 'border-dashed')
    })
  }, [isDragging, itemId, options])

  return {
    isDragging,
    dragPosition,
    startPosition: startPos.current,
    dragHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    dragRef,
  }
}
