// ============================================
// USERS - For Authentication & Onboarding Demo
// ============================================

export const MOCK_USERS = [
  {
    id: 'u001',
    email: 'sarah.chen@email.com',
    password: 'password123',
    name: 'Sarah Chen',
    age: 28,
    ageRange: '26-35',
    location: 'Singapore',
    pronouns: 'she/her',
    personalityType: 'ambivert',
    bio: "Tech professional looking to balance work stress with mindful activities. Love yoga, reading, and meeting creative people.",
    interests: ['mental health', 'yoga', 'reading', 'tech', 'meditation'],
    activityPreferences: {
      outdoors: true,
      indoors: true,
      virtual: true,
      active: true,
      creative: false,
      intellectual: true,
    },
    interactionPreferences: {
      energyLevel: 'moderate',
      groupSize: 'small',
      conversationDepth: 'meaningful',
    },
    preferredModes: ['virtual', 'in-person'],
    timePreferences: {
      preferredDays: ['monday', 'wednesday', 'thursday', 'saturday'],
      preferredTimes: ['evening'],
      frequency: '1-2 times a week',
    },
    goals: ['make friends', 'manage stress', 'build support network'],
    currentStreak: 12,
    totalPoints: 450,
    level: 3,
    joinedCircles: [
      { id: 'c002', name: 'Wellness Warriors', role: 'member' },
      { id: 'c001', name: 'Outdoor Enthusiasts', role: 'member' },
    ],
    attendedEvents: ['e001', 'e004'],
    moodHistory: [
      { date: '2026-02-09', score: 4, state: 'calm' },
      { date: '2026-02-08', score: 3, state: 'seeking_connection' },
      { date: '2026-02-07', score: 2, state: 'anxious' },
      { date: '2026-02-06', score: 4, state: 'calm' },
      { date: '2026-02-05', score: 3, state: 'reflective' },
    ],
    created_at: '2026-01-25T10:00:00Z',
  },
  {
    id: 'u002',
    email: 'marcus.johnson@email.com',
    password: 'password123',
    name: 'Marcus Johnson',
    age: 42,
    ageRange: '36-45',
    location: 'Singapore',
    pronouns: 'he/him',
    personalityType: 'introvert',
    bio: "Father of two, recently moved to Singapore. Passionate about photography and nature. Looking for authentic connections.",
    interests: ['photography', 'nature', 'parenting', 'hiking', 'coffee'],
    activityPreferences: {
      outdoors: true,
      indoors: false,
      virtual: false,
      active: true,
      creative: true,
      intellectual: true,
    },
    interactionPreferences: {
      energyLevel: 'low-key',
      groupSize: 'intimate',
      conversationDepth: 'deep',
    },
    preferredModes: ['in-person', 'walk-talk'],
    timePreferences: {
      preferredDays: ['saturday', 'sunday'],
      preferredTimes: ['morning', 'afternoon'],
      frequency: 'once a week',
    },
    goals: ['make friends', 'find activity partners', 'combat loneliness'],
    currentStreak: 7,
    totalPoints: 280,
    level: 2,
    joinedCircles: [
      { id: 'c001', name: 'Outdoor Enthusiasts', role: 'member' },
      { id: 'c003', name: 'Creative Souls', role: 'organizer' },
    ],
    attendedEvents: ['e003'],
    moodHistory: [
      { date: '2026-02-09', score: 4, state: 'reflective' },
      { date: '2026-02-08', score: 4, state: 'calm' },
      { date: '2026-02-07', score: 3, state: 'calm' },
    ],
    created_at: '2026-02-01T14:30:00Z',
  },
  {
    id: 'u003',
    email: 'priya.kumar@email.com',
    password: 'password123',
    name: 'Priya Kumar',
    age: 24,
    ageRange: '18-25',
    location: 'Singapore',
    pronouns: 'she/her',
    personalityType: 'extrovert',
    bio: "Recent grad navigating adulting! Love fitness, trying new restaurants, and making spontaneous plans. Always up for an adventure!",
    interests: ['fitness', 'food', 'travel', 'music', 'social events', 'mental health'],
    activityPreferences: {
      outdoors: true,
      indoors: true,
      virtual: true,
      active: true,
      creative: true,
      intellectual: false,
    },
    interactionPreferences: {
      energyLevel: 'high-energy',
      groupSize: 'medium',
      conversationDepth: 'casual',
    },
    preferredModes: ['in-person', 'virtual'],
    timePreferences: {
      preferredDays: ['tuesday', 'thursday', 'friday', 'saturday'],
      preferredTimes: ['evening'],
      frequency: '2+ times a week',
    },
    goals: ['make friends', 'find activity partners', 'professional networking'],
    currentStreak: 18,
    totalPoints: 620,
    level: 4,
    joinedCircles: [
      { id: 'c002', name: 'Wellness Warriors', role: 'member' },
      { id: 'c001', name: 'Outdoor Enthusiasts', role: 'member' },
    ],
    attendedEvents: ['e001', 'e003', 'e004'],
    moodHistory: [
      { date: '2026-02-09', score: 5, state: 'joyful' },
      { date: '2026-02-08', score: 4, state: 'energetic' },
      { date: '2026-02-07', score: 5, state: 'joyful' },
      { date: '2026-02-06', score: 4, state: 'energetic' },
    ],
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'u004',
    email: 'emma.wilson@email.com',
    password: 'password123',
    name: 'Emma Wilson',
    age: 31,
    ageRange: '26-35',
    location: 'Singapore',
    pronouns: 'she/her',
    personalityType: 'ambivert',
    bio: "Yoga instructor and wellness coach. Love helping people find balance through movement and mindfulness.",
    interests: ['yoga', 'wellness', 'meditation', 'fitness', 'mindfulness'],
    activityPreferences: {
      outdoors: true,
      indoors: true,
      virtual: true,
      active: true,
      creative: false,
      intellectual: false,
    },
    interactionPreferences: {
      energyLevel: 'moderate',
      groupSize: 'small',
      conversationDepth: 'meaningful',
    },
    preferredModes: ['in-person', 'virtual'],
    timePreferences: {
      preferredDays: ['monday', 'wednesday', 'friday', 'saturday'],
      preferredTimes: ['morning', 'evening'],
      frequency: '3+ times a week',
    },
    goals: ['help others', 'build community', 'share knowledge'],
    currentStreak: 25,
    totalPoints: 850,
    level: 5,
    joinedCircles: [
      { id: 'c002', name: 'Wellness Warriors', role: 'organizer' },
    ],
    attendedEvents: ['e001', 'e004'],
    moodHistory: [
      { date: '2026-02-09', score: 5, state: 'joyful' },
      { date: '2026-02-08', score: 5, state: 'energetic' },
    ],
    created_at: '2025-12-10T08:00:00Z',
  },
  {
    id: 'u005',
    email: 'jake.morrison@email.com',
    password: 'password123',
    name: 'Jake Morrison',
    age: 29,
    ageRange: '26-35',
    location: 'Singapore',
    pronouns: 'he/him',
    personalityType: 'extrovert',
    bio: "Fitness enthusiast and outdoor adventurer. Always up for a challenge and love meeting new people!",
    interests: ['fitness', 'hiking', 'running', 'outdoors', 'sports'],
    activityPreferences: {
      outdoors: true,
      indoors: false,
      virtual: false,
      active: true,
      creative: false,
      intellectual: false,
    },
    interactionPreferences: {
      energyLevel: 'high-energy',
      groupSize: 'large',
      conversationDepth: 'casual',
    },
    preferredModes: ['in-person'],
    timePreferences: {
      preferredDays: ['saturday', 'sunday'],
      preferredTimes: ['morning', 'afternoon'],
      frequency: 'once a week',
    },
    goals: ['find workout buddies', 'explore nature', 'stay active'],
    currentStreak: 8,
    totalPoints: 320,
    level: 2,
    joinedCircles: [
      { id: 'c001', name: 'Outdoor Enthusiasts', role: 'member' },
    ],
    attendedEvents: ['e003'],
    moodHistory: [
      { date: '2026-02-09', score: 5, state: 'energetic' },
      { date: '2026-02-08', score: 4, state: 'joyful' },
    ],
    created_at: '2026-01-20T12:00:00Z',
  },
  {
    id: 'u006',
    email: 'lisa.chen@email.com',
    password: 'password123',
    name: 'Lisa Chen',
    age: 26,
    ageRange: '18-25',
    location: 'Singapore',
    pronouns: 'she/her',
    personalityType: 'introvert',
    bio: "Art lover and creative soul. Enjoy quiet activities like painting, reading, and pottery.",
    interests: ['art', 'creative', 'pottery', 'reading', 'crafts'],
    activityPreferences: {
      outdoors: false,
      indoors: true,
      virtual: true,
      active: false,
      creative: true,
      intellectual: true,
    },
    interactionPreferences: {
      energyLevel: 'low-key',
      groupSize: 'intimate',
      conversationDepth: 'deep',
    },
    preferredModes: ['in-person', 'virtual'],
    timePreferences: {
      preferredDays: ['tuesday', 'thursday', 'saturday'],
      preferredTimes: ['afternoon', 'evening'],
      frequency: '1-2 times a week',
    },
    goals: ['express creativity', 'meet artists', 'learn new skills'],
    currentStreak: 5,
    totalPoints: 180,
    level: 1,
    joinedCircles: [
      { id: 'c003', name: 'Creative Souls', role: 'member' },
    ],
    attendedEvents: ['e002'],
    moodHistory: [
      { date: '2026-02-09', score: 4, state: 'calm' },
      { date: '2026-02-08', score: 4, state: 'reflective' },
    ],
    created_at: '2026-02-05T15:00:00Z',
  },
  {
    id: 'u007',
    email: 'mike.davis@email.com',
    password: 'password123',
    name: 'Mike Davis',
    age: 35,
    ageRange: '26-35',
    location: 'Singapore',
    pronouns: 'he/him',
    personalityType: 'ambivert',
    bio: "Tech professional by day, meditation practitioner by night. Finding balance in the digital age.",
    interests: ['meditation', 'tech', 'mindfulness', 'reading', 'wellness'],
    activityPreferences: {
      outdoors: false,
      indoors: true,
      virtual: true,
      active: false,
      creative: false,
      intellectual: true,
    },
    interactionPreferences: {
      energyLevel: 'moderate',
      groupSize: 'small',
      conversationDepth: 'meaningful',
    },
    preferredModes: ['virtual', 'in-person'],
    timePreferences: {
      preferredDays: ['monday', 'wednesday', 'friday'],
      preferredTimes: ['evening'],
      frequency: '2 times a week',
    },
    goals: ['reduce stress', 'find balance', 'connect with like-minded people'],
    currentStreak: 15,
    totalPoints: 520,
    level: 3,
    joinedCircles: [
      { id: 'c002', name: 'Wellness Warriors', role: 'member' },
    ],
    attendedEvents: ['e004'],
    moodHistory: [
      { date: '2026-02-09', score: 4, state: 'calm' },
      { date: '2026-02-08', score: 4, state: 'calm' },
    ],
    created_at: '2026-01-10T09:00:00Z',
  },
];

