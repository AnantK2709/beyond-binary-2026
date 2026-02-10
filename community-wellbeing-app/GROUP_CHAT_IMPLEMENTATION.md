# Group Chat Feature Implementation Guide

## Overview
This document describes the Group Chat feature implementation for the Community Wellbeing App. The feature includes real-time chat simulation, polls, event proposals, and various message types.

## Features Implemented

### 1. **Real-Time Chat Simulation**
- Messages appear with timed delays to simulate real-time conversation
- Supports multiple message types: regular messages, announcements, system notifications, polls, and event proposals
- Auto-scrolling to latest messages
- Visual indicators for simulation status

### 2. **Message Types**
- **Regular Messages**: Standard user-to-user communication
- **Announcements**: Event announcements with special styling (📢)
- **System Notifications**: Welcome messages and system updates (🎉)
- **Polls**: Interactive voting widgets with real-time vote counts
- **Event Proposals**: Proposals that can be converted to actual events

### 3. **Interactive Features**
- **Polls**: Create polls with multiple options, vote on them, see results in real-time
- **Event Proposals**: Propose events from chat discussions, convert to actual events
- **Message Input**: Rich input with options to create polls and event proposals

## File Structure

```
src/
├── components/components/communities/
│   ├── GroupChat.jsx          # Main chat component
│   ├── ChatMessage.jsx        # Individual message component
│   ├── ChatInput.jsx          # Message input with actions
│   ├── PollWidget.jsx         # Poll voting widget
│   └── EventProposal.jsx      # Event proposal component
├── context/
│   └── ChatContext.jsx         # Chat state management
├── services/
│   └── chatService.js          # Chat API service layer
├── utils/
│   └── chatSimulator.js        # Timed message simulation utilities
└── pages/
    └── CommunityDetailPage.jsx # Page integrating GroupChat
```

## Key Components

### GroupChat Component
**Location**: `src/components/components/communities/GroupChat.jsx`

**Features**:
- Loads messages for a community
- Simulates timed message appearance
- Handles message sending
- Supports creating polls and event proposals
- Auto-scrolls to bottom

**Props**:
- `communityId` (string, required): ID of the community

**Usage**:
```jsx
<GroupChat communityId="c001" />
```

### ChatMessage Component
**Location**: `src/components/components/communities/ChatMessage.jsx`

**Features**:
- Renders different message types with appropriate styling
- Handles system messages, announcements, polls, and event proposals
- Shows timestamps and user names

**Props**:
- `message` (object, required): Message object with type, text, userId, etc.

### PollWidget Component
**Location**: `src/components/components/communities/PollWidget.jsx`

**Features**:
- Displays poll question and options
- Allows voting (one vote per user)
- Shows vote counts and percentages
- Visual progress bars

**Props**:
- `poll` (object, required): Poll data with question and options
- `messageId` (string, required): ID of the message containing the poll

### EventProposal Component
**Location**: `src/components/components/communities/EventProposal.jsx`

**Features**:
- Displays event proposal details
- Allows converting proposal to actual event
- Form to fill event details (title, description, date, time, location)

**Props**:
- `proposal` (object, required): Proposal data
- `messageId` (string, required): ID of the message
- `userName` (string, required): Name of user who created proposal
- `timestamp` (string, required): Message timestamp

## State Management

### ChatContext
**Location**: `src/context/ChatContext.jsx`

**State**:
- `messages`: Object mapping communityId to array of messages
- `loading`: Boolean indicating loading state

**Methods**:
- `loadMessages(communityId)`: Load messages for a community
- `sendMessage(communityId, message)`: Add a message to the chat

**Usage**:
```jsx
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

const { messages, loading, loadMessages, sendMessage } = useContext(ChatContext)
```

## Services

### chatService
**Location**: `src/services/chatService.js`

**Methods**:
- `getMessages(communityId)`: Fetch messages for a community
- `sendMessage(communityId, messageText, userId, userName)`: Send a message
- `createPoll(communityId, question, options, userId, userName)`: Create a poll
- `voteOnPoll(messageId, optionId, userId)`: Vote on a poll option
- `createEventProposal(communityId, proposalData, userId, userName)`: Create event proposal
- `createEventFromProposal(proposalId, eventData)`: Convert proposal to event

