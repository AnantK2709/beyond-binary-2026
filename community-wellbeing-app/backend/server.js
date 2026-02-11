// import { SYSTEM_PROMPTS} from "./prompts.js"
require('dotenv').config();

const multer = require('multer');
const OpenAI = require('openai');

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON file
const readJsonFile = (filename) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filename, data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'data', filename),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Load data
const EVENTS = readJsonFile('events.json');
const ORGANIZATIONS = readJsonFile('organizations.json');
let COMMUNITIES = readJsonFile('communities.json');
let USERS = readJsonFile('users.json'); // Make mutable so we can reload it
const CHAT_MESSAGES = readJsonFile('chat-messages.json');
let COMMUNITY_INVITATIONS = [];
try {
  COMMUNITY_INVITATIONS = readJsonFile('community-invitations.json');
} catch (error) {
  // File doesn't exist yet, start with empty array
  COMMUNITY_INVITATIONS = [];
  writeJsonFile('community-invitations.json', COMMUNITY_INVITATIONS);
}

// Speech to text consts
const upload = multer({ dest: 'uploads/' });

// Initialize OpenAI only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI client initialized');
} else {
  console.warn('⚠️  OPENAI_API_KEY not found. AI features (transcription, chat) will be disabled.');
}

// ============================================
// EVENTS API ENDPOINTS
// ============================================

/**
 * GET /api/events
 * Fetch all events with optional filtering
 *
 * Query params:
 * - category: string (wellness, outdoors, arts, sports, social, workshops)
 * - timeOfDay: string (morning, afternoon, evening, any)
 * - search: string (searches title, description, location, organizer name)
 * - verified: boolean (true to show only verified organizers)
 * - dateFrom: string (ISO date)
 * - dateTo: string (ISO date)
 * - ageGroup: string (18-25, 25-35, 35-50, 50+, all)
 * - userInterests: string (comma-separated interests for personalization)
 */
app.get('/api/events', (req, res) => {
  console.log('GET /api/events - Query params:', req.query);

  let events = [...EVENTS];

  // ============================================
  // FILTER: Category
  // ============================================
  if (req.query.category && req.query.category !== 'all') {
    events = events.filter(e => e.category === req.query.category);
    console.log(`Filtered by category '${req.query.category}': ${events.length} events`);
  }

  // ============================================
  // FILTER: Time of Day
  // ============================================
  if (req.query.timeOfDay && req.query.timeOfDay !== 'any') {
    events = events.filter(e => {
      const hour = parseInt(e.time.split(':')[0]);
      if (req.query.timeOfDay === 'morning') return hour >= 6 && hour < 12;
      if (req.query.timeOfDay === 'afternoon') return hour >= 12 && hour < 17;
      if (req.query.timeOfDay === 'evening') return hour >= 17 || hour < 6;
      return true;
    });
    console.log(`Filtered by time '${req.query.timeOfDay}': ${events.length} events`);
  }

  // ============================================
  // FILTER: Verified Organizations Only
  // ============================================
  if (req.query.verified === 'true') {
    events = events.filter(e => e.organizer.verified === true);
    console.log(`Filtered by verified organizers: ${events.length} events`);
  }

  // ============================================
  // FILTER: Date Range
  // ============================================
  if (req.query.dateFrom) {
    events = events.filter(e => new Date(e.date) >= new Date(req.query.dateFrom));
    console.log(`Filtered by dateFrom '${req.query.dateFrom}': ${events.length} events`);
  }

  if (req.query.dateTo) {
    events = events.filter(e => new Date(e.date) <= new Date(req.query.dateTo));
    console.log(`Filtered by dateTo '${req.query.dateTo}': ${events.length} events`);
  }

  // ============================================
  // FILTER: Age Group
  // ============================================
  if (req.query.ageGroup && req.query.ageGroup !== 'all') {
    events = events.filter(e => {
      if (e.ageGroup === 'all') return true; // Events open to all ages always match
      return e.ageGroup === req.query.ageGroup;
    });
    console.log(`Filtered by ageGroup '${req.query.ageGroup}': ${events.length} events`);
  }

  // ============================================
  // FILTER: Search Query
  // ============================================
  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    events = events.filter(e =>
      e.title.toLowerCase().includes(searchLower) ||
      e.description.toLowerCase().includes(searchLower) ||
      e.location.toLowerCase().includes(searchLower) ||
      e.organizer.name.toLowerCase().includes(searchLower) ||
      e.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    console.log(`Filtered by search '${req.query.search}': ${events.length} events`);
  }

  // ============================================
  // PERSONALIZATION: User Interests
  // ============================================
  if (req.query.userInterests) {
    const interests = req.query.userInterests.split(',').map(i => i.trim().toLowerCase());

    console.log('Personalizing for interests:', interests);

    // Calculate relevance score for each event
    events = events.map(event => {
      let score = 0;

      // CATEGORY MATCH (10 points) - highest weight
      if (interests.includes(event.category.toLowerCase())) {
        score += 10;
      }

      // TYPE MATCH (5 points)
      if (interests.includes(event.type.toLowerCase())) {
        score += 5;
      }

      // TAG MATCH (3 points each)
      event.tags.forEach(tag => {
        interests.forEach(interest => {
          if (tag.toLowerCase().includes(interest) || interest.includes(tag.toLowerCase())) {
            score += 3;
          }
        });
      });

      // KEYWORD MATCH in title/description (2 points each)
      const searchableText = (event.title + ' ' + event.description).toLowerCase();
      interests.forEach(interest => {
        if (searchableText.includes(interest)) {
          score += 2;
        }
      });

      return { ...event, relevanceScore: score };
    });

    // Sort by relevance (highest score first), then by date
    events.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(a.date) - new Date(b.date);
    });

    console.log('Top 5 recommended events:', events.slice(0, 5).map(e => ({
      title: e.title,
      score: e.relevanceScore,
      category: e.category
    })));
  } else {
    // No personalization - sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  console.log(`Final result: ${events.length} events`);

  res.json({
    events,
    total: events.length,
    filters: req.query
  });
});

