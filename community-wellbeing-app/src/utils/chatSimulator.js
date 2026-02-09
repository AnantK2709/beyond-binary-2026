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
        timestamp: new Date().toISOString()
      })
    }
  }, 10000) // Check every 10 seconds

  return () => clearInterval(interval)
}
