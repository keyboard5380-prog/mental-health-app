import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function SectionProgress({ sections, currentSectionIndex, currentQuestionIndex }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {sections.map((section, i) => {
        const isActive = i === currentSectionIndex
        const isCompleted = i < currentSectionIndex
        const isFuture = i > currentSectionIndex

        return (
          <div key={section.id} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                className={clsx(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                )}
                animate={{
                  backgroundColor: isCompleted
                    ? section.color
                    : isActive
                    ? section.color
                    : '#E5E1D8',
                  scale: isActive ? 1.3 : 1,
                  opacity: isFuture ? 0.5 : 1
                }}
              />
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-body text-stone-500 mt-1 whitespace-nowrap hidden md:block"
                  style={{ fontSize: '10px' }}
                >
                  {section.title}
                </motion.p>
              )}
            </div>
            {i < sections.length - 1 && (
              <motion.div
                className="h-px w-6 md:w-12"
                animate={{
                  backgroundColor: isCompleted ? section.color : '#E5E1D8',
                  opacity: isFuture ? 0.4 : 1
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
