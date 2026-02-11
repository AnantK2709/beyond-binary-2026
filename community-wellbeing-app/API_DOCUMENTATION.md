# API Documentation

Complete API reference for the MindfulCircles Community Well-Being Platform backend.

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require user authentication. User ID is passed in request body or query parameters.

---

## Users API

### Create or Update User
```http
POST /api/users
```

**Request Body:**
```json
{
  "id": "u001",
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword",
  "interests": ["fitness", "yoga"],
  "activityPreferences": {
    "morning": true,
    "afternoon": false
  },
  "joinedCircles": [],
  "totalPoints": 0,
  "level": 1
}
```

**Response:** `200 OK` or `201 Created`
```json
{
  "id": "u001",
  "email": "user@example.com",
  "name": "John Doe",
  "interests": ["fitness", "yoga"],
  "level": 1,
  "totalPoints": 0
}
```

### Get User by ID
```http
GET /api/users/:id
```

**Response:** `200 OK`
```json
{
  "id": "u001",
  "name": "John Doe",
  "email": "user@example.com",
  "interests": ["fitness", "yoga"],
  "level": 1,
  "totalPoints": 450
}
```

### Search Users
```http
GET /api/users/search?q=search_term
```

**Query Parameters:**
- `q` (optional): Search query (searches name, email, bio, interests)

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "u001",
      "name": "John Doe",
      "email": "user@example.com",
      "bio": "Fitness enthusiast",
      "interests": ["fitness", "yoga"]
    }
  ]
}
```

---

## Events API

### Get All Events
```http
GET /api/events
```

**Query Parameters:**
- `category` (optional): Filter by category (wellness, outdoors, arts, sports, social, workshops)
- `timeOfDay` (optional): Filter by time (morning, afternoon, evening, any)
- `search` (optional): Search in title, description, location, organizer
- `verified` (optional): Filter by verified organizers (true/false)
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string
- `ageGroup` (optional): Filter by age group (18-25, 25-35, 35-50, 50+, all)
- `userInterests` (optional): Comma-separated interests for personalization

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "e001",
      "title": "Morning Yoga in the Park",
      "description": "Join us for a peaceful yoga session",
      "category": "wellness",
      "date": "2026-02-15T08:00:00Z",
      "location": "Central Park",
      "organizer": {
        "id": "org001",
        "name": "Wellness Hub"
      }
    }
  ],
  "total": 30
}
```

### Get Event by ID
```http
GET /api/events/:id
```

**Response:** `200 OK`
```json
{
  "id": "e001",
  "title": "Morning Yoga in the Park",
  "description": "Join us for a peaceful yoga session",
  "category": "wellness",
  "date": "2026-02-15T08:00:00Z",
  "location": "Central Park",
  "organizer": {
    "id": "org001",
    "name": "Wellness Hub"
  },
  "rsvps": 15,
  "maxAttendees": 30
}
```

---

## Communities API

### Get All Communities
```http
GET /api/communities
```

**Response:** `200 OK`
```json
{
  "communities": [
    {
      "id": "c001",
      "name": "Outdoor Enthusiasts",
      "description": "For people who love the outdoors",
      "interests": ["hiking", "camping"],
      "members": 150,
      "verified": true
    }
  ],
  "total": 28
}
```

### Get Community by ID
```http
GET /api/communities/:id
```

**Response:** `200 OK`
```json
{
  "id": "c001",
  "name": "Outdoor Enthusiasts",
  "description": "For people who love the outdoors",
  "interests": ["hiking", "camping"],
  "members": 150,
  "verified": true,
  "creatorId": "u001",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### Create Community
```http
POST /api/communities
```

**Request Body:**
```json
{
  "name": "New Community",
  "description": "Community description",
  "interests": ["fitness", "wellness"],
  "verified": false,
  "creatorId": "u001",
  "creatorName": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": "c032",
  "name": "New Community",
  "description": "Community description",
  "interests": ["fitness", "wellness"],
  "members": 1,
  "verified": false,
  "creatorId": "u001",
  "createdAt": "2026-02-11T08:00:00Z"
}
```

### Join Community
```http
POST /api/communities/:id/join
```

**Request Body:**
```json
{
  "userId": "u001"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "pointsEarned": 25
}
```

### Send Community Invitations
```http
POST /api/communities/:id/invite
```

**Request Body:**
```json
{
  "userIds": ["u002", "u003"],
  "inviterId": "u001"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "invitations": [
    {
      "id": "inv_1234567890_u002",
      "communityId": "c001",
      "userId": "u002",
      "status": "pending",
      "createdAt": "2026-02-11T08:00:00Z"
    }
  ],
  "message": "Invitations sent to 2 user(s)"
}
```

---

## Chat API

### Get Community Messages
```http
GET /api/communities/:id/messages
```

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "msg1234567890",
      "communityId": "c001",
      "userId": "u001",
      "userName": "John Doe",
      "text": "Hello everyone!",
      "timestamp": "2026-02-11T08:00:00Z",
      "type": "message"
    }
  ]
}
```

