'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only activate on pointer (mouse) devices
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    let currentX = -100
    let currentY = -100
    let targetX = -100
    let targetY = -100
    let hovered = false
    let rafId: number

    const onMove = (e: MouseEvent) => {
      // Show on first move
      if (currentX === -100) {
        currentX = e.clientX
        currentY = e.clientY
      }
      targetX = e.clientX
      targetY = e.clientY
      cursor.style.opacity = '1'
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element
      hovered = !!el.closest('a, button, [data-cursor]')
    }

    const onOut = () => { hovered = false }

    const tick = () => {
      currentX = targetX
      currentY = targetY

      const size = hovered ? 40 : 16
      const half = size / 2

      cursor.style.width  = `${size}px`
      cursor.style.height = `${size}px`
      cursor.style.transform = `translate(${currentX - half}px, ${currentY - half}px)`
      cursor.style.background = hovered ? 'rgba(201,162,77,0.15)' : 'transparent'

      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1.5px solid #c9a24d',
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform, width, height',
        transition: 'width 0.2s cubic-bezier(0.25,0.1,0.25,1), height 0.2s cubic-bezier(0.25,0.1,0.25,1), background 0.2s cubic-bezier(0.25,0.1,0.25,1)',
      }}
    />
  )
}
