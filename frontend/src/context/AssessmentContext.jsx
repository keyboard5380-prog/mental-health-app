import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const AssessmentContext = createContext(null)

export function AssessmentProvider({ children }) {
  const [sections, setSections] = useState([])
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [phase, setPhase] = useState('welcome')

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/assessment/questions/structured')
      setSections(data.sections)
    } catch (err) {
      setError('Failed to load questions. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  const answerQuestion = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }, [])

  const allQuestions = sections.flatMap(s => s.questions)
  const totalQuestions = allQuestions.length
  const answeredCount = Object.keys(answers).length

  const currentSection = sections[currentSectionIndex]
  const currentQuestion = currentSection?.questions[currentQuestionIndex]

  const globalQuestionIndex = sections
    .slice(0, currentSectionIndex)
    .reduce((acc, s) => acc + s.questions.length, 0) + currentQuestionIndex

  const progressPercent = totalQuestions > 0
    ? Math.round((globalQuestionIndex / totalQuestions) * 100)
    : 0

  const goNext = useCallback(() => {
    if (!currentSection) return
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1)
      setCurrentQuestionIndex(0)
    }
  }, [currentSection, currentQuestionIndex, currentSectionIndex, sections.length])

  const goPrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1]
      setCurrentSectionIndex(prev => prev - 1)
      setCurrentQuestionIndex(prevSection.questions.length - 1)
    }
  }, [currentQuestionIndex, currentSectionIndex, sections])

  const isLastQuestion =
    currentSectionIndex === sections.length - 1 &&
    currentQuestionIndex === (currentSection?.questions.length ?? 1) - 1

  const submitAssessment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const answerPayload = Object.entries(answers).map(([question_id, value]) => ({
        question_id,
        value
      }))
      const { data } = await axios.post('/api/assessment/submit', {
        answers: answerPayload
      })
      setResult(data)
      setPhase('results')
    } catch (err) {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [answers])

  const startAssessment = useCallback(() => {
    setPhase('assessment')
    if (sections.length === 0) {
      loadQuestions()
    }
  }, [sections.length, loadQuestions])

  const resetAssessment = useCallback(() => {
    setAnswers({})
    setResult(null)
    setCurrentSectionIndex(0)
    setCurrentQuestionIndex(0)
    setPhase('welcome')
    setError(null)
  }, [])

  return (
    <AssessmentContext.Provider value={{
      sections,
      currentSectionIndex,
      currentQuestionIndex,
      currentSection,
      currentQuestion,
      answers,
      result,
      loading,
      error,
      phase,
      totalQuestions,
      answeredCount,
      globalQuestionIndex,
      progressPercent,
      isLastQuestion,
      loadQuestions,
      answerQuestion,
      goNext,
      goPrev,
      submitAssessment,
      startAssessment,
      resetAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider')
  return ctx
}