// ============================================
// EVENTS - Your existing events (kept as is)
// ============================================

export const MOCK_EVENTS = [
  {
    id: 'e001',
    title: 'Morning Yoga in the Park',
    description: 'Start your day with mindfulness and movement in the tranquil surroundings of Central Park. Perfect for all skill levels.',
    category: 'wellness',
    type: 'outdoors',
    ageGroup: '18-35',
    date: '2026-02-15',
    time: '08:00',
    duration: 90,
    location: 'Central Park',
    pointsReward: 50,
    participants: 12,
    maxParticipants: 20,
    organizer: {
      id: 'org001',
      name: 'Wellness Hub',
      verified: true,
      verificationBadge: 'gold'
    },
    tags: ['yoga', 'wellness', 'outdoors', 'morning'],
    imageUrl: '/images/events/yoga-park.jpg',
    matchScore: 85, // Added for recommendation algorithm
  },
  {
    id: 'e002',
    title: 'Pottery Workshop: Mindful Creation',
    description: 'Explore your creativity through clay. Learn pottery basics while practicing mindfulness and relaxation.',
    category: 'creative',
    type: 'indoors',
    ageGroup: '25-45',
    date: '2026-02-16',
    time: '14:00',
    duration: 120,
    location: 'Creative Minds Studio',
    pointsReward: 75,
    participants: 8,
    maxParticipants: 12,
    organizer: {
      id: 'org002',
      name: 'Creative Minds Collective',
      verified: true,
      verificationBadge: 'gold'
    },
    tags: ['creative', 'art', 'indoors', 'mindfulness'],
    imageUrl: '/images/events/pottery-workshop.jpg',
    matchScore: 72,
  },
  {
    id: 'e003',
    title: 'Community Trail Run',
    description: 'Join fellow runners for an energizing trail run. All paces welcome!',
    category: 'fitness',
    type: 'outdoors',
    ageGroup: '18-55',
    date: '2026-02-17',
    time: '07:00',
    duration: 60,
    location: 'Mountain Trail Head',
    pointsReward: 60,
    participants: 15,
    maxParticipants: 25,
    organizer: {
      id: 'org001',
      name: 'Wellness Hub',
      verified: true,
      verificationBadge: 'gold'
    },
    tags: ['fitness', 'running', 'outdoors', 'active'],
    imageUrl: '/images/events/trail-run.jpg',
    matchScore: 78,
  },
  {
    id: 'e004',
    title: 'Evening Meditation Circle',
    description: 'Wind down your day with guided meditation and breathing exercises in a peaceful setting.',
    category: 'wellness',
    type: 'indoors',
    ageGroup: '25-65',
    date: '2026-02-18',
    time: '18:30',
    duration: 45,
    location: 'Zen Center Downtown',
    pointsReward: 40,
    participants: 20,
    maxParticipants: 30,
    organizer: {
      id: 'org001',
      name: 'Wellness Hub',
      verified: true,
      verificationBadge: 'gold'
    },
    tags: ['meditation', 'wellness', 'evening', 'mindfulness'],
    imageUrl: '/images/events/meditation.jpg',
    matchScore: 88,
  }
];

