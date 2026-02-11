import { useEffect, useState } from 'react'

function LevelUpModal({ newLevel, badge, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center transition-all duration-500 ${
          visible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'
        }`}
      >
        {/* Decorative dots */}
        <div className="absolute -top-3 left-1/4 w-3 h-3 rounded-full bg-orange-400 animate-bounce" />
        <div className="absolute -top-2 right-1/3 w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute -top-4 right-1/4 w-2.5 h-2.5 rounded-full bg-ocean-400 animate-bounce" style={{ animationDelay: '0.4s' }} />

        {/* Level badge */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mx-auto mb-4">
          {newLevel}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Level Up!</h2>
        <p className="text-gray-600 mb-6">
          You've reached <span className="font-bold text-sage-600">Level {newLevel}</span>. Keep up the amazing work!
        </p>

        {badge && (
          <div className="bg-gradient-to-r from-sage-50 to-ocean-50 rounded-2xl p-4 mb-6 border border-sage-200">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="font-bold text-gray-900">{badge.name}</div>
            <div className="text-sm text-gray-600">Badge Unlocked!</div>
          </div>
        )}

        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}

export default LevelUpModal