/**
 * GET /api/events/:id
 * Fetch a single event by ID
 */
app.get('/api/events/:id', (req, res) => {
  console.log(`GET /api/events/${req.params.id}`);

  const event = EVENTS.find(e => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Get similar events
  const similarEvents = event.similarEventIds
    ? EVENTS.filter(e => event.similarEventIds.includes(e.id))
    : [];

  res.json({
    event,
    similarEvents
  });
});

// ============================================
// TRANSCRIPTION API ENDPOINTS
// ============================================
const { toFile } = require('openai/uploads');

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!openai) {
    // Cleanup on error
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch { }
    }
    return res.status(503).json({
      error: 'Transcription service unavailable',
      message: 'OPENAI_API_KEY is not configured. Please set it in your .env file.'
    });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Create a File object that OpenAI expects
    const file = await toFile(
      fs.createReadStream(req.file.path),
      req.file.originalname || 'audio.webm'
    );

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1"
    });

    console.log('Transcription:', transcription.text);

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json({ text: transcription.text });

  } catch (error) {
    console.error('Transcription error:', error);

    // Cleanup on error
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch { }
    }

    res.status(500).json({
      error: 'Transcription failed',
      details: error.message
    });
  }
});

// Load system prompts (only if prompts.js exists)
let SYSTEM_PROMPTS = { general: 'You are a helpful assistant.' };
try {
  SYSTEM_PROMPTS = require('./prompts.js');
  console.log("✅ System prompts loaded");
} catch (error) {
  console.warn("⚠️  prompts.js not found, using default prompts");
}

app.post("/api/ask", express.json(), async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'AI service unavailable',
      message: 'OPENAI_API_KEY is not configured. Please set it in your .env file.'
    });
  }

  try {
    
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.general // Use the appropriate prompt
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    console.log("OpenAI Response:", response.choices[0].message.content);

    res.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Text model error:", error);
    res.status(500).json({ error: "Text generation failed" });
  }
});


// ============================================
// ORGANIZATIONS API ENDPOINTS
// ============================================

/**
 * GET /api/organizations
 * Fetch all organizations
 */
app.get('/api/organizations', (req, res) => {
  console.log('GET /api/organizations');
  res.json({ organizations: ORGANIZATIONS });
});

