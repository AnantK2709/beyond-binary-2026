# Quick Reference Guide

Quick reference for common tasks and commands in the MindfulCircles platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
npm run dev
```

## 📝 Common Tasks

### Adding a New API Endpoint

1. **Add route in `backend/server.js`:**
```javascript
app.post('/api/your-endpoint', (req, res) => {
  // Handle request
  // Query database tables
  // Return response
});
```

2. **Create service in `src/services/yourService.js`:**
```javascript
export const yourService = {
  yourMethod: async (data) => {
    const response = await apiClient.post('/your-endpoint', data);
    return response.data;
  }
};
```

3. **Use in component:**
```javascript
import { yourService } from '../services/yourService';

const handleAction = async () => {
  const result = await yourService.yourMethod(data);
  // Handle result
};
```

### Adding a New Page

1. **Create page component in `src/pages/YourPage.jsx`**
2. **Add route in `src/router.jsx`:**
```javascript
import YourPage from './pages/YourPage';

<Route 
  path="/your-page" 
  element={
    <ProtectedRoute>
      <YourPage />
    </ProtectedRoute>
  } 
/>
```

3. **Add navigation link in `Navbar.jsx`**

### Adding a New Context

1. **Create context file `src/context/YourContext.jsx`:**
```javascript
import { createContext, useState } from 'react';

export const YourContext = createContext();

export const YourProvider = ({ children }) => {
  const [state, setState] = useState(null);
  
  return (
    <YourContext.Provider value={{ state, setState }}>
      {children}
    </YourContext.Provider>
  );
};
```

2. **Add provider in `src/App.jsx`:**
```javascript
<YourProvider>
  {/* other providers */}
</YourProvider>
```

3. **Use in components:**
```javascript
import { useContext } from 'react';
import { YourContext } from '../context/YourContext';

const { state, setState } = useContext(YourContext);
```

## 🔧 Common Commands

### Development
```bash
# Start frontend dev server
npm run dev

# Start backend server
cd backend && npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### Git
```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature
```

## 📚 Key Files Reference

### Frontend
- `src/App.jsx` - Root component with providers
- `src/router.jsx` - Route definitions
- `src/context/` - Context providers
- `src/services/` - API service layer
- `src/pages/` - Page components

### Backend
- `backend/server.js` - Express server and API endpoints
- `backend/data/` - Database tables
- `backend/prompts.js` - AI system prompts

## 🎨 Styling

### Tailwind Classes
```jsx
// Common patterns
className="flex items-center gap-2"
className="bg-sage-500 text-white rounded-lg"
className="hover:bg-sage-600 transition-colors"
```

### Custom Colors
- `sage-*` - Primary green colors
- `ocean-*` - Blue colors
- Defined in `src/styles/variables.css`

## 🔌 API Quick Reference

### Users
```javascript
// Create/Update user
POST /api/users
Body: { id, email, name, ... }

// Get user
GET /api/users/:id

// Search users
GET /api/users/search?q=query
```

### Events
```javascript
// Get events
GET /api/events?category=wellness&dateFrom=2026-02-01

// Get event
GET /api/events/:id

// RSVP
POST /api/events/:id/rsvp
Body: { userId }
```

### Communities
```javascript
// Get communities
GET /api/communities

// Join community
POST /api/communities/:id/join
Body: { userId }

// Send message
POST /api/communities/:id/messages
Body: { userId, userName, text, type }
```

## 🐛 Debugging Tips

### Frontend
- Check browser console for errors
- Use React DevTools
- Check Network tab for API calls
- Verify localStorage for user data

### Backend
- Check server console logs
- Verify database table data
- Check request/response in terminal
- Verify environment variables

### Common Issues

**API calls failing:**
- Check backend server is running
- Verify API URL in `.env`
- Check CORS configuration

**Authentication issues:**
- Check localStorage for `currentUser`
- Verify user exists in database
- Check AuthContext state

**Chat not working:**
- Verify user is member of community
- Check `isSimulated` flag for conversation flows
- Verify backend membership check

## 📖 Documentation Files

- `README.md` - Main documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `COMPONENT_DOCUMENTATION.md` - Component reference
- `ARCHITECTURE.md` - Architecture details
- `QUICK_REFERENCE.md` - This file

## 💡 Best Practices

### Components
- Keep components small and focused
- Use props for configuration
- Extract reusable logic to hooks
- Handle loading and error states

### API Calls
- Use service layer, not direct fetch
- Handle errors gracefully
- Show loading states
- Update context after API calls

### State Management
- Use Context for global state
- Use useState for local state
- Avoid prop drilling
- Keep state close to where it's used

### Styling
- Use Tailwind utility classes
- Create reusable component variants
- Use CSS variables for theming
- Keep styles consistent

---

For detailed information, refer to the main documentation files.