## Mock Data

### Chat Messages Structure
```javascript
{
  id: 'msg001',
  communityId: 'c001',
  userId: 'u456',
  userName: 'Alex Johnson',
  text: 'Message text',
  timestamp: '2026-02-10T09:30:00Z',
  type: 'message' // 'message', 'announcement', 'system', 'poll', 'event_proposal'
}
```

### Poll Structure
```javascript
{
  question: 'Best time for the hike?',
  options: [
    { id: 'opt1', text: '7:00 AM', votes: 5, voters: ['u789', 'u101'] },
    { id: 'opt2', text: '8:00 AM', votes: 3, voters: ['u104'] }
  ],
  totalVotes: 8
}
```

## Integration

### Adding to a Page
The GroupChat component is integrated into `CommunityDetailPage`:

```jsx
import GroupChat from '../components/components/communities/GroupChat'

// In the component:
<GroupChat communityId={communityId} />
```

### Routing
The chat is accessible via:
- Route: `/communities/:id`
- Tab: "Chat" tab in CommunityDetailPage

## Testing

### Manual Testing Steps

1. **Navigate to a Community**:
   - Go to `/communities/c001` (or any community ID)
   - Click on the "Chat" tab

2. **View Messages**:
   - Messages should appear with timed delays (simulation)
   - Different message types should render correctly

3. **Send a Message**:
   - Type a message in the input field
   - Click "Send" or press Enter
   - Message should appear instantly

4. **Create a Poll**:
   - Click the "+" button in chat input
   - Click "Create Poll"
   - Enter question and options
   - Poll should appear in chat
   - Vote on options to see results

5. **Create Event Proposal**:
   - Click the "+" button in chat input
   - Click "Propose Event"
   - Enter event details
   - Proposal should appear in chat
   - Click "Create Event from Discussion" to convert

## Future Enhancements

### Backend Integration
When connecting to a real backend:

1. **WebSocket Integration**:
   - Replace `simulateTimedMessages` with WebSocket connection
   - Update `chatService` methods to call real API endpoints
   - Handle real-time message updates

2. **API Endpoints** (Expected):
   ```
   GET    /api/communities/:id/messages
   POST   /api/communities/:id/messages
   POST   /api/communities/:id/polls
   POST   /api/polls/:id/vote
   POST   /api/communities/:id/event-proposals
   POST   /api/event-proposals/:id/create-event
   ```

3. **Authentication**:
   - Include user token in API requests
   - Verify user permissions for creating polls/proposals

### AI Integration
If adding AI features:

1. **Message Analysis**:
   - Analyze chat messages for sentiment
   - Suggest events based on discussions
   - Auto-generate event proposals from conversations

2. **Smart Recommendations**:
   - Suggest poll options based on context
   - Recommend event times based on member availability

## Troubleshooting

### Messages Not Appearing
- Check if `communityId` is correctly passed to GroupChat
- Verify messages exist in mock data for that community
- Check browser console for errors

### Polls Not Working
- Ensure user is logged in (AuthContext)
- Check that `messageId` is correctly passed to PollWidget
- Verify poll structure matches expected format

### Event Proposals Not Creating Events
- Check that `chatService.createEventFromProposal` is implemented
- Verify event data structure matches EventContext expectations
- Check browser console for API errors

## Notes

- All state is managed client-side (localStorage for persistence)
- Messages are stored per community in ChatContext
- Simulation can be disabled by setting `isSimulating` to false
- Poll votes are stored in message object (in real app, would be in database)
- Event creation from proposals currently shows success toast but doesn't navigate (can be added)

## Dependencies

- React (Context API for state management)
- React Router (for navigation)
- Tailwind CSS (for styling)
- Custom hooks: `useToast`, `useAuth`

## Contact

For questions or issues with this implementation, refer to the main project README or contact the development team.
