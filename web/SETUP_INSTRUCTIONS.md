# Reps Web App Setup

## ✅ Files Created

The setup script has created all necessary files for Phase 2. Here's what was generated:

### Configuration
- `.env.local` - Environment variables (UPDATE THIS!)
- `lib/supabase/client.ts` - Supabase browser client
- `lib/supabase/server.ts` - Supabase server client
- `lib/types.ts` - TypeScript types
- `lib/judge0/client.ts` - Judge0 integration

### Components
- `components/editor/CodeEditor.tsx` - Monaco code editor component

### API Routes
- `app/api/execute/route.ts` - Code execution endpoint

### Pages
- `app/page.tsx` - Home page
- `app/challenge/[id]/page.tsx` - Challenge detail page

## 🚀 Next Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @monaco-editor/react monaco-editor
npm install axios
npm install @heroicons/react
```

### 2. Update Environment Variables

Edit `.env.local` with your actual credentials:

```bash
# Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Get from RapidAPI (https://rapidapi.com/judge0-official/api/judge0-ce)
JUDGE0_API_KEY=your_rapidapi_key
```

### 3. Add Missing shadcn Components

```bash
npx shadcn@latest add badge
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Test a Challenge

Navigate to: http://localhost:3000/challenge/{challenge-id}

Get a challenge ID from your Supabase dashboard.

## 🔧 Troubleshooting

### Monaco Editor Not Loading
If you see errors about Monaco, add to `next.config.ts`:

```typescript
const config: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};
```

### Judge0 API Errors
- Check your RapidAPI key is correct
- Verify you're subscribed to Judge0 CE (free tier)
- Check rate limits (50 requests/day on free tier)

### Supabase Connection Issues
- Verify your URL and anon key are correct
- Check if your IP is allowed in Supabase dashboard
- Test connection: `curl https://your-project.supabase.co/rest/v1/`

## 📚 What's Next?

1. Add authentication pages (login/signup)
2. Create user progress tracking
3. Add profile page
4. Implement streak tracking
5. Add leaderboard

Refer to the main implementation guide for detailed instructions!