/**
 * GET /api/organizations/:id
 * Fetch a single organization by ID
 */
app.get('/api/organizations/:id', (req, res) => {
  console.log(`GET /api/organizations/${req.params.id}`);

  const organization = ORGANIZATIONS.find(o => o.id === req.params.id);

  if (!organization) {
    return res.status(404).json({ error: 'Organization not found' });
  }

  // Get events hosted by this organization
  const events = EVENTS.filter(e => e.organizer.id === req.params.id);

  res.json({
    organization,
    events
  });
});

// ============================================
// COMMUNITIES API ENDPOINTS
// ============================================

/**
 * GET /api/communities
 * Fetch all communities
 */
app.get('/api/communities', (req, res) => {
  console.log('GET /api/communities');
  res.json({ communities: COMMUNITIES, total: COMMUNITIES.length });
});

/**
 * GET /api/communities/:id
 * Fetch a single community by ID
 */
app.get('/api/communities/:id', (req, res) => {
  console.log(`GET /api/communities/${req.params.id}`);

  const community = COMMUNITIES.find(c => c.id === req.params.id);

  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }

  res.json(community);
});

/**
 * POST /api/communities/:id/join
 * Join a community
 */
app.post('/api/communities/:id/join', (req, res) => {
  console.log(`POST /api/communities/${req.params.id}/join`);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const community = COMMUNITIES.find(c => c.id === req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }

  // In a real app, you'd update user's joinedCircles here
  // For now, just return success
  res.json({ success: true, pointsEarned: 25 });
});

/**
 * POST /api/communities
 * Create a new community
 */
app.post('/api/communities', (req, res) => {
  console.log('POST /api/communities');
  const { name, description, interests, verified, creatorId, creatorName } = req.body;

  if (!name || !description || !interests || interests.length === 0) {
    return res.status(400).json({ error: 'name, description, and at least one interest are required' });
  }

  // Generate new community ID
  const maxId = COMMUNITIES.reduce((max, c) => {
    const num = parseInt(c.id.replace('c', ''));
    return num > max ? num : max;
  }, 0);
  const newId = `c${String(maxId + 1).padStart(3, '0')}`;

  const newCommunity = {
    id: newId,
    name: name.trim(),
    description: description.trim(),
    interests: Array.isArray(interests) ? interests : [interests],
    members: 1, // Creator is first member
    verified: verified || false,
    creatorId: creatorId,
    creatorName: creatorName,
    createdAt: new Date().toISOString()
  };

  COMMUNITIES.push(newCommunity);
  writeJsonFile('communities.json', COMMUNITIES);

  // Auto-join creator to the community
  if (creatorId) {
    let user = USERS.find(u => u.id === creatorId);
    
    // If user doesn't exist in backend, create a basic user entry
    if (!user) {
      console.log(`User ${creatorId} not found in backend, creating user entry...`);
      user = {
        id: creatorId,
        name: creatorName || 'Unknown User',
        email: `${creatorId}@example.com`, // Placeholder email
        joinedCircles: []
      };
      USERS.push(user);
    }
    
    const joinedCircles = user.joinedCircles || [];
    if (!joinedCircles.some(c => (typeof c === 'string' ? c : c.id) === newId)) {
      joinedCircles.push({ id: newId, name: newCommunity.name, role: 'admin' });
      user.joinedCircles = joinedCircles;
      writeJsonFile('users.json', USERS);
      
      // Reload USERS from file to ensure consistency
      USERS = readJsonFile('users.json');
    }
  }

  console.log(`Created community ${newId}: ${newCommunity.name}`);
  res.status(201).json(newCommunity);
});

/**
 * POST /api/communities/:id/invite
 * Send invitations to join a community
 */
