// AI Insight Generation Service
// Uses rule-based logic to generate personalized insights based on user activity

import { mockApiCall } from './api'

/**
 * Analyzes event review data and generates AI insights
 * @param {Object} review - Event review with rating, mood, and text
 * @param {Object} event - Event details
 * @returns {Promise<Object>} AI-generated insight
 */
const generateEventInsight = async (review, event) => {
  const { rating, mood, reviewText } = review
  const { category, title } = event

  let insight = ''
  let sentiment = 'neutral'
  let recommendations = []

  // Analyze rating
  if (rating >= 4) {
    sentiment = 'positive'
    insight = `Great to see you enjoyed "${title}"! `

    if (mood === 'energized' || mood === 'happy') {
      insight += `Your ${mood} mood shows this ${category} event was a perfect match. `
      recommendations.push({
        type: 'similar',
        message: `We'll recommend more ${category} events like this one.`
      })
    }
  } else if (rating === 3) {
    sentiment = 'neutral'
    insight = `Thanks for attending "${title}". `
    recommendations.push({
      type: 'variety',
      message: 'We can help you explore different types of events that might be a better fit.'
    })
  } else {
    sentiment = 'negative'
    insight = `We appreciate your honest feedback about "${title}". `
    recommendations.push({
      type: 'alternative',
      message: `Let's find ${category} events that better match your preferences.`
    })
  }

  // Analyze mood patterns
  if (mood === 'stressed' || mood === 'anxious') {
    recommendations.push({
      type: 'wellness',
      message: 'Consider trying meditation or yoga events to help manage stress.'
    })
  }

  if (mood === 'lonely') {
    recommendations.push({
      type: 'social',
      message: 'Social connection events and community gatherings might help you feel more connected.'
    })
  }

  // Analyze review text sentiment (basic keyword analysis)
  if (reviewText) {
    const positiveKeywords = ['amazing', 'great', 'wonderful', 'fantastic', 'loved', 'enjoyed', 'helpful', 'inspiring']
    const negativeKeywords = ['boring', 'disappointing', 'bad', 'terrible', 'waste', 'disorganized', 'crowded']

    const textLower = reviewText.toLowerCase()
    const hasPositiveWords = positiveKeywords.some(word => textLower.includes(word))
    const hasNegativeWords = negativeKeywords.some(word => textLower.includes(word))

    if (hasPositiveWords && !hasNegativeWords) {
      insight += 'Your enthusiasm really shows in your review! '
    } else if (hasNegativeWords) {
      insight += 'We take your concerns seriously and will work to improve. '
    }
  }

  return {
    insight,
    sentiment,
    recommendations,
    confidence: rating >= 4 || rating <= 2 ? 'high' : 'medium'
  }
}

/**
 * Generates insights from user's event participation history
 * @param {Array} attendedEvents - List of events user has attended
 * @param {Array} reviews - User's event reviews
 * @returns {Promise<Object>} Aggregated insights
 */
