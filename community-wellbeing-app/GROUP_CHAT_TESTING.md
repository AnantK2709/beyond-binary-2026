# Group Chat Feature - Testing Guide

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to a community**:
   - Go to `http://localhost:3000/communities/c001` (or any community ID from mock data)
   - You should see the Community Detail Page with tabs

3. **Click on the "Chat" tab**:
   - The Group Chat should load
   - Messages will appear with timed delays (simulation)

## Testing Scenarios

### 1. View Chat Messages
- **Expected**: Messages appear one by one with 2-second delays
- **Verify**: Different message types render correctly:
  - Regular messages (left/right aligned based on sender)
  - Announcements (centered, orange background)
  - System notifications (centered, sage background)
  - Polls (with voting options)
  - Event proposals (with create event button)

### 2. Send a Message
- **Steps**:
  1. Type a message in the input field
  2. Click "Send" or press Enter
- **Expected**: Message appears instantly in the chat
- **Verify**: Message shows your name and timestamp

### 3. Create a Poll
- **Steps**:
  1. Click the "+" button in chat input
  2. Click "📊 Create Poll"
  3. Enter question: "Best time for the hike?"
  4. Enter options: "7:00 AM", "8:00 AM", "9:00 AM"
  5. Click OK
- **Expected**: Poll appears in chat with all options
- **Verify**: You can vote on options and see vote counts

### 4. Vote on a Poll
- **Steps**:
  1. Find a poll message in chat
  2. Click on an option
- **Expected**: 
  - Vote is recorded
  - Vote count increases
  - Percentage bar updates
  - Option is highlighted
- **Verify**: You can only vote once per poll

### 5. Create Event Proposal
- **Steps**:
  1. Click the "+" button in chat input
  2. Click "📅 Propose Event"
  3. Enter title: "Weekend Hiking Adventure"
  4. Enter description: "Let's explore the mountain trails"
  5. Click OK
- **Expected**: Event proposal appears in chat
- **Verify**: Proposal shows title and description

### 6. Convert Proposal to Event
- **Steps**:
  1. Find an event proposal in chat
  2. Click "📅 Create Event from Discussion"
  3. Fill in the form:
     - Title: "Weekend Hiking Adventure"
     - Description: "Let's explore the mountain trails"
     - Date: Select a future date
     - Time: Select a time
     - Location: "Mountain Trail Head"
  4. Click "Create Event"
- **Expected**: 
  - Success toast appears
  - Form closes
- **Note**: In current implementation, event is created but doesn't navigate (can be enhanced)

## Test Data

### Community IDs Available:
- `c001` - Outdoor Enthusiasts (234 members)
- `c002` - Wellness Warriors (189 members)
- `c003` - Creative Souls (156 members)

### Sample Messages:
The chat will simulate messages appearing. You can also check `public/mock-data/chat-messages.json` for sample messages.

## Common Issues

### Issue: Messages not appearing
**Solution**: 
- Check browser console for errors
- Verify communityId is correct
- Check that ChatProvider is in App.jsx

### Issue: Can't send messages
**Solution**:
- Ensure you're logged in (check AuthContext)
- Verify user object exists
- Check browser console for errors

### Issue: Polls not working
**Solution**:
- Ensure user is logged in
- Check that messageId is passed correctly
- Verify poll structure in mock data

### Issue: Chat not scrolling
**Solution**:
- Check that messagesEndRef is set correctly
- Verify chat container has proper height
- Check browser console for errors

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Performance Notes

- Message simulation adds ~2 seconds per message
- For faster testing, you can modify `delayBetweenMessages` in GroupChat.jsx
- Set `isSimulating` to false to show all messages immediately

## Next Steps for Production

1. Replace simulation with WebSocket connection
2. Add message persistence (database)
3. Add real-time updates for polls
4. Add notification system for new messages
5. Add message search functionality
6. Add file/image sharing
7. Add emoji picker
8. Add message reactions
