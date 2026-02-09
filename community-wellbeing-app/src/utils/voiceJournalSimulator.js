export const simulateVoiceRecording = async (duration = 3000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transcriptions = [
        {
          text: "Today was a great day. I attended the morning yoga session and felt so energized afterwards. Meeting new people in the community has been wonderful.",
          emotions: ['happy', 'energized', 'grateful'],
          activities: ['yoga'],
          interests: ['wellness', 'social']
        },
        {
          text: "Had a tough week at work but the pottery class really helped me unwind. There's something therapeutic about working with clay.",
          emotions: ['stressed', 'relaxed'],
          activities: ['pottery'],
          interests: ['creative', 'wellness']
        },
        {
          text: "The trail run this morning was challenging but rewarding. I love being outdoors and pushing myself physically.",
          emotions: ['accomplished', 'energized'],
          activities: ['running'],
          interests: ['fitness', 'outdoors']
        }
      ]

      const randomTranscription = transcriptions[Math.floor(Math.random() * transcriptions.length)]

      resolve({
        success: true,
        transcription: randomTranscription,
        insights: [
          "You seem to find peace in physical activities",
          "Social connections appear to boost your mood"
        ]
      })
    }, duration)
  })
}

export const analyzeVoiceJournal = (transcription) => {
  const positiveWords = ['great', 'wonderful', 'love', 'energized', 'grateful', 'accomplished']
  const negativeWords = ['tough', 'stressed', 'challenging', 'difficult']

  const text = transcription.toLowerCase()

  const positiveCount = positiveWords.filter(word => text.includes(word)).length
  const negativeCount = negativeWords.filter(word => text.includes(word)).length

  let overallMood = 'neutral'
  if (positiveCount > negativeCount) overallMood = 'positive'
  if (negativeCount > positiveCount) overallMood = 'negative'

  return {
    mood: overallMood,
    sentiment: positiveCount - negativeCount,
    keywords: extractKeywords(transcription)
  }
}

const extractKeywords = (text) => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']
  const words = text.toLowerCase().split(' ')
  return words
    .filter(word => word.length > 4 && !commonWords.includes(word))
    .slice(0, 5)
}
