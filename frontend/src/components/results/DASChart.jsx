import { motion } from 'framer-motion'

const dims = [
  { key: 'consensus_score',    label: 'Consensus',   color: '#7BA7A7' },
  { key: 'satisfaction_score', label: 'Satisfaction', color: '#9B8EC4' },
  { key: 'cohesion_score',     label: 'Cohesion',    color: '#C9A96E' },
  { key: 'affection_score',    label: 'Affection',   color: '#D4A5A5' },
]

export default function DASChart({ das }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {dims.map((d, i) => {
        const score = das[d.key]
        return (
          <motion.div key={d.key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#57534E' }}>{d.label}</span>
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', fontWeight: 300, color: d.color }}>
                {Math.round(score)}%
              </span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#EDEBE5', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: '999px', backgroundColor: d.color + 'CC' }}
                initial={{ width: '0%' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.2, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
