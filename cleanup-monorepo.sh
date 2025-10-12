#!/bin/bash

# Reps Monorepo Cleanup Script
# This removes duplicate mobile app files from root directory after migration

set -e  # Exit on error

echo "🧹 Cleaning up monorepo structure..."
echo ""

# Check if we're in the right directory
if [ ! -d "mobile" ] || [ ! -d "web" ]; then
    echo "❌ Error: mobile/ and web/ directories not found."
    echo "   Make sure you're in the root of the reps repository."
    exit 1
fi

echo "📋 Found directories:"
ls -d */ 2>/dev/null | head -5
echo ""

# Create a backup just in case
echo "💾 Creating backup..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# List of files/directories that should ONLY exist in mobile/, not in root
MOBILE_ONLY_FILES=(
    "app"
    "components"
    "hooks"
    "lib"
    "store"
    "utils"
    "assets"
    "app.json"
    "babel.config.js"
    "tsconfig.json"
    "metro.config.js"
    ".expo"
    ".gitignore"
)

# Backup and remove duplicate files from root
echo "🗑️  Removing duplicate files from root..."
for item in "${MOBILE_ONLY_FILES[@]}"; do
    if [ -e "$item" ]; then
        echo "  - Moving $item to backup (exists in mobile/)"
        mv "$item" "$BACKUP_DIR/" 2>/dev/null || true
    fi
done

# Remove common duplicate files that might exist
echo ""
echo "🗑️  Removing other duplicate files..."
rm -f package-lock.json 2>/dev/null || true
rm -f .env 2>/dev/null || true
rm -f .env.local 2>/dev/null || true
rm -rf node_modules 2>/dev/null || true

echo ""
echo "📁 Keeping these root-level files:"
echo "  ✓ mobile/"
echo "  ✓ web/"
echo "  ✓ shared/ (if exists)"
echo "  ✓ .git/"
echo "  ✓ README.md"
echo "  ✓ package.json (root workspace)"
echo "  ✓ .gitignore (root)"

# Create proper root .gitignore if it doesn't exist or is from mobile
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
!.env.example

# Build outputs
*/dist/
*/build/
*/.next/
out/
*/.expo/
*.tsbuildinfo
.expo-shared/

# Testing
coverage/
*.lcov

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Temporary
*.tmp
*.temp
.cache/

# Backup
backup-*/
EOF

# Create root package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo ""
    echo "📝 Creating root package.json..."
    cat > package.json << 'EOF'
{
  "name": "reps",
  "version": "1.0.0",
  "private": true,
  "description": "Daily coding practice for technical interviews",
  "workspaces": [
    "mobile",
    "web"
  ],
  "scripts": {
    "mobile": "cd mobile && npm start",
    "mobile:ios": "cd mobile && npx expo run:ios",
    "mobile:android": "cd mobile && npx expo run:android",
    "mobile:build": "cd mobile && eas build",
    "web": "cd web && npm run dev",
    "web:build": "cd web && npm run build",
    "web:start": "cd web && npm start",
    "install:all": "npm install && cd mobile && npm install && cd ../web && npm install",
    "clean": "rm -rf node_modules mobile/node_modules web/node_modules",
    "typecheck": "npm run typecheck --workspaces"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/elchic00/reps.git"
  },
  "author": "elchic00",
  "license": "MIT"
}
EOF
fi

# Create shared directory structure if it doesn't exist
if [ ! -d "shared" ]; then
    echo ""
    echo "📁 Creating shared directory..."
    mkdir -p shared/types shared/constants shared/utils
    
    cat > shared/types/index.ts << 'EOF'
// Shared TypeScript types for both mobile and web

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  github_username?: string;
  current_streak: number;
  longest_streak: number;
  total_challenges_solved: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  starter_code_python?: string;
  starter_code_javascript?: string;
  test_cases: TestCase[];
  hints?: Hint[];
  solution_explanation?: string;
  time_complexity?: string;
  space_complexity?: string;
  tags?: string[];
  points: number;
  order_index?: number;
  created_at: string;
}

export interface TestCase {
  input: string;
  expected: string;
  explanation?: string;
}

export interface Hint {
  text: string;
  video_url?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'not_started' | 'attempted' | 'solved';
  code?: string;
  language?: 'python' | 'javascript';
  attempts: number;
  time_spent?: number;
  solved_at?: string;
  created_at: string;
  updated_at: string;
  challenge?: Challenge;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string;
  challenges_solved: number;
  points_earned: number;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  friend?: Profile;
}
EOF

    cat > shared/constants/index.ts << 'EOF'
// Shared constants

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export const POINTS = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

export const CATEGORIES = [
  'arrays',
  'strings',
  'linked-lists',
  'trees',
  'graphs',
  'dynamic-programming',
  'sorting',
  'searching',
  'recursion',
  'hash-tables',
] as const;
EOF

    cat > shared/utils/index.ts << 'EOF'
// Shared utility functions

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateStreak(activities: { date: string }[]): number {
  if (activities.length === 0) return 0;

  // Sort by date descending
  const sorted = activities.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const activity of sorted) {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
EOF

    cat > shared/README.md << 'EOF'
# Shared Code

This directory contains code shared between mobile and web apps.

## Structure

```
shared/
├── types/          # TypeScript interfaces and types
├── constants/      # Shared constants
└── utils/          # Utility functions
```

## Usage

### In Mobile App

```typescript
import { Challenge, Profile } from '../../shared/types';
import { DIFFICULTIES, POINTS } from '../../shared/constants';
import { formatDate, calculateStreak } from '../../shared/utils';
```

### In Web App

```typescript
import { Challenge, Profile } from '../../shared/types';
import { DIFFICULTIES, POINTS } from '../../shared/constants';
import { formatDate, calculateStreak } from '../../shared/utils';
```

## Adding New Shared Code

1. Add types to `types/index.ts`
2. Add constants to `constants/index.ts`
3. Add utilities to `utils/index.ts`
4. Both apps will automatically have access
EOF
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📁 Final structure:"
tree -L 2 -I 'node_modules|.git|.expo|.next' 2>/dev/null || ls -la

echo ""
echo "🔍 Root directory contents:"
ls -la | grep -v "^d.*\.\.$" | grep "^d"

echo ""
echo "💾 Backup created at: $BACKUP_DIR/"
echo "   (You can delete this once you verify everything works)"
echo ""
echo "✅ Next steps:"
echo "1. Review the changes: git status"
echo "2. Test mobile app: npm run mobile"
echo "3. Test web app: npm run web"
echo "4. If everything works, commit:"
echo "   git add ."
echo "   git commit -m 'Clean up monorepo structure'"
echo "   git push origin main"
echo "5. Delete backup folder: rm -rf $BACKUP_DIR"
echo ""