// ============================================
// CIRCLES - Simplified for dashboard (combines with events)
// ============================================

export const MOCK_CIRCLES = MOCK_EVENTS.map(event => ({
  id: event.id,
  name: event.title,
  description: event.description,
  mode: event.type === 'outdoors' || event.type === 'indoors' ? 'in-person' : 'virtual',
  location: event.location,
  scheduledTime: `${event.date}T${event.time}:00Z`,
  recurring: true,
  maxParticipants: event.maxParticipants,
  currentParticipants: event.participants,
  tags: event.tags || [],
  isVerified: event.organizer?.verified || false,
  matchScore: event.matchScore || 70,
}));

// ============================================
// COMMUNITIES - Your existing (kept as is)
// ============================================

export const MOCK_COMMUNITIES = [
  {
    id: 'c001',
    name: 'Outdoor Enthusiasts',
    description: 'For hikers, runners, and nature lovers who want to explore the great outdoors together',
    members: 234,
    interests: ['outdoors', 'fitness', 'wellness'],
    verified: true,
    imageUrl: '/images/communities/outdoor-enthusiasts.jpg'
  },
  {
    id: 'c002',
    name: 'Wellness Warriors',
    description: 'Supporting each other on our wellness journeys through mindfulness, yoga, and healthy living',
    members: 189,
    interests: ['wellness', 'yoga', 'meditation'],
    verified: true,
    imageUrl: '/images/communities/wellness-warriors.jpg'
  },
  {
    id: 'c003',
    name: 'Creative Souls',
    description: 'Artists, makers, and creative minds connecting through art and expression',
    members: 156,
    interests: ['creative', 'art', 'crafts'],
    verified: false
  }
];

