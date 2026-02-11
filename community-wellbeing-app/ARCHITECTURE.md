# Architecture Documentation

Technical architecture and design decisions for the MindfulCircles platform.

## System Architecture

### Overview
MindfulCircles is built as a full-stack application with a clear separation between frontend and backend:

```
┌─────────────────┐         ┌─────────────────┐
│   React Frontend │ ◄─────► │  Express Backend │
│   (Port 3001)    │  HTTP   │   (Port 5001)    │
└─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │  Data Tables    │
                            │  (Database)     │
                            └─────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **React 18**: UI library with hooks
- **React Router v6**: Client-side routing
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management
- **Custom Hooks**: Reusable logic

### Project Structure

```
src/
├── App.jsx                 # Root component with providers
├── main.jsx                # Entry point
├── router.jsx              # Route definitions
│
├── pages/                  # Page components (route destinations)
│   ├── DashboardPage.jsx
│   ├── EventsPage.jsx
│   ├── CommunitiesPage.jsx
│   └── ...
│
├── components/             # Reusable components
│   ├── auth/              # Auth-related components
│   ├── common/            # Shared UI components
│   └── components/        # Feature-specific components
│
├── context/                # React Context providers
│   ├── AuthContext.jsx
│   ├── ChatContext.jsx
│   └── ...
│
├── services/               # API service layer
│   ├── api.js             # Base API client
│   ├── eventService.js
│   ├── communityService.js
│   └── ...
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.js
│   ├── useToast.js
│   └── ...
│
├── utils/                 # Utility functions
│   ├── dateUtils.js
│   ├── validation.js
│   └── ...
│
└── styles/                # Global styles
    ├── index.css
    ├── variables.css
    └── animations.css
```

### State Management

#### Context API Pattern
The application uses React Context API for global state management:

1. **AuthContext**: User authentication and session
2. **UserContext**: User profile and preferences
3. **EventContext**: Event data and RSVPs
4. **ChatContext**: Chat messages and real-time updates
5. **GamificationContext**: Points, levels, achievements
6. **NotificationContext**: Toast notifications
7. **JournalContext**: Journal entries and insights

#### Local State
- Component-specific state uses `useState`
- Form state managed locally
- UI state (modals, dropdowns) managed locally

### Data Flow

```
User Action
    │
    ▼
Component Event Handler
    │
    ▼
Service Layer (API call)
    │
    ▼
Backend API
    │
    ▼
Database Tables
    │
    ▼
Response
    │
    ▼
Context Update
    │
    ▼
Component Re-render
```

### Routing

#### Public Routes
- `/` - Landing page
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/onboarding` - Onboarding flow

#### Protected Routes
All other routes require authentication:
- `/dashboard` - Main dashboard
- `/events` - Events listing
- `/communities` - Communities listing
- `/journal` - Journal interface
- `/profile` - User profile
- `/messages/:userId` - Direct messages

#### Route Protection
Implemented via `ProtectedRoute` component that:
1. Checks authentication status
2. Redirects to sign-in if not authenticated
3. Renders children if authenticated

---

## Backend Architecture

### Technology Stack
- **Express.js**: Web framework
- **Node.js**: Runtime environment
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling
- **OpenAI API**: AI features (transcription, chat)

### Project Structure

```
backend/
├── server.js              # Main Express server
├── prompts.js             # AI system prompts
├── data/                  # Database tables
│   ├── users.json
│   ├── events.json
│   ├── communities.json
│   ├── chat-messages.json
│   └── ...
└── uploads/               # Temporary file storage
```

### API Design

#### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Status codes for responses

#### Endpoint Organization
```
/api/users          # User management
/api/events         # Event management
/api/communities    # Community management
/api/connections    # User connections
/api/transcribe     # AI transcription
/api/ask            # AI chat
```

### Database Schema

#### Users Table
Stores user accounts and profiles:
- Authentication credentials
- Profile information
- Interests and preferences
- Activity history
- Points and achievements

