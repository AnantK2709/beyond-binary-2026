import { useState, useEffect, useContext } from 'react'
import { Plus, Target, Flame, Star, CheckCircle } from 'lucide-react'
import IconRenderer from '../common/IconRenderer'
import { GamificationContext } from '../../context/GamificationContext'
import Toast from '../common/Toast'

const PRESET_HABITS = [
  { icon: 'HeartPulse', name: 'Meditation', category: 'wellness', points: 10 },
  { icon: 'Dumbbell', name: 'Exercise', category: 'fitness', points: 15 },
  { icon: 'BookOpen', name: 'Reading', category: 'learning', points: 10 },
  { icon: 'Droplets', name: 'Drink 8 Glasses of Water', category: 'health', points: 5 },
  { icon: 'Sunrise', name: 'Wake Up Early', category: 'productivity', points: 10 },
  { icon: 'PenLine', name: 'Journaling', category: 'wellness', points: 10 },
  { icon: 'Salad', name: 'Healthy Eating', category: 'health', points: 10 },
  { icon: 'Moon', name: 'Sleep 8 Hours', category: 'health', points: 10 },
  { icon: 'Footprints', name: '10,000 Steps', category: 'fitness', points: 15 },
  { icon: 'Brain', name: 'Learn Something New', category: 'learning', points: 15 }
]

