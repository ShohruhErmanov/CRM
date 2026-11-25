import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from '../components/common/Icon.jsx'

const ToastContext = createContext(null)

const iconByType = {
  success: 'check',
  error: 'alert',
  info: 'info',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)
  const timers = useRef([])

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((type, message) => {
    counter.current += 1
    const id = counter.current
    setToasts((current) => [...current, { id, type, message }])
    const timer = setTimeout(() => remove(id), 4500)
    timers.current.push(timer)
  }, [remove])

  const api = {
    success: (message) => notify('success', message),
    error: (message) => notify('error', message),
    info: (message) => notify('info', message),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.type}`} key={toast.id}>
            <Icon name={iconByType[toast.type] || 'info'} size={18} />
            <span>{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => remove(toast.id)} aria-label="Bildirishni yopish">
              <Icon name="close" size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast faqat ToastProvider ichida ishlatilishi mumkin.')
  return context
}
