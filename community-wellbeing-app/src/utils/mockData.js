export const MOCK_EVENTS = [
  {
    id: 'e001',
    title: 'Morning Yoga in the Park',
    description: 'Start your day with mindfulness and movement in the tranquil surroundings of Central Park. Perfect for all skill levels.',
    fullDescription: 'Join us for an invigorating morning yoga session in the heart of Central Park. Our experienced instructors will guide you through a series of poses designed to awaken your body and center your mind. Whether you\'re a beginner or an experienced yogi, you\'ll find this session both challenging and restorative. The outdoor setting provides a perfect backdrop for connecting with nature while deepening your practice. We\'ll focus on breath work, gentle stretches, and building strength through foundational poses.',
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
    imageUrl: '/images/events/yoga-park.jpg',
    tags: ['yoga', 'mindfulness', 'outdoor', 'morning', 'fitness', 'wellness'],
    whatToBring: [
      'Yoga mat (rentals available)',
      'Water bottle',
      'Comfortable workout clothing',
      'Sunscreen',
      'Towel (optional)'
    ]
  },
  {
    id: 'e002',
    title: 'Pottery Workshop: Mindful Creation',
    description: 'Explore your creativity through clay. Learn pottery basics while practicing mindfulness and relaxation.',
    fullDescription: 'Discover the therapeutic art of pottery in this hands-on workshop designed for beginners. You\'ll learn the fundamentals of working with clay, including centering, shaping, and glazing techniques. This workshop combines creativity with mindfulness, allowing you to focus on the present moment while crafting beautiful, functional pieces. Our expert instructors will guide you through each step of the process, from wedging clay to creating your first bowl or vase. All materials are provided, and you\'ll take home your finished creations after they\'ve been fired and glazed.',
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
    imageUrl: '/images/events/pottery-workshop.jpg',
    tags: ['pottery', 'art', 'creative', 'mindfulness', 'crafts', 'beginner-friendly'],
    whatToBring: [
      'Apron or old clothes (clay can be messy)',
      'Small towel',
      'Enthusiasm and creativity!',
      'Note: All pottery materials and tools provided'
    ]
  },
  {
    id: 'e003',
    title: 'Community Trail Run',
    description: 'Join fellow runners for an energizing trail run. All paces welcome!',
    fullDescription: 'Lace up your running shoes and hit the trails with our supportive community of runners! This weekly trail run welcomes participants of all fitness levels and paces. We\'ll explore scenic mountain trails while building endurance and connecting with nature. Our experienced run leaders will guide the group and ensure everyone stays together at key points along the route. The trail features moderate elevation gain and stunning views, making it perfect for those looking to take their running off the pavement and into nature. Post-run refreshments and socializing included!',
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
    imageUrl: '/images/events/trail-run.jpg',
    tags: ['running', 'fitness', 'outdoor', 'community', 'nature', 'cardio'],
    whatToBring: [
      'Trail running shoes or athletic shoes with good grip',
      'Water bottle or hydration pack',
      'Sunscreen and hat',
      'Light snack for after the run',
      'Phone for emergencies'
    ]
  },
  {
    id: 'e004',
    title: 'Evening Meditation Circle',
    description: 'Wind down your day with guided meditation and breathing exercises in a peaceful setting.',
    fullDescription: 'End your day on a peaceful note with our guided meditation circle. This gentle evening practice is designed to help you release the stress and tension accumulated throughout the day. Our certified meditation instructor will lead you through various mindfulness techniques, including breath awareness, body scanning, and loving-kindness meditation. The session takes place in our serene meditation room, complete with cushions, soft lighting, and calming music. Whether you\'re new to meditation or have an established practice, this circle provides a supportive space for inner peace and reflection. Perfect for anyone looking to improve sleep quality, reduce anxiety, or simply find moments of calm in their busy lives.',
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
    imageUrl: '/images/events/meditation.jpg',
    tags: ['meditation', 'mindfulness', 'wellness', 'relaxation', 'evening', 'stress-relief'],
    whatToBring: [
      'Comfortable clothing',
      'Light shawl or blanket (optional)',
      'Water bottle',
      'Open mind and willingness to relax',
      'Note: Meditation cushions provided'
    ]
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
