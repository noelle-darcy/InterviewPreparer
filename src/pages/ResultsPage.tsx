import React, { useEffect, useState } from 'react'
import { mintBadge } from '../api/api'
import { useLoading } from '../contexts/loading'
import { useToast } from '../contexts/toast'

export default function ResultsPage() {
  const [session, setSession] = useState<any>(null)
  const { setLoading } = useLoading()
  const toast = useToast()

  useEffect(() => {
    const raw = localStorage.getItem('interview_session')
    if (raw) setSession(JSON.parse(raw))
  }, [])

  async function onMint() {
    if (!session) return
    setLoading(true)
    try {
      const res = await mintBadge(session.sessionId)
      toast.show('Minted: ' + res.tx)
    } catch (e) {
      toast.show('Mint failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Interview Summary</h2>
        <p className="text-sm text-gray-600">Session: {session?.sessionId}</p>
        <div className="mt-3">
          <button onClick={onMint} className="px-3 py-2 bg-indigo-600 text-white rounded">Mint Proof Badge</button>
        </div>
      </div>

      <div>
        <button onClick={() => window.location.assign('/')} className="text-sm text-gray-600">Restart Interview</button>
      </div>
    </div>
  )
}
