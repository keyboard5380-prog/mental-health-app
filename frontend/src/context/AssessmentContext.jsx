import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const AssessmentContext = createContext(null)

// Get API base URL: env var, or production fallback to Render, or dev proxy
const RAW = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim()
const PROD_FALLBACK = 'https://mental-health-app-t82u.onrender.com'
const API_BASE_URL = (RAW || (import.meta.env.PROD ? PROD_FALLBACK : '')).replace(/\/$/, '') || '/api'

// Log API configuration for debugging
console.log('📡 API Configuration:', {
  API_BASE_URL,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
})

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
      const url = `${API_BASE_URL}/api/assessment/questions/structured`
      console.log('📤 Fetching questions from:', url)
      const { data } = await axios.get(url, { timeout: 90000 })
      console.log('✅ Questions loaded successfully:', data)
      setSections(data.sections)
    } catch (err) {
      console.error('❌ Failed to load questions:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        url: err.config?.url,
        data: err.response?.data
      })
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
      const url = `${API_BASE_URL}/api/assessment/submit`
      console.log('📤 Submitting assessment to:', url)
      const { data } = await axios.post(url, { answers: answerPayload }, { timeout: 90000 })
      console.log('✅ Analysis completed:', data)
      setResult(data)
      setPhase('results')
    } catch (err) {
      console.error('❌ Failed to submit assessment:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        url: err.config?.url,
        data: err.response?.data
      })
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
