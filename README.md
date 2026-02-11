# MindfulCircles - Community Well-Being Platform

A comprehensive community well-being platform that connects like-minded individuals through events, communities, journaling, and meaningful interactions. Built with React and Express.js, featuring a robust backend API with database integration.

## 🌟 Features

### Core Features
- **User Authentication & Onboarding**: Complete sign-up flow with personalized onboarding
- **Events Management**: Discover, filter, and RSVP to community events
- **Communities**: Join interest-based communities with group chat functionality
- **Journaling**: Voice and text journaling with AI-powered insights
- **Direct Messaging**: One-on-one messaging between connected users
- **User Profiles**: Comprehensive profiles with badges, achievements, and activity history
- **Recommendations**: AI-powered personalized recommendations for events and communities
- **Monthly Reports**: Detailed analytics and insights about user activity
- **Gamification**: Points, levels, badges, and streaks to encourage engagement

### Advanced Features
- **Real-time Chat**: Group chat with polls, event proposals, and announcements
- **Community Creation**: Users can create and manage their own communities
- **Connection System**: Send connection requests and build your network
- **Search**: Dynamic search for users, events, and communities
- **AI Integration**: OpenAI-powered transcription and chat assistance
- **Event Posting**: Create and manage events with reviews and RSVPs

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with React Router v6
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API (Auth, User, Events, Chat, etc.)
- **Build Tool**: Vite
- **UI Components**: Custom component library with reusable components

### Backend
- **Framework**: Express.js
- **Database**: Backend data tables for persistent storage
- **API**: RESTful API with comprehensive endpoints
- **AI Integration**: OpenAI API for transcription and chat features
- **File Upload**: Multer for handling audio file uploads

## 📁 Project Structure

```
community-wellbeing-app/
├── backend/
│   ├── server.js              # Express server with API endpoints
│   ├── data/                   # Database tables (users, events, communities, etc.)
│   ├── prompts.js              # AI system prompts
│   └── uploads/                # Temporary file storage
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   ├── common/             # Common UI components
│   │   ├── components/         # Feature-specific components
│   │   │   ├── communities/    # Community-related components
│   │   │   ├── events/         # Event-related components
│   │   │   ├── journal/        # Journal components
│   │   │   └── profile/        # Profile components
│   │   └── gamification/       # Gamification components
│   ├── context/                # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── services/               # API service layer
│   ├── styles/                 # Global styles and CSS
│   └── utils/                  # Utility functions
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running on port 5001
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd community-wellbeing-app
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `backend` directory:
```env
PORT=5001
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

5. **Start the backend server**
```bash
cd backend
npm start
```

6. **Start the frontend development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or the port specified by Vite).

## 🔌 API Endpoints

### Authentication
- `POST /api/users` - Create or update user account
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search` - Search users

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event
- `POST /api/events/:id/rsvp` - RSVP to event

### Communities
- `GET /api/communities` - Get all communities
- `GET /api/communities/:id` - Get community details
- `POST /api/communities` - Create new community
- `POST /api/communities/:id/join` - Join community
- `POST /api/communities/:id/invite` - Invite users to community

### Chat
- `GET /api/communities/:id/messages` - Get community messages
- `POST /api/communities/:id/messages` - Send message
- `POST /api/communities/:id/messages/:messageId/vote` - Vote on poll

### Connections
- `GET /api/connections/status` - Get connection status
- `POST /api/connections/request` - Send connection request
- `GET /api/connections/:userId` - Get user connections

### AI Features
- `POST /api/transcribe` - Transcribe audio file
- `POST /api/ask` - AI chat assistance

## 🎨 Key Components

### Pages
- **LandingPage**: Welcome page with sign-up/sign-in options
- **DashboardPage**: Main dashboard with recommendations and quick actions
- **EventsPage**: Browse and filter events
- **CommunitiesPage**: Discover and join communities
- **JournalPage**: Voice and text journaling interface
- **ProfilePage**: User profile with stats and activity
- **OnboardingPage**: Multi-step onboarding flow

### Context Providers
- **AuthContext**: User authentication and session management
- **UserContext**: User profile and preferences
- **EventContext**: Event data and RSVP management
- **ChatContext**: Chat messages and real-time updates
- **GamificationContext**: Points, levels, and achievements

### Services
All API interactions are handled through service layers:
- `api.js` - Base API client with error handling
- `authService.js` - Authentication operations
- `eventService.js` - Event management
- `communityService.js` - Community operations
- `chatService.js` - Chat functionality
- `userService.js` - User profile management

## 🗄️ Database Schema

The backend uses data tables to store:

### Users Table
- User profiles with interests, preferences, and activity history
- Authentication credentials
- Joined communities and connections
- Points, level, and achievements

### Events Table
- Event details (title, description, date, location)
- Category, time preferences, and age groups
- Organizer information and RSVP data

### Communities Table
- Community information (name, description, interests)
- Member count and verification status
- Creator and admin information

### Messages Table
- Chat messages with community association
- Message types (text, poll, announcement, event proposal)
- Timestamps and user associations

### Connections Table
- User connections and friend relationships
- Connection request status
- Connection history

## 🔐 Authentication Flow

1. User signs up with email and basic information
2. Completes onboarding with interests and preferences
3. User data is stored in the backend database
4. Session is maintained via localStorage
5. Protected routes require authentication

## 🎯 Key Features Explained

### Community Chat
- Real-time group messaging
- Poll creation and voting
- Event proposals
- System announcements
- Conversation flows triggered by "hello" messages

### Event Management
- Advanced filtering (category, date, location, age group)
- Personalized recommendations based on user interests
- RSVP functionality with notifications
- Event reviews and ratings
- Post-event feedback

### Journaling
- Voice recording with transcription
- Text journal entries
- AI-powered insights and recommendations
- Mood tracking and history
- Monthly activity summaries

### Gamification
- Points earned for various activities
- Level progression system
- Badges and achievements
- Streak tracking
- Leaderboard (future feature)

## 🛠️ Development

### Adding New Features

1. **Create API endpoint** in `backend/server.js`
2. **Create service** in `src/services/`
3. **Create components** in appropriate `src/components/` directory
4. **Add route** in `src/router.jsx`
5. **Update context** if needed for state management

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Maintain consistent naming conventions

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5001
OPENAI_API_KEY=your_key_here  # Optional
```

### Frontend
Configured via Vite environment variables:
- `VITE_API_URL` - Backend API URL (defaults to http://localhost:5001/api)

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation for user inputs
- API error handling with user-friendly messages
- Protected route authentication checks
- Data validation on backend endpoints

## 📦 Build for Production

```bash
# Build frontend
npm run build

# The built files will be in the `dist/` directory
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with React, Express.js, Tailwind CSS, and OpenAI API.

---

For detailed API documentation, see the inline comments in `backend/server.js`.
