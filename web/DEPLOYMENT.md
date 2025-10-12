# Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com with your GitHub account)
- Supabase project

## Step 1: Prepare Your Repository

1. Commit all changes:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 3: Configure Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To add environment variables:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development

## Step 4: Configure Supabase for Vercel

### Update Auth Redirect URLs in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URLs to **Redirect URLs**:
   - `https://your-app-name.vercel.app/auth/callback`
   - `https://your-app-name.vercel.app/**` (wildcard for all routes)
4. Add to **Site URL**:
   - `https://your-app-name.vercel.app`

### Important: Cookie Settings

For authentication to work properly on Vercel, you may need to update your Supabase client configuration.

The current setup in `lib/supabase/server.ts` already uses the recommended `getAll()` and `setAll()` cookie methods which work correctly with Next.js 15 and Vercel.

## Step 5: Choose Your Subdomain

During deployment, you can customize your subdomain:

- Click on your project name in Vercel
- Go to Settings → Domains
- Add a custom subdomain like `reps` or `repspractice`
- Your URL will be: `https://reps.vercel.app` or `https://repspractice.vercel.app`

## Step 6: Deploy

Click "Deploy" and wait for the build to complete!

## Troubleshooting

### Authentication Not Working

If authentication doesn't work after deployment:

1. **Check environment variables** are set correctly in Vercel
2. **Verify Supabase redirect URLs** include your Vercel domain
3. **Check browser console** for CORS or cookie errors
4. **Ensure cookies are enabled** - Vercel requires cookies for auth

### Build Failures

If the build fails:

- Check the build logs in Vercel
- Ensure all TypeScript errors are fixed
- Verify all dependencies are in package.json

### API Routes Not Working

If `/api/execute` doesn't work:

- Ensure you have a Judge0 API key configured
- Check environment variables are set
- Review API logs in Vercel dashboard

## Custom Domain (Optional)

If you want a truly custom domain like `reps.io`:

1. Purchase a domain from a registrar (Namecheap, Google Domains, etc.)
2. In Vercel, go to your project → Settings → Domains
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS records
5. Wait for DNS propagation (can take up to 48 hours)

## Continuous Deployment

Once set up, Vercel automatically:

- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Runs builds and tests automatically

## Monitoring

Monitor your deployment:

- **Dashboard**: vercel.com/dashboard
- **Analytics**: View performance and usage
- **Logs**: Real-time function logs and errors
