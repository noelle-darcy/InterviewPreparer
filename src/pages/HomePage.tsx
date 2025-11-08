import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateInterview } from '../api/api'
import { useLoading } from '../contexts/loading'
import { useToast } from '../contexts/toast'
import { MotionWrapper } from '../components/MotionWrapper'

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [hints, setHints] = useState('')
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const { setLoading } = useLoading()
  const toast = useToast()
  const nav = useNavigate()

  async function onGenerate() {
    if (!resumeFile || !jobDescription.trim()) {
      toast.show('Please upload resume and provide job description')
      return
    }
    const form = new FormData()
    form.append('resume', resumeFile)
    form.append('job', new Blob([jobDescription], { type: 'text/plain' }))
    form.append('hints', hints)
    form.append('mode', mode)
    setLoading(true)
    try {
      const resp = await generateInterview(form)
      // store session in localStorage for demo flow
      localStorage.setItem('interview_session', JSON.stringify(resp))
      nav('/interview')
    } catch (err) {
      toast.show('Failed to generate interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <MotionWrapper>
        <section className="card">
          <h1 className="text-2xl font-semibold">InterviewMate</h1>
          <p className="text-sm text-gray-600">Your personalized AI interviewer</p>
        </section>
      </MotionWrapper>

      <MotionWrapper>
        <section className="card">
        <label className="block text-sm font-medium">Upload Resume</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} />

        <label className="block text-sm font-medium mt-4">Job Description</label>
        <textarea 
          value={jobDescription} 
          onChange={(e) => setJobDescription(e.target.value)} 
          className="w-full mt-2 p-2 border rounded h-32"
          placeholder="Paste the job description here..."
        />

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Interview Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={mode === 'text'} 
                onChange={() => setMode('text')} 
                className="text-indigo-600"
              />
              <span>Text Mode</span>
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="radio" 
                checked={mode === 'voice'} 
                onChange={() => setMode('voice')} 
                className="text-indigo-600"
              />
              <span>Voice Mode</span>
            </label>
          </div>
        </div>

        <label className="block text-sm font-medium mt-4">Hints about interview focus (optional)</label>
        <textarea 
          value={hints} 
          onChange={(e) => setHints(e.target.value)} 
          className="w-full mt-2 p-2 border rounded" 
          placeholder="Enter any specific topics or areas you'd like to focus on..."
        />

        <div className="mt-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={onGenerate}>Generate Interview</button>
        </div>
        </section>
      </MotionWrapper>
    </div>
  )
}
