// Gamification Service - Points, levels, and badges management
import { mockApiCall } from './api'
import { calculateLevel, awardPoints as calculatePoints, getBadgeForLevel as getBadgeByLevel } from '../utils/gamification'

const STORAGE_PREFIX = 'gamification_'
const DEFAULT_USER_ID = 'current-user'

/**
 * Award points to a user for completing an action
 * @param {string} userId - User ID
 * @param {number} points - Points to award
 * @param {string} action - Action description
 * @returns {Promise<Object>} Updated points info with level-up status
 */
const awardPoints = async (userId = DEFAULT_USER_ID, points, action) => {
  const currentPoints = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0')
  const result = calculatePoints(currentPoints, points)

  // Store new points
  localStorage.setItem(`${STORAGE_PREFIX}points_${userId}`, result.newPoints.toString())

  // Store action history
  const history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history_${userId}`) || '[]')
  history.push({
    action,
    points,
    timestamp: new Date().toISOString(),
    totalPoints: result.newPoints
  })
  localStorage.setItem(`${STORAGE_PREFIX}history_${userId}`, JSON.stringify(history))

  // If leveled up, unlock badge
  if (result.leveledUp && result.badge) {
    await unlockBadge(userId, result.badge)
  }

  return mockApiCall({
    ...result,
    action,
    pointsAwarded: points,
    currentPoints: result.newPoints,
    message: `You earned ${points} points for ${action}!`
  })
}

/**
 * Get badge for a specific level
 * @param {number} level - User level
 * @returns {Object|null} Badge object or null
 */
const getBadgeForLevel = (level) => {
  return getBadgeByLevel(level)
}

/**
 * Get user's current points
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current points
 */
const getPoints = async (userId = DEFAULT_USER_ID) => {
  const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0')
  return mockApiCall(points)
}

/**
 * Get user's current level
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current level
 */
const getLevel = async (userId = DEFAULT_USER_ID) => {
  const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0')
  const level = calculateLevel(points)
  return mockApiCall(level)
}

/**
 * Get complete user gamification stats
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Complete stats including points, level, badges
 */
const getUserStats = async (userId = DEFAULT_USER_ID) => {
  const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0')
  const level = calculateLevel(points)
  const badges = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]')
  const history = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}history_${userId}`) || '[]')

  // Calculate progress to next level
  const pointsPerLevel = 500
  const pointsInCurrentLevel = points - ((level - 1) * pointsPerLevel)
  const progressPercentage = (pointsInCurrentLevel / pointsPerLevel) * 100
  const pointsToNextLevel = pointsPerLevel - pointsInCurrentLevel

  return mockApiCall({
    userId,
    points,
    level,
    badges,
    badgeCount: badges.length,
    progressPercentage,
    pointsToNextLevel,
    recentActions: history.slice(-10).reverse(),
    totalActions: history.length
  })
}

/**
 * Get all badges earned by user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of earned badges
 */
const getBadges = async (userId = DEFAULT_USER_ID) => {
  const badges = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]')
  return mockApiCall(badges)
}

/**
 * Unlock a badge for a user
 * @param {string} userId - User ID
 * @param {Object} badge - Badge object to unlock
 * @returns {Promise<Object>} Unlock confirmation
 */
const unlockBadge = async (userId = DEFAULT_USER_ID, badge) => {
  const badges = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]')

  // Check if badge already unlocked
  if (badges.find(b => b.id === badge.id)) {
    return mockApiCall({ success: false, message: 'Badge already unlocked', badge })
  }

  // Add unlock timestamp
  const unlockedBadge = {
    ...badge,
    unlockedAt: new Date().toISOString()
  }

  badges.push(unlockedBadge)
  localStorage.setItem(`${STORAGE_PREFIX}badges_${userId}`, JSON.stringify(badges))

  return mockApiCall({
    success: true,
    badge: unlockedBadge,
    message: `Badge unlocked: ${badge.name}!`
  })
}

/**
 * Get leaderboard data
 * @param {number} limit - Number of users to return
 * @returns {Promise<Object>} Leaderboard data
 */
