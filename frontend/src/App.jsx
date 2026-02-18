import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AssessmentProvider } from './context/AssessmentContext'
import Welcome from './pages/Welcome'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import AppShell from './components/layout/AppShell'

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </AppShell>
      </AssessmentProvider>
    </BrowserRouter>
  )
}
