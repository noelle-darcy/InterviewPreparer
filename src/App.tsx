import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InterviewPage from './pages/InterviewPage'
import ResultsPage from './pages/ResultsPage'
import { LoadingProvider } from './contexts/loading'
import { ToastProvider } from './contexts/toast'

export default function App() {
  return (
    <LoadingProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <header className="p-4 border-b">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link to="/" className="text-lg font-semibold">InterviewMate</Link>
              <nav className="text-sm text-gray-600">
                <Link to="/">Home</Link>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-4xl mx-auto p-6 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/interview" element={<InterviewPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </main>

          <footer className="p-4 text-center text-sm text-gray-500">
            Powered by Gemini + ElevenLabs + Solana + Cloudflare
          </footer>
        </div>
      </ToastProvider>
    </LoadingProvider>
  )
}
