# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Build succeeds locally (`npm run build`)
- [x] All TypeScript/ESLint errors fixed
- [x] Authentication system implemented
- [x] Login and signup pages created
- [x] Middleware for route protection added
- [x] Navbar with auth state management
- [x] Cross-platform auth setup documented

## 📋 Deployment Steps

### Step 1: Commit Your Code

```bash
cd /Users/aalag/Projects/reps
git add .
git commit -m "Add authentication and prepare for deployment"
git push
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `reps` repository
4. **IMPORTANT**: Configure project settings:
   - **Root Directory**: `web` ⚠️ This is critical!
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Set Environment Variables in Vercel

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL
Value: [Your Supabase Project URL]
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Your Supabase Anon Key]
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

✅ Set for: **Production**, **Preview**, and **Development**

### Step 4: Choose Your Subdomain

During deployment or after in Settings → Domains:
- Enter: `reps` or `repspractice`
- Your URL will be: `https://reps.vercel.app` or `https://repspractice.vercel.app`

### Step 5: Deploy!

Click **"Deploy"** and wait 2-3 minutes for the build to complete.

## 🔐 Post-Deployment: Configure Supabase

### Critical: Update Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**

4. Add these URLs:

**Site URL:**
```
https://your-app-name.vercel.app
```

**Redirect URLs (Add all of these):**
```
https://your-app-name.vercel.app/auth/callback
https://your-app-name.vercel.app/**
http://localhost:3000/**
http://localhost:3000/auth/callback
```

The `**` wildcard allows auth callbacks from any route.

5. Click **Save**

## 🧪 Testing Your Deployment

### 1. Test Basic Functionality

Visit: `https://your-app-name.vercel.app`

- [ ] Page loads without errors
- [ ] Can see challenge list
- [ ] Navbar displays correctly
- [ ] Can see "Sign In" and "Sign Up" buttons

### 2. Test Authentication

**Sign Up Flow:**
- [ ] Click "Sign Up"
- [ ] Fill in username, email, password
- [ ] Submit form
- [ ] Redirects to home page
- [ ] Can see username in navbar
- [ ] Can access challenge pages

**Sign In Flow:**
- [ ] Sign out
- [ ] Click "Sign In"
- [ ] Enter credentials
- [ ] Successfully signs in
- [ ] Redirects to home page

**Protected Routes:**
- [ ] Try accessing `/challenge/[id]` while logged out
- [ ] Should redirect to `/login`
- [ ] After logging in, can access challenge pages

### 3. Test Cross-Platform

**From Mobile:**
- [ ] Sign up or sign in on mobile app
- [ ] Note your email/username

**From Web:**
- [ ] Go to web app
- [ ] Sign in with same credentials
- [ ] Verify it works
- [ ] Check that profile data matches (same username, etc.)

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check that root directory is set to `web` in Vercel
- Verify all imports use correct paths

**Error: "Environment variable not defined"**
- Add env vars in Vercel project settings
- Redeploy after adding vars

### Auth Not Working

**Error: "Invalid Redirect URL"**
```
Fix: Add your Vercel URL to Supabase redirect URLs
```

**Error: "Network request failed"**
```
Fix: Check NEXT_PUBLIC_SUPABASE_URL is correct
```

**Sessions not persisting:**
```
Fix: Check browser allows cookies (required for auth)
```

### Challenges Not Loading

**Error: Database query fails**
```
Fix: Verify Supabase connection and table exists
Check: Row Level Security (RLS) policies allow public read
```

## 📊 Monitoring

After deployment, monitor your app:

1. **Vercel Dashboard**
   - View deployment logs
   - Check function execution
   - Monitor bandwidth usage

2. **Supabase Dashboard**
   - Check auth users
   - Monitor database queries
   - View API usage

3. **Browser Console**
   - Check for JavaScript errors
   - Verify API calls succeed

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Web app loads at your Vercel URL
- ✅ Users can sign up and sign in
- ✅ Authentication persists across page reloads
- ✅ Protected routes redirect to login
- ✅ Challenge pages load and display correctly
- ✅ Same account works on both mobile and web
- ✅ Sign out works correctly

## 🔄 Continuous Deployment

Vercel is now set up for automatic deployments:

- **Main branch** → Automatically deploys to production
- **Other branches** → Creates preview deployments
- **Pull requests** → Generates preview links

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically build and deploy within 2-3 minutes!

## 🌐 Custom Domain (Optional)

Want `reps.io` instead of `reps.vercel.app`?

1. **Purchase domain** from:
   - Namecheap ($10-15/year)
   - Google Domains
   - Cloudflare

2. **Add to Vercel:**
   - Project Settings → Domains
   - Enter your domain
   - Follow DNS instructions

3. **Update Supabase:**
   - Add new domain to redirect URLs
   - Update site URL

4. **Wait for DNS propagation** (up to 48 hours)

## 📝 Next Steps After Deployment

1. Share your URL: `https://your-app.vercel.app`
2. Test on multiple devices
3. Consider adding:
   - [ ] Password reset functionality
   - [ ] Email verification
   - [ ] OAuth login (Google, GitHub)
   - [ ] User profile page
   - [ ] Analytics (Vercel Analytics)

## 🆘 Need Help?

- Check [web/AUTH_SETUP.md](./AUTH_SETUP.md) for auth details
- Check [web/DEPLOYMENT.md](./DEPLOYMENT.md) for extended guide
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

**Your app is ready for deployment! 🎉**
