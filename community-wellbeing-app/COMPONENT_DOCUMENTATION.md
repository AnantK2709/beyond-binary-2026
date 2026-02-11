# Component Documentation

Complete reference for all React components in the MindfulCircles platform.

## Component Architecture

Components are organized by feature area and functionality:

```
src/components/
├── auth/              # Authentication components
├── common/            # Shared UI components
├── components/         # Feature-specific components
│   ├── communities/   # Community features
│   ├── events/        # Event features
│   ├── journal/       # Journaling features
│   └── profile/       # Profile features
└── gamification/      # Gamification components
```

---

## Authentication Components

### ProtectedRoute
**Location:** `src/components/auth/ProtectedRoute.jsx`

Protects routes that require authentication. Redirects to sign-in if user is not authenticated.

**Props:**
- `children`: React node to render if authenticated

**Usage:**
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

---

## Common Components

### Navbar
**Location:** `src/components/components/common/Navbar.jsx`

Main navigation bar with search functionality and user menu.

**Features:**
- Dynamic search bar for users
- Navigation links
- User profile dropdown
- Responsive design

### SearchBar
**Location:** `src/components/components/common/SearchBar.jsx`

Dynamic search component for finding users.

**Features:**
- Real-time search as you type
- Expandable search interface
- User avatar grid view
- Click to navigate to user profile

### Button
**Location:** `src/components/components/common/Button.jsx`

Reusable button component with variants.

**Props:**
- `variant`: "primary" | "secondary" | "ghost"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean
- `onClick`: function

### Modal
**Location:** `src/components/components/common/Modal.jsx`

Reusable modal component.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: React node

---

## Community Components

### CommunitiesPage
**Location:** `src/pages/CommunitiesPage.jsx`

Main page for browsing and managing communities.

**Features:**
- Tabbed interface (My Communities / All Communities)
- Community recommendations based on interests
- Join/leave community functionality
- Create community modal
- Chat access for joined communities

### CommunityDetailPage
**Location:** `src/pages/CommunityDetailPage.jsx`

Detailed view of a specific community.

**Features:**
- Tabbed interface (Chat, Details, Events, Members)
- Membership status check
- Join community functionality
- Community information display

### GroupChat
**Location:** `src/components/components/communities/GroupChat.jsx`

Real-time group chat component for communities.

**Features:**
- Message display with auto-scroll
- Conversation flow triggers
- Poll creation and voting
- Event proposals
- Membership-based access control

**Props:**
- `communityId`: string
- `isMember`: boolean

### ChatMessage
**Location:** `src/components/components/communities/ChatMessage.jsx`

Individual chat message component.

**Features:**
- Supports multiple message types (text, poll, announcement, event proposal)
- User avatar and name display
- Timestamp formatting
- Poll widget integration

**Props:**
- `message`: message object
- `communityId`: string

### ChatInput
**Location:** `src/components/components/communities/ChatInput.jsx`

Input component for sending messages.

**Features:**
- Text input with character limit
- Poll creation option
- Event proposal option
- Membership validation
- Disabled state for non-members

**Props:**
- `communityId`: string
- `isMember`: boolean
- `onCreatePoll`: function
- `onCreateEventProposal`: function
- `onMessageSent`: function

### PollWidget
**Location:** `src/components/components/communities/PollWidget.jsx`

Interactive poll component.

**Features:**
- Question display
- Multiple choice options
- Vote count display
- Vote functionality
- Real-time vote updates

**Props:**
- `poll`: poll object
- `messageId`: string
- `communityId`: string

### CreateCommunityModal
**Location:** `src/components/components/communities/CreateCommunityModal.jsx`

Modal for creating new communities.

**Features:**
- Community name and description input
- Interest selection
- Verified community option
- User invitation step
- Connected users list

---

## Event Components

### EventsPage
**Location:** `src/pages/EventsPage.jsx`

Main page for browsing events.

**Features:**
- Advanced filtering (category, date, location, age group)
- Search functionality
- Personalized recommendations
- Event cards with RSVP buttons

### EventDetailPage
**Location:** `src/pages/EventDetailPage.jsx`

Detailed view of a specific event.

**Features:**
- Event information display
- RSVP functionality
- Organizer information
- Similar events recommendations
- Event reviews

### EventCard
**Location:** `src/components/components/events/EventCard.jsx`

Card component for displaying event preview.

**Props:**
- `event`: event object
- `onRSVP`: function
- `onClick`: function

---

## Journal Components

### JournalPage
**Location:** `src/pages/JournalPage.jsx`

Main journaling interface.

**Features:**
- Tabbed interface (Voice / Text)
- Voice recording with transcription
- Text entry
- Entry history
- AI insights

### VoiceJournalRecorder
**Location:** `src/components/components/journal/VoiceJournalRecorder.jsx`

Voice recording component.

**Features:**
- Audio recording
- Waveform visualization
- Recording controls
- Transcription display

### TextJournalEntry
**Location:** `src/components/components/journal/TextJournalEntry.jsx`

Text journal entry component.

**Features:**
- Rich text input
- Character count
- Save functionality
- Entry preview

