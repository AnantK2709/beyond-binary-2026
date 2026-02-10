export const simulateTypingDelay = () => {
  return Math.random() * 1000 + 500 // 500-1500ms
}

export const generateAutoReply = (message) => {
  const replies = [
    "That sounds great! Count me in!",
    "I'd love to join! What time works best?",
    "Thanks for organizing this!",
    "Looking forward to it!",
    "Great idea! I'll be there."
  ]

  return replies[Math.floor(Math.random() * replies.length)]
}

export const simulateChatActivity = (communityId, onNewMessage) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance of new message
      const messages = [
        "Anyone up for a morning hike this weekend?",
        "Just finished an amazing yoga session!",
        "Check out this new wellness event I found",
        "Has anyone tried the new meditation app?",
        "Looking for a running buddy, anyone interested?"
      ]

      const users = [
        { id: 'u101', name: 'Emma Wilson' },
        { id: 'u102', name: 'Jake Morrison' },
        { id: 'u103', name: 'Lisa Chen' }
      ]

      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]

      onNewMessage({
        id: `msg${Date.now()}`,
        communityId,
        userId: randomUser.id,
        userName: randomUser.name,
        text: randomMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
      })
    }
  }, 10000) // Check every 10 seconds

  return () => clearInterval(interval)
}

/**
 * Simulates timed message appearance for demo purposes
 * Messages appear with delays to create a realistic chat experience
 */
export const simulateTimedMessages = (messages, onMessageAppear, delayBetweenMessages = 2000) => {
  let currentIndex = 0
  const timeouts = []

  const showNextMessage = () => {
    if (currentIndex < messages.length) {
      const message = messages[currentIndex]
      onMessageAppear(message)
      currentIndex++
      
      if (currentIndex < messages.length) {
        const timeout = setTimeout(showNextMessage, delayBetweenMessages)
        timeouts.push(timeout)
      }
    }
  }

  // Start showing messages
  showNextMessage()

  // Return cleanup function
  return () => {
    timeouts.forEach(timeout => clearTimeout(timeout))
  }
}

/**
 * Generates demo messages for a community chat
 */
export const generateDemoMessages = (communityId, count = 5) => {
  const messageTemplates = [
    { text: "Hey everyone! Who's up for the morning hike this Saturday?", type: 'message' },
    { text: "I'm in! What time are we meeting?", type: 'message' },
    { text: "📢 New event announced: Morning Yoga in the Park", type: 'announcement' },
    { text: "Who wants to organize a hike?", type: 'event_proposal' },
    { text: "Poll: Best time for the hike?", type: 'poll' },
    { text: "🎉 Welcome to the community!", type: 'system' },
    { text: "Just finished an amazing yoga session! 🧘‍♀️", type: 'message' },
    { text: "Looking for a running buddy, anyone interested?", type: 'message' }
  ]

  const users = [
    { id: 'u101', name: 'Emma Wilson' },
    { id: 'u102', name: 'Jake Morrison' },
    { id: 'u103', name: 'Lisa Chen' },
    { id: 'u104', name: 'Mike Davis' },
    { id: 'u105', name: 'Sarah Johnson' }
  ]

  const messages = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const template = messageTemplates[i % messageTemplates.length]
    const user = users[i % users.length]
    const timestamp = new Date(now - (count - i) * 60000).toISOString() // Spread over time

    messages.push({
      id: `msg${now + i}`,
      communityId,
      userId: template.type === 'system' ? 'system' : user.id,
      userName: template.type === 'system' ? 'System' : user.name,
      text: template.text,
      timestamp,
      type: template.type,
      ...(template.type === 'poll' && {
        poll: {
          question: 'Best time for the hike?',
          options: [
            { id: 'opt1', text: '7:00 AM', votes: Math.floor(Math.random() * 5), voters: [] },
            { id: 'opt2', text: '8:00 AM', votes: Math.floor(Math.random() * 5), voters: [] },
            { id: 'opt3', text: '9:00 AM', votes: Math.floor(Math.random() * 5), voters: [] }
          ],
          totalVotes: 0
        }
      })
    })
  }

  return messages
}
