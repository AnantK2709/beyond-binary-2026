export const generateTranscript = async (recording) => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      const transcriptions = [
        "Today was a great day. I attended the morning yoga session and felt so energized afterwards. Meeting new people in the community has been wonderful.",
        "Had a tough week at work but the pottery class really helped me unwind. There's something therapeutic about working with clay.",
        "The trail run this morning was challenging but rewarding. I love being outdoors and pushing myself physically."
      ];

      const randomTranscript = transcriptions[Math.floor(Math.random() * transcriptions.length)];

      resolve({
        success: true,
        transcript: randomTranscript
      });
    }, 100); // Simulated processing time
  });
};

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