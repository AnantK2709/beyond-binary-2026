const POINTS_PER_LEVEL = 500

export const calculateLevel = (points) => {
  return Math.floor(points / POINTS_PER_LEVEL) + 1
}

export const getPointsToNextLevel = (points) => {
  const currentLevel = calculateLevel(points)
  const pointsForNextLevel = currentLevel * POINTS_PER_LEVEL
  return pointsForNextLevel - points
}

export const awardPoints = (currentPoints, eventPoints) => {
  const oldLevel = calculateLevel(currentPoints)
  const newPoints = currentPoints + eventPoints
  const newLevel = calculateLevel(newPoints)

  return {
    newPoints,
    newLevel,
    leveledUp: newLevel > oldLevel,
    badge: newLevel > oldLevel ? getBadgeForLevel(newLevel) : null
  }
}

export const getBadgeForLevel = (level) => {
  const badges = {
    2: { id: 'connector', name: 'Community Connector', icon: '🤝', color: 'sage' },
    3: { id: 'explorer', name: 'Event Explorer', icon: '🔍', color: 'ocean' },
    5: { id: 'champion', name: 'Wellness Champion', icon: '🏆', color: 'gold' },
    10: { id: 'master', name: 'Wellbeing Master', icon: '⭐', color: 'purple' }
  }
  return badges[level] || null
}

export const getProgressPercentage = (points) => {
  const currentLevel = calculateLevel(points)
  const pointsInCurrentLevel = points - ((currentLevel - 1) * POINTS_PER_LEVEL)
  return (pointsInCurrentLevel / POINTS_PER_LEVEL) * 100
}
