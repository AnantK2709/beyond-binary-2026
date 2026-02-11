import { useContext } from 'react'
import { GamificationContext } from '../../../context/GamificationContext'

function LevelProgressBar({ compact = false }) {
  const { points, level, pointsToNextLevel, progressPercentage } =
    useContext(GamificationContext)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
          {level}
        </div>
        <div className="flex-1">
          <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {pointsToNextLevel} to next
        </span>
      </div>
    )
  }

  return (
    <div className="card animate-scale-in h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Your Level</div>
          <div className="text-3xl font-bold text-sage-600">Level {level}</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {level}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{points} points</span>
          <span className="text-gray-600">{points + pointsToNextLevel} points</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        <span className="font-semibold text-sage-600">{pointsToNextLevel} points</span> until Level {level + 1}
      </p>
    </div>
  )
}

export default LevelProgressBar