// ============================================
// ORGANIZATIONS - Your existing (kept as is)
// ============================================

export const MOCK_ORGANIZATIONS = [
  {
    id: 'org001',
    name: 'Wellness Hub',
    verified: true,
    verificationBadge: 'gold',
    trustScore: 4.8,
    partnerSince: '2023-05',
    description: 'Leading provider of wellness events and activities',
    logoUrl: '/images/organizations/wellness-hub-logo.png'
  },
  {
    id: 'org002',
    name: 'Creative Minds Collective',
    verified: true,
    verificationBadge: 'gold',
    trustScore: 4.6,
    partnerSince: '2024-01',
    description: 'Community-focused creative workshops and art experiences',
    logoUrl: '/images/organizations/creative-minds-logo.png'
  }
];

// ============================================
// CHAT MESSAGES - Your existing (kept as is)
// ============================================

export const MOCK_CHAT_MESSAGES = [
  {
    id: 'msg001',
    communityId: 'c001',
    userId: 'u002',
    userName: 'Marcus Johnson',
    text: 'Hey everyone! Who\'s up for the morning hike this Saturday?',
    timestamp: '2026-02-10T09:30:00Z',
    type: 'message'
  },
  {
    id: 'msg002',
    communityId: 'c001',
    userId: 'u003',
    userName: 'Priya Kumar',
    text: 'I\'m in! What time are we meeting?',
    timestamp: '2026-02-10T09:35:00Z',
    type: 'message'
  },
  {
    id: 'msg003',
    communityId: 'c001',
    userId: 'u001',
    userName: 'Sarah Chen',
    text: '7 AM at the trail head? I can bring some snacks!',
    timestamp: '2026-02-10T09:40:00Z',
    type: 'message'
  },
  {
    id: 'msg004',
    communityId: 'c001',
    userId: 'system',
    userName: 'System',
    text: '📢 New event announced: Morning Yoga in the Park - Saturday, Feb 15 at 8:00 AM',
    timestamp: '2026-02-10T10:00:00Z',
    type: 'announcement',
    eventId: 'e001'
  },
  {
    id: 'msg005',
    communityId: 'c001',
    userId: 'u002',
    userName: 'Marcus Johnson',
    text: 'Poll: Best time for the hike?',
    timestamp: '2026-02-10T10:20:00Z',
    type: 'poll',
    poll: {
      question: 'Best time for the hike?',
      options: [
        { id: 'opt1', text: '7:00 AM', votes: 5, voters: ['u003', 'u001'] },
        { id: 'opt2', text: '8:00 AM', votes: 3, voters: ['u002'] },
        { id: 'opt3', text: '9:00 AM', votes: 2, voters: [] }
      ],
      totalVotes: 10
    }
  },
  {
    id: 'msg006',
    communityId: 'c001',
    userId: 'system',
    userName: 'System',
    text: '🎉 Welcome Emma Wilson to the community!',
    timestamp: '2026-02-10T10:30:00Z',
    type: 'system'
  }
];

