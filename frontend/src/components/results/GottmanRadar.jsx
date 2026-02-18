import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  const level = val > 60 ? 'High' : val > 30 ? 'Moderate' : 'Low'
  const color = val > 60 ? '#B07070' : val > 30 ? '#C9A96E' : '#7BA77B'
  return (
    <div style={{
      background: 'rgba(253,252,248,0.95)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.7)', borderRadius: '12px',
      padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#A8A29E' }}>
        {payload[0].name}
      </p>
      <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 300, color }}>
        {Math.round(val)}
      </p>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color }}>
        {level} presence
      </p>
    </div>
  )
}

export default function GottmanRadar({ gottman }) {
  const data = [
    { subject: 'Criticism',     value: gottman.criticism_score,     fullMark: 100 },
    { subject: 'Contempt',      value: gottman.contempt_score,      fullMark: 100 },
    { subject: 'Stonewalling',  value: gottman.stonewalling_score,  fullMark: 100 },
    { subject: 'Defensiveness', value: gottman.defensiveness_score, fullMark: 100 },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data}>
          <PolarGrid stroke="#E8E3DA" />
          <PolarAngleAxis dataKey="subject" tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fill: '#78716C' }} />
          <Radar name="Score" dataKey="value" stroke="#D4A5A5" fill="#D4A5A5" fillOpacity={0.22} strokeWidth={2} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
