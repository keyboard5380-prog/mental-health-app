import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAssessment } from '../context/AssessmentContext'

const C = {
  sage: '#7BA77B', sageLight: '#A8C4A8', sagePale: '#E8F0E8',
  gold: '#C9A96E', goldPale: '#FAF3E8',
  rose: '#D4A5A5', rosePale: '#FDF5F5',
  teal: '#7BA7A7', tealPale: '#F0F7FA',
  text: '#2D2A24', mid: '#78716C', soft: '#A8A29E',
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] }
  })
}

const features = [
  {
    icon: '🫀',
    color: C.rose,
    bg: C.rosePale,
    title: 'Attachment Analysis',
    desc: 'Discover your relational blueprint through Adult Attachment Theory'
  },
  {
    icon: '🧭',
    color: C.gold,
    bg: C.goldPale,
    title: 'Gottman Method',
    desc: 'Identify communication patterns that shape your relationship trajectory'
  },
  {
    icon: '🛡️',
    color: C.teal,
    bg: C.tealPale,
    title: 'Trauma-Informed Care',
    desc: 'Gently explore how your history shapes your present relationships'
  },
  {
    icon: '🌿',
    color: C.sage,
    bg: C.sagePale,
    title: 'Personalised Support Plan',
    desc: 'Receive a stepped care plan tailored to your unique profile'
  },
]

const stats = [
  { num: '6', label: 'Research Domains' },
  { num: '34', label: 'Validated Questions' },
  { num: '8', label: 'Analysis Dimensions' },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { startAssessment } = useAssessment()

  const handleStart = () => {
    startAssessment()
    navigate('/assessment')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
    }}>
      <motion.div
        style={{ maxWidth: '720px', width: '100%', textAlign: 'center' }}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp} custom={0}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '36px' }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.sageLight}, ${C.teal})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px'
          }}>🌿</div>
          <span style={{
            fontFamily: '"DM Sans", sans-serif', color: C.sage,
            fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500
          }}>Serenova</span>
        </motion.div>

        <motion.h1
          variants={fadeUp} custom={1}
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(44px, 8vw, 76px)',
            fontWeight: 300,
            color: C.text,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}
        >
          Your path to<br />
          <em style={{ color: C.sage, fontStyle: 'italic' }}>relational clarity</em>
        </motion.h1>

        <motion.p
          variants={fadeUp} custom={2}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '17px', fontWeight: 300, lineHeight: 1.7,
            color: C.mid, maxWidth: '520px', margin: '0 auto 12px',
          }}
        >
          A thoughtful, evidence-based assessment rooted in attachment theory,
          the Gottman Method, and trauma-informed care — designed to illuminate
          your relationship patterns and guide you toward healing.
        </motion.p>

        <motion.p
          variants={fadeUp} custom={3}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px', color: C.soft, marginBottom: '48px'
          }}
        >
          ~25 minutes · 34 intelligent questions · Private & confidential
        </motion.p>

        <motion.div
          variants={fadeUp} custom={4}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px',
            marginBottom: '48px',
            textAlign: 'left',
          }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className="feature-card"
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.22 }}
            >
              <div className="icon-badge" style={{ backgroundColor: f.bg }}>
                <span style={{ fontSize: '18px' }}>{f.icon}</span>
              </div>
              <div>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                  fontSize: '14px', color: C.text, marginBottom: '4px'
                }}>{f.title}</p>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '12px',
                  color: C.soft, lineHeight: 1.5
                }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} custom={5}>
          <motion.button
            className="btn-primary"
            onClick={handleStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Begin Your Assessment
            <span style={{ fontSize: '18px', lineHeight: 1 }}>›</span>
          </motion.button>
        </motion.div>

        <motion.p
          variants={fadeUp} custom={6}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px', color: C.soft, marginTop: '20px'
          }}
        >
          Your responses are not stored on any server. This assessment is for self-awareness only.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '38px', fontWeight: 300,
                color: C.sage, lineHeight: 1
              }}>{s.num}</p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px', color: C.soft, marginTop: '6px'
              }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
