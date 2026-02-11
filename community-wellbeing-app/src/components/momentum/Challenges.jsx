import { useState, useEffect, useContext } from 'react'
import { GamificationContext } from '../../context/GamificationContext'
import Toast from '../common/Toast'

const COMMUNITY_CHALLENGES = [
  {
    id: '30day-meditation',
    title: '30-Day Meditation Challenge',
    description: 'Meditate for at least 10 minutes every day for 30 days',
    icon: '🧘',
    category: 'wellness',
    duration: 30,
    pointsPerDay: 15,
    totalPoints: 500,
    difficulty: 'Beginner',
    participants: 234
  },
  {
    id: '30day-fitness',
    title: '30-Day Fitness Challenge',
    description: 'Exercise for at least 30 minutes daily for 30 days',
    icon: '💪',
    category: 'fitness',
    duration: 30,
    pointsPerDay: 20,
    totalPoints: 700,
    difficulty: 'Intermediate',
    participants: 189
  },
  {
    id: '30day-reading',
    title: '30-Day Reading Challenge',
    description: 'Read for at least 20 minutes every day for 30 days',
    icon: '📚',
    category: 'learning',
    duration: 30,
    pointsPerDay: 10,
    totalPoints: 400,
    difficulty: 'Beginner',
    participants: 156
  },
  {
    id: '30day-gratitude',
    title: '30-Day Gratitude Challenge',
    description: 'Write 3 things you\'re grateful for each day for 30 days',
    icon: '✨',
    category: 'wellness',
    duration: 30,
    pointsPerDay: 10,
    totalPoints: 400,
    difficulty: 'Beginner',
    participants: 298
  },
  {
    id: '30day-hydration',
    title: '30-Day Hydration Challenge',
    description: 'Drink 8 glasses of water every day for 30 days',
    icon: '💧',
    category: 'health',
    duration: 30,
    pointsPerDay: 5,
    totalPoints: 250,
    difficulty: 'Beginner',
    participants: 412
  },
  {
    id: '30day-early-riser',
    title: '30-Day Early Riser Challenge',
    description: 'Wake up before 7 AM every day for 30 days',
    icon: '🌅',
    category: 'productivity',
    duration: 30,
    pointsPerDay: 15,
    totalPoints: 550,
    difficulty: 'Intermediate',
    participants: 127
  }
]

