import { useState, useEffect } from 'react'

function LevelUpModal({ levelUpData, onClose }) {
  const [showContent, setShowContent] = useState(false)
  const [animateLevel, setAnimateLevel] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState(10)

  const { oldLevel, newLevel, badge, message } = levelUpData || {
    oldLevel: 1,
    newLevel: 2,
    badge: { name: 'Engagement Champion', icon: '🏆' },
    message: 'You\'ve reached a new level!'
  }

  useEffect(() => {
    // Trigger animations
    setTimeout(() => setShowContent(true), 300)
    setTimeout(() => setAnimateLevel(true), 800)

    // Auto-close countdown
    const timer = setInterval(() => {
      setAutoCloseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-900/80 via-ocean-900/80 to-sage-900/80 backdrop-blur-sm">
        {/* Animated Particles/Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div
                className="text-2xl opacity-70"
                style={{
                  animation: 'pulse 2s infinite',
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confetti Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div
              className="w-3 h-3 rotate-45"
              style={{
                backgroundColor: [
                  '#7EC8A3',
                  '#4A9D7E',
                  '#5BA3D0',
                  '#F59E0B',
                  '#FBBF24',
                  '#FCD34D'
                ][Math.floor(Math.random() * 6)]
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl card p-12 text-center transform transition-all duration-700 ${
          showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 100px rgba(126,200,163,0.3)'
        }}
      >
        {/* Pulsing Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sage-400/20 to-ocean-400/20 animate-pulse-slow pointer-events-none"></div>

        {/* Close/Auto-close Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            Auto-close in {autoCloseTimer}s
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
            <h2 className="text-5xl font-bold text-gradient animate-slide-down">
              Level Up!
            </h2>
            <p className="text-xl text-gray-600 font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {message}
            </p>
          </div>

          {/* Level Animation */}
          <div className="flex items-center justify-center gap-8 py-8" style={{ animationDelay: '400ms' }}>
            {/* Old Level */}
            <div
              className={`transition-all duration-700 ${
                animateLevel ? 'scale-75 opacity-50' : 'scale-100 opacity-100'
              }`}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-xl">
                <span className="text-5xl font-bold text-white">{oldLevel}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium mt-3">Previous Level</p>
            </div>

            {/* Arrow */}
            <div className="text-4xl text-sage-600 animate-pulse">→</div>

            {/* New Level */}
            <div
              className={`transition-all duration-700 ${
                animateLevel ? 'scale-125 opacity-100' : 'scale-75 opacity-0'
              }`}
            >
              <div className="relative">
                {/* Animated Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-400 to-ocean-400 animate-ping opacity-75"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-400 to-ocean-400 animate-pulse blur-xl"></div>

                {/* Level Badge */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-sage-400 to-ocean-500 flex items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-5xl font-bold text-white">{newLevel}</span>
                </div>
              </div>
              <p className="text-sm text-sage-700 font-bold mt-3 animate-pulse">New Level</p>
            </div>
          </div>

          {/* Badge Unlock */}
          {badge && (
            <div
              className="card p-6 bg-gradient-to-br from-sage-50 to-ocean-50 border-2 border-sage-300/50 animate-fade-in-up"
              style={{ animationDelay: '600ms' }}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="text-5xl animate-bounce-gentle">{badge.icon}</div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium mb-1">Badge Unlocked!</p>
                  <h3 className="text-2xl font-bold text-gray-900">{badge.name}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div
            className="bg-gradient-to-r from-sage-400/20 to-ocean-400/20 rounded-2xl p-6 border border-sage-300/30 animate-fade-in-up"
            style={{ animationDelay: '800ms' }}
          >
            <p className="text-lg font-semibold text-gray-800">
              Amazing progress! Keep engaging with your community to unlock more rewards.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="btn-primary px-12 py-4 text-lg font-bold animate-fade-in-up shadow-2xl hover:scale-105 transition-transform"
            style={{ animationDelay: '1000ms' }}
          >
            Awesome!
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default LevelUpModal
