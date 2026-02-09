import { createContext, useState, useCallback } from 'react'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      duration: 3000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const showSuccess = useCallback((message) => {
    addNotification({ type: 'success', message })
  }, [addNotification])

  const showError = useCallback((message) => {
    addNotification({ type: 'error', message, duration: 5000 })
  }, [addNotification])

  const showInfo = useCallback((message) => {
    addNotification({ type: 'info', message })
  }, [addNotification])

  const showWarning = useCallback((message) => {
    addNotification({ type: 'warning', message })
  }, [addNotification])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showInfo,
      showWarning
    }}>
      {children}
    </NotificationContext.Provider>
  )
}