app.post('/api/communities/:id/invite', (req, res) => {
  const { id } = req.params;
  const { userIds, inviterId } = req.body;
  console.log(`POST /api/communities/${id}/invite`, { userIds, inviterId });

  const community = COMMUNITIES.find(c => c.id === id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: 'userIds array is required' });
  }

  const invitations = userIds.map(userId => ({
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    communityId: id,
    communityName: community.name,
    inviterId: inviterId,
    userId: userId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    acceptedAt: null
  }));

  COMMUNITY_INVITATIONS.push(...invitations);
  writeJsonFile('community-invitations.json', COMMUNITY_INVITATIONS);

  // Simulate random acceptance after 2-10 seconds
  invitations.forEach(invitation => {
    const acceptDelay = Math.random() * 8000 + 2000; // 2-10 seconds
    console.log(`Simulating auto-acceptance for invitation ${invitation.id} in ${acceptDelay}ms`);
    
    setTimeout(() => {
      const invIndex = COMMUNITY_INVITATIONS.findIndex(inv => inv.id === invitation.id);
      if (invIndex !== -1 && COMMUNITY_INVITATIONS[invIndex].status === 'pending') {
        COMMUNITY_INVITATIONS[invIndex].status = 'accepted';
        COMMUNITY_INVITATIONS[invIndex].acceptedAt = new Date().toISOString();
        writeJsonFile('community-invitations.json', COMMUNITY_INVITATIONS);

        // Add user to community members
        const user = USERS.find(u => u.id === invitation.userId);
        if (user) {
          const joinedCircles = user.joinedCircles || [];
          if (!joinedCircles.some(c => (typeof c === 'string' ? c : c.id) === id)) {
            joinedCircles.push({ id: id, name: community.name, role: 'member' });
            user.joinedCircles = joinedCircles;
            writeJsonFile('users.json', USERS);
            
            // Increment community member count
            community.members = (community.members || 1) + 1;
            writeJsonFile('communities.json', COMMUNITIES);
          }
        }
        
        console.log(`Auto-accepted invitation ${invitation.id} for user ${invitation.userId}`);
      }
    }, acceptDelay);
  });

  res.json({ success: true, invitations, message: `Invitations sent to ${userIds.length} user(s)` });
});

// ============================================
// USERS API ENDPOINTS
// ============================================

/**
 * GET /api/users/search
 * Search users by name, email, bio, or interests
 * Query params: q (search query)
 */
app.get('/api/users/search', (req, res) => {
  console.log('GET /api/users/search - Query:', req.query.q);

  const query = (req.query.q || '').toLowerCase();

  // If query is empty or less than 2 characters, return all users
  if (!query || query.length < 2) {
    const allUsers = USERS.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    return res.json({ users: allUsers });
  }

  const filteredUsers = USERS.filter(user => {
    // Exclude password from results
    const { password, ...safeUser } = user;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.bio?.toLowerCase().includes(query) ||
      user.interests?.some(interest => interest.toLowerCase().includes(query))
    );
  }).map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });

  res.json({ users: filteredUsers });
});

/**
 * GET /api/users/:id
 * Fetch a single user by ID (without password)
 */