// ============================================
// RECOMMENDATIONS - Updated with real user references
// ============================================

export const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec001',
    type: 'event',
    title: 'Morning Yoga in the Park',
    reason: 'Based on your interest in wellness and morning activities',
    confidence: 0.92,
    targetId: 'e001'
  },
  {
    id: 'rec002',
    type: 'person',
    name: 'Marcus Johnson',
    reason: 'Shares your interests in outdoor activities and photography',
    confidence: 0.87,
    targetId: 'u002'
  },
  {
    id: 'rec003',
    type: 'community',
    title: 'Wellness Warriors',
    reason: 'Perfect match for your wellness journey',
    confidence: 0.91,
    targetId: 'c002'
  }
];

// ============================================
// MONTHLY REPORTS - Your existing (kept as is)
// ============================================

export const MOCK_MONTHLY_REPORTS = [
  {
    month: 'january',
    year: 2026,
    eventsAttended: 12,
    communitiesJoined: 3,
    pointsEarned: 450,
    moodTrend: 'improving',
    topMoments: [
      'Reached Level 3!',
      'Made 5 new connections',
      'Attended your first pottery workshop'
    ],
    emotionalSummary: 'Your wellbeing score improved by 23% this month',
    socialConnections: 15,
    recommendations: [
      'Try morning yoga classes',
      'Connect with the Creative Souls community'
    ]
  }
];

