import { useContext } from 'react'
import { ToastContext } from '../contexts/toast-context.js'

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast faqat ToastProvider ichida ishlatilishi mumkin.')
  return context
}