const getLeaderboard = async (limit = 10) => {
  // In a real app, this would fetch from backend
  // For now, return mock data with current user
  const currentUserId = DEFAULT_USER_ID
  const currentPoints = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${currentUserId}`) || '0')
  const currentLevel = calculateLevel(currentPoints)

  const mockLeaderboard = [
    { userId: 'u1', name: 'Alex Johnson', points: 1250, level: 3, rank: 1 },
    { userId: 'u2', name: 'Sarah Chen', points: 980, level: 2, rank: 2 },
    { userId: 'u3', name: 'Mike Torres', points: 750, level: 2, rank: 3 },
    { userId: 'u4', name: 'Emma Davis', points: 650, level: 2, rank: 4 },
    { userId: 'u5', name: 'James Wilson', points: 520, level: 2, rank: 5 }
  ]

  // Add current user to leaderboard
  const currentUserEntry = {
    userId: currentUserId,
    name: 'You',
    points: currentPoints,
    level: currentLevel,
    rank: mockLeaderboard.filter(u => u.points > currentPoints).length + 1,
    isCurrentUser: true
  }

  // Insert current user in correct position
  const leaderboard = [...mockLeaderboard, currentUserEntry]
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((user, index) => ({ ...user, rank: index + 1 }))

  return mockApiCall({
    leaderboard,
    currentUserRank: currentUserEntry.rank,
    totalUsers: mockLeaderboard.length + 1
  })
}

/**
 * Get available achievements and their unlock status
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of all achievements
 */
const getAchievements = async (userId = DEFAULT_USER_ID) => {
  const unlockedBadges = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}badges_${userId}`) || '[]')
  const points = parseInt(localStorage.getItem(`${STORAGE_PREFIX}points_${userId}`) || '0')
  const level = calculateLevel(points)

  // Define all available achievements
  const allAchievements = [
    {
      id: 'first-event',
      name: 'First Steps',
      description: 'Attend your first event',
      icon: 'Target',
      pointsRequired: 0,
      category: 'events'
    },
    {
      id: 'connector',
      name: 'Community Connector',
      description: 'Reach Level 2',
      icon: 'HeartHandshake',
      pointsRequired: 500,
      category: 'levels',
      level: 2
    },
    {
      id: 'explorer',
      name: 'Event Explorer',
      description: 'Reach Level 3',
      icon: 'Search',
      pointsRequired: 1000,
      category: 'levels',
      level: 3
    },
    {
      id: '5-events',
      name: 'Social Butterfly',
      description: 'Attend 5 events',
      icon: 'Sparkles',
      pointsRequired: 0,
      category: 'events'
    },
    {
      id: 'champion',
      name: 'Wellness Champion',
      description: 'Reach Level 5',
      icon: 'Trophy',
      pointsRequired: 2000,
      category: 'levels',
      level: 5
    },
    {
      id: 'master',
      name: 'Wellbeing Master',
      description: 'Reach Level 10',
      icon: 'Star',
      pointsRequired: 4500,
      category: 'levels',
      level: 10
    }
  ]

  // Mark unlocked achievements
  const achievements = allAchievements.map(achievement => {
    const isUnlocked = unlockedBadges.some(b => b.id === achievement.id) ||
                       (achievement.level && level >= achievement.level)
    return {
      ...achievement,
      unlocked: isUnlocked,
      progress: achievement.pointsRequired > 0
        ? Math.min(100, (points / achievement.pointsRequired) * 100)
        : 0
    }
  })

  return mockApiCall(achievements)
}

/**
 * Reset user's gamification data (for testing)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Reset confirmation
 */
const resetUserData = async (userId = DEFAULT_USER_ID) => {
  localStorage.removeItem(`${STORAGE_PREFIX}points_${userId}`)
  localStorage.removeItem(`${STORAGE_PREFIX}badges_${userId}`)
  localStorage.removeItem(`${STORAGE_PREFIX}history_${userId}`)

  return mockApiCall({
    success: true,
    message: 'Gamification data reset successfully'
  })
}

export const gamificationService = {
  awardPoints,
  getBadgeForLevel,
  getPoints,
  getLevel,
  getUserStats,
  getBadges,
  unlockBadge,
  getLeaderboard,
  getAchievements,
  resetUserData
}
