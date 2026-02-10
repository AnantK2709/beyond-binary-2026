// Toast Notification Component with auto-dismiss functionality
import { useState, useEffect } from 'react'

/**
 * Toast notification component with glassmorphic design
 * @param {string} message - Toast message to display
 * @param {string} type - Toast type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Auto-dismiss duration in ms (default: 3000)
 * @param {function} onClose - Callback when toast is dismissed
 * @param {boolean} show - Control visibility externally
 */
function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  show = true
}) {
  const [isVisible, setIsVisible] = useState(show)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsExiting(false)
      if (onClose) onClose()
    }, 300) // Match animation duration
  }

  if (!isVisible && !isExiting) return null

  // Type-specific styles
  const typeStyles = {
    success: {
      gradient: 'from-green-500/90 to-emerald-500/90',
      border: 'border-green-300/40',
      shadow: 'shadow-green-500/30',
      icon: '✓',
      iconBg: 'bg-green-400/30'
    },
    error: {
      gradient: 'from-red-500/90 to-rose-500/90',
      border: 'border-red-300/40',
      shadow: 'shadow-red-500/30',
      icon: '✕',
      iconBg: 'bg-red-400/30'
    },
    warning: {
      gradient: 'from-orange-500/90 to-amber-500/90',
      border: 'border-orange-300/40',
      shadow: 'shadow-orange-500/30',
      icon: '⚠',
      iconBg: 'bg-orange-400/30'
    },
    info: {
      gradient: 'from-sage-500/90 to-ocean-500/90',
      border: 'border-sage-300/40',
      shadow: 'shadow-sage-500/30',
      icon: 'ℹ',
      iconBg: 'bg-sage-400/30'
    }
  }

  const style = typeStyles[type] || typeStyles.info

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 max-w-md
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-r ${style.gradient}
          backdrop-blur-xl
          border ${style.border}
          shadow-lg ${style.shadow}
          transition-all duration-300
        `}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative flex items-start gap-3 p-4">
          {/* Icon */}
          <div
            className={`
              flex items-center justify-center
              w-8 h-8 rounded-full
              ${style.iconBg}
              flex-shrink-0
              text-white font-bold text-lg
            `}
          >
            {style.icon}
          </div>

          {/* Message */}
          <p className="flex-1 text-white font-medium leading-relaxed pt-0.5">
            {message}
          </p>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="
              flex-shrink-0 w-6 h-6 rounded-full
              flex items-center justify-center
              text-white/80 hover:text-white
              hover:bg-white/20
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-white/50
            "
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar (if duration > 0) */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/60 animate-progress"
              style={{
                animationDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Toast Container for managing multiple toasts
export function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove && onRemove(toast.id || index)}
          show={true}
        />
      ))}
    </div>
  )
}

// Custom CSS for animations (add to your global styles or use Tailwind plugin)
const style = document.createElement('style')
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-out-right {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-slide-out-right {
    animation: slide-out-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animate-progress {
    animation: progress linear;
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}

export default Toast
