import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/components/common/Navbar'
import HabitTracker from '../components/momentum/HabitTracker'
import Challenges from '../components/momentum/Challenges'
import GrowthAnalytics from '../components/momentum/GrowthAnalytics'
import { Rocket, TrendingUp, Flame, CheckSquare, Target, Star, BarChart3 } from 'lucide-react'

function MomentumPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('habits')
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalPoints: 0,
    habitsCompleted: 0,
    challengesActive: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    // Load from localStorage
    const habits = JSON.parse(localStorage.getItem('user_habits') || '[]')
    const completions = JSON.parse(localStorage.getItem('habit_completions') || '{}')
    const challenges = JSON.parse(localStorage.getItem('active_challenges') || '[]')

    // Calculate current streak
    const streak = calculateCurrentStreak(completions)

    // Count total completions
    const totalCompletions = Object.values(completions).reduce((sum, dates) => sum + dates.length, 0)

    setStats({
      currentStreak: streak,
      totalPoints: user?.totalPoints || 0,
      habitsCompleted: totalCompletions,
      challengesActive: challenges.length
    })
  }

  const calculateCurrentStreak = (completions) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    let checkDate = new Date(today)

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompletion = Object.values(completions).some(dates => dates.includes(dateStr))

      if (!hasCompletion) {
        // Allow skipping today if no habits completed yet
        if (streak === 0 && dateStr === today.toISOString().split('T')[0]) {
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
        break
      }

      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    return streak
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="card p-8 animate-slide-up-fade">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gradient mb-3 flex items-center gap-2"><Rocket size={36} strokeWidth={2} /> Momentum</h1>
                  <p className="text-gray-600 text-lg">
                    Build lasting habits and track your personal growth journey
                  </p>
                </div>
                <div className="hidden lg:block animate-float">
                  <TrendingUp size={56} strokeWidth={1.5} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gradient-to-br from-sage-400/20 to-sage-500/20 rounded-2xl p-4 border border-sage-300/30">
                  <div className="text-3xl font-bold text-sage-700">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">Day Streak <Flame size={14} strokeWidth={2} /></div>
                </div>
                <div className="bg-gradient-to-br from-ocean-400/20 to-ocean-500/20 rounded-2xl p-4 border border-ocean-300/30">
                  <div className="text-3xl font-bold text-ocean-600">
                    {stats.habitsCompleted}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">Habits Done <CheckSquare size={14} strokeWidth={2} /></div>
                </div>
                <div className="bg-gradient-to-br from-amber-400/20 to-amber-500/20 rounded-2xl p-4 border border-amber-300/30">
                  <div className="text-3xl font-bold text-amber-700">
                    {stats.challengesActive}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">Active Challenges <Target size={14} strokeWidth={2} /></div>
                </div>
                <div className="bg-gradient-to-br from-sage-300/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
                  <div className="text-3xl font-bold text-sage-700">
                    {stats.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">Total Points <Star size={14} strokeWidth={2} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="card p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('habits')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'habits'
                      ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CheckSquare size={16} strokeWidth={2} className="mr-2 inline" />
                  Daily Habits
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'challenges'
                      ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Target size={16} strokeWidth={2} className="mr-2 inline" />
                  30-Day Challenges
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 size={16} strokeWidth={2} className="mr-2 inline" />
                  Growth Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-slide-up-fade">
            {activeTab === 'habits' && <HabitTracker onUpdate={loadStats} />}
            {activeTab === 'challenges' && <Challenges onUpdate={loadStats} />}
            {activeTab === 'analytics' && <GrowthAnalytics />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MomentumPage