#### Events Table
Stores event information:
- Event details (title, description, date, location)
- Category and tags
- Organizer information
- RSVP data
- Reviews and ratings

#### Communities Table
Stores community data:
- Community information
- Member list
- Interests and tags
- Creator and admin info

#### Messages Table
Stores chat messages:
- Message content
- Community association
- Message type (text, poll, announcement)
- Timestamps
- User associations

#### Connections Table
Stores user relationships:
- Connection pairs
- Request status
- Connection history

### Request/Response Flow

```
Client Request
    │
    ▼
Express Middleware (CORS, JSON parsing)
    │
    ▼
Route Handler
    │
    ▼
Data Validation
    │
    ▼
Database Query/Update
    │
    ▼
Response Formation
    │
    ▼
Client Response
```

---

## Data Flow Patterns

### Authentication Flow

1. User signs up → Frontend creates user object
2. Frontend calls `POST /api/users` → Backend stores in database
3. Backend returns user data → Frontend stores in localStorage
4. Frontend updates AuthContext → User is logged in
5. Protected routes become accessible

### Chat Flow

1. User sends message → `ChatInput` component
2. Frontend calls `POST /api/communities/:id/messages`
3. Backend validates membership → Stores message in database
4. Backend returns message → Frontend updates ChatContext
5. Message appears in chat → Other users see via polling/refresh

### Event RSVP Flow

1. User clicks RSVP → `EventCard` component
2. Frontend calls `POST /api/events/:id/rsvp`
3. Backend updates event RSVP count → Stores in database
4. Backend returns updated event → Frontend updates EventContext
5. UI updates to show RSVP status

---

## Security Considerations

### Authentication
- User sessions managed via localStorage
- Protected routes check authentication
- Backend validates user IDs on requests

### Authorization
- Community membership checks before messaging
- User ownership checks for updates
- Creator/admin permissions for communities

### Data Validation
- Frontend form validation
- Backend request validation
- Input sanitization
- Error handling

---

## Performance Optimizations

### Frontend
- Code splitting via React Router
- Lazy loading for heavy components
- Debounced search inputs
- Memoization for expensive computations
- Optimistic UI updates

### Backend
- Efficient database queries
- Caching strategies (in-memory data)
- Pagination for large datasets
- Filtering at database level

---

## Error Handling

### Frontend
- Try-catch blocks in async functions
- Error boundaries for component errors
- User-friendly error messages
- Toast notifications for errors

### Backend
- Try-catch in route handlers
- Proper HTTP status codes
- Error response format
- Logging for debugging

---

## Testing Strategy

### Frontend Testing
- Component unit tests (future)
- Integration tests (future)
- E2E tests (future)

### Backend Testing
- API endpoint tests (future)
- Integration tests (future)

---

## Deployment Considerations

### Frontend
- Build with `npm run build`
- Serve static files from `dist/`
- Configure API URL via environment variable
- Enable production optimizations

### Backend
- Set production PORT
- Configure CORS for production domain
- Set up OpenAI API key
- Configure file upload limits
- Set up logging

---

## Future Enhancements

### Planned Features
- Real-time WebSocket connections for chat
- Push notifications
- Email notifications
- Advanced search with filters
- Event calendar view
- Mobile app (React Native)

### Technical Improvements
- Database migration to PostgreSQL/MongoDB
- Redis for caching
- CDN for static assets
- Load balancing
- Monitoring and analytics

---

## Development Guidelines

### Code Style
- Use functional components
- Prefer hooks over class components
- Consistent naming conventions
- Comment complex logic
- Keep components focused and small

### Git Workflow
- Feature branches for new features
- Descriptive commit messages
- Code review before merge
- Main branch for production-ready code

---

For specific implementation details, refer to:
- `README.md` - Getting started guide
- `API_DOCUMENTATION.md` - API reference
- `COMPONENT_DOCUMENTATION.md` - Component reference
