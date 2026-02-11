import { createContext, useState, useContext, useCallback, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { gamificationService } from '../services/gamificationService'
import {
  calculateLevel,
  getPointsToNextLevel,
  getProgressPercentage,
  getBadgeForLevel,
  ACHIEVEMENTS,
} from '../utils/gamification'

export const GamificationContext = createContext()

// Point values for different actions
export const POINT_VALUES = {
  event_rsvp: 10,
  event_review: 50,
  mood_checkin: 10,
  journal_entry: 15,
  community_join: 20,
  chat_message: 5,
  habit_complete: 10, // default, overridden by habit.points
  poll_create: 10,
  poll_vote: 5,
  event_propose: 15,
}

const STORAGE_PREFIX = 'gamification_'

export const GamificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const userId = user?.id || 'current-user'

  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState([])
  const [achievements, setAchievements] = useState([])

  // Notification state
  const [recentAction, setRecentAction] = useState(null) // { points, label }
  const [levelUpData, setLevelUpData] = useState(null) // { newLevel, badge }
  const [badgeUnlockData, setBadgeUnlockData] = useState(null) // badge object

  // Rate limiting for chat messages
  const [lastChatAward, setLastChatAward] = useState(0)

  // Load gamification data on user change
  useEffect(() => {
    if (user) {
      loadGamificationData()
    }
  }, [user])

  const loadGamificationData = useCallback(() => {
    const storedPoints = parseInt(
      localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0'
    )
    const storedBadges = JSON.parse(
      localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]'
    )

    setPoints(storedPoints)
    setLevel(calculateLevel(storedPoints))
    setBadges(storedBadges)
    checkAchievements(storedPoints, storedBadges)
  }, [userId])

  const checkAchievements = useCallback(
    (currentPoints, currentBadges) => {
      const history = JSON.parse(
        localStorage.getItem(`${STORAGE_PREFIX}history_${userId}`) || '[]'
      )

      // Count actions by type
      const actionCounts = {}
      history.forEach((entry) => {
        const key = entry.action
        actionCounts[key] = (actionCounts[key] || 0) + 1
      })

      const currentLevel = calculateLevel(currentPoints)

      // Check user streak from their data
      const currentStreak = user?.currentStreak || 0

      const updatedAchievements = ACHIEVEMENTS.map((achievement) => {
        const alreadyUnlocked = currentBadges.some(
          (b) => b.id === achievement.id
        )

        let unlocked = alreadyUnlocked
        let progress = 0

        switch (achievement.id) {
          case 'first-steps':
            unlocked =
              alreadyUnlocked || (actionCounts['event_rsvp'] || 0) >= 1
            progress = Math.min(100, (actionCounts['event_rsvp'] || 0) * 100)
            break
          case 'social-butterfly':
            unlocked =
              alreadyUnlocked || (actionCounts['community_join'] || 0) >= 3
            progress = Math.min(
              100,
              ((actionCounts['community_join'] || 0) / 3) * 100
            )
            break
          case 'journaler':
            unlocked =
              alreadyUnlocked || (actionCounts['journal_entry'] || 0) >= 5
            progress = Math.min(
              100,
              ((actionCounts['journal_entry'] || 0) / 5) * 100
            )
            break
          case 'streak-master':
            unlocked = alreadyUnlocked || currentStreak >= 7
            progress = Math.min(100, (currentStreak / 7) * 100)
            break
          case 'connector':
            unlocked = alreadyUnlocked || currentLevel >= 2
            progress = Math.min(100, (currentPoints / 500) * 100)
            break
          case 'explorer':
            unlocked =
              alreadyUnlocked || (actionCounts['event_rsvp'] || 0) >= 5
            progress = Math.min(
              100,
              ((actionCounts['event_rsvp'] || 0) / 5) * 100
            )
            break
          case 'champion':
            unlocked = alreadyUnlocked || currentLevel >= 5
            progress = Math.min(100, (currentPoints / 2000) * 100)
            break
          case 'habit-hero':
            unlocked =
              alreadyUnlocked || (actionCounts['habit_complete'] || 0) >= 20
            progress = Math.min(
              100,
              ((actionCounts['habit_complete'] || 0) / 20) * 100
            )
            break
          case 'review-guru':
            unlocked =
              alreadyUnlocked || (actionCounts['event_review'] || 0) >= 5
            progress = Math.min(
              100,
              ((actionCounts['event_review'] || 0) / 5) * 100
            )
            break
          case 'master':
            unlocked = alreadyUnlocked || currentLevel >= 10
            progress = Math.min(100, (currentPoints / 4500) * 100)
            break
          default:
            break
        }

        // Auto-unlock new achievements
        if (unlocked && !alreadyUnlocked) {
          const badge = {
            id: achievement.id,
            name: achievement.name,
            icon: achievement.icon,
            color: achievement.color,
            unlockedAt: new Date().toISOString(),
          }
          const updatedBadges = [
            ...JSON.parse(
              localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]'
            ),
          ]
          if (!updatedBadges.some((b) => b.id === badge.id)) {
            updatedBadges.push(badge)
            localStorage.setItem(
              `${STORAGE_PREFIX}badges_${userId}`,
              JSON.stringify(updatedBadges)
            )
            setBadges(updatedBadges)
            setBadgeUnlockData(badge)
          }
        }

        return {
          ...achievement,
          unlocked,
          progress: Math.round(progress),
        }
      })

      setAchievements(updatedAchievements)
    },
    [userId, user]
  )

  const awardPoints = useCallback(
    (pointsToAward, actionKey, actionLabel) => {
      // Rate limiting for chat messages (max 1 per 60 seconds)
      if (actionKey === 'chat_message') {
        const now = Date.now()
        if (now - lastChatAward < 60000) return
        setLastChatAward(now)
      }

      // Get current points
      const currentPoints = parseInt(
        localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0'
      )
      const oldLevel = calculateLevel(currentPoints)

      // Calculate new state
      const newPoints = currentPoints + pointsToAward
      const newLevel = calculateLevel(newPoints)

      // Persist points
      localStorage.setItem(
        `${STORAGE_PREFIX}points_${userId}`,
        newPoints.toString()
      )

      // Persist action history
      const history = JSON.parse(
        localStorage.getItem(`${STORAGE_PREFIX}history_${userId}`) || '[]'
      )
      history.push({
        action: actionKey,
        label: actionLabel,
        points: pointsToAward,
        timestamp: new Date().toISOString(),
        totalPoints: newPoints,
      })
      localStorage.setItem(
        `${STORAGE_PREFIX}history_${userId}`,
        JSON.stringify(history)
      )

      // Update React state
      setPoints(newPoints)
      setLevel(newLevel)

      // Show points notification
      setRecentAction({ points: pointsToAward, label: actionLabel })

      // Check for level up
      if (newLevel > oldLevel) {
        const badge = getBadgeForLevel(newLevel)
        setLevelUpData({ newLevel, badge })

        // If there's a badge for this level, unlock it
        if (badge) {
          const currentBadges = JSON.parse(
            localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]'
          )
          if (!currentBadges.some((b) => b.id === badge.id)) {
            const unlockedBadge = {
              ...badge,
              unlockedAt: new Date().toISOString(),
            }
            currentBadges.push(unlockedBadge)
            localStorage.setItem(
              `${STORAGE_PREFIX}badges_${userId}`,
              JSON.stringify(currentBadges)
            )
            setBadges(currentBadges)
          }
        }
      }

      // Re-check achievements
      const latestBadges = JSON.parse(
        localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]'
      )
      checkAchievements(newPoints, latestBadges)
    },
    [userId, lastChatAward, checkAchievements]
  )

  const dismissPointsNotification = useCallback(() => {
    setRecentAction(null)
  }, [])

  const dismissLevelUp = useCallback(() => {
    setLevelUpData(null)
  }, [])

  const dismissBadgeUnlock = useCallback(() => {
    setBadgeUnlockData(null)
  }, [])

  const getRecentHistory = useCallback(
    (limit = 10) => {
      const history = JSON.parse(
        localStorage.getItem(`${STORAGE_PREFIX}history_${userId}`) || '[]'
      )
      return history.slice(-limit).reverse()
    },
    [userId]
  )

  return (
    <GamificationContext.Provider
      value={{
        // State
        points,
        level,
        badges,
        achievements,
        recentAction,
        levelUpData,
        badgeUnlockData,

        // Derived
        pointsToNextLevel: getPointsToNextLevel(points),
        progressPercentage: getProgressPercentage(points),

        // Actions
        awardPoints,
        getRecentHistory,
        dismissPointsNotification,
        dismissLevelUp,
        dismissBadgeUnlock,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}