app.get('/api/users/:id', (req, res) => {
  console.log(`GET /api/users/${req.params.id}`);

  const user = USERS.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Remove password before sending
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// ============================================
// CHAT MESSAGES API ENDPOINTS
// ============================================

/**
 * GET /api/communities/:id/messages
 * Fetch all messages for a community
 */
app.get('/api/communities/:id/messages', (req, res) => {
  console.log(`GET /api/communities/${req.params.id}/messages`);
  // Filter messages for this community and exclude invalid poll messages (polls without poll data)
  const messages = CHAT_MESSAGES.filter(m => {
    if (m.communityId !== req.params.id) return false;
    // Exclude poll messages that don't have poll data
    if (m.type === 'poll' && !m.poll) {
      console.warn(`⚠️ Excluding invalid poll message ${m.id} - missing poll data`);
      return false;
    }
    return true;
  });
  console.log(`✅ Returning ${messages.length} valid messages for community ${req.params.id}`);
  res.json({ messages });
});

/**
 * POST /api/communities/:id/messages
 * Send a new message to a community
 */
app.post('/api/communities/:id/messages', (req, res) => {
  console.log(`POST /api/communities/${req.params.id}/messages`);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  const { userId, userName, text, type = 'message', poll, eventProposal, ...extraData } = req.body;

  if (!userId || !userName || !text) {
    return res.status(400).json({ error: 'userId, userName, and text are required' });
  }

  // Reload USERS to ensure we have the latest data (in case it was updated)
  USERS = readJsonFile('users.json');
  
  // Check if user is a member of the community
  let user = USERS.find(u => u.id === userId);
  
  // If user doesn't exist, check if they're the creator of the community
  if (!user) {
    const community = COMMUNITIES.find(c => c.id === req.params.id);
    if (community && community.creatorId === userId) {
      // Creator should be able to send messages even if not in users.json yet
      console.log(`User ${userId} is creator of community ${req.params.id}, allowing message`);
    } else {
      console.log(`User ${userId} not found in backend and not creator of community ${req.params.id}`);
      return res.status(404).json({ error: 'User not found. Please ensure you are logged in and a member of this community.' });
    }
  } else {
    const joinedCircles = user.joinedCircles || [];
    const joinedIds = joinedCircles.map(c => typeof c === 'string' ? c : c.id);
    const isMember = joinedIds.includes(req.params.id);
    
    // Also check if user is the creator
    const community = COMMUNITIES.find(c => c.id === req.params.id);
    const isCreator = community && community.creatorId === userId;

    if (!isMember && !isCreator) {
      console.log(`User ${userId} attempted to send message to community ${req.params.id} but is not a member`);
      console.log(`User joinedCircles:`, joinedCircles);
      console.log(`Community ID: ${req.params.id}`);
      return res.status(403).json({ error: 'You must be a member of this community to send messages' });
    }
  }

  const newMessage = {
    id: `msg${Date.now()}`,
    communityId: req.params.id,
    userId,
    userName,
    text,
    timestamp: new Date().toISOString(),
    type
  };

  // Add poll data if it's a poll message
  if (type === 'poll') {
    if (poll) {
      newMessage.poll = poll;
      console.log('✅ Added poll data to message:', JSON.stringify(poll, null, 2));
    } else {
      console.error('❌ Poll message type but no poll data provided! Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ error: 'Poll data is required for poll type messages' });
    }
  }

  // Add event proposal data if it's an event proposal
  if (type === 'event_proposal' && eventProposal) {
    newMessage.eventProposal = eventProposal;
  }

  // Add any other extra data (but don't overwrite poll or eventProposal)
  Object.keys(extraData).forEach(key => {
    if (key !== 'poll' && key !== 'eventProposal') {
      newMessage[key] = extraData[key];
    }
  });

  console.log('📝 Final message being saved:', JSON.stringify(newMessage, null, 2));

  CHAT_MESSAGES.push(newMessage);
  writeJsonFile('chat-messages.json', CHAT_MESSAGES);

  console.log('✅ Message saved successfully. Poll data present:', !!newMessage.poll);
  res.json(newMessage);
});

/**
 * POST /api/communities/:id/messages/:messageId/vote
 * Vote on a poll message
 */
app.post('/api/communities/:id/messages/:messageId/vote', (req, res) => {
  console.log(`POST /api/communities/${req.params.id}/messages/${req.params.messageId}/vote`);

  const { optionId, userId } = req.body;

  if (!optionId || !userId) {
    return res.status(400).json({ error: 'optionId and userId are required' });
  }

  const messageIndex = CHAT_MESSAGES.findIndex(
    m => m.id === req.params.messageId && m.communityId === req.params.id
  );

  if (messageIndex === -1 || CHAT_MESSAGES[messageIndex].type !== 'poll') {
    return res.status(404).json({ error: 'Poll message not found' });
  }

  const message = CHAT_MESSAGES[messageIndex];
  const option = message.poll.options.find(opt => opt.id === optionId);

  if (!option) {
    return res.status(404).json({ error: 'Poll option not found' });
  }

  // Prevent double voting
  if (option.voters.includes(userId)) {
    return res.json(message);
  }

  option.votes++;
  option.voters.push(userId);
  message.poll.totalVotes = message.poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  writeJsonFile('chat-messages.json', CHAT_MESSAGES);

  res.json(message);
});

// ============================================
// CONNECTION REQUESTS API ENDPOINTS
// ============================================

/**
 * GET /api/connections/status
 * Get connection status between two users
 * Query params: userId1, userId2
 */
app.get('/api/connections/status', (req, res) => {
  console.log('GET /api/connections/status', req.query);

  const { userId1, userId2 } = req.query;

  if (!userId1 || !userId2) {
    return res.status(400).json({ error: 'userId1 and userId2 are required' });
  }

  const requests = readJsonFile('connection-requests.json');
  const connections = readJsonFile('connections.json') || {};

  // Check if already connected
  const userConnections = connections[userId1] || [];
  if (userConnections.includes(userId2)) {
    return res.json({ status: 'connected', request: null });
  }

  // Check for existing request
  const request = requests.find(
    r =>
      (r.fromUserId === userId1 && r.toUserId === userId2) ||
      (r.fromUserId === userId2 && r.toUserId === userId1)
  );

  if (!request) {
    return res.json({ status: 'none', request: null });
  }

  // Map 'accepted' status to 'connected' for the UI
  const status = request.status === 'accepted' ? 'connected' : request.status;

  res.json({
    status,
    request,
    isFromMe: request.fromUserId === userId1
  });
});

/**
 * POST /api/connections/request
 * Send a connection request
 */
app.post('/api/connections/request', (req, res) => {
  console.log('POST /api/connections/request', req.body);

  const { fromUserId, toUserId } = req.body;

  if (!fromUserId || !toUserId) {
    return res.status(400).json({ error: 'fromUserId and toUserId are required' });
  }

  let requests = readJsonFile('connection-requests.json');

  // Check if request already exists
  const existingRequest = requests.find(
    r => r.fromUserId === fromUserId && r.toUserId === toUserId
  );

  if (existingRequest) {
    return res.status(400).json({ success: false, message: 'Request already sent' });
  }

  const newRequest = {
    id: `req_${Date.now()}`,
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    acceptedAt: null
  };

  requests.push(newRequest);
  writeJsonFile('connection-requests.json', requests);

  // Simulate auto-acceptance after 2-10 seconds (for demo)
  const acceptDelay = Math.random() * 8000 + 2000;
  setTimeout(() => {
    const updatedRequests = readJsonFile('connection-requests.json');
    const requestIndex = updatedRequests.findIndex(r => r.id === newRequest.id);

    if (requestIndex !== -1 && updatedRequests[requestIndex].status === 'pending') {
      updatedRequests[requestIndex].status = 'accepted';
      updatedRequests[requestIndex].acceptedAt = new Date().toISOString();
      writeJsonFile('connection-requests.json', updatedRequests);

      // Update connections
      let connections = readJsonFile('connections.json') || {};
      if (!connections[fromUserId]) connections[fromUserId] = [];
      if (!connections[toUserId]) connections[toUserId] = [];

      if (!connections[fromUserId].includes(toUserId)) {
        connections[fromUserId].push(toUserId);
      }
      if (!connections[toUserId].includes(fromUserId)) {
        connections[toUserId].push(fromUserId);
      }

      writeJsonFile('connections.json', connections);
    }
  }, acceptDelay);

  res.json({ success: true, request: newRequest });
});

/**
 * GET /api/connections/:userId
 * Get all connections for a user
 */
app.get('/api/connections/:userId', (req, res) => {
  console.log(`GET /api/connections/${req.params.userId}`);

  const connections = readJsonFile('connections.json') || {};
  const userConnections = connections[req.params.userId] || [];

  res.json({ connections: userConnections });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    eventsCount: EVENTS.length,
    organizationsCount: ORGANIZATIONS.length,
    communitiesCount: COMMUNITIES.length,
    usersCount: USERS.length,
    chatMessagesCount: CHAT_MESSAGES.length
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  Community Well-Being API Server               ║
║  Port: ${PORT}                                   ║
║  Events loaded: ${EVENTS.length}                          ║
║  Organizations loaded: ${ORGANIZATIONS.length}                    ║
║  Communities loaded: ${COMMUNITIES.length}                      ║
║  Users loaded: ${USERS.length}                            ║
║  Chat messages loaded: ${CHAT_MESSAGES.length}                      ║
║  Community invitations loaded: ${COMMUNITY_INVITATIONS.length}                      ║
╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
