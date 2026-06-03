'use client'

import { useEffect, useRef } from 'react'

interface AnimatedBarProps {
  pct: number
  color?: string
  height?: string
  delay?: number
}

export default function AnimatedBar({
  pct,
  color = 'from-emerald-400 to-emerald-500',
  height = 'h-3',
  delay = 0,
}: AnimatedBarProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const t = setTimeout(() => el.classList.add('in'), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`overflow-hidden rounded-full bg-slate-100 ${height}`}>
      <div
        ref={ref}
        className={`bar-fill h-full rounded-full bg-gradient-to-r ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
