// Placeholder TTS helper
// This file currently provides a tiny placeholder implementation that returns a short WAV
// Blob (a 1s 440Hz sine tone). Replace the body of textToSpeech with your Google Gemini
// TTS or backend proxy call when ready. The function signature remains the same so callers
// (e.g. `getVoice`) don't need to change.

export async function textToSpeech(message: string): Promise<Blob | null> {
  if (!message) throw new Error('textToSpeech: message is required')

  // Minimal placeholder: generate a 1-second 440Hz sine WAV so frontend can play an audio
  // object URL while the final TTS integration is developed.
  const sampleRate = 24000
  const durationSeconds = 1
  const frequency = 440
  const numSamples = sampleRate * durationSeconds

  // WAV file header + PCM16 little-endian samples
  const bytesPerSample = 2
  const blockAlign = bytesPerSample * 1
  const byteRate = sampleRate * blockAlign
  const dataSize = numSamples * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  // RIFF header
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  // fmt chunk
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // subchunk1size
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  // data chunk
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  // Fill samples
  const amplitude = 0.25 * 0x7fff
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const sample = Math.round(amplitude * Math.sin(2 * Math.PI * frequency * t))
    view.setInt16(44 + i * 2, sample, true)
  }

  const wavBlob = new Blob([new Uint8Array(buffer)], { type: 'audio/wav' })
  return wavBlob
}

export default textToSpeech
