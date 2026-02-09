export const generateMonthlyReport = (userId, month, year) => {
  // Fetch user data from localStorage
  const moodHistory = JSON.parse(localStorage.getItem(`mood_${userId}`) || '[]')
  const journalEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
  const rsvpEvents = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
  const myCommunities = JSON.parse(localStorage.getItem('my_communities') || '[]')
  const points = parseInt(localStorage.getItem(`points_${userId}`) || '0')

  // Calculate statistics
  const report = {
    month,
    year,
    userId,
    eventsAttended: rsvpEvents.length,
    communitiesJoined: myCommunities.length,
    pointsEarned: points,
    journalEntries: journalEntries.length,
    moodTrend: calculateMoodTrend(moodHistory),
    topMoments: generateTopMoments(rsvpEvents, points),
    emotionalSummary: generateEmotionalSummary(moodHistory),
    socialConnections: calculateSocialConnections(myCommunities),
    recommendations: generateMonthlyRecommendations(moodHistory, rsvpEvents)
  }

  return report
}

const calculateMoodTrend = (moodHistory) => {
  if (moodHistory.length < 2) return 'stable'

  const recent = moodHistory.slice(-7)
  const older = moodHistory.slice(-14, -7)

  const recentAvg = recent.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / recent.length
  const olderAvg = older.length > 0
    ? older.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / older.length
    : recentAvg

  if (recentAvg > olderAvg + 0.5) return 'improving'
  if (recentAvg < olderAvg - 0.5) return 'declining'
  return 'stable'
}

const getMoodValue = (mood) => {
  const values = {
    'amazing': 5,
    'happy': 4,
    'neutral': 3,
    'sad': 2,
    'stressed': 1
  }
  return values[mood] || 3
}

const generateTopMoments = (events, points) => {
  const moments = []

  if (events.length > 0) {
    moments.push(`Attended ${events.length} community events`)
  }

  if (points > 300) {
    moments.push('Earned over 300 wellbeing points')
  }

  moments.push('Made meaningful connections in your communities')

  return moments
}

const generateEmotionalSummary = (moodHistory) => {
  if (moodHistory.length === 0) {
    return 'Start tracking your mood to see insights here'
  }

  const avgMood = moodHistory.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / moodHistory.length

  if (avgMood >= 4) return 'Your wellbeing has been consistently high this month'
  if (avgMood >= 3) return 'Your wellbeing has been stable this month'
  return 'Consider trying new activities to boost your wellbeing'
}

const calculateSocialConnections = (communities) => {
  return communities.length * 5 // Estimate 5 connections per community
}

const generateMonthlyRecommendations = (moodHistory, events) => {
  const recommendations = []

  if (moodHistory.length < 15) {
    recommendations.push('Try daily mood check-ins to track your wellbeing')
  }

  if (events.length < 4) {
    recommendations.push('Attend more community events to boost social connections')
  }

  recommendations.push('Explore new interests through our recommended events')

  return recommendations
}
