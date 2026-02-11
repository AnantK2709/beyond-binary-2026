import { useEffect, useState } from 'react'

function PointsNotification({ points, label, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss?.(), 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] transition-all duration-300 ${
        visible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-sage-500 to-ocean-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 min-w-[260px]">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0 font-bold">
          +{points}
        </div>
        <div>
          <div className="font-bold text-lg">Points Earned!</div>
          <div className="text-white/80 text-sm">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default PointsNotification
