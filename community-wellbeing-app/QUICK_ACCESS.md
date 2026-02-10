# Quick Access Guide - Testing Group Chat

## ✅ Auth Bypass Enabled

The app now **auto-logs in** a test user when you start it, so you can access all features immediately!

## 🚀 Direct Access to Chat

### Option 1: Direct URL
Simply navigate to:
```
http://localhost:5173/communities/c001
```

Then click the **"Chat"** tab.

### Option 2: From Landing Page
1. Go to `http://localhost:5173`
2. Click **"Sign In"** button (now works!)
3. Or scroll down and click **"🚀 Go to Chat (Test)"** button

### Option 3: Direct Navigation
You can directly navigate to any community chat:
- `http://localhost:5173/communities/c001` - Outdoor Enthusiasts
- `http://localhost:5173/communities/c002` - Wellness Warriors  
- `http://localhost:5173/communities/c003` - Creative Souls

## 🔧 What Was Fixed

1. **Auto-Login**: App automatically logs in a test user on startup
2. **Sign In Button**: Now actually works (calls signin function)
3. **Direct Chat Link**: Added "Go to Chat" button on landing page
4. **No Auth Required**: Protected routes now allow access (for testing)

## 👤 Test User Credentials

The app auto-logs in with:
- **Name**: Test User
- **Email**: test@example.com
- **ID**: u123
- **Points**: 450
- **Level**: 3

## 🧪 Testing the Chat

Once you're on the chat page:

1. **View Messages**: Messages will appear with timed delays (simulation)
2. **Send Message**: Type and click "Send" or press Enter
3. **Create Poll**: Click "+" → "📊 Create Poll"
4. **Propose Event**: Click "+" → "📅 Propose Event"
5. **Vote on Polls**: Click any option in a poll message

## 🔄 Disabling Auto-Login (For Production)

To disable auto-login, edit `src/context/AuthContext.jsx`:

```javascript
useEffect(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
  setLoading(false)
  // Remove the auto-login else block
}, [])
```

## 📝 Notes

- All state is stored client-side (localStorage)
- Messages are simulated for demo purposes
- No backend required for testing
- Ready for backend integration when needed

---

**Happy Testing! 🎉**
