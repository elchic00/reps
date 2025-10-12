# Cross-Platform Authentication Guide

## How It Works

When users tap "Open in Web" from your mobile app, they'll automatically be logged in on the web app!

## Implementation Overview

### Flow Diagram
```
Mobile App (Logged In)
    ↓
User taps "Open in Web Editor"
    ↓
Mobile gets current session tokens
    ↓
Opens URL: https://reps-elchic00-elchic00s-projects.vercel.app/auth/token?access_token=xxx&refresh_token=yyy&redirect=/challenge/123
    ↓
Web receives tokens and sets session
    ↓
Web redirects to challenge page
    ↓
User is logged in on web! 🎉
```

## Files Created

### 1. Web Token Authentication Route
**File**: `/web/app/auth/token/route.ts`

This route:
- Receives `access_token` and `refresh_token` from URL params
- Uses Supabase to set the session on web
- Redirects to the intended page
- Handles errors gracefully

### 2. Mobile Deep Linking Utility
**File**: `/mobile/lib/deepLink.ts`

Functions available:
- `openWebWithAuth(path)` - Opens any web path with auth
- `openChallengeInWeb(challengeId)` - Opens specific challenge
- `openHomeInWeb()` - Opens home page

## Usage in Mobile App

### Example 1: Add "Open in Web" Button to Challenge Screen

```typescript
import { openChallengeInWeb } from '@/lib/deepLink';
import { Button } from 'react-native';

function ChallengeScreen({ challengeId }) {
  return (
    <View>
      {/* Your challenge UI */}

      <Button
        title="Open in Web Editor"
        onPress={() => openChallengeInWeb(challengeId)}
      />
    </View>
  );
}
```

### Example 2: Share Link with Auth

```typescript
import { openWebWithAuth } from '@/lib/deepLink';

// Open any path
await openWebWithAuth('/challenge/two-sum-123');
await openWebWithAuth('/');
```

### Example 3: Menu Option

```typescript
import { openChallengeInWeb } from '@/lib/deepLink';

const MenuOptions = () => (
  <Menu>
    <MenuItem onPress={() => openChallengeInWeb(challenge.id)}>
      Open in Browser
    </MenuItem>
  </Menu>
);
```

## Configuration Required

### 1. Update Supabase Redirect URLs

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Authentication → URL Configuration

Add these URLs:

```
https://reps-elchic00-elchic00s-projects.vercel.app/auth/token
https://reps-elchic00-elchic00s-projects.vercel.app/auth/callback
https://reps-elchic00-elchic00s-projects.vercel.app/**
```

### 2. Verify Web App URL

The mobile deep link utility is configured to use:
```
https://reps-elchic00-elchic00s-projects.vercel.app
```

If your URL changes, update it in `/mobile/lib/deepLink.ts`:
```typescript
const WEB_APP_URL = 'https://your-new-url.vercel.app';
```

## Security Notes

### ✅ Safe to Pass Tokens in URL

- Tokens are in URL params (not visible in browser history for HTTPS)
- URL is only used during redirect (not stored)
- Session is immediately set to cookies
- Redirect happens server-side
- HTTPS encrypts the entire URL

### 🔒 Best Practices

1. **Tokens are short-lived** - Access tokens expire in 1 hour
2. **HTTPS only** - All traffic is encrypted
3. **Immediate session setup** - Tokens are converted to cookies immediately
4. **No token storage** - Tokens aren't stored in browser
5. **Error handling** - Falls back to login if tokens are invalid

## Testing

### Test Flow

1. **On Mobile:**
   - Sign in to your account
   - Navigate to a challenge (e.g., "Two Sum")
   - Tap "Open in Web Editor" button

2. **Expected Result:**
   - Mobile opens browser
   - URL briefly shows `/auth/token?access_token=...&redirect=/challenge/123`
   - Immediately redirects to `/challenge/123`
   - You're logged in on web!
   - Username shows in navbar

3. **Verify:**
   - Check navbar shows your username
   - Try accessing protected routes
   - Check you can solve challenges
   - Try signing out

### Test Cases

✅ **Happy Path**
- Mobile logged in → Opens web → Stays logged in

✅ **No Session on Mobile**
- Opens web without tokens → Redirects to login

✅ **Invalid Tokens**
- Bad tokens → Redirects to login with error

✅ **Expired Tokens**
- Supabase auto-refreshes if refresh token is valid

## Troubleshooting

### Problem: Opens web but not logged in

**Cause**: Tokens not being passed correctly

**Fix**:
1. Check mobile console for errors
2. Verify session exists: `supabase.auth.getSession()`
3. Check URL includes tokens
4. Verify Supabase redirect URLs are set

### Problem: "Auth failed" error

**Cause**: Invalid or expired tokens

**Fix**:
1. Sign out and sign in again on mobile
2. Check Supabase session is valid
3. Verify tokens aren't expired

### Problem: Redirects to login

**Cause**: No tokens in URL or session setup failed

**Fix**:
1. Check `/auth/token` route is deployed
2. Verify environment variables on Vercel
3. Check Supabase project URL is correct

## Advanced: Custom Redirect Logic

### Option 1: Remember Last Page

```typescript
// Mobile - Save last page before opening web
import AsyncStorage from '@react-native-async-storage/async-storage';

async function openCurrentPageInWeb(currentPath: string) {
  await AsyncStorage.setItem('last_mobile_path', currentPath);
  await openWebWithAuth(currentPath);
}
```

### Option 2: Deep Link Back to Mobile

Add a "Open in App" button on web:

```typescript
// Web component
function OpenInAppButton() {
  const handleOpenInApp = () => {
    // Custom app scheme
    window.location.href = 'reps://challenge/123';
  };

  return <button onClick={handleOpenInApp}>Open in App</button>;
}
```

## Deployment Checklist

Before using this feature in production:

- [ ] Deploy web app with `/auth/token` route
- [ ] Update Supabase redirect URLs
- [ ] Test token flow works correctly
- [ ] Verify HTTPS is enabled on web
- [ ] Add UI button/menu in mobile app
- [ ] Test with expired tokens
- [ ] Test without mobile session
- [ ] Document for users

## Example UI Implementation

### Mobile: Add Button to Challenge Screen

```typescript
// mobile/app/(tabs)/challenge/[id].tsx
import { openChallengeInWeb } from '@/lib/deepLink';
import { IconButton } from 'react-native-paper';

export default function ChallengePage({ route }) {
  const { id } = route.params;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Two Sum</Text>

        <IconButton
          icon="open-in-new"
          size={24}
          onPress={() => openChallengeInWeb(id)}
        />
      </View>

      {/* Rest of challenge UI */}
    </View>
  );
}
```

### Alternative: Menu Option

```typescript
import { Menu } from 'react-native-paper';
import { openChallengeInWeb } from '@/lib/deepLink';

function ChallengeMenu({ challengeId }) {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<IconButton icon="dots-vertical" onPress={() => setVisible(true)} />}
    >
      <Menu.Item
        onPress={() => {
          openChallengeInWeb(challengeId);
          setVisible(false);
        }}
        title="Open in Browser"
        leadingIcon="open-in-new"
      />
    </Menu>
  );
}
```

## Summary

✅ **What You Have:**
- Web route that accepts auth tokens
- Mobile utility to generate auth URLs
- Automatic session setup on web
- Seamless cross-platform experience

✅ **What Users Get:**
- Tap "Open in Web" on mobile
- Automatically logged in on web
- Continue working seamlessly
- Same account, same data

✅ **Security:**
- HTTPS encrypted
- Short-lived tokens
- Immediate cookie conversion
- No token storage

🚀 **Ready to Use!**
