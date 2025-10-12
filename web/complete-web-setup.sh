#!/bin/bash

# Reps Web App - Complete Setup (Steps 3+)
# Run this from the reps-web directory

set -e

echo "🚀 Completing Reps Web App Setup..."

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the reps-web directory"
    exit 1
fi

# Step 3: Update .env.local with actual credentials
echo "📝 Step 3: Updating .env.local with your credentials..."
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hkubooimyeyhxotozorx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdWJvb2lteWV5aHhvdG96b3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTY4NTQsImV4cCI6MjA3NTgzMjg1NH0.wEetouGnG-FIXko-lkkBuGc2nQBzBPozmncQpiPp_mc

# Judge0 Configuration (RapidAPI)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=ec811ad4edmsh76c8068ddb13de9p18b296jsn039fe97a08c7
EOF

echo "✅ Environment variables configured!"

# Step 4: Install all required dependencies
echo ""
echo "📦 Step 4: Installing dependencies..."
echo "This may take a few minutes..."

npm install @supabase/supabase-js@latest \
    @supabase/ssr@latest \
    @monaco-editor/react@latest \
    monaco-editor@latest \
    axios@latest \
    @heroicons/react@latest

echo "✅ Dependencies installed!"

# Step 5: Add missing shadcn components
echo ""
echo "🎨 Step 5: Adding shadcn/ui components..."

# Check if button component exists
if [ ! -f "components/ui/button.tsx" ]; then
    echo "Adding button component..."
    npx shadcn@latest add button -y
fi

# Badge is already created in setup script, but ensure it exists
if [ ! -f "components/ui/badge.tsx" ]; then
    echo "Adding badge component..."
    npx shadcn@latest add badge -y
fi

# Add card component if missing
if [ ! -f "components/ui/card.tsx" ]; then
    echo "Adding card component..."
    npx shadcn@latest add card -y
fi

echo "✅ UI components added!"

# Step 6: Update next.config.ts for Monaco Editor
echo ""
echo "⚙️  Step 6: Updating Next.js configuration..."
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Fix for Monaco Editor in Next.js
    config.resolve.fallback = {
      fs: false,
      path: false,
      module: false
    };
    return config;
  },
};

export default nextConfig;
EOF

echo "✅ Next.js config updated!"

# Step 7: Ensure lib/types.ts imports from shared
echo ""
echo "📋 Step 7: Verifying shared types integration..."
cat > lib/types.ts << 'EOF'
// Re-export shared types from parent shared directory
export * from '../../shared/types';

// Web-specific type extensions can go here if needed
EOF

echo "✅ Types configured!"

# Step 8: Create a test challenge data script
echo ""
echo "🧪 Step 8: Creating test data insertion script..."
cat > scripts/seed-challenge.sql << 'EOF'
-- Insert a test challenge
-- Run this in your Supabase SQL Editor

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  starter_code_python,
  test_cases,
  hints,
  solution_explanation,
  time_complexity,
  space_complexity,
  points,
  order_index
) VALUES (
  'Two Sum',
  'two-sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
  'easy',
  'arrays',
  'def two_sum(nums, target):
    # Write your solution here
    pass',
  '[
    {
      "input": "[2,7,11,15], 9",
      "expected": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]"
    },
    {
      "input": "[3,2,4], 6",
      "expected": "[1,2]",
      "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]"
    },
    {
      "input": "[3,3], 6",
      "expected": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 6, we return [0, 1]"
    }
  ]'::jsonb,
  '[
    {
      "text": "Try using a hash map to store numbers you''ve seen"
    },
    {
      "text": "For each number, check if target - number exists in your hash map"
    }
  ]'::jsonb,
  'Use a hash map to store each number and its index as you iterate through the array. For each number, check if target - current number exists in the map.',
  'O(n)',
  'O(n)',
  10,
  1
)
RETURNING id;
EOF

mkdir -p scripts
echo "✅ Test data script created at scripts/seed-challenge.sql"

# Step 9: Create a quick start guide
echo ""
echo "📖 Step 9: Creating quick start guide..."
cat > QUICK_START.md << 'EOF'
# Quick Start Guide

## ✅ Setup Complete!

All dependencies are installed and configured.

## 🚀 Next Steps

### 1. Add Test Data to Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hkubooimyeyhxotozorx
2. Navigate to SQL Editor
3. Copy the contents of `scripts/seed-challenge.sql`
4. Run the SQL to insert a test challenge
5. Copy the returned challenge ID

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Test the Challenge Page

Navigate to: http://localhost:3000/challenge/{CHALLENGE_ID}

Replace `{CHALLENGE_ID}` with the ID from step 1.

## 🧪 Testing the Code Editor

1. Try modifying the starter code
2. Click "Run Code"
3. View test results

Example solution for Two Sum:
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

## 📝 Environment Variables

Your `.env.local` has been configured with:
- ✅ Supabase URL and API key
- ✅ Judge0/RapidAPI key

## 🔧 Troubleshooting

### Monaco Editor Issues
If you see "Cannot find module" errors:
```bash
npm install monaco-editor --save-dev
```

### Judge0 Rate Limits
Free tier: 50 requests/day
- Consider caching results
- Implement local testing mode

### Supabase Connection
Test connection:
```bash
curl https://hkubooimyeyhxotozorx.supabase.co/rest/v1/
```

## 📚 What's Next?

1. ✅ Create more challenges in Supabase
2. ✅ Add authentication (login/signup pages)
3. ✅ Implement progress tracking
4. ✅ Add profile page with stats
5. ✅ Build leaderboard

See the main README for full implementation details!
EOF

echo "✅ Quick start guide created!"

# Create a verification script
echo ""
echo "🔍 Creating verification script..."
cat > scripts/verify-setup.js << 'EOF'
#!/usr/bin/env node

// Verification script to check setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Reps Web App Setup...\n');

const checks = [
  { name: 'package.json', path: './package.json' },
  { name: '.env.local', path: './.env.local' },
  { name: 'Supabase client', path: './lib/supabase/client.ts' },
  { name: 'Supabase server', path: './lib/supabase/server.ts' },
  { name: 'Types file', path: './lib/types.ts' },
  { name: 'Judge0 client', path: './lib/judge0/client.ts' },
  { name: 'Code Editor', path: './components/editor/CodeEditor.tsx' },
  { name: 'Execute API', path: './app/api/execute/route.ts' },
  { name: 'Challenge page', path: './app/challenge/[id]/page.tsx' },
  { name: 'Home page', path: './app/page.tsx' },
];

let allGood = true;

checks.forEach(check => {
  const exists = fs.existsSync(check.path);
  const icon = exists ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
  if (!exists) allGood = false;
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ All files present! Setup complete.');
  console.log('\n📝 Next step: npm run dev');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
}
EOF

chmod +x scripts/verify-setup.js

echo ""
echo "======================================================"
echo "✅ Setup Complete!"
echo "======================================================"
echo ""
echo "📋 What was done:"
echo "  1. ✅ Environment variables configured"
echo "  2. ✅ Dependencies installed"
echo "  3. ✅ UI components added"
echo "  4. ✅ Next.js config updated for Monaco"
echo "  5. ✅ Shared types integrated"
echo "  6. ✅ Test data script created"
echo "  7. ✅ Documentation generated"
echo ""
echo "🚀 Next Steps:"
echo "  1. Add test data: Open scripts/seed-challenge.sql in Supabase SQL Editor"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3000"
echo ""
echo "📖 See QUICK_START.md for detailed instructions"
echo ""
echo "🔍 Verify setup: node scripts/verify-setup.js"
echo ""
