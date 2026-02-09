# Community Wellbeing App - Quick Start Guide 🌿

Welcome to the Community Wellbeing App! This guide will help you get started with your calming, sage green themed wellness application.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd community-wellbeing-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## 📁 Project Structure Overview

```
community-wellbeing-app/
├── public/
│   ├── images/          # Event images, avatars, logos
│   ├── audio/           # Audio files (waveforms)
│   └── mock-data/       # JSON mock data files
├── src/
│   ├── components/      # All React components
│   ├── pages/          # Page-level components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   └── styles/         # Global styles
└── Configuration files
```

## 🎨 Theme & Design

The app features a **calming sage green theme** with:

- **Primary Colors**: Sage green (#A8D5BA, #5F9C8D)
- **Accent Colors**: Ocean blue (#89CFF0)
- **Style**: Transparent glass effects, soft shadows, gentle animations
- **Icons**: Peaceful emojis (🌿, 🧘‍♀️, 🎯, 👥, 📈)

All animations are designed to be gentle and calming:
- `animate-fade-in` - Smooth fade in
- `animate-slide-up` - Gentle slide up
- `animate-bounce-gentle` - Soft bounce
- `animate-float` - Peaceful floating effect

## 🧩 Key Features Implemented

### ✅ Complete Structure
- All directories and files created
- All component placeholders set up
- Mock data JSON files ready
- Service layer configured
- Context providers ready
- Custom hooks implemented

### ✅ Core Functionality
- Authentication flow (mock)
- Event discovery and management
- Community features
- Journal (voice & text)
- Gamification system
- Recommendations engine
- Monthly reports

### ✅ UI Components
- Common components (Button, Card, Input, Modal, etc.)
- Event components
- Community components
- Dashboard components
- Profile components
- And many more!

## 📝 Next Steps

### 1. Add Images

Add images to the following directories (see `public/images/README.md` for guidelines):
- `/public/images/events/` - Event photos
- `/public/images/communities/` - Community banners
- `/public/images/organizations/` - Organization logos
- `/public/images/avatars/` - User avatars

Recommended image sources:
- [Unsplash](https://unsplash.com) - Search: yoga, meditation, nature, wellness
- [Pexels](https://pexels.com) - Search: peaceful, calming, community

### 2. Customize Mock Data

Edit the JSON files in `/public/mock-data/` to customize:
- Users
- Events
- Communities
- Organizations
- And more

### 3. Implement Component Logic

The placeholder components in `/src/components/` are ready for you to add logic:
- Add state management
- Connect to services
- Add event handlers
- Implement UI interactions

### 4. Customize Styles

Modify the theme in `tailwind.config.js`:
```javascript
colors: {
  sage: { ... },    // Your calming sage greens
  ocean: { ... },   // Accent colors
}
```

## 🎯 Key Files to Start With

1. **Landing Page**: `src/pages/LandingPage.jsx` ✅ (Already implemented!)
2. **Dashboard**: `src/pages/DashboardPage.jsx`
3. **Events**: `src/components/events/EventCard.jsx` ✅ (Already implemented!)
4. **Auth**: `src/components/auth/SignIn.jsx` & `SignUp.jsx`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📦 Dependencies

- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling with custom sage theme
- **Framer Motion** - Smooth, calming animations
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

## 🎨 Design Philosophy

The app embodies **calmness and joyfulness** through:

1. **Color Palette**: Sage greens representing peace and nature
2. **Transparency**: Glass-morphism effects for lightness
3. **Animations**: Gentle, non-intrusive movements
4. **Icons**: Peaceful, welcoming emojis
5. **Spacing**: Generous whitespace for breathing room
6. **Typography**: Clean, readable fonts (Inter)

## 💡 Tips

- Use the provided utility classes like `card`, `btn-primary`, `glass-effect`
- Animations are opt-in via classes like `animate-fade-in`
- Mock services simulate 300ms API delay for realistic feel
- LocalStorage is used for state persistence
- All components follow the calming theme automatically

## 🤝 Need Help?

- Check the README.md for project overview
- Review component examples in `/src/components/`
- Look at implemented services in `/src/services/`
- Explore utility functions in `/src/utils/`

## 🌟 Happy Building!

Create something beautiful and calming that helps people connect and thrive! 🌿✨
