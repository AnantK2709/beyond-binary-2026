import { useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'

export const useToast = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useToast must be used within a NotificationProvider')
  }

  const showToast = (message, type = 'info') => {
    switch (type) {
      case 'success':
        context.showSuccess(message)
        break
      case 'error':
        context.showError(message)
        break
      case 'warning':
        context.showWarning(message)
        break
      default:
        context.showInfo(message)
    }
  }

  return {
    showToast,
    showSuccess: context.showSuccess,
    showError: context.showError,
    showInfo: context.showInfo,
    showWarning: context.showWarning
  }
}
