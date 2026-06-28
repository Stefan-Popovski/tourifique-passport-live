import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { useState, useEffect, useRef } from 'react'

export default function PointsBadge({ value }) {
  const { points } = useStore()
  const displayPoints = value ?? points
  const [flash, setFlash] = useState(false)
  const prevRef = useRef(displayPoints)

  useEffect(() => {
    if (displayPoints !== prevRef.current) {
      setFlash(true)
      prevRef.current = displayPoints
      const t = setTimeout(() => setFlash(false), 800)
      return () => clearTimeout(t)
    }
  }, [displayPoints])

  return (
    <motion.div
      animate={flash ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.4 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: flash ? '#FACC15' : 'rgba(250,204,21,0.16)',
        border: '1px solid rgba(245,158,11,0.55)',
        borderRadius: 999, padding: '6px 13px',
        transition: 'background 0.3s',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={flash ? '#9A7426' : '#FACC15'} stroke="#9A7426" strokeWidth="1" strokeLinejoin="round">
        <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 17.8 5.5 20l1.5-6.5-5-4.4 6.6-.6z" />
      </svg>
      <span style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
        fontSize: 13.5, color: flash ? '#14101F' : '#6D28D9',
      }}>
        {displayPoints.toLocaleString()}
      </span>
    </motion.div>
  )
}