### Send Message
```http
POST /api/communities/:id/messages
```

**Request Body:**
```json
{
  "userId": "u001",
  "userName": "John Doe",
  "text": "Hello everyone!",
  "type": "message"
}
```

**Response:** `200 OK`
```json
{
  "id": "msg1234567890",
  "communityId": "c001",
  "userId": "u001",
  "userName": "John Doe",
  "text": "Hello everyone!",
  "timestamp": "2026-02-11T08:00:00Z",
  "type": "message"
}
```

### Create Poll
```http
POST /api/communities/:id/messages
```

**Request Body:**
```json
{
  "userId": "u001",
  "userName": "John Doe",
  "text": "Poll: What should we do?",
  "type": "poll",
  "poll": {
    "question": "What should we do?",
    "options": [
      {
        "id": "opt1",
        "text": "Option 1",
        "votes": 0,
        "voters": []
      },
      {
        "id": "opt2",
        "text": "Option 2",
        "votes": 0,
        "voters": []
      }
    ],
    "totalVotes": 0
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "msg1234567890",
  "communityId": "c001",
  "userId": "u001",
  "userName": "John Doe",
  "text": "Poll: What should we do?",
  "type": "poll",
  "poll": {
    "question": "What should we do?",
    "options": [
      {
        "id": "opt1",
        "text": "Option 1",
        "votes": 0,
        "voters": []
      }
    ],
    "totalVotes": 0
  },
  "timestamp": "2026-02-11T08:00:00Z"
}
```

### Vote on Poll
```http
POST /api/communities/:communityId/messages/:messageId/vote
```

**Request Body:**
```json
{
  "optionId": "opt1",
  "userId": "u001"
}
```

**Response:** `200 OK`
```json
{
  "id": "msg1234567890",
  "poll": {
    "question": "What should we do?",
    "options": [
      {
        "id": "opt1",
        "text": "Option 1",
        "votes": 1,
        "voters": ["u001"]
      }
    ],
    "totalVotes": 1
  }
}
```

---

## Connections API

### Get Connection Status
```http
GET /api/connections/status?userId1=u001&userId2=u002
```

**Query Parameters:**
- `userId1`: First user ID
- `userId2`: Second user ID

**Response:** `200 OK`
```json
{
  "status": "connected",
  "request": null
}
```

**Status Values:**
- `none`: No connection or request
- `pending`: Request pending
- `requested_by_them`: Other user sent request
- `connected`: Users are connected

### Send Connection Request
```http
POST /api/connections/request
```

**Request Body:**
```json
{
  "fromUserId": "u001",
  "toUserId": "u002"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "request": {
    "id": "req_1234567890",
    "fromUserId": "u001",
    "toUserId": "u002",
    "status": "pending",
    "createdAt": "2026-02-11T08:00:00Z"
  }
}
```

### Get User Connections
```http
GET /api/connections/:userId
```

**Response:** `200 OK`
```json
{
  "connections": ["u002", "u003", "u004"]
}
```

---

## AI Features API

### Transcribe Audio
```http
POST /api/transcribe
Content-Type: multipart/form-data
```

**Request:**
- Form data with `audio` file field

**Response:** `200 OK`
```json
{
  "text": "Transcribed text from audio file"
}
```

**Error Response:** `503 Service Unavailable` (if OpenAI not configured)
```json
{
  "error": "AI features are disabled: OPENAI_API_KEY not configured."
}
```

### AI Chat Assistance
```http
POST /api/ask
```

**Request Body:**
```json
{
  "question": "What are some wellness tips?"
}
```

**Response:** `200 OK`
```json
{
  "answer": "Here are some wellness tips..."
}
```

**Error Response:** `503 Service Unavailable` (if OpenAI not configured)

---

## Organizations API

### Get All Organizations
```http
GET /api/organizations
```

**Response:** `200 OK`
```json
{
  "organizations": [
    {
      "id": "org001",
      "name": "Wellness Hub",
      "description": "Promoting wellness in the community",
      "verified": true
    }
  ],
  "total": 10
}
```

### Get Organization by ID
```http
GET /api/organizations/:id
```

**Response:** `200 OK`
```json
{
  "id": "org001",
  "name": "Wellness Hub",
  "description": "Promoting wellness in the community",
  "verified": true,
  "events": ["e001", "e002"]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 403 Forbidden
```json
{
  "error": "You must be a member of this community to send messages"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Detailed error message"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting for API endpoints.

## CORS

The API allows CORS requests from `http://localhost:3001` (or configured frontend URL).

---

For implementation details, see `backend/server.js`.