// ============================================
// VOICE TRANSCRIPTIONS - Your existing (kept as is)
// ============================================

export const MOCK_VOICE_TRANSCRIPTIONS = [
  {
    id: 'trans001',
    text: "Today was tough at work but the evening run really helped clear my mind. I'm grateful for this community.",
    emotions: ['stressed', 'relieved', 'grateful'],
    activities: ['running'],
    interests: ['fitness', 'wellness']
  }
];

// ============================================
// COMMUNITY POSTS - Added for social feed
// ============================================

export const MOCK_POSTS = [
  {
    id: 'post001',
    authorId: 'u003',
    authorName: 'Priya Kumar',
    type: 'milestone',
    content: 'Just completed my 10th circle session! 🎉 This community has changed my life.',
    reactions: { heart: 42, celebrate: 18 },
    comments: [
      { userId: 'u001', userName: 'Sarah Chen', text: 'So proud of you! 🎉' },
      { userId: 'u002', userName: 'Marcus Johnson', text: "You've come so far!" },
    ],
    timestamp: '2026-02-09T14:00:00Z',
  },
  {
    id: 'post002',
    authorId: 'u001',
    authorName: 'Sarah Chen',
    type: 'reflection',
    content: 'The morning yoga session was exactly what I needed. Feeling so centered! 🧘‍♀️',
    reactions: { heart: 28, celebrate: 12 },
    comments: [],
    timestamp: '2026-02-08T10:30:00Z',
  }
];

// ============================================
// ONBOARDING CONSTANTS - For my components
// ============================================

export const MOCK_MOOD_STATES = [
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡' },
  { value: 'seeking_connection', label: 'Seeking Connection', emoji: '🤗' },
  { value: 'reflective', label: 'Reflective', emoji: '🤔' },
  { value: 'joyful', label: 'Joyful', emoji: '😊' },
  { value: 'stressed', label: 'Stressed', emoji: '😣' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😵' },
];

export const INTEREST_OPTIONS = [
  { value: 'mental health', label: 'Mental Health', icon: '🧠' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'yoga', label: 'Yoga', icon: '🧘' },
  { value: 'meditation', label: 'Meditation', icon: '🕉️' },
  { value: 'reading', label: 'Reading', icon: '📚' },
  { value: 'hiking', label: 'Hiking', icon: '🥾' },
  { value: 'photography', label: 'Photography', icon: '📷' },
  { value: 'cooking', label: 'Cooking', icon: '🍳' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'tech', label: 'Tech', icon: '💻' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'parenting', label: 'Parenting', icon: '👶' },
];

export const ACTIVITY_TYPES = [
  { value: 'outdoors', label: 'Outdoors', icon: '🌳', description: 'Parks, hiking, nature' },
  { value: 'indoors', label: 'Indoors', icon: '🏠', description: 'Cafes, studios, homes' },
  { value: 'virtual', label: 'Virtual', icon: '💻', description: 'Video calls, online' },
  { value: 'active', label: 'Active', icon: '🏃', description: 'Sports, exercise' },
  { value: 'creative', label: 'Creative', icon: '🎨', description: 'Art, music, crafts' },
  { value: 'intellectual', label: 'Intellectual', icon: '📚', description: 'Learning, discussions' },
];