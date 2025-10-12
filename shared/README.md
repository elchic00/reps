# Shared Code

This directory contains code shared between mobile and web apps.

## Structure

```
shared/
├── types/          # TypeScript interfaces and types
├── constants/      # Shared constants
├── utils/          # Utility functions
└── index.ts        # Barrel export
```

## Usage

### Direct Import (Recommended)

```typescript
// In mobile or web
import { Challenge, Profile } from '../../shared/types';
import { DIFFICULTIES, POINTS } from '../../shared/constants';
import { formatDate, calculateStreak } from '../../shared/utils';
```

### Via Re-exports

```typescript
// mobile/lib/types.ts and web/lib/types.ts re-export shared types
import { Challenge } from '@/lib/types';  // Works in both apps
```

## What Should Go Here?

### ✅ DO Include:
- TypeScript interfaces/types used by both apps
- Constants (difficulties, categories, points)
- Pure utility functions (no platform-specific code)
- Validation functions
- Date/time helpers
- Calculation logic

### ❌ DON'T Include:
- Platform-specific code (React Native, Next.js specific)
- UI components
- API clients (Supabase clients differ between mobile/web)
- Navigation logic
- State management

## Adding New Shared Code

1. Add types to `types/index.ts`
2. Add constants to `constants/index.ts`
3. Add utilities to `utils/index.ts`
4. Both apps will automatically have access via re-exports

## Testing

Shared code should be pure TypeScript with no external dependencies.
This ensures it works in both React Native and Next.js environments.
