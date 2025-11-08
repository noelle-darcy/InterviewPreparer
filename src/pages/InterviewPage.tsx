import React, { useEffect, useState } from 'react'
import { Question, getVoice, evaluateAnswer } from '../api/api'
import { MotionWrapper } from '../components/MotionWrapper'
import { useLoading } from '../contexts/loading'
import { useToast } from '../contexts/toast'

export default function InterviewPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, { score: number; feedback: string }>>({})
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const { setLoading } = useLoading()
  const toast = useToast()

  useEffect(() => {
    const raw = localStorage.getItem('interview_session')
    if (raw) {
      const parsed = JSON.parse(raw)
      setQuestions(parsed.questions || [])
      setMode(parsed.mode || 'text')
    }
  }, [])

  async function startVoiceQuestion(q: Question) {
    setLoading(true)
    try {
      const r = await getVoice(q.text)
      const audio = new Audio(r.audioUrl)
      await audio.play()
      // Start recording after question is played
      startRecording(q.id)
    } catch (e) {
      toast.show('Voice playback failed')
    } finally {
      setLoading(false)
    }
  }

  async function startRecording(questionId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks)
        // Convert audio to text using Elevenlabs API
        // For now, we'll mock this with a placeholder
        const transcribedText = "This is where the transcribed text would go"
        setAnswers(prev => ({ ...prev, [questionId]: transcribedText }))
        await onSubmit(questions.find(q => q.id === questionId)!)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Stop recording after 2 minutes
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
          setIsRecording(false)
        }
      }, 120000)
    } catch (e) {
      toast.show('Failed to start recording')
      setIsRecording(false)
    }
  }

  async function onPlay(q: Question) {
    setLoading(true)
    try {
      const r = await getVoice(q.text)
      const audio = new Audio(r.audioUrl)
      audio.play()
    } catch (e) {
      toast.show('Voice playback failed')
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(q: Question) {
    const answer = answers[q.id] || ''
    setLoading(true)
    try {
      const res = await evaluateAnswer(q.id, answer)
      setFeedback((f) => ({ ...f, [q.id]: res }))
    } catch (e) {
      toast.show('Evaluation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-sm text-gray-600">
          {mode === 'voice' ? 'Voice Mode - Questions will be read aloud and you can speak your answers' : 'Text Mode - Type your answers'}
        </div>
      </div>

      {questions.map((q, index) => (
        <MotionWrapper key={q.id}>
          <div className={`card ${index === activeQuestionIndex ? 'ring-2 ring-indigo-500' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium">{q.text}</div>
                {mode === 'voice' && isRecording && index === activeQuestionIndex && (
                  <div className="text-sm text-red-500 mt-1 flex items-center gap-2">
                    <span className="animate-pulse">●</span> Recording...
                  </div>
                )}
              </div>
              {mode === 'voice' ? (
                <div className="space-x-2">
                  {index === activeQuestionIndex && !answers[q.id] && (
                    <button 
                      onClick={() => startVoiceQuestion(q)} 
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                      disabled={isRecording}
                    >
                      Start Question
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-x-2">
                  <button onClick={() => onPlay(q)} className="px-3 py-1 border rounded">
                    Play Voice
                  </button>
                </div>
              )}
            </div>

            {mode === 'text' && (
              <div className="mt-3">
                <textarea 
                  placeholder="Type your answer here" 
                  value={answers[q.id] || ''} 
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} 
                  className="w-full p-2 border rounded" 
                />
                <div className="mt-2 flex gap-2">
                  <button 
                    onClick={() => onSubmit(q)} 
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            )}

            {mode === 'voice' && answers[q.id] && (
              <div className="mt-3">
                <div className="text-sm text-gray-700">
                  <strong>Your transcribed answer:</strong>
                  <p className="mt-1">{answers[q.id]}</p>
                </div>
              </div>
            )}

            {feedback[q.id] && (
              <div className="mt-3 bg-gray-50 p-3 rounded">
                <div className="text-sm font-semibold">Score: {feedback[q.id].score}</div>
                <div className="text-sm text-gray-700">{feedback[q.id].feedback}</div>
              </div>
            )}
          </div>
        </MotionWrapper>
      ))}
    </div>
  )
}