function HabitTracker({ onUpdate }) {
  const { awardPoints } = useContext(GamificationContext)
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('CheckCircle')
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = () => {
    const storedHabits = JSON.parse(localStorage.getItem('user_habits') || '[]')
    const storedCompletions = JSON.parse(localStorage.getItem('habit_completions') || '{}')
    setHabits(storedHabits)
    setCompletions(storedCompletions)
  }

  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  const addHabit = (presetHabit = null) => {
    if (!presetHabit && !newHabitName.trim()) {
      showToast('warning', 'Please enter a habit name')
      return
    }

    const habit = presetHabit || {
      id: Date.now().toString(),
      name: newHabitName,
      icon: selectedIcon,
      category: 'custom',
      points: 10,
      createdAt: new Date().toISOString()
    }

    if (!habit.id) {
      habit.id = Date.now().toString()
      habit.createdAt = new Date().toISOString()
    }

    const updatedHabits = [...habits, habit]
    setHabits(updatedHabits)
    localStorage.setItem('user_habits', JSON.stringify(updatedHabits))

    setNewHabitName('')
    setShowAddModal(false)
    showToast('success', `Added habit: ${habit.name}`)
    onUpdate?.()
  }

  const toggleCompletion = (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    const habitCompletions = completions[habitId] || []

    let updatedCompletions
    if (habitCompletions.includes(today)) {
      // Uncheck
      updatedCompletions = {
        ...completions,
        [habitId]: habitCompletions.filter(date => date !== today)
      }
      showToast('info', 'Habit unchecked for today')
    } else {
      // Check
      updatedCompletions = {
        ...completions,
        [habitId]: [...habitCompletions, today]
      }
      const habit = habits.find(h => h.id === habitId)
      awardPoints(habit?.points || 10, 'habit_complete', habit?.name || 'Habit complete')
      showToast('success', `+${habit?.points || 10} points! Great job!`)
    }

    setCompletions(updatedCompletions)
    localStorage.setItem('habit_completions', JSON.stringify(updatedCompletions))
    onUpdate?.()
  }

  const deleteHabit = (habitId) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    const updatedHabits = habits.filter(h => h.id !== habitId)
    setHabits(updatedHabits)
    localStorage.setItem('user_habits', JSON.stringify(updatedHabits))

    const updatedCompletions = { ...completions }
    delete updatedCompletions[habitId]
    setCompletions(updatedCompletions)
    localStorage.setItem('habit_completions', JSON.stringify(updatedCompletions))

    showToast('info', 'Habit deleted')
    onUpdate?.()
  }

  const getStreak = (habitId) => {
    const habitCompletions = completions[habitId] || []
    if (habitCompletions.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    let checkDate = new Date(today)

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (!habitCompletions.includes(dateStr)) {
        // Allow skipping today if not completed yet
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

  const isCompletedToday = (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    return (completions[habitId] || []).includes(today)
  }

  const getTodayProgress = () => {
    if (habits.length === 0) return 0
    const completedToday = habits.filter(h => isCompletedToday(h.id)).length
    return Math.round((completedToday / habits.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Progress</h2>
            <p className="text-gray-600 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-4xl font-bold text-sage-700">
            {getTodayProgress()}%
          </div>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
            style={{ width: `${getTodayProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Habits List */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Habits</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4"><Target size={56} className="text-gray-300 mx-auto" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Habits Yet</h3>
            <p className="text-gray-600 mb-6">
              Start building positive habits to track your progress!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-6 py-3"
            >
              Add Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const streak = getStreak(habit.id)
              const completed = isCompletedToday(habit.id)
              const totalCompletions = (completions[habit.id] || []).length

              return (
                <div
                  key={habit.id}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    completed
                      ? 'bg-gradient-to-r from-sage-50 to-ocean-50 border-sage-400/50'
                      : 'bg-white border-gray-200 hover:border-sage-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCompletion(habit.id)}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-300 ${
                        completed
                          ? 'bg-sage-500 border-sage-600 text-white scale-110'
                          : 'bg-white border-gray-300 hover:border-sage-400'
                      }`}
                    >
                      {completed ? <CheckCircle size={24} /> : <IconRenderer name={habit.icon} size={24} />}
                    </button>

                    {/* Habit Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{habit.name}</h3>
                        {streak > 0 && (
                          <span className="badge bg-orange-100 text-orange-700 px-2 py-1 text-xs font-bold flex items-center gap-1">
                            <Flame size={12} /> {streak} day{streak !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Star size={12} className="text-amber-400" /> {habit.points} pts</span>
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-sage-500" /> {totalCompletions} total</span>
                        {habit.category && (
                          <span className="badge badge-primary px-2 py-1 text-xs capitalize">
                            {habit.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Delete habit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal
      {showAddModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Habit</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Preset Habits }
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Habits</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_HABITS.map((habit, idx) => (
                  <button
                    key={idx}
                    onClick={() => addHabit(habit)}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-sage-400 hover:bg-sage-50 transition-all duration-300 text-left"
                  >
                    <div className="mb-2"><IconRenderer name={habit.icon} size={24} /></div>
                    <div className="font-semibold text-gray-900 text-sm">{habit.name}</div>
                    <div className="text-xs text-gray-600 mt-1">+{habit.points} pts</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Habit }
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Or Create Custom</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="E.g., Practice guitar, Call a friend..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (optional)
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['CheckCircle', 'Target', 'Lightbulb', 'Palette', 'Music', 'Smartphone', 'Briefcase', 'PersonStanding', 'Gamepad2', 'Camera'].map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                          selectedIcon === icon
                            ? 'border-sage-500 bg-sage-50'
                            : 'border-gray-200 hover:border-sage-300'
                        }`}
                      >
                        <IconRenderer name={icon} size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => addHabit()}
                  className="w-full btn-primary py-3"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}


      {/* Add Habit Modal */}
      {showAddModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80  z-60 animate-fade-in"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scale-in "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Habit</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Preset Habits */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Popular Habits</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PRESET_HABITS.map((habit, idx) => (
                    <button
                      key={idx}
                      onClick={() => addHabit(habit)}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-sage-400 hover:bg-sage-50 transition-all duration-300 text-left"
                    >
                      <div className="text-2xl mb-2">{habit.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">{habit.name}</div>
                      <div className="text-xs text-gray-600 mt-1">+{habit.points} pts</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Habit */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Or Create Custom</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habit Name
                    </label>
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="E.g., Practice guitar, Call a friend..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sage-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (optional)
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {['✅', '🎯', '💡', '🎨', '🎵', '📱', '💼', '🏃', '🎮', '📷'].map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setSelectedIcon(icon)}
                          className={`w-12 h-12 rounded-xl border-2 text-2xl transition-all ${selectedIcon === icon
                              ? 'border-sage-500 bg-sage-50'
                              : 'border-gray-200 hover:border-sage-300'
                            }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => addHabit()}
                    className="w-full btn-primary py-3"
                  >
                    Create Habit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
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

export default HabitTracker
