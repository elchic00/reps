# Cross-Platform Authentication Setup

## Overview

Your Reps app now has **unified authentication** across mobile and web! Users can sign in on one platform and seamlessly access their account on the other.

## How It Works

Both platforms use **Supabase Auth** with the same database, which means:

1. ✅ **Shared User Accounts** - Same email/password works on both mobile and web
2. ✅ **Shared User Data** - Profile, progress, and completed challenges sync across platforms
3. ✅ **Session Management** - Supabase handles tokens and session refresh automatically

## Mobile → Web Session Sharing

When a user opens a link from the mobile app to the web app:

### Current Behavior
The user will need to sign in again on web because mobile and web use different session storage:
- **Mobile**: Uses React Native's AsyncStorage for session tokens
- **Web**: Uses HTTP cookies for session tokens

### To Enable Automatic Sign-In (Advanced)

If you want users to automatically be signed in when opening web links from mobile, you have two options:

#### Option 1: Deep Link with Auth Token (Recommended for Native Apps)
1. When creating a web link in mobile, append the session token:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   const webUrl = `https://your-app.vercel.app?token=${session.access_token}`;
   ```

2. On web, create a token handler route:
   ```typescript
   // app/auth/token/route.ts
   export async function GET(request: NextRequest) {
     const token = request.nextUrl.searchParams.get('token');
     if (token) {
       const { data, error } = await supabase.auth.setSession({
         access_token: token,
         refresh_token: '', // You'd need to pass this too
       });
       return NextResponse.redirect('/');
     }
   }
   ```

#### Option 2: OAuth/Social Login (Simplest)
Use Google/Apple/GitHub OAuth for both platforms - Supabase handles the session sharing automatically:
```typescript
// Both mobile and web
await supabase.auth.signInWithOAuth({ provider: 'google' })
```

## What You Have Now

### ✅ Completed Setup

1. **Web Authentication Pages**
   - `/login` - Sign in page
   - `/signup` - Registration page
   - Auto-redirect if already logged in

2. **Protected Routes**
   - Middleware automatically protects challenge pages
   - Redirects to login if not authenticated

3. **Session Management**
   - Automatic session refresh
   - Persistent login (cookies stored securely)
   - Sign out functionality in navbar

4. **Unified User Experience**
   - Shows username/email in navbar
   - Same user data accessed from both platforms
   - Profile metadata synced via Supabase

## Supabase Configuration Required

### 1. Set Redirect URLs in Supabase Dashboard

Go to: **Authentication** → **URL Configuration**

Add these URLs:

**For Local Development:**
```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

**For Production (Vercel):**
```
https://your-app-name.vercel.app/auth/callback
https://your-app-name.vercel.app/**
```

**For Mobile (Deep Links):**
```
com.yourapp.reps://
com.yourapp.reps://**
```

### 2. Email Template (If Using Email Confirmation)

If you enable email confirmation in Supabase:
- Update the confirmation email template to point to your web domain
- Template: `https://your-app-name.vercel.app/auth/confirm?token_hash={{ .Token }}`

## Testing Authentication

### Test Web Auth Locally

1. Start the dev server:
   ```bash
   cd web
   npm run dev
   ```

2. Go to `http://localhost:3000`

3. Click "Sign Up" and create an account

4. Verify you can:
   - ✅ Sign up
   - ✅ Sign in
   - ✅ See your username in navbar
   - ✅ Access challenge pages
   - ✅ Sign out

### Test Cross-Platform

1. Sign up on mobile app
2. Go to web and sign in with same credentials
3. Verify your profile data is the same

## Security Notes

### Cookies (Web)
- Cookies are `httpOnly` and `secure` in production
- Automatically sent with requests
- Managed by Supabase SSR package

### AsyncStorage (Mobile)
- Encrypted on device
- Cleared on sign out
- Managed by Supabase React Native package

### Session Tokens
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (automatically refreshed)
- All handled by Supabase Auth

## Environment Variables

Make sure these are set in **both** `.env.local` (local) and Vercel (production):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### "User not authenticated" error
- Clear browser cookies and try again
- Check that Supabase URL is correct in env vars
- Verify redirect URLs are configured in Supabase

### Sessions not persisting
- Check browser allows cookies
- Verify `middleware.ts` is running (check Network tab)
- Make sure you're using `createClient()` correctly

### Mobile session not working on web
- This is expected - see "Mobile → Web Session Sharing" above
- Users need to sign in separately on each platform
- Consider adding OAuth for seamless cross-platform auth

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Update Supabase redirect URLs with production domain
3. ✅ Test authentication in production
4. Consider adding:
   - Password reset flow
   - Email verification
   - OAuth providers (Google, GitHub, Apple)
   - Profile editing page
   - Account settings

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
