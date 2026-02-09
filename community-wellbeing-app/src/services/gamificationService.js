import { mockApiCall } from './api'
import { calculateLevel, awardPoints as calculatePoints } from '../utils/gamification'

export const gamificationService = {
  awardPoints: async (userId, points, action) => {
    const currentPoints = parseInt(localStorage.getItem(`points_${userId}`) || '0')
    const result = calculatePoints(currentPoints, points)

    localStorage.setItem(`points_${userId}`, result.newPoints.toString())

    return mockApiCall({
      ...result,
      action,
      pointsAwarded: points
    })
  },

  getBadges: async (userId) => {
    const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]')
    return mockApiCall({ badges })
  },

  unlockBadge: async (userId, badge) => {
    const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]')
    if (!badges.find(b => b.id === badge.id)) {
      badges.push(badge)
      localStorage.setItem(`badges_${userId}`, JSON.stringify(badges))
    }
    return mockApiCall({ success: true, badge })
  },

  getLeaderboard: async () => {
    return mockApiCall({
      leaderboard: [
        { userId: 'u1', name: 'Alex Johnson', points: 1250, level: 3 },
        { userId: 'u2', name: 'Sarah Chen', points: 980, level: 2 },
        { userId: 'u3', name: 'Mike Torres', points: 750, level: 2 }
      ]
    })
  }
}
