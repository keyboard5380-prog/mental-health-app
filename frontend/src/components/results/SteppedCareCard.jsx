import { motion } from 'framer-motion'

const stepColors = { 0: '#7BA77B', 1: '#7BA7A7', 2: '#C9A96E', 3: '#9B8EC4', 4: '#D4A5A5' }

export default function SteppedCareCard({ plan }) {
  const color = stepColors[plan.step_level] ?? '#7BA77B'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass card-shadow"
      style={{ borderRadius: '22px', padding: '26px 28px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '20px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}CC, ${color}77)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Cormorant Garamond", serif', fontSize: '22px',
          fontWeight: 300, color: 'white',
        }}>
          {plan.step_level}
        </div>
        <div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#A8A29E', marginBottom: '3px' }}>
            Step {plan.step_level} — {plan.estimated_duration}
          </p>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 400, color: '#2D2A24', marginBottom: '6px' }}>
            {plan.step_name}
          </h3>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#78716C', lineHeight: 1.55 }}>
            {plan.description}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {plan.interventions.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
          >
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
              backgroundColor: color + '22', border: `1.5px solid ${color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', color: color, fontWeight: 700
            }}>✓</div>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#57534E', lineHeight: 1.5 }}>
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
