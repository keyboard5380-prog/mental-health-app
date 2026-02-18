import { motion } from 'framer-motion'

export default function ScoreRing({ score, size = 120, strokeWidth = 8, color = '#7BA77B', label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#EDEBE5" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: size > 100 ? '28px' : '20px',
              fontWeight: 300, color: '#2D2A24', lineHeight: 1,
            }}
          >
            {Math.round(score)}
          </motion.span>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#2D2A24' }}>
            {label}
          </p>
          {sublabel && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#A8A29E', marginTop: '2px' }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
