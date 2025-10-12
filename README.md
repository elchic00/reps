# Reps 🎯

Daily coding practice for technical interviews - Build your reps, one challenge at a time.

## 🏗️ Monorepo Structure
reps/
├── mobile/          # React Native (Expo) mobile app
├── web/             # Next.js web application
├── shared/          # Shared types, constants, and utilities
└── README.md

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile)

### Setup
```bash
# Install dependencies for all workspaces
npm install

# Run mobile app
npm run mobile

# Run web app  
npm run web
Mobile Development
bashcd mobile

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Build for production
npm run mobile:build
Web Development
bashcd web

# Start Next.js dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
🛠️ Tech Stack
Mobile (React Native + Expo)

React Native
Expo Router
Supabase (Auth, Database)
Zustand (State Management)
React Native Paper (UI)

Web (Next.js)

Next.js 14+ (App Router)
TypeScript
Tailwind CSS
Supabase
Monaco Editor (Code Editor)
Judge0 API (Code Execution)

Shared

TypeScript types
Constants
Utility functions

📱 Features

✅ Daily coding challenges
✅ Real-time code execution
✅ Progress tracking & streaks
✅ Mobile + Web sync
✅ Friend leaderboards
🚧 Video solutions (coming soon)
🚧 Interview prep mode (coming soon)

🔧 Configuration
Environment Variables
Both apps require environment variables. Create .env.local files:
mobile/.env.local
bashEXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
web/.env.local
bashNEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
JUDGE0_API_KEY=your_judge0_key
📚 Documentation

Implementation Guide
Mobile Setup
Web Setup

🤝 Contributing

Fork the repo
Create a feature branch (git checkout -b feature/amazing-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
MIT License - see LICENSE file for details
🙏 Acknowledgments

Built with Supabase
Powered by Judge0
Mobile UI with React Native Paper
