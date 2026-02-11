import { useState, useEffect, useRef, useContext } from 'react'
import { MessageCircle } from 'lucide-react'
import { ChatContext } from '../../../context/ChatContext'
import { AuthContext } from '../../../context/AuthContext'
import { GamificationContext } from '../../../context/GamificationContext'
import { chatService } from '../../../services/chatService'
import { simulateTimedMessages, generateDemoMessages } from '../../../utils/chatSimulator'
import { useToast } from '../../../hooks/useToast'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

function GroupChat({ communityId, isMember = false }) {
  const { messages, loading, loadMessages, sendMessage, updateMessage } = useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const { awardPoints } = useContext(GamificationContext)
  const { showToast } = useToast()
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [isSimulating, setIsSimulating] = useState(false) // Disable simulation by default for now
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Load initial messages - only once per communityId
  const loadedCommunitiesRef = useRef(new Set())
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9))
  const displayedMessageIdsRef = useRef(new Set()) // Declare BEFORE useEffects that use it
  const hasSimulatedRef = useRef(new Set()) // Track which communities have been simulated
  
  console.log(`[GroupChat-${componentIdRef.current}] Component render`, {
    communityId,
    isLoaded: loadedCommunitiesRef.current.has(communityId),
    messagesCount: messages[communityId]?.length || 0,
    displayedMessagesCount: displayedMessages.length,
    isSimulating,
    hasSimulated: hasSimulatedRef.current.has(communityId)
  });
  
  useEffect(() => {
    console.log(`[GroupChat-${componentIdRef.current}] useEffect triggered (loadMessages)`, {
      communityId,
      isAlreadyLoaded: loadedCommunitiesRef.current.has(communityId),
      timestamp: new Date().toISOString()
    });

    if (communityId) {
      // Clear previous messages for fresh start
      console.log(`[GroupChat-${componentIdRef.current}] [cleanup]Clearing previous messages for fresh start`)
      setDisplayedMessages([])
      displayedMessageIdsRef.current.clear()
      hasSimulatedRef.current.delete(communityId)
      loadedCommunitiesRef.current.delete(communityId)
      
      // Load fresh messages
      if (!loadedCommunitiesRef.current.has(communityId)) {
        console.log(`[GroupChat-${componentIdRef.current}] [ok]Calling loadMessages(${communityId})`)
        loadedCommunitiesRef.current.add(communityId)
        loadMessages(communityId)
      }
    }
    
    return () => {
      console.log(`[GroupChat-${componentIdRef.current}] [cleanup]Cleanup function called (loadMessages)`, { communityId })
    }
  }, [communityId, loadMessages])

  // Display messages when they're loaded - handle both simulation and immediate display
  useEffect(() => {
    const communityMessages = messages[communityId];
    
    console.log(`[GroupChat-${componentIdRef.current}] useEffect triggered (display messages)`, {
      communityId,
      hasMessages: !!communityMessages,
      messagesCount: communityMessages?.length || 0,
      isSimulating,
      hasSimulated: hasSimulatedRef.current.has(communityId),
      displayedMessagesCount: displayedMessages.length,
      messagesObjectKeys: Object.keys(messages)
    });

    if (!communityId || !communityMessages || communityMessages.length === 0) {
      console.log(`[GroupChat-${componentIdRef.current}] [warn]No messages to display`, {
        communityId,
        hasMessages: !!communityMessages,
        messagesCount: communityMessages?.length || 0
      });
      return;
    }

    // If already simulated for this community, skip
    if (hasSimulatedRef.current.has(communityId)) {
      console.log(`[GroupChat-${componentIdRef.current}] [warn]Already simulated for ${communityId}, skipping`);
      // But ensure displayedMessages has the messages (in case state was reset)
      if (displayedMessages.length === 0) {
        console.log(`[GroupChat-${componentIdRef.current}] [refresh]Re-displaying messages (displayedMessages was empty)`);
        const allMessages = communityMessages;
        allMessages.forEach(msg => displayedMessageIdsRef.current.add(msg.id))
        setDisplayedMessages(allMessages)
      }
      return;
    }

    console.log(`[GroupChat-${componentIdRef.current}] [processing]Processing ${communityMessages.length} messages for ${communityId}`);

    // If simulating, show messages with delay
    if (isSimulating) {
      console.log(`[GroupChat-${componentIdRef.current}] [start]Starting simulation for ${communityId}`);
      hasSimulatedRef.current.add(communityId);

      // Generate demo messages if we don't have many
      const demoMessages = communityMessages.length < 3 
        ? generateDemoMessages(communityId, 8)
        : communityMessages

      // Mark all demo messages as displayed
      demoMessages.forEach(msg => displayedMessageIdsRef.current.add(msg.id))

      // Start simulation
      const cleanup = simulateTimedMessages(
        demoMessages,
        (message) => {
          console.log(`[GroupChat-${componentIdRef.current}] [msg]Adding message to display:`, message.id);
          setDisplayedMessages(prev => {
            // Only add if not already displayed
            if (!displayedMessageIdsRef.current.has(message.id)) {
              displayedMessageIdsRef.current.add(message.id)
              return [...prev, message]
            }
            return prev
          })
        },
        2000 // 2 seconds between messages
      )

      // Stop simulation after all messages are shown
      setTimeout(() => {
        console.log(`[GroupChat-${componentIdRef.current}] [ok]Simulation complete for ${communityId}`);
        setIsSimulating(false)
      }, demoMessages.length * 2000 + 1000)

      return cleanup
    } else {
      // If not simulating, show all messages immediately
      console.log(`[GroupChat-${componentIdRef.current}] [instant]Showing all messages immediately for ${communityId}`);
      hasSimulatedRef.current.add(communityId);
      const allMessages = communityMessages;
      allMessages.forEach(msg => displayedMessageIdsRef.current.add(msg.id))
      setDisplayedMessages(allMessages)
      console.log(`[GroupChat-${componentIdRef.current}] [ok]Set ${allMessages.length} messages to displayedMessages`, {
        messageIds: allMessages.map(m => m.id)
      });
    }
  }, [communityId, messages, isSimulating]) // Watch messages object and isSimulating

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages])
  
  // Handle new messages from ChatContext (for real-time updates after initial load)
  useEffect(() => {
    if (!communityId || !messages[communityId] || hasSimulatedRef.current.has(communityId)) {
      // Skip if already simulated (initial load handled above)
      return;
    }

    const communityMessages = messages[communityId]
    const newMessages = communityMessages.filter(
      msg => !displayedMessageIdsRef.current.has(msg.id)
    )
    
    if (newMessages.length > 0) {
      console.log(`[GroupChat-${componentIdRef.current}] [new]Adding ${newMessages.length} new messages`);
      setDisplayedMessages(prev => {
        const updated = [...prev]
        newMessages.forEach(msg => {
          if (!displayedMessageIdsRef.current.has(msg.id)) {
            updated.push(msg)
            displayedMessageIdsRef.current.add(msg.id)
          }
        })
        return updated
      })
    }
  }, [messages, communityId])

  const handleSendMessage = async (newMessage) => {
    if (!newMessage) return

    // Check if message is already displayed (prevent duplicates)
    if (displayedMessageIdsRef.current.has(newMessage.id)) {
      console.log(`[GroupChat-${componentIdRef.current}] [warn]Message ${newMessage.id} already displayed, skipping`)
      return
    }

    // Add to displayed messages immediately for instant feedback
    displayedMessageIdsRef.current.add(newMessage.id)
    setDisplayedMessages(prev => [...prev, newMessage])
    
    // Also update context (if not already there)
    await sendMessage(communityId, newMessage)

    // Award points for sending a message (rate-limited in GamificationContext)
    if (newMessage.userId === user?.id) {
      awardPoints(5, 'chat_message', 'Chat message')
    }

    // Check if user sent "hello" (case insensitive) to trigger conversation flow
    const messageText = newMessage.text?.toLowerCase().trim()
    if ((messageText === 'hello' || messageText === 'hi' || messageText === 'hey') && newMessage.userId === user?.id) {
      console.log(`[GroupChat-${componentIdRef.current}] [start]Triggering conversation flow after "hello"`)
      // Use actual user name from AuthContext (fallback to message userName)
      const userName = user?.name || newMessage.userName || 'there'
      // Don't await - let it run in background
      triggerConversationFlow(newMessage.userId, userName)
    }
  }

  // Community-specific conversation and poll configurations
  const getCommunityConfig = (communityId) => {
    const configs = {
      'c001': { // Outdoor Enthusiasts
        conversation: [
          {
            text: 'Hey {userName}! Great to see you here!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Welcome! We were just planning our next adventure!',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just discussing our next group activity. Want to help us decide?',
            delay: 3000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Yes! I think we should vote on where to go!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'That sounds like a great idea! Let me create a poll for everyone.',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          }
        ],
        poll: {
          question: 'Where should we go for our next group activity?',
          options: ['Beach', 'Mountain', 'City', 'Park'],
          creatorId: 'u002',
          creatorName: 'Marcus Johnson'
        }
      },
      'c002': { // Wellness Warriors
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our wellness circle!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just discussing our next wellness session!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect timing! We need help deciding what to focus on next.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'I think we should vote on the type of session!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Great idea! Let me create a poll for everyone to vote.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What type of wellness session should we have next?',
          options: ['Yoga Flow', 'Meditation', 'Breathwork', 'Mindful Walking'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c003': { // Creative Souls
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our creative space!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just brainstorming our next creative project!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Your input would be amazing! We need help choosing our next activity.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Yes! Let\'s vote on what we should create together!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Perfect! Let me set up a poll for everyone.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What creative activity should we do together next?',
          options: ['Painting Workshop', 'Pottery Class', 'Photography Walk', 'Writing Circle'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c004': { // Fitness Fanatics
        conversation: [
          {
            text: 'Hey {userName}! Welcome to the fitness community!',
            delay: 2000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'We were just planning our next group workout!',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Perfect timing! We need help deciding what type of workout to do.',
            delay: 3000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'Let\'s vote on it! Everyone can share their preference.',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u007',
            userName: 'Jake Morrison'
          }
        ],
        poll: {
          question: 'What type of workout should we do next?',
          options: ['HIIT Training', 'Yoga Flow', 'Running Group', 'Strength Training'],
          creatorId: 'u007',
          creatorName: 'Jake Morrison'
        }
      },
      'c005': { // Book Lovers Circle
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our book club!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just discussing our next book selection!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Your opinion would be valuable! Help us choose the next read.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Yes! Let\'s vote on the genre or book!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll for everyone.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What should we read next?',
          options: ['Fiction Novel', 'Non-Fiction', 'Mystery/Thriller', 'Self-Help'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c006': { // Mental Health Support
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our supportive community!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next support session.',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'We\'d love your input on what topic to focus on.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the discussion topic!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What topic should we discuss in our next session?',
          options: ['Stress Management', 'Building Resilience', 'Self-Care Practices', 'Mindfulness Techniques'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c007': { // Foodie Adventures
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our foodie community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next cooking event!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Perfect! Help us decide what cuisine to explore.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the cuisine type!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Excellent! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What cuisine should we explore next?',
          options: ['Italian', 'Asian Fusion', 'Mediterranean', 'Desserts'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c008': { // Music Makers
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our music community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next jam session!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'We need help deciding what genre to focus on.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the music style!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What music style should we explore?',
          options: ['Acoustic', 'Jazz', 'Electronic', 'Rock'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c009': { // Tech Enthusiasts
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our tech community!',
            delay: 2000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'We were just discussing our next tech meetup!',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Perfect timing! Help us decide on the topic.',
            delay: 3000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Let\'s vote on what to discuss!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u008',
            userName: 'Lisa Chen'
          }
        ],
        poll: {
          question: 'What tech topic should we discuss next?',
          options: ['AI & Machine Learning', 'Web Development', 'Mobile Apps', 'Cybersecurity'],
          creatorId: 'u008',
          creatorName: 'Lisa Chen'
        }
      },
      'c010': { // Gaming Guild
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our gaming community!',
            delay: 2000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'We were just planning our next gaming session!',
            delay: 2500,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Help us decide what game to play together!',
            delay: 3000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'Let\'s vote on the game genre!',
            delay: 2000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u007',
            userName: 'Jake Morrison'
          }
        ],
        poll: {
          question: 'What type of game should we play?',
          options: ['Co-op Games', 'Strategy Games', 'RPG Games', 'Casual Games'],
          creatorId: 'u007',
          creatorName: 'Jake Morrison'
        }
      },
      'c011': { // Travel Explorers
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our travel community!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'We were just planning our next group trip!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Help us decide on the destination.',
            delay: 3000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Let\'s vote on where to go!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          }
        ],
        poll: {
          question: 'Where should we plan our next group trip?',
          options: ['Beach Destination', 'Mountain Retreat', 'City Exploration', 'Nature Adventure'],
          creatorId: 'u002',
          creatorName: 'Marcus Johnson'
        }
      },
      'c012': { // Parenting Circle
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our parenting community!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next parent meetup!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'We\'d love your input on what activity to organize.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the activity type!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What activity should we organize next?',
          options: ['Playdate at Park', 'Parent Support Group', 'Educational Workshop', 'Family Picnic'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c013': { // Yoga & Mindfulness
        conversation: [
          {
            text: 'Namaste {userName}! Welcome to our yoga community!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next yoga session!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide what style to practice.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the yoga style!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What yoga style should we practice?',
          options: ['Hatha Yoga', 'Vinyasa Flow', 'Yin Yoga', 'Power Yoga'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c014': { // Photography Enthusiasts
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our photography community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next photo walk!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Help us decide on the location.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on where to shoot!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'Where should we go for our next photo walk?',
          options: ['City Streets', 'Nature Park', 'Beach Sunset', 'Urban Architecture'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c015': { // Cooking & Recipes
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our cooking community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next cooking class!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Help us decide what to cook.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the dish!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What should we cook together next?',
          options: ['Pasta Night', 'Asian Fusion', 'Baking Workshop', 'BBQ Party'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c016': { // Art & Crafts
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our art community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next art workshop!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Help us decide on the medium.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the art form!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Great! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What art form should we explore?',
          options: ['Watercolor Painting', 'Pottery Making', 'Sketching', 'Digital Art'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c017': { // Nature Lovers
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our nature community!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'We were just planning our next nature outing!',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Help us decide on the activity.',
            delay: 3000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Let\'s vote on what to do!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          }
        ],
        poll: {
          question: 'What nature activity should we do?',
          options: ['Bird Watching', 'Nature Photography', 'Forest Walk', 'Wildlife Spotting'],
          creatorId: 'u002',
          creatorName: 'Marcus Johnson'
        }
      },
      'c018': { // Hiking Adventures
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our hiking community!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'We were just planning our next hike!',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Help us decide on the trail difficulty.',
            delay: 3000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Let\'s vote on the trail!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Great idea! Let me create a poll.',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          }
        ],
        poll: {
          question: 'What type of hike should we do?',
          options: ['Easy Trail', 'Moderate Hike', 'Challenging Climb', 'Multi-day Trek'],
          creatorId: 'u002',
          creatorName: 'Marcus Johnson'
        }
      },
      'c019': { // Meditation Circle
        conversation: [
          {
            text: 'Welcome {userName}! Welcome to our meditation circle!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next meditation session!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide on the meditation type.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the practice!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What meditation practice should we do?',
          options: ['Mindfulness', 'Loving-Kindness', 'Body Scan', 'Breathwork'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c020': { // Food & Dining
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our foodie community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next restaurant visit!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Help us decide on the cuisine.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the restaurant type!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What type of restaurant should we try?',
          options: ['Fine Dining', 'Casual Eatery', 'Street Food', 'Cafe & Brunch'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c021': { // Music Lovers
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our music community!',
            delay: 2000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'We were just planning our next music event!',
            delay: 2500,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Help us decide on the event type.',
            delay: 3000,
            userId: 'u005',
            userName: 'Alex Rivera'
          },
          {
            text: 'Let\'s vote on the activity!',
            delay: 2000,
            userId: 'u006',
            userName: 'Emma Wilson'
          },
          {
            text: 'Great! Let me create a poll.',
            delay: 2500,
            userId: 'u005',
            userName: 'Alex Rivera'
          }
        ],
        poll: {
          question: 'What music event should we organize?',
          options: ['Concert Night', 'Open Mic', 'Music Festival', 'Album Listening Party'],
          creatorId: 'u005',
          creatorName: 'Alex Rivera'
        }
      },
      'c022': { // Tech & Innovation
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our tech community!',
            delay: 2000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'We were just planning our next tech meetup!',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Help us decide on the topic.',
            delay: 3000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Let\'s vote on the tech topic!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u008',
            userName: 'Lisa Chen'
          }
        ],
        poll: {
          question: 'What tech topic should we discuss?',
          options: ['AI & ML', 'Web Dev', 'Mobile Apps', 'Cloud Computing'],
          creatorId: 'u008',
          creatorName: 'Lisa Chen'
        }
      },
      'c023': { // Gaming Community
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our gaming community!',
            delay: 2000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'We were just planning our next gaming session!',
            delay: 2500,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Help us decide on the game type.',
            delay: 3000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'Let\'s vote on the game!',
            delay: 2000,
            userId: 'u008',
            userName: 'Lisa Chen'
          },
          {
            text: 'Great! Let me create a poll.',
            delay: 2500,
            userId: 'u007',
            userName: 'Jake Morrison'
          }
        ],
        poll: {
          question: 'What type of game should we play?',
          options: ['Co-op Games', 'Battle Royale', 'RPG Adventure', 'Puzzle Games'],
          creatorId: 'u007',
          creatorName: 'Jake Morrison'
        }
      },
      'c024': { // Travel & Adventure
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our travel community!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'We were just planning our next group trip!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide on the destination type.',
            delay: 3000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Let\'s vote on where to go!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          }
        ],
        poll: {
          question: 'What type of destination should we visit?',
          options: ['Tropical Beach', 'Mountain Retreat', 'Historic City', 'Adventure Park'],
          creatorId: 'u002',
          creatorName: 'Marcus Johnson'
        }
      },
      'c025': { // Parenting Support
        conversation: [
          {
            text: 'Hi {userName}! Welcome to our parenting community!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next parent gathering!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide on the activity.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on what to do!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Great! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What should we organize next?',
          options: ['Kids Playdate', 'Parent Workshop', 'Family Activity', 'Support Group'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c026': { // Reading Club
        conversation: [
          {
            text: 'Hello {userName}! Welcome to our book club!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just selecting our next book!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide on the genre.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the book type!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What genre should we read next?',
          options: ['Fiction', 'Mystery', 'Biography', 'Self-Help'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c027': { // Mental Wellness
        conversation: [
          {
            text: 'Welcome {userName}! Welcome to our wellness community!',
            delay: 2000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'We were just planning our next wellness session!',
            delay: 2500,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Help us decide on the focus area.',
            delay: 3000,
            userId: 'u001',
            userName: 'Sarah Chen'
          },
          {
            text: 'Let\'s vote on the topic!',
            delay: 2000,
            userId: 'u003',
            userName: 'Priya Kumar'
          },
          {
            text: 'Great! Let me create a poll.',
            delay: 2500,
            userId: 'u001',
            userName: 'Sarah Chen'
          }
        ],
        poll: {
          question: 'What wellness topic should we focus on?',
          options: ['Stress Relief', 'Emotional Health', 'Self-Care', 'Mindfulness'],
          creatorId: 'u001',
          creatorName: 'Sarah Chen'
        }
      },
      'c028': { // Active Lifestyle
        conversation: [
          {
            text: 'Hey {userName}! Welcome to our active community!',
            delay: 2000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'We were just planning our next fitness challenge!',
            delay: 2500,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Help us decide on the challenge type.',
            delay: 3000,
            userId: 'u007',
            userName: 'Jake Morrison'
          },
          {
            text: 'Let\'s vote on the activity!',
            delay: 2000,
            userId: 'u002',
            userName: 'Marcus Johnson'
          },
          {
            text: 'Perfect! Let me create a poll.',
            delay: 2500,
            userId: 'u007',
            userName: 'Jake Morrison'
          }
        ],
        poll: {
          question: 'What fitness challenge should we do?',
          options: ['30-Day Challenge', 'Running Group', 'Strength Training', 'Yoga Challenge'],
          creatorId: 'u007',
          creatorName: 'Jake Morrison'
        }
      }
    }
    
    // Default to Outdoor Enthusiasts if community not found
    return configs[communityId] || configs['c001']
  }

  // Trigger conversation flow that leads to poll voting
  const triggerConversationFlow = async (userId, userName) => {
    const config = getCommunityConfig(communityId)
    // Replace {userName} placeholder in conversation messages
    const conversationMessages = config.conversation.map(msg => ({
      ...msg,
      text: msg.text.replace(/{userName}/g, userName || 'there')
    }))

    // Show conversation messages with delays
    for (let i = 0; i < conversationMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, conversationMessages[i].delay))
      
      const conversationMessage = {
        id: `conv-msg-${Date.now()}-${i}`,
        communityId,
        userId: conversationMessages[i].userId,
        userName: conversationMessages[i].userName,
        text: conversationMessages[i].text,
        timestamp: new Date().toISOString(),
        type: 'message'
      }

      // Mark as displayed and add to context
      displayedMessageIdsRef.current.add(conversationMessage.id)
      setDisplayedMessages(prev => [...prev, conversationMessage])
      await sendMessage(communityId, conversationMessage)
    }

    // After conversation, create and show a poll
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      console.log(`[GroupChat-${componentIdRef.current}] [poll]Creating poll for community ${communityId}...`)
      const pollMessage = await chatService.createPoll(
        communityId,
        config.poll.question,
        config.poll.options,
        config.poll.creatorId,
        config.poll.creatorName
      )

      console.log(`[GroupChat-${componentIdRef.current}] [poll]Poll creation response:`, JSON.stringify(pollMessage, null, 2))

      if (!pollMessage) {
        console.error(`[GroupChat-${componentIdRef.current}] [error]Poll creation returned null/undefined`)
        return
      }

      if (!pollMessage.poll) {
        console.error(`[GroupChat-${componentIdRef.current}] [error]Poll message missing poll data!`, {
          messageId: pollMessage.id,
          messageType: pollMessage.type,
          hasPoll: !!pollMessage.poll,
          fullMessage: pollMessage
        })
        // Try to fix it by adding poll data manually
        if (pollMessage.type === 'poll') {
          console.log(`[GroupChat-${componentIdRef.current}] [fix]Attempting to fix poll data...`)
          const fallbackConfig = getCommunityConfig(communityId)
          pollMessage.poll = {
            question: fallbackConfig.poll.question,
            options: fallbackConfig.poll.options.map((opt, idx) => ({
              id: `opt${idx + 1}`,
              text: opt,
              votes: 0,
              voters: []
            })),
            totalVotes: 0
          }
          console.log(`[GroupChat-${componentIdRef.current}] [ok]Fixed poll data`)
        }
      }

      if (pollMessage && pollMessage.poll) {
        console.log(`[GroupChat-${componentIdRef.current}] [ok]Poll created successfully with poll data`)
        // Mark as displayed and add to context
        displayedMessageIdsRef.current.add(pollMessage.id)
        setDisplayedMessages(prev => [...prev, pollMessage])
        await sendMessage(communityId, pollMessage)
        console.log(`[GroupChat-${componentIdRef.current}] [ok]Poll displayed in chat`)
        
        // Simulate votes from multiple users after a short delay
        setTimeout(() => {
          simulatePollVotes(pollMessage.id, pollMessage.poll)
        }, 3000) // Start simulating votes 3 seconds after poll is created
      } else {
        console.error(`[GroupChat-${componentIdRef.current}] [error]Still missing poll data after fix attempt`)
      }
    } catch (error) {
      console.error(`[GroupChat-${componentIdRef.current}] [error]Error creating poll:`, error)
    }
  }

  // Simulate votes from multiple users on a poll
  const simulatePollVotes = async (pollMessageId, pollData) => {
    console.log(`[GroupChat-${componentIdRef.current}] [vote]Starting to simulate votes for poll ${pollMessageId}`)
    
    // List of simulated users who will vote
    const simulatedUsers = [
      { id: 'u001', name: 'Sarah Chen' },
      { id: 'u002', name: 'Marcus Johnson' },
      { id: 'u003', name: 'Priya Kumar' },
      { id: 'u005', name: 'Alex Rivera' },
      { id: 'u006', name: 'Emma Wilson' },
      { id: 'u007', name: 'Jake Morrison' },
      { id: 'u008', name: 'Lisa Chen' }
    ]

    // Randomly assign votes to different options
    const options = pollData.options || []
    if (options.length === 0) {
      console.error(`[GroupChat-${componentIdRef.current}] [error]No options in poll data`)
      return
    }

    // Simulate 5-8 votes spread across options
    const numberOfVotes = Math.floor(Math.random() * 4) + 5 // 5-8 votes
    const shuffledUsers = [...simulatedUsers].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < numberOfVotes && i < shuffledUsers.length; i++) {
      // Random delay between votes (1-3 seconds)
      const delay = Math.random() * 2000 + 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Randomly select an option (weighted towards first few options)
      const optionIndex = Math.floor(Math.random() * Math.min(options.length, 3))
      const selectedOption = options[optionIndex]
      
      try {
        console.log(`[GroupChat-${componentIdRef.current}] [vote]Simulating vote: ${shuffledUsers[i].name} votes for ${selectedOption.text}`)
        const updatedMessage = await chatService.voteOnPoll(communityId, pollMessageId, selectedOption.id, shuffledUsers[i].id)
        
        if (updatedMessage && updatedMessage.poll) {
          // Update ChatContext with the updated message
          if (updateMessage) {
            updateMessage(communityId, pollMessageId, updatedMessage)
          }
          
          // Update displayed messages with new vote count
          setDisplayedMessages(prev => prev.map(msg => {
            if (msg.id === pollMessageId) {
              return updatedMessage
            }
            return msg
          }))
        }
      } catch (error) {
        console.error(`[GroupChat-${componentIdRef.current}] [error]Error simulating vote:`, error)
      }
    }
    
    console.log(`[GroupChat-${componentIdRef.current}] [ok]Finished simulating votes`)
  }

  const handleCreatePoll = async () => {
    const question = prompt('Enter poll question:')
    if (!question) return

    const options = []
    let optionCount = 0
    while (optionCount < 2) {
      const option = prompt(`Enter option ${optionCount + 1} (or leave empty to finish):`)
      if (!option) break
      options.push(option)
      optionCount++
    }

    if (options.length < 2) {
      showToast('Please provide at least 2 options for the poll', 'error')
      return
    }

    try {
      const pollMessage = await chatService.createPoll(
        communityId,
        question,
        options,
        user.id,
        user.name
      )
      await sendMessage(communityId, pollMessage)
      handleSendMessage(pollMessage)
      showToast('Poll created!', 'success')
    } catch (error) {
      console.error('Error creating poll:', error)
      showToast('Failed to create poll. Please try again.', 'error')
    }
  }

  const handleCreateEventProposal = async () => {
    const title = prompt('Enter event title:')
    if (!title) return

    const description = prompt('Enter event description:') || ''

    try {
      const proposalMessage = await chatService.createEventProposal(
        communityId,
        { title, description, communityId },
        user.id,
        user.name
      )
      await sendMessage(communityId, proposalMessage)
      handleSendMessage(proposalMessage)
      showToast('Event proposal created!', 'success')
    } catch (error) {
      console.error('Error creating event proposal:', error)
      showToast('Failed to create event proposal. Please try again.', 'error')
    }
  }

  if (loading && displayedMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-sage-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-sage-200 bg-sage-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2"><MessageCircle size={16} /> Community Chat</h3>
            <p className="text-xs text-gray-600">Real-time discussion</p>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <div className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></div>
              <span>Simulating messages...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: '600px' }}
      >
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle size={24} className="mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          displayedMessages.map((message) => (
            <ChatMessage key={message.id} message={message} communityId={communityId} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        communityId={communityId}
        isMember={isMember}
        onCreatePoll={handleCreatePoll}
        onCreateEventProposal={handleCreateEventProposal}
        onMessageSent={handleSendMessage}
      />
    </div>
  )
}

export default GroupChat
