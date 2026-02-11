import { useEffect, useState } from 'react'

function BadgeUnlock({ badge, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss?.(), 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const colorMap = {
    sage: 'from-sage-400 to-sage-600',
    ocean: 'from-ocean-400 to-ocean-600',
    gold: 'from-yellow-400 to-orange-500',
    orange: 'from-orange-400 to-orange-600',
    purple: 'from-purple-400 to-purple-600',
  }

  const gradientClass = colorMap[badge?.color] || colorMap.sage

  return (
    <div
      className={`fixed top-24 right-6 z-[9998] transition-all duration-500 ${
        visible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-75'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 min-w-[280px] flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
          {badge?.icon}
        </div>
        <div>
          <div className="text-xs font-semibold text-sage-600 uppercase tracking-wide mb-1">
            Achievement Unlocked
          </div>
          <div className="font-bold text-gray-900">{badge?.name}</div>
          <div className="text-sm text-gray-500">{badge?.description || 'New badge earned!'}</div>
        </div>
      </div>
    </div>
  )
}

export default BadgeUnlock
