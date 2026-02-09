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
    imageUrl: '/images/events/yoga-park.jpg'
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
    imageUrl: '/images/events/pottery-workshop.jpg'
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
    imageUrl: '/images/events/trail-run.jpg'
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
    imageUrl: '/images/events/meditation.jpg'
  }
]

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
]

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
]

export const MOCK_CHAT_MESSAGES = [
  {
    id: 'msg001',
    communityId: 'c001',
    userId: 'u456',
    userName: 'Alex Johnson',
    text: 'Hey everyone! Who\'s up for the morning hike this Saturday?',
    timestamp: '2026-02-10T09:30:00Z'
  },
  {
    id: 'msg002',
    communityId: 'c001',
    userId: 'u789',
    userName: 'Maria Garcia',
    text: 'I\'m in! What time are we meeting?',
    timestamp: '2026-02-10T09:35:00Z'
  }
]

export const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec001',
    type: 'event',
    title: 'Sunrise Yoga Session',
    reason: 'Based on your interest in wellness and morning activities',
    confidence: 0.92,
    targetId: 'e001'
  },
  {
    id: 'rec002',
    type: 'person',
    name: 'Jamie Lee',
    reason: 'Shares your interests in outdoor activities and photography',
    confidence: 0.87,
    targetId: 'u555'
  }
]

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
]

export const MOCK_VOICE_TRANSCRIPTIONS = [
  {
    id: 'trans001',
    text: "Today was tough at work but the evening run really helped clear my mind. I'm grateful for this community.",
    emotions: ['stressed', 'relieved', 'grateful'],
    activities: ['running'],
    interests: ['fitness', 'wellness']
  }
]
