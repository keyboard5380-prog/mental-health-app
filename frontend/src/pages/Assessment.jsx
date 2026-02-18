import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAssessment } from '../context/AssessmentContext'

const C = {
  sage: '#7BA77B', sageLight: '#A8C4A8', sagePale: '#E8F0E8',
  gold: '#C9A96E', teal: '#7BA7A7',
  text: '#2D2A24', mid: '#78716C', soft: '#A8A29E', pale: '#F8F6F2',
  ivory: '#FAF7F0',
}

const sectionIcons = {
  Heart: '🫀', MessageCircle: '💬', Shield: '🛡️',
  Sun: '☀️', Users: '👥', Home: '🏡',
}

function OptionButton({ option, isSelected, color, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: isSelected ? 0 : 4 }}
      whileTap={{ scale: 0.99 }}
      className="option-btn"
      style={isSelected ? {
        background: `linear-gradient(135deg, ${color}DD, ${color}99)`,
        borderColor: 'transparent',
        color: 'white',
        transform: 'none',
      } : {}}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
        border: isSelected ? '2px solid rgba(255,255,255,0.6)' : '2px solid #D6D0C8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isSelected ? 'rgba(255,255,255,0.2)' : 'transparent',
        transition: 'all 0.15s',
      }}>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: 'white'
            }}
          />
        )}
      </div>
      <span style={{ lineHeight: 1.45 }}>{option.label}</span>
    </motion.button>
  )
}

export default function Assessment() {
  const navigate = useNavigate()
  const {
    sections, currentSectionIndex, currentQuestionIndex,
    currentSection, currentQuestion,
    answers, loading, error,
    progressPercent, globalQuestionIndex, totalQuestions,
    isLastQuestion, loadQuestions, answerQuestion,
    goNext, goPrev, submitAssessment,
  } = useAssessment()

  useEffect(() => {
    if (sections.length === 0) loadQuestions()
  }, [])

  const handleNext = async () => {
    if (isLastQuestion) {
      await submitAssessment()
      navigate('/results')
    } else {
      goNext()
    }
  }

  const hasAnswered = currentQuestion && answers[currentQuestion.id] !== undefined

  if (loading && sections.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: `3px solid ${C.sageLight}`,
              borderTopColor: C.sage,
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: C.soft }}>
            Preparing your assessment...
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass card-shadow"
          style={{ borderRadius: '28px', padding: '48px 40px', maxWidth: '400px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif', fontSize: '26px',
            fontWeight: 300, color: C.text, marginBottom: '12px'
          }}>Connection Issue</h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: C.soft, fontSize: '14px', marginBottom: '24px' }}>
            {error}
          </p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Return Home
          </button>
        </motion.div>
      </div>
    )
  }

  if (!currentSection || !currentQuestion) return null

  const sectionIcon = sectionIcons[currentSection.icon] || '◆'
  const sectionColor = currentSection.color

  const isSafetyQuestion = currentQuestion.id === 'ram_01' || currentQuestion.id === 'phq_06'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '28px 24px' }}>

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: '700px', margin: '0 auto', width: '100%', marginBottom: '20px'
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '12px',
            color: C.soft, background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          ‹ Serenova
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {sections.map((s, i) => {
            const isActive = i === currentSectionIndex
            const isDone = i < currentSectionIndex
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  animate={{
                    backgroundColor: isDone || isActive ? s.color : '#DDD8D0',
                    scale: isActive ? 1.4 : 1,
                  }}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    opacity: i > currentSectionIndex ? 0.4 : 1,
                  }}
                />
                {i < sections.length - 1 && (
                  <div style={{
                    width: '20px', height: '1px',
                    backgroundColor: isDone ? s.color : '#DDD8D0',
                    opacity: i >= currentSectionIndex ? 0.4 : 1,
                  }} />
                )}
              </div>
            )
          })}
        </div>

        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.soft }}>
          {globalQuestionIndex + 1} / {totalQuestions}
        </span>
      </motion.header>

      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', marginBottom: '20px' }}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%`, backgroundColor: sectionColor }}
          />
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        maxWidth: '700px', margin: '0 auto', width: '100%',
      }}>

        <motion.div
          key={`sec-${currentSectionIndex}`}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
            backgroundColor: sectionColor + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            {sectionIcon}
          </div>
          <div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '14px', color: C.text }}>
              {currentSection.title}
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: C.soft }}>
              {currentSection.subtitle}
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 400,
                color: C.text,
                lineHeight: 1.35,
                marginBottom: '10px',
                letterSpacing: '-0.01em',
              }}>
                {currentQuestion.text}
              </h2>
              {currentQuestion.sub_text && (
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '13px',
                  color: C.soft, fontStyle: 'italic', lineHeight: 1.5
                }}>
                  {currentQuestion.sub_text}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQuestion.options.map((option, i) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <OptionButton
                    option={option}
                    isSelected={answers[currentQuestion.id] === option.value}
                    color={sectionColor}
                    onClick={() => answerQuestion(currentQuestion.id, option.value)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '36px'
        }}>
          <button
            onClick={goPrev}
            disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
            style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '13px',
              color: C.soft, background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              opacity: (currentSectionIndex === 0 && currentQuestionIndex === 0) ? 0.3 : 1,
            }}
          >
            ‹ Previous
          </button>

          <motion.button
            onClick={handleNext}
            disabled={!hasAnswered || (loading && isLastQuestion)}
            whileHover={hasAnswered ? { scale: 1.03 } : {}}
            whileTap={hasAnswered ? { scale: 0.97 } : {}}
            style={{
              fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
              fontSize: '14px', color: 'white',
              padding: '12px 28px', borderRadius: '999px', border: 'none',
              cursor: hasAnswered ? 'pointer' : 'not-allowed',
              opacity: hasAnswered ? 1 : 0.45,
              background: hasAnswered
                ? `linear-gradient(135deg, ${sectionColor}EE, ${sectionColor}AA)`
                : '#C8C2B8',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
          >
            {loading && isLastQuestion ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: '14px' }}
                >
                  ⟳
                </motion.span>
                Analysing…
              </>
            ) : isLastQuestion ? (
              <> Complete Assessment ✓ </>
            ) : (
              <> Next › </>
            )}
          </motion.button>
        </div>

        {isSafetyQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '24px', padding: '14px 18px', borderRadius: '14px',
              backgroundColor: 'rgba(197,220,220,0.35)', border: '1px solid rgba(123,167,167,0.3)',
            }}
          >
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '12px',
              color: '#4A7878', lineHeight: 1.6, textAlign: 'center'
            }}>
              🌿 <strong>You are safe here.</strong> If you are in immediate danger, please contact emergency services.
              In India: <strong>iCall — 9152987821</strong> · Emergency: <strong>112</strong>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
