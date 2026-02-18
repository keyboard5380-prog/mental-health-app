import { motion } from 'framer-motion'

const styles = [
  { key: 'secure_score',       label: 'Secure',        color: '#7BA77B', desc: 'Balanced intimacy & autonomy' },
  { key: 'anxious_score',      label: 'Anxious',       color: '#C9A96E', desc: 'Fear of abandonment' },
  { key: 'avoidant_score',     label: 'Avoidant',      color: '#7BA7A7', desc: 'Self-protection via distance' },
  { key: 'disorganized_score', label: 'Disorganized',  color: '#D4A5A5', desc: 'Conflicting fear & desire' },
]

export default function AttachmentBars({ profile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {styles.map((s, i) => {
        const score = profile[s.key]
        const isDominant = profile.style === s.label
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            style={{ opacity: isDominant ? 1 : 0.65 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 500, color: '#2D2A24' }}>
                  {s.label}
                </span>
                {isDominant && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '999px',
                    backgroundColor: s.color, color: 'white',
                    fontSize: '10px', fontFamily: '"DM Sans", sans-serif', fontWeight: 500
                  }}>Primary</span>
                )}
              </div>
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 300, color: s.color }}>
                {Math.round(score)}
              </span>
            </div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#A8A29E', marginBottom: '6px' }}>
              {s.desc}
            </p>
            <div style={{ height: '6px', backgroundColor: '#EDEBE5', borderRadius: '999px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: '999px', backgroundColor: s.color }}
                initial={{ width: '0%' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.3, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
