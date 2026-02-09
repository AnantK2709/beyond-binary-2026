import { MOCK_EVENTS, MOCK_COMMUNITIES } from './mockData'

export const generateEventRecommendations = (userProfile) => {
  if (!userProfile || !userProfile.interests) return []

  const userInterests = userProfile.interests || []
  const recommendations = []

  MOCK_EVENTS.forEach(event => {
    let score = 0

    // Match interests
    if (userInterests.includes(event.category)) {
      score += 0.5
    }

    // Match time preferences
    if (userProfile.availability && userProfile.availability[event.time]) {
      score += 0.3
    }

    // Random factor for diversity
    score += Math.random() * 0.2

    if (score > 0.4) {
      recommendations.push({
        event,
        confidence: Math.min(score, 0.99),
        reason: `Based on your interest in ${event.category}`
      })
    }
  })

  // Sort by confidence
  recommendations.sort((a, b) => b.confidence - a.confidence)

  return recommendations.slice(0, 5)
}

export const generateCommunityRecommendations = (userProfile) => {
  if (!userProfile || !userProfile.interests) return []

  const userInterests = userProfile.interests || []
  const recommendations = []

  MOCK_COMMUNITIES.forEach(community => {
    let score = 0

    // Match interests
    const matchingInterests = community.interests.filter(i =>
      userInterests.includes(i)
    )
    score += matchingInterests.length * 0.3

    // Verified communities get a boost
    if (community.verified) {
      score += 0.2
    }

    if (score > 0.3) {
      recommendations.push({
        community,
        confidence: Math.min(score, 0.99),
        reason: `Matches your interests: ${matchingInterests.join(', ')}`
      })
    }
  })

  recommendations.sort((a, b) => b.confidence - a.confidence)

  return recommendations.slice(0, 3)
}
