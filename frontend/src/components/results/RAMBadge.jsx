import { motion } from 'framer-motion'

const cfg = {
  Low:    { color: '#7BA77B', bg: '#F0F7F0', border: '#A8C4A8', icon: '🛡️', msg: 'You appear to be in a safe environment. Continue monitoring your wellbeing.' },
  Medium: { color: '#C9A96E', bg: '#FAF3E8', border: '#E0C898', icon: '⚠️', msg: 'Some concerns have been noted. Connecting with a professional is recommended.' },
  High:   { color: '#B07070', bg: '#FDF0F0', border: '#D4A5A5', icon: '🆘', msg: 'Your safety is the priority. Please reach out for immediate support.' },
}

export default function RAMBadge({ ram }) {
  const c = cfg[ram.risk_level] || cfg.Low
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      style={{ borderRadius: '18px', padding: '22px', backgroundColor: c.bg, border: `1px solid ${c.border}` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
          backgroundColor: c.color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
        }}>{c.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '13px', color: '#2D2A24' }}>
              Risk Level
            </span>
            <span style={{
              padding: '3px 12px', borderRadius: '999px', backgroundColor: c.color,
              color: 'white', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', fontWeight: 500
            }}>{ram.risk_level}</span>
          </div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#57534E', lineHeight: 1.55, marginBottom: '10px' }}>
            {c.msg}
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#78716C' }}>
            <strong>Recommended: </strong>{ram.application_response}
          </p>
          {ram.urgent_concerns.length > 0 && (
            <ul style={{ marginTop: '12px', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ram.urgent_concerns.map((concern, i) => (
                <li key={i} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#78716C', display: 'flex', gap: '8px' }}>
                  <span style={{ color: c.color }}>•</span> {concern}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {ram.risk_level === 'High' && (
        <div style={{
          marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid #F5D5D5'
        }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#B07070', textAlign: 'center', fontWeight: 500 }}>
            🆘 India Crisis Line: iCall — 9152987821 &nbsp;|&nbsp; Vandrevala Foundation: 1860-2662-345 &nbsp;|&nbsp; Emergency: 112
          </p>
        </div>
      )}
    </motion.div>
  )
}
