// API stubs - replace fetch calls with real backend endpoints later

export type Question = {
  id: string
  text: string
}

export async function generateInterview(data: FormData) {
  // TODO: POST to /api/generate with resume, job description, hints
  return new Promise<{ sessionId: string; questions: Question[]; mode: 'text' | 'voice' }>((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId: 'sess_' + Date.now(),
        mode: data.get('mode') as 'text' | 'voice',
        questions: [
          { id: 'q1', text: 'Explain the difference between var, let, and const in JavaScript.' },
          { id: 'q2', text: 'Design a URL shortener — what are the core components?' },
          { id: 'q3', text: 'How would you find a cycle in a linked list?'
          }
        ],
      })
    }, 1200)
  })
}

import { textToSpeech } from './tts'

export async function getVoice(questionText: string) {
  // Use the client-side ElevenLabs TTS helper. This will return a local object URL you can play with <audio>.
  // Note: If the ElevenLabs API enforces CORS, you may need a backend proxy. See README notes.
  const blob = await textToSpeech(questionText)
  if (!blob) throw new Error('getVoice: failed to generate audio')
  const audioUrl = URL.createObjectURL(blob)
  return { audioUrl }
}

export async function transcribeVoice(audioBlob: Blob) {
  // TODO: POST audio to /api/transcribe to convert speech to text using ElevenLabs
  return new Promise<{ text: string }>((resolve) => {
    setTimeout(() => resolve({ text: 'Mock transcribed text from audio recording' }), 700)
  })
}

export async function evaluateAnswer(questionId: string, answer: string) {
  // TODO: POST to /api/evaluate with questionId and answer
  return new Promise<{ score: number; feedback: string }>((resolve) => {
    setTimeout(() => {
      const score = Math.max(0, Math.min(100, Math.floor(Math.random() * 40) + 60))
      resolve({ score, feedback: `Mock feedback for ${questionId}: solid reasoning, add complexity handling.` })
    }, 700)
  })
}

export async function mintBadge(sessionId: string) {
  // TODO: POST to /api/mint to mint badge on Solana and return tx or badge url
  return new Promise<{ tx: string; badgeUrl?: string }>((resolve) => {
    setTimeout(() => resolve({ tx: 'tx_' + Date.now(), badgeUrl: 'https://example.com/badge.png' }), 900)
  })
}
