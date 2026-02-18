import { motion, AnimatePresence } from 'framer-motion'
import { useAssessment } from '../../context/AssessmentContext'
import clsx from 'clsx'

const optionVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function QuestionCard({ question, sectionColor }) {
  const { answers, answerQuestion } = useAssessment()
  const selected = answers[question.id]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <div className="mb-8">
          <h2
            className="font-display text-2xl md:text-3xl font-light text-stone-800 leading-snug mb-3 text-balance"
            style={{ letterSpacing: '-0.01em' }}
          >
            {question.text}
          </h2>
          {question.sub_text && (
            <p className="font-body text-stone-400 text-sm italic leading-relaxed">
              {question.sub_text}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selected === option.value
            return (
              <motion.button
                key={option.value}
                custom={i}
                variants={optionVariants}
                initial="hidden"
                animate="visible"
                onClick={() => answerQuestion(question.id, option.value)}
                className={clsx(
                  'w-full text-left px-5 py-4 rounded-2xl font-body text-sm md:text-base transition-all duration-200 border',
                  'flex items-center gap-4 group',
                  isSelected
                    ? 'text-white shadow-soft'
                    : 'glass-card text-stone-600 hover:border-opacity-60'
                )}
                style={isSelected ? {
                  background: `linear-gradient(135deg, ${sectionColor}CC, ${sectionColor}99)`,
                  borderColor: sectionColor,
                } : {
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
                whileHover={{ scale: isSelected ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div
                  className={clsx(
                    'w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all',
                    isSelected ? 'bg-white border-white' : 'border-stone-200 group-hover:border-stone-300'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: sectionColor }}
                    />
                  )}
                </div>
                <span className="leading-snug">{option.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