function Challenges({ onUpdate }) {
  const { awardPoints } = useContext(GamificationContext)
  const [activeChallenges, setActiveChallenges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [challengeProgress, setChallengeProgress] = useState({})
  const [showBrowseModal, setShowBrowseModal] = useState(false)
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' })

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = () => {
    const active = JSON.parse(localStorage.getItem('active_challenges') || '[]')
    const completed = JSON.parse(localStorage.getItem('completed_challenges') || '[]')
    const progress = JSON.parse(localStorage.getItem('challenge_progress') || '{}')

    setActiveChallenges(active)
    setCompletedChallenges(completed)
    setChallengeProgress(progress)
  }

  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  const joinChallenge = (challenge) => {
    // Check if already joined
    if (activeChallenges.find(c => c.id === challenge.id)) {
      showToast('warning', 'Already joined this challenge!')
      return
    }

    const newChallenge = {
      ...challenge,
      joinedAt: new Date().toISOString(),
      startDate: new Date().toISOString().split('T')[0]
    }

    const updated = [...activeChallenges, newChallenge]
    setActiveChallenges(updated)
    localStorage.setItem('active_challenges', JSON.stringify(updated))

    // Initialize progress
    const updatedProgress = {
      ...challengeProgress,
      [challenge.id]: []
    }
    setChallengeProgress(updatedProgress)
    localStorage.setItem('challenge_progress', JSON.stringify(updatedProgress))

    setShowBrowseModal(false)
    showToast('success', `Joined ${challenge.title}! Let's go! 🎉`)
    onUpdate?.()
  }

  const toggleDayCompletion = (challengeId, dayIndex) => {
    const progress = challengeProgress[challengeId] || []
    const today = new Date().toISOString().split('T')[0]

    let updatedProgress
    if (progress.includes(dayIndex)) {
      // Uncheck
      updatedProgress = progress.filter(d => d !== dayIndex)
    } else {
      // Check
      updatedProgress = [...progress, dayIndex]

      // Award points
      const challenge = activeChallenges.find(c => c.id === challengeId)
      if (challenge) {
        awardPoints(challenge.pointsPerDay, 'challenge_checkin', challenge.title)
        showToast('success', `+${challenge.pointsPerDay} points! Day ${dayIndex + 1} complete!`)
      }

      // Check if challenge completed
      if (updatedProgress.length === 30) {
        completeChallenge(challengeId)
        return
      }
    }

    const newProgress = {
      ...challengeProgress,
      [challengeId]: updatedProgress
    }
    setChallengeProgress(newProgress)
    localStorage.setItem('challenge_progress', JSON.stringify(newProgress))
    onUpdate?.()
  }

  const completeChallenge = (challengeId) => {
    const challenge = activeChallenges.find(c => c.id === challengeId)
    if (!challenge) return

    // Move to completed
    const completedChallenge = {
      ...challenge,
      completedAt: new Date().toISOString()
    }

    const updatedActive = activeChallenges.filter(c => c.id !== challengeId)
    const updatedCompleted = [...completedChallenges, completedChallenge]

    setActiveChallenges(updatedActive)
    setCompletedChallenges(updatedCompleted)

    localStorage.setItem('active_challenges', JSON.stringify(updatedActive))
    localStorage.setItem('completed_challenges', JSON.stringify(updatedCompleted))

    showToast('success', `🎊 Congratulations! You completed ${challenge.title}! +${challenge.totalPoints} bonus points!`)
    onUpdate?.()
  }

  const quitChallenge = (challengeId) => {
    if (!confirm('Are you sure you want to quit this challenge? Your progress will be lost.')) return

    const updatedActive = activeChallenges.filter(c => c.id !== challengeId)
    setActiveChallenges(updatedActive)
    localStorage.setItem('active_challenges', JSON.stringify(updatedActive))

    // Remove progress
    const updatedProgress = { ...challengeProgress }
    delete updatedProgress[challengeId]
    setChallengeProgress(updatedProgress)
    localStorage.setItem('challenge_progress', JSON.stringify(updatedProgress))

    showToast('info', 'Challenge quit. You can rejoin anytime!')
    onUpdate?.()
  }

  const getChallengeStreak = (challengeId) => {
    const progress = challengeProgress[challengeId] || []
    if (progress.length === 0) return 0

    // Find consecutive days from the most recent
    const sortedProgress = [...progress].sort((a, b) => b - a)
    let streak = 1

    for (let i = 0; i < sortedProgress.length - 1; i++) {
      if (sortedProgress[i] - sortedProgress[i + 1] === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const availableChallenges = COMMUNITY_CHALLENGES.filter(
    c => !activeChallenges.find(ac => ac.id === c.id) && !completedChallenges.find(cc => cc.id === c.id)
  )

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Challenges</h2>
          <button
            onClick={() => setShowBrowseModal(true)}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            <span>🎯</span>
            Browse Challenges
          </button>
        </div>

        {activeChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Challenges</h3>
            <p className="text-gray-600 mb-6">
              Join a 30-day challenge to level up your wellness journey!
            </p>
            <button
              onClick={() => setShowBrowseModal(true)}
              className="btn-primary px-6 py-3"
            >
              Browse Challenges
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeChallenges.map((challenge) => {
              const progress = challengeProgress[challenge.id] || []
              const streak = getChallengeStreak(challenge.id)
              const progressPercent = Math.round((progress.length / 30) * 100)

              return (
                <div
                  key={challenge.id}
                  className="p-6 rounded-2xl border-2 border-sage-300/50 bg-gradient-to-br from-sage-50 to-ocean-50"
                >
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-5xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="badge badge-primary px-3 py-1 text-xs capitalize">
                            {challenge.category}
                          </span>
                          <span className="badge bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold">
                            🔥 {streak} day streak
                          </span>
                          <span className="text-sm text-gray-600">⭐ {challenge.pointsPerDay} pts/day</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => quitChallenge(challenge.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Quit challenge"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-sage-700">
                        {progress.length}/30 days ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 30-Day Grid */}
                  <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: 30 }, (_, i) => {
                      const isCompleted = progress.includes(i)
                      return (
                        <button
                          key={i}
                          onClick={() => toggleDayCompletion(challenge.id, i)}
                          className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-sage-500 border-sage-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400 hover:border-sage-400'
                          }`}
                          title={`Day ${i + 1}`}
                        >
                          {isCompleted ? '✓' : i + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Challenges 🏆</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl border-2 border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <span>✅ Completed</span>
                      <span>⭐ +{challenge.totalPoints} pts</span>
                    </div>
                  </div>
                  <div className="text-2xl">🏆</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse Challenges Modal */}
      {showBrowseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Browse 30-Day Challenges</h2>
                <p className="text-gray-600 text-sm mt-1">Join a challenge and transform your habits!</p>
              </div>
              <button
                onClick={() => setShowBrowseModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {availableChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Challenges Joined!</h3>
                <p className="text-gray-600">You're already participating in all available challenges.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="p-5 rounded-2xl border-2 border-gray-200 hover:border-sage-400 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{challenge.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="badge badge-primary px-2 py-1 text-xs capitalize">
                            {challenge.category}
                          </span>
                          <span className="badge bg-amber-100 text-amber-700 px-2 py-1 text-xs">
                            {challenge.difficulty}
                          </span>
                          <span className="text-xs text-gray-600">👥 {challenge.participants} joined</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-bold text-sage-700">+{challenge.totalPoints}</span>
                            <span className="text-gray-600"> total points</span>
                          </div>
                          <button
                            onClick={() => joinChallenge(challenge)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Join Challenge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
      )}
    </div>
  )
}

export default Challenges
