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

// Load data
const EVENTS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'events.json'), 'utf8'));
const ORGANIZATIONS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'organizations.json'), 'utf8'));

// Speech to text consts
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    eventsCount: EVENTS.length,
    organizationsCount: ORGANIZATIONS.length
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
╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
