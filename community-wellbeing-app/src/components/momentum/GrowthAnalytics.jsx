import { useState, useEffect } from 'react'
import { Flame, Star, BarChart3, Lightbulb } from 'lucide-react'
import IconRenderer from '../common/IconRenderer'

function GrowthAnalytics() {
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState({})
  const [challenges, setChallenges] = useState([])
  const [challengeProgress, setChallengeProgress] = useState({})
  const [timeRange, setTimeRange] = useState('week') // week, month, all

  // Helper function to get date string in local timezone (SGT)
  const getLocalDateString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    loadData()

    // Refresh data at midnight to update dates
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const midnightTimeout = setTimeout(() => {
      loadData()
      // Set up daily refresh
      const dailyInterval = setInterval(() => {
        loadData()
      }, 24 * 60 * 60 * 1000) // 24 hours

      return () => clearInterval(dailyInterval)
    }, timeUntilMidnight)

    return () => clearTimeout(midnightTimeout)
  }, [])

  const loadData = () => {
    const storedHabits = JSON.parse(localStorage.getItem('user_habits') || '[]')
    const storedCompletions = JSON.parse(localStorage.getItem('habit_completions') || '{}')
    const storedChallenges = JSON.parse(localStorage.getItem('active_challenges') || '[]')
    const storedChallengeProgress = JSON.parse(localStorage.getItem('challenge_progress') || '{}')

    setHabits(storedHabits)
    setCompletions(storedCompletions)
    setChallenges(storedChallenges)
    setChallengeProgress(storedChallengeProgress)
  }

  const getDateRange = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)

    if (timeRange === 'week') {
      start.setDate(today.getDate() - 6)
    } else if (timeRange === 'month') {
      start.setDate(today.getDate() - 29)
    } else {
      // Get earliest completion date
      const allDates = Object.values(completions).flat()
      if (allDates.length === 0) {
        start.setDate(today.getDate() - 6)
      } else {
        const earliest = new Date(Math.min(...allDates.map(d => new Date(d + 'T00:00:00'))))
        start.setTime(earliest.getTime())
      }
    }

    const dates = []
    const current = new Date(start)
    current.setHours(0, 0, 0, 0)

    // Include today by using <= comparison - use local date strings
    while (current.getTime() <= today.getTime()) {
      dates.push(getLocalDateString(current))
      current.setDate(current.getDate() + 1)
      current.setHours(0, 0, 0, 0)
    }

    return dates
  }

  const getCompletionsForDate = (date) => {
    return Object.values(completions).filter(dates => dates.includes(date)).length
  }

  const getHabitCompletionRate = (habitId) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return 0

    const createdDate = new Date(habit.createdAt || new Date())
    const today = new Date()
    const daysSinceCreated = Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24)) + 1

    const completionCount = (completions[habitId] || []).length
    return Math.round((completionCount / daysSinceCreated) * 100)
  }

  const getTotalPoints = () => {
    let points = 0

    // Points from habits
    Object.entries(completions).forEach(([habitId, dates]) => {
      const habit = habits.find(h => h.id === habitId)
      if (habit) {
        points += dates.length * (habit.points || 10)
      }
    })

    // Points from challenges
    challenges.forEach(challenge => {
      const progress = challengeProgress[challenge.id] || []
      points += progress.length * (challenge.pointsPerDay || 10)
    })

    return points
  }

  const getStreakData = () => {
    const dateRange = getDateRange()
    return dateRange.map(date => ({
      date,
      completions: getCompletionsForDate(date)
    }))
  }

  const getCategoryBreakdown = () => {
    const categories = {}

    habits.forEach(habit => {
      const category = habit.category || 'custom'
      const completionCount = (completions[habit.id] || []).length

      if (!categories[category]) {
        categories[category] = 0
      }
      categories[category] += completionCount
    })

    return Object.entries(categories).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / Object.values(categories).reduce((a, b) => a + b, 0)) * 100) || 0
    }))
  }

  const getBestStreak = () => {
    let maxStreak = 0

    habits.forEach(habit => {
      const habitCompletions = completions[habit.id] || []
      if (habitCompletions.length === 0) return

      const sortedDates = habitCompletions.sort()
      let currentStreak = 1
      let bestHabitStreak = 1

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(sortedDates[i])
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
          currentStreak++
          bestHabitStreak = Math.max(bestHabitStreak, currentStreak)
        } else {
          currentStreak = 1
        }
      }

      maxStreak = Math.max(maxStreak, bestHabitStreak)
    })

    return maxStreak
  }

  const streakData = getStreakData()
  const categoryBreakdown = getCategoryBreakdown()
  const maxCompletions = Math.max(...streakData.map(d => d.completions), 1)
  const totalHabitCompletions = Object.values(completions).reduce((sum, dates) => sum + dates.length, 0)
  const bestStreak = getBestStreak()
  const hasAnyData = totalHabitCompletions > 0 || habits.length > 0

  const categoryColors = {
    wellness: 'from-sage-400 to-sage-600',
    fitness: 'from-ocean-400 to-ocean-600',
    learning: 'from-amber-400 to-amber-600',
    health: 'from-green-400 to-green-600',
    productivity: 'from-blue-400 to-blue-600',
    custom: 'from-gray-400 to-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Total Completions</div>
          <div className="text-3xl font-bold text-sage-700">{totalHabitCompletions}</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Best Streak</div>
          <div className="text-3xl font-bold text-orange-600 flex items-center gap-1">{bestStreak} <Flame size={24} /></div>
          <div className="text-xs text-gray-500 mt-1">Consecutive days</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Total Points</div>
          <div className="text-3xl font-bold text-amber-600 flex items-center gap-1">{getTotalPoints()} <Star size={24} /></div>
          <div className="text-xs text-gray-500 mt-1">From habits & challenges</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-600 mb-1">Active Habits</div>
          <div className="text-3xl font-bold text-ocean-600">{habits.length}</div>
          <div className="text-xs text-gray-500 mt-1">Currently tracking</div>
        </div>
      </div>

      {/* Completion Timeline */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Completion Timeline</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                timeRange === 'week'
                  ? 'bg-sage-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                timeRange === 'month'
                  ? 'bg-sage-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                timeRange === 'all'
                  ? 'bg-sage-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {!hasAnyData ? (
          <div className="text-center py-12">
            <div className="mb-4"><BarChart3 size={56} className="text-gray-300 mx-auto" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Yet</h3>
            <p className="text-gray-600">Complete some habits to see your progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
{/* Line Chart */}
<div className="relative h-80 bg-gradient-to-br from-sage-50/50 to-ocean-50/50 rounded-2xl p-6 border border-sage-200/50">
  {(() => {
    const n = streakData.length

    // Chart sizing inside SVG
    const CHART_W = 800
    const CHART_H = 300

    // Padding inside SVG so first/last points aren't stuck to the edge
    const PADDING_X = 30
    const PADDING_TOP = 20
    const PADDING_BOTTOM = 70 // space for labels inside SVG

    const plotW = CHART_W - 2 * PADDING_X
    const plotH = CHART_H - PADDING_TOP - PADDING_BOTTOM

    // Avoid divide-by-zero when n=1
    const stepX = n > 1 ? plotW / (n - 1) : 0

    const getX = (idx) => PADDING_X + idx * stepX
    const getY = (completions) => {
      const heightPercent = completions > 0 ? (completions / maxCompletions) : 0
      return PADDING_TOP + (1 - heightPercent) * plotH
    }

    const todayDateString = getLocalDateString(new Date())

    // Build line path
    const linePath = streakData.map((day, idx) => {
      const x = getX(idx)
      const y = getY(day.completions)
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    // Build area path
    const areaPath = `
      M ${getX(0)} ${PADDING_TOP + plotH}
      ${streakData.map((day, idx) => `L ${getX(idx)} ${getY(day.completions)}`).join(' ')}
      L ${getX(n - 1)} ${PADDING_TOP + plotH}
      Z
    `

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6b8e7f', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#6b8e7f', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = PADDING_TOP + plotH - (plotH * percent / 100)
          return (
            <line
              key={percent}
              x1={PADDING_X}
              y1={y}
              x2={CHART_W - PADDING_X}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          )
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#lineGradient)" />

        {/* Main line */}
        <path
          d={linePath}
          fill="none"
          stroke="#6b8e7f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points + labels */}
        {streakData.map((day, idx) => {
          const x = getX(idx)
          const y = getY(day.completions)
          const dateObj = new Date(day.date + 'T00:00:00')
          const isToday = day.date === todayDateString

          return (
            <g key={idx}>
              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={isToday ? '#f59e0b' : '#6b8e7f'}
                stroke="white"
                strokeWidth="2"
              >
                <title>{day.completions} completions</title>
              </circle>

              {/* Today ring */}
              {isToday && (
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  opacity="0.5"
                />
              )}

              {/* X-axis Labels INSIDE SVG */}
              <text
                x={x}
                y={PADDING_TOP + plotH + 22}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isToday ? "700" : "600"}
                fill={isToday ? "#b45309" : "#4b5563"}
              >
                {day.completions}
              </text>

              <text
                x={x}
                y={PADDING_TOP + plotH + 40}
                textAnchor="middle"
                fontSize="13"
                fontWeight={isToday ? "650" : "550"}
                fill={isToday ? "#9a3412" : "#374151"}
                style={{ letterSpacing: "0.2px" }}
              >
                {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
              </text>


              <text
                x={x}
                y={PADDING_TOP + plotH + 58}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isToday ? "700" : "400"}
                fill={isToday ? "#d97706" : "#9ca3af"}
              >
                {dateObj.getDate()}
              </text>
            </g>
          )
        })}
      </svg>
    )
  })()}
</div>


            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage-600"></div>
                <span className="text-sm text-gray-600">Completions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown & Habit Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
          {categoryBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No category data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {category.name}
                    </span>
                    <span className="text-sm font-bold text-sage-700">
                      {category.count} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                        categoryColors[category.name] || categoryColors.custom
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Performance */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Habit Performance</h2>
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No habits tracked yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => {
                const completionRate = getHabitCompletionRate(habit.id)
                const totalCompletions = (completions[habit.id] || []).length

                return (
                  <div key={habit.id} className="p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <IconRenderer name={habit.icon} size={24} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{habit.name}</div>
                        <div className="text-xs text-gray-600">
                          {totalCompletions} completions • {completionRate}% consistency
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="card p-6 bg-gradient-to-br from-sage-50 to-ocean-50 border-2 border-sage-300/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Lightbulb size={24} /> Insights & Tips</h2>
        <div className="space-y-3">
          {totalHabitCompletions === 0 && (
            <p className="text-gray-700">
              <strong>Get started:</strong> Add your first habit and complete it today to build momentum!
            </p>
          )}
          {totalHabitCompletions > 0 && totalHabitCompletions < 10 && (
            <p className="text-gray-700">
              <strong>Keep going:</strong> You've completed {totalHabitCompletions} habits. The first 21 days are crucial for habit formation!
            </p>
          )}
          {bestStreak >= 7 && (
            <p className="text-gray-700">
              <strong>Awesome streak!</strong> You've maintained a {bestStreak}-day streak. Research shows it takes 66 days on average to form a habit.
            </p>
          )}
          {habits.length > 0 && habits.length < 5 && (
            <p className="text-gray-700">
              <strong>Tip:</strong> Start small! 2-3 habits is perfect for building consistency. Add more once these become automatic.
            </p>
          )}
          {categoryBreakdown.length > 0 && (
            <p className="text-gray-700">
              <strong>Balance:</strong> You're focusing most on {categoryBreakdown[0]?.name}. Consider adding habits from other categories for holistic growth.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GrowthAnalytics