---

## Profile Components

### ProfilePage
**Location:** `src/pages/ProfilePage.jsx`

User's own profile page.

**Features:**
- Profile header with stats
- Interests display
- Activity history
- Badges and achievements
- Connections list
- Mood history chart
- Attended events list

### UserProfilePage
**Location:** `src/pages/UserProfilePage.jsx`

View other users' profiles.

**Features:**
- Profile information display
- Connection status
- "Reach Out" button (from search)
- "Message" button (if connected)
- User activity display

### ProfileHeader
**Location:** `src/components/components/profile/ProfileHeader.jsx`

Profile header component with user info and stats.

**Props:**
- `user`: user object
- `stats`: stats object

### BadgeDisplay
**Location:** `src/components/components/profile/BadgeDisplay.jsx`

Displays user badges and achievements.

**Props:**
- `badges`: array of badge objects

---

## Gamification Components

### GamificationOverlay
**Location:** `src/components/components/gamification/GamificationOverlay.jsx`

Overlay component for displaying points and achievements.

**Features:**
- Points earned notifications
- Level up animations
- Badge unlock animations

### PointsNotification
**Location:** `src/components/components/gamification/PointsNotification.jsx`

Notification component for points earned.

**Props:**
- `points`: number
- `reason`: string

---

## Page Components

### DashboardPage
**Location:** `src/pages/DashboardPage.jsx`

Main dashboard after login.

**Features:**
- Welcome card
- Quick actions
- Recommended events
- Upcoming events
- Community highlights
- AI insights banner

### LandingPage
**Location:** `src/pages/LandingPage.jsx`

Welcome/landing page.

**Features:**
- Hero section
- Feature highlights
- Sign up / Sign in buttons
- Test login link

### OnboardingPage
**Location:** `src/pages/OnboardingPage.jsx`

Multi-step onboarding flow.

**Steps:**
1. Interest selection
2. Availability preferences
3. Mood check-in
4. Personality and goals

**Features:**
- Progress indicator
- Step navigation
- Data persistence
- User account creation

### SignInPage / SignUpPage
**Location:** `src/pages/SignInPage.jsx` / `src/pages/SignUpPage.jsx`

Authentication pages.

**Features:**
- Form validation
- Error handling
- Redirect after authentication
- Link to other auth page

---

## Context Providers

### AuthContext
**Location:** `src/context/AuthContext.jsx`

Manages user authentication state.

**Methods:**
- `signIn(email, password)`: Sign in user
- `signUp(userData)`: Create new user
- `signOut()`: Sign out user
- `updateUser(updates)`: Update user data

### ChatContext
**Location:** `src/context/ChatContext.jsx`

Manages chat messages and state.

**Methods:**
- `loadMessages(communityId)`: Load messages for community
- `sendMessage(communityId, message)`: Send message
- `updateMessage(communityId, messageId, updates)`: Update message

### EventContext
**Location:** `src/context/EventContext.jsx`

Manages event data and RSVPs.

**Methods:**
- `loadEvents(filters)`: Load events with filters
- `rsvpToEvent(eventId)`: RSVP to event
- `cancelRSVP(eventId)`: Cancel RSVP

### GamificationContext
**Location:** `src/context/GamificationContext.jsx`

Manages points, levels, and achievements.

**Methods:**
- `awardPoints(amount, type, description)`: Award points
- `getLevel()`: Get current level
- `getPoints()`: Get current points

---

## Custom Hooks

### useAuth
**Location:** `src/hooks/useAuth.js`

Hook for accessing authentication context.

**Returns:**
- `user`: current user object
- `signIn`: sign in function
- `signUp`: sign up function
- `signOut`: sign out function
- `isAuthenticated`: boolean

### useToast
**Location:** `src/hooks/useToast.js`

Hook for displaying toast notifications.

**Returns:**
- `showToast(message, type)`: Show toast notification

**Types:**
- `success`
- `error`
- `info`
- `warning`

### useDebounce
**Location:** `src/hooks/useDebounce.js`

Hook for debouncing values.

**Usage:**
```jsx
const debouncedValue = useDebounce(value, 500);
```

### useLocalStorage
**Location:** `src/hooks/useLocalStorage.js`

Hook for managing localStorage.

**Usage:**
```jsx
const [value, setValue] = useLocalStorage('key', defaultValue);
```

---

## Styling

### Tailwind CSS
All components use Tailwind CSS for styling with custom configuration.

### Custom CSS Variables
Defined in `src/styles/variables.css`:
- Color palette (sage, ocean, etc.)
- Spacing scale
- Typography scale

### Animations
Custom animations defined in:
- `src/styles/animations.css`
- `src/assets/styles/animations.css`

---

## Component Patterns

### Form Components
- Use controlled inputs with React state
- Implement validation
- Show error messages
- Disable submit during processing

### List Components
- Use `.map()` for rendering lists
- Implement loading states
- Handle empty states
- Add pagination if needed

### Modal Components
- Use portal for rendering
- Implement backdrop click to close
- Handle escape key
- Focus management

---

For implementation details, see individual component files in `src/components/` and `src/pages/`.
