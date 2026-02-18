import { motion } from 'framer-motion'

export default function AppShell({ children }) {
  return (
    <div className="serenova-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
        <motion.div
          style={{
            position: 'absolute', top: '-120px', left: '-120px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,196,168,0.35) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute', top: '35%', right: '-80px',
            width: '420px', height: '420px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.22) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -30, 0], y: [0, 35, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          style={{
            position: 'absolute', bottom: '-60px', left: '25%',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197,220,220,0.28) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 25, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        />
        <motion.div
          style={{
            position: 'absolute', top: '20%', left: '40%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(221,213,240,0.18) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -20, 12, 0], y: [0, 25, -12, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  )
}
