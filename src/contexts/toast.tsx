import React, { createContext, useContext, useState } from 'react'

type Toast = { id: string; message: string }

const ToastContext = createContext({ show: (m: string) => {} })

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  function show(message: string) {
    const id = String(Date.now())
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-900 text-white px-4 py-2 rounded shadow">{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext) as { show: (m: string) => void }