const generateActivityInsights = async (attendedEvents, reviews) => {
  const categoryCount = {}
  const avgRatings = {}
  let totalEvents = attendedEvents.length

  // Analyze event categories
  attendedEvents.forEach(event => {
    categoryCount[event.category] = (categoryCount[event.category] || 0) + 1
  })

  // Calculate average ratings per category
  reviews.forEach(review => {
    const event = attendedEvents.find(e => e.id === review.eventId)
    if (event) {
      if (!avgRatings[event.category]) {
        avgRatings[event.category] = { total: 0, count: 0 }
      }
      avgRatings[event.category].total += review.rating
      avgRatings[event.category].count += 1
    }
  })

  // Find favorite category
  const favoriteCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0]

  // Find best-rated category
  const bestRatedCategory = Object.entries(avgRatings)
    .map(([category, data]) => ({
      category,
      avgRating: data.total / data.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)[0]

  let insights = []

  if (totalEvents >= 5) {
    insights.push({
      type: 'milestone',
      message: `You've attended ${totalEvents} events! You're building great habits for community connection.`,
      icon: '🎉'
    })
  }

  if (favoriteCategory) {
    insights.push({
      type: 'preference',
      message: `${favoriteCategory[0]} events seem to be your favorite, with ${favoriteCategory[1]} attended.`,
      icon: '⭐'
    })
  }

  if (bestRatedCategory && bestRatedCategory.avgRating >= 4) {
    insights.push({
      type: 'satisfaction',
      message: `You rate ${bestRatedCategory.category} events highly (${bestRatedCategory.avgRating.toFixed(1)}/5). Great match!`,
      icon: '💚'
    })
  }

  // Encourage diversity
  const uniqueCategories = Object.keys(categoryCount).length
  if (uniqueCategories < 3 && totalEvents >= 5) {
    insights.push({
      type: 'suggestion',
      message: 'Try exploring new event categories to discover more interests!',
      icon: '🔍'
    })
  }

  return mockApiCall({
    insights,
    summary: {
      totalEvents,
      favoriteCategory: favoriteCategory?.[0],
      uniqueCategories,
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0
    }
  })
}

/**
 * Generates personalized event recommendations based on user behavior
 * @param {Object} userProfile - User preferences and history
 * @param {Array} availableEvents - All available events
 * @returns {Promise<Array>} Recommended events with confidence scores
 */
const generateRecommendations = async (userProfile, availableEvents) => {
  const { interests, attendedCategories, preferredTimes, moodHistory } = userProfile

  const recommendations = availableEvents.map(event => {
    let score = 0
    let reasons = []

    // Interest matching
    if (interests?.includes(event.category)) {
      score += 30
      reasons.push('Matches your interests')
    }

    // Category history
    if (attendedCategories?.[event.category] > 0) {
      score += 20
      reasons.push('You enjoyed similar events')
    }

    // Time preference
    const eventHour = parseInt(event.time.split(':')[0])
    if (preferredTimes?.includes(eventHour < 12 ? 'morning' : eventHour < 17 ? 'afternoon' : 'evening')) {
      score += 15
      reasons.push('Matches your preferred time')
    }

    // Mood-based recommendations
    if (moodHistory) {
      const recentMood = moodHistory[moodHistory.length - 1]
      if (recentMood === 'stressed' && (event.category === 'wellness' || event.category === 'mindfulness')) {
        score += 25
        reasons.push('Recommended for stress relief')
      }
      if (recentMood === 'lonely' && event.category === 'social') {
        score += 25
        reasons.push('Great for social connection')
      }
    }

    // Diversity bonus
    if (!attendedCategories?.[event.category]) {
      score += 10
      reasons.push('New experience for you')
    }

    return {
      event,
      score,
      reasons,
      confidence: score >= 50 ? 'high' : score >= 30 ? 'medium' : 'low'
    }
  })

  // Sort by score and return top recommendations
  const topRecommendations = recommendations
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return mockApiCall(topRecommendations)
}

/**
 * Analyzes mood trends and generates wellness insights
 * @param {Array} moodEntries - User's mood check-in history
 * @returns {Promise<Object>} Mood analysis and insights
 */
const analyzeMoodTrends = async (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) {
    return mockApiCall({ insights: [], trend: 'neutral' })
  }

  const moodCounts = {}
  moodEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
  })

  const dominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]

  const recentMoods = moodEntries.slice(-7) // Last 7 entries
  const positiveMoods = ['happy', 'energized', 'grateful', 'calm']
  const negativeMoods = ['stressed', 'anxious', 'sad', 'lonely']

  const recentPositive = recentMoods.filter(e => positiveMoods.includes(e.mood)).length
  const recentNegative = recentMoods.filter(e => negativeMoods.includes(e.mood)).length

  let trend = 'neutral'
  let insights = []

  if (recentPositive > recentNegative * 1.5) {
    trend = 'improving'
    insights.push({
      type: 'positive',
      message: 'Your mood has been trending positively! Keep up the great work with your wellness activities.',
      icon: '📈'
    })
  } else if (recentNegative > recentPositive * 1.5) {
    trend = 'declining'
    insights.push({
      type: 'concern',
      message: 'We notice you\'ve been feeling down lately. Consider reaching out to community support or attending wellness events.',
      icon: '💙'
    })
  }

  if (dominantMood[0] === 'stressed' || dominantMood[0] === 'anxious') {
    insights.push({
      type: 'recommendation',
      message: 'Mindfulness and meditation events might help manage stress. We have several available this week.',
      icon: '🧘'
    })
  }

  return mockApiCall({
    trend,
    insights,
    dominantMood: dominantMood[0],
    moodDistribution: moodCounts
  })
}

export const aiService = {
  generateEventInsight,
  generateActivityInsights,
  generateRecommendations,
  analyzeMoodTrends
}
