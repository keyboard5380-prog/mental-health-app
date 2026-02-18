import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAssessment } from '../context/AssessmentContext'
import ScoreRing from '../components/results/ScoreRing'
import AttachmentBars from '../components/results/AttachmentBars'
import GottmanRadar from '../components/results/GottmanRadar'
import RAMBadge from '../components/results/RAMBadge'
import SteppedCareCard from '../components/results/SteppedCareCard'
import DASChart from '../components/results/DASChart'

const C = {
  sage: '#7BA77B', sagePale: '#E8F0E8', sageDeep: '#4A7050',
  gold: '#C9A96E', goldPale: '#FAF3E8',
  rose: '#D4A5A5', roseDeep: '#B07070', rosePale: '#FDF5F5',
  teal: '#7BA7A7', tealPale: '#F0F7FA', tealDeep: '#4A7878',
  lavender: '#9B8EC4',
  text: '#2D2A24', mid: '#78716C', soft: '#A8A29E', pale: '#F8F6F2',
}

const revealY = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
}

function Section({ i, title, subtitle, iconEmoji, color, children }) {
  return (
    <motion.div
      custom={i}
      variants={revealY}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="glass card-shadow"
      style={{ borderRadius: '24px', padding: '28px 30px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '22px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '13px', flexShrink: 0,
          backgroundColor: color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px'
        }}>
          {iconEmoji}
        </div>
        <div>
          <h3 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '22px', fontWeight: 400, color: C.text, lineHeight: 1.2, margin: 0
          }}>{title}</h3>
          {subtitle && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: C.soft, marginTop: '3px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

function PHQMeter({ phq }) {
  const levels = ['Minimal', 'Mild', 'Moderate', 'Severe']
  const colors = [C.sage, C.gold, C.rose, C.roseDeep]
  const idx = levels.indexOf(phq.severity)
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {levels.map((lv, i) => (
          <div key={lv} style={{ flex: 1, textAlign: 'center' }}>
            <motion.div
              style={{
                height: '10px', borderRadius: '999px', marginBottom: '6px',
                backgroundColor: i <= idx ? colors[i] : '#EDEBE5',
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
            />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '11px',
              color: i === idx ? colors[i] : '#C0BAB2',
              fontWeight: i === idx ? 600 : 400,
            }}>{lv}</span>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: C.pale, borderRadius: '14px', padding: '14px 16px', marginBottom: '16px' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.mid, lineHeight: 1.6 }}>
          {phq.clinical_recommendation}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {[
          { label: 'PHQ-9 (Depression)', value: Math.round(phq.phq9_score), max: 27 },
          { label: 'GAD-7 (Anxiety)',    value: Math.round(phq.gad7_score), max: 21 },
          { label: 'PHQ-ADS Total',      value: Math.round(phq.total_score), max: 48 },
        ].map(item => (
          <div key={item.label} style={{
            backgroundColor: '#FDFCF8', border: '1px solid #EDEBE5',
            borderRadius: '13px', padding: '12px', textAlign: 'center'
          }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', fontWeight: 300, color: C.text }}>
              {item.value}
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: C.soft, lineHeight: 1.4 }}>
              {item.label}
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#D0CCC5' }}>/ {item.max}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TraumaCard({ trauma }) {
  const riskColors = { Low: C.sage, Moderate: C.gold, Elevated: C.rose, High: C.roseDeep }
  const color = riskColors[trauma.risk_level] ?? C.sage
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <span style={{
          padding: '5px 14px', borderRadius: '999px', backgroundColor: color,
          color: 'white', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 500
        }}>{trauma.risk_level} Risk</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#EDEBE5' }} />
      </div>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.mid, lineHeight: 1.6, marginBottom: '20px' }}>
        {trauma.description}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Childhood Trauma', value: trauma.childhood_trauma_indicators },
          { label: 'Interpersonal',    value: trauma.ipt_indicators },
          { label: 'PTSD Markers',     value: trauma.ptsd_indicators },
        ].map(item => (
          <div key={item.label} style={{ backgroundColor: C.pale, borderRadius: '13px', padding: '12px', textAlign: 'center' }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', fontWeight: 300, color }}>
              {Math.round(item.value)}
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: C.soft, lineHeight: 1.4 }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 500, color: C.mid, marginBottom: '12px' }}>
        Recommendations
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {trauma.recommendations.map((rec, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0, marginTop: '6px' }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.mid, lineHeight: 1.55 }}>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GottmanSection({ g }) {
  return (
    <div>
      <GottmanRadar gottman={g} />
      <div style={{ marginTop: '16px', backgroundColor: C.tealPale, borderRadius: '14px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.mid, fontWeight: 500 }}>
            Positive Interaction Ratio
          </span>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 300, color: C.tealDeep }}>
            {g.positive_ratio}:1
          </span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#D5E8E8', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: '999px', backgroundColor: C.teal }}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min((g.positive_ratio / 5) * 100, 100)}%` }}
            transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: C.soft, marginTop: '6px' }}>
          Gottman's ideal is <strong>5:1</strong> or higher
        </p>
      </div>
      {g.horsemen_present.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.soft, fontWeight: 500, marginBottom: '8px' }}>
            Active patterns to address:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {g.horsemen_present.map(h => (
              <span key={h} style={{
                padding: '5px 14px', borderRadius: '999px', fontFamily: '"DM Sans", sans-serif',
                fontSize: '12px', color: C.roseDeep,
                backgroundColor: '#FDF0F0', border: '1px solid #F5D5D5'
              }}>{h}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #EDEBE5', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.soft }}>Trajectory:</span>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: C.tealDeep }}>
          {g.relationship_trajectory}
        </span>
      </div>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { result, resetAssessment } = useAssessment()

  useEffect(() => { if (!result) navigate('/') }, [result, navigate])
  if (!result) return null

  const overallColor = result.overall_wellbeing_score >= 70 ? C.sage : result.overall_wellbeing_score >= 45 ? C.gold : C.rose

  return (
    <div style={{ minHeight: '100vh', padding: '48px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>🌿</span>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: C.sage, fontWeight: 500 }}>
              Serenova
            </span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 'clamp(38px, 7vw, 68px)', fontWeight: 300,
            color: C.text, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '16px'
          }}>
            Your <em style={{ color: C.sage, fontStyle: 'italic' }}>Wellbeing</em> Report
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: C.soft, maxWidth: '420px', margin: '0 auto', lineHeight: 1.65 }}>
            Synthesised across 6 evidence-based dimensions. Every insight here is an invitation, not a verdict.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass card-shadow"
          style={{ borderRadius: '28px', padding: '36px', marginBottom: '24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
            <ScoreRing score={result.overall_wellbeing_score} size={160} strokeWidth={10} color={overallColor} label="Overall Wellbeing" sublabel="Score out of 100" />
            <div style={{ width: '100%' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: C.mid, lineHeight: 1.65, marginBottom: '22px', textAlign: 'center' }}>
                {result.summary}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ backgroundColor: C.sagePale, borderRadius: '16px', padding: '16px' }}>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: C.sageDeep, marginBottom: '10px' }}>
                    ✦ Positive Highlights
                  </p>
                  {result.positive_highlights.map((h, i) => (
                    <p key={i} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.mid, lineHeight: 1.5, marginBottom: '7px' }}>
                      · {h}
                    </p>
                  ))}
                </div>
                <div style={{ backgroundColor: C.goldPale, borderRadius: '16px', padding: '16px' }}>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#8A6030', marginBottom: '10px' }}>
                    ◆ Priority Focus Areas
                  </p>
                  {result.priority_focus_areas.map((f, i) => (
                    <p key={i} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.mid, lineHeight: 1.5, marginBottom: '7px' }}>
                      · {f}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px', marginBottom: '18px' }}>
          <Section i={1} title="Attachment Style" subtitle="Adult Attachment Theory" iconEmoji="🫀" color={C.rose}>
            <div style={{ backgroundColor: C.rosePale, borderRadius: '14px', padding: '16px', marginBottom: '18px' }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 400, color: C.text, marginBottom: '6px' }}>
                {result.attachment_profile.style}{' '}
                <em style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontStyle: 'italic', color: C.rose, fontWeight: 300 }}>attachment</em>
              </p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.mid, lineHeight: 1.6 }}>
                {result.attachment_profile.description}
              </p>
            </div>
            <AttachmentBars profile={result.attachment_profile} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '18px' }}>
              <div style={{ backgroundColor: C.sagePale, borderRadius: '13px', padding: '12px' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: C.sageDeep, marginBottom: '8px' }}>Strengths</p>
                {result.attachment_profile.strengths.slice(0, 2).map((s, i) => (
                  <p key={i} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: C.mid, lineHeight: 1.5, marginBottom: '5px' }}>· {s}</p>
                ))}
              </div>
              <div style={{ backgroundColor: C.goldPale, borderRadius: '13px', padding: '12px' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', fontWeight: 600, color: '#8A6030', marginBottom: '8px' }}>Growth Areas</p>
                {result.attachment_profile.growth_areas.slice(0, 2).map((g, i) => (
                  <p key={i} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: C.mid, lineHeight: 1.5, marginBottom: '5px' }}>· {g}</p>
                ))}
              </div>
            </div>
          </Section>

          <Section i={2} title="Communication Dynamics" subtitle="Gottman's Four Horsemen Analysis" iconEmoji="💬" color={C.teal}>
            <GottmanSection g={result.gottman_analysis} />
          </Section>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px', marginBottom: '18px' }}>
          <Section i={3} title="Emotional Wellbeing" subtitle="PHQ-ADS — Anxiety & Depression Composite" iconEmoji="🧠" color={C.lavender}>
            <PHQMeter phq={result.phq_ads_result} />
          </Section>

          <Section i={4} title="Relationship Satisfaction" subtitle="Dyadic Adjustment Scale (DAS)" iconEmoji="💑" color={C.gold}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '22px' }}>
              <ScoreRing score={result.das_result.total_score} size={90} strokeWidth={7} color={C.gold} />
              <div>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 400, color: C.text, marginBottom: '5px' }}>
                  {result.das_result.adaptation_level}
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.soft, lineHeight: 1.55, maxWidth: '220px' }}>
                  {result.das_result.description}
                </p>
              </div>
            </div>
            <DASChart das={result.das_result} />
          </Section>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <Section i={5} title="Trauma Awareness Profile" subtitle="Childhood & interpersonal trauma research" iconEmoji="🌿" color={C.sage}>
            <TraumaCard trauma={result.trauma_profile} />
          </Section>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <Section i={6} title="Safety Assessment (RAM)" subtitle="Risk Assessment Matrix — Red / Amber / Green" iconEmoji="🛡️" color={C.teal}>
            <RAMBadge ram={result.ram_result} />
          </Section>
        </div>

        <motion.div
          custom={7} variants={revealY} initial="hidden" whileInView="visible" viewport={{ once: true }}
          style={{ marginBottom: '18px' }}
        >
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', fontWeight: 300, color: C.text, marginBottom: '5px' }}>
            Your Personalised Support Plan
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.soft, marginBottom: '14px' }}>
            Stepped care recommendation based on your unique profile
          </p>
          <SteppedCareCard plan={result.stepped_care} />
        </motion.div>

        <Section i={8} title="Daily Check-In Practice" subtitle="Small rituals that prevent disconnection" iconEmoji="📅" color={C.rose}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.soft, lineHeight: 1.6, marginBottom: '18px' }}>
            Grounded in Gottman's 5:1 ratio principle — these micro-moments build trust and nervous system co-regulation over time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.daily_checkin_plan.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '13px 16px',
                  borderRadius: '14px', backgroundColor: i % 2 === 0 ? C.pale : C.sagePale,
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>{item.split(' ')[0]}</span>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: C.mid, lineHeight: 1.5 }}>
                  {item.slice(item.indexOf(' ') + 1)}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '56px 0 32px' }}
        >
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 300, fontStyle: 'italic', color: C.mid, marginBottom: '8px' }}>
            "Awareness is the first act of compassion."
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#C0BAB2' }}>
            — Rooted in trauma-informed care philosophy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '32px', flexWrap: 'wrap' }}
        >
          <button
            className="btn-ghost"
            onClick={() => { resetAssessment(); navigate('/') }}
          >
            ↺ &nbsp;Retake Assessment
          </button>
          <button
            className="btn-primary"
            onClick={() => window.print()}
          >
            🖨 &nbsp;Save / Print Report
          </button>
        </motion.div>

        <p style={{
          textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '11px',
          color: '#C0BAB2', maxWidth: '480px', margin: '0 auto 48px', lineHeight: 1.7
        }}>
          This tool is for psychoeducation and self-awareness only. It does not constitute clinical diagnosis or treatment. Please consult a licensed mental health professional for personalised clinical support.
        </p>
      </div>
    </div>
  )
}
