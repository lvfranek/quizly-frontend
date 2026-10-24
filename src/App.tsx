import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LegalNoticePage } from './pages/LegalNoticePage'
import { LibraryPage } from './pages/LibraryPage'
import { LoginPage } from './pages/LoginPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { QuizDetailPage } from './pages/QuizDetailPage'
import { QuizPlayPage } from './pages/QuizPlayPage'
import { RegisterPage } from './pages/RegisterPage'
import { ToastProvider } from './toast/ToastProvider'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/legal-notice" element={<LegalNoticePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>
          <Route element={<Layout loggedIn />}>
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/quiz/:id" element={<QuizDetailPage />} />
            <Route path="/quiz/:id/play" element={<QuizPlayPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/library" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
