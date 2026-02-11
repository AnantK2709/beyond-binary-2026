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

// Expanded achievements covering all app activities
export const ACHIEVEMENTS = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'RSVP to your first event',
    icon: '🎯',
    color: 'sage',
    category: 'events',
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Join 3 communities',
    icon: '🦋',
    color: 'ocean',
    category: 'social',
  },
  {
    id: 'journaler',
    name: 'Journaler',
    description: 'Write 5 journal entries',
    icon: '📝',
    color: 'sage',
    category: 'wellness',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: '7-day mood check-in streak',
    icon: '🔥',
    color: 'orange',
    category: 'wellness',
  },
  {
    id: 'connector',
    name: 'Community Connector',
    description: 'Reach Level 2',
    icon: '🤝',
    color: 'sage',
    category: 'levels',
  },
  {
    id: 'explorer',
    name: 'Event Explorer',
    description: 'RSVP to 5 events',
    icon: '🔍',
    color: 'ocean',
    category: 'events',
  },
  {
    id: 'champion',
    name: 'Wellness Champion',
    description: 'Reach Level 5',
    icon: '🏆',
    color: 'gold',
    category: 'levels',
  },
  {
    id: 'habit-hero',
    name: 'Habit Hero',
    description: 'Complete 20 daily habits',
    icon: '💪',
    color: 'ocean',
    category: 'momentum',
  },
  {
    id: 'review-guru',
    name: 'Review Guru',
    description: 'Submit 5 event reviews',
    icon: '✍️',
    color: 'sage',
    category: 'events',
  },
  {
    id: 'master',
    name: 'Wellbeing Master',
    description: 'Reach Level 10',
    icon: '⭐',
    color: 'purple',
    category: 'levels',
  },
]
