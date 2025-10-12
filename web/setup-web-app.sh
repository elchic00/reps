#!/bin/bash

# Reps Web App - Phase 2 Setup Script
# This script creates all necessary files and directories for the web app

set -e  # Exit on error

echo "🚀 Setting up Reps Web App - Phase 2..."

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the reps-web directory"
    exit 1
fi

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p lib/supabase
mkdir -p lib/judge0
mkdir -p components/editor
mkdir -p app/api/execute
mkdir -p app/challenge/[id]
mkdir -p hooks

# Create .env.local template
echo "📝 Creating .env.local template..."
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Judge0 Configuration (RapidAPI)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
EOF

echo "⚠️  Don't forget to update .env.local with your actual keys!"

# Create Supabase client for browser
echo "📝 Creating Supabase client (browser)..."
cat > lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF

# Create Supabase client for server
echo "📝 Creating Supabase client (server)..."
cat > lib/supabase/server.ts << 'EOF'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
EOF

# Create types file
echo "📝 Creating types..."
cat > lib/types.ts << 'EOF'
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
EOF

# Create Judge0 client
echo "📝 Creating Judge0 client..."
cat > lib/judge0/client.ts << 'EOF'
import axios from 'axios';

const JUDGE0_API = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

// Language IDs for Judge0
export const LANGUAGES = {
  python: 71,  // Python 3
  javascript: 63, // JavaScript (Node.js)
};

export interface ExecutionResult {
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time: string;
  memory: number;
}

export async function executeCode(
  code: string,
  language: 'python' | 'javascript',
  testCases: { input: string; expected: string }[]
) {
  try {
    // Submit code for execution
    const submissions = await Promise.all(
      testCases.map(async (testCase) => {
        const response = await axios.post(
          `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
          {
            source_code: code,
            language_id: LANGUAGES[language],
            stdin: testCase.input,
            expected_output: testCase.expected,
          },
          {
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': JUDGE0_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        return {
          ...response.data,
          input: testCase.input,
          expected: testCase.expected,
        };
      })
    );

    return submissions;
  } catch (error: any) {
    console.error('Judge0 error:', error.response?.data || error.message);
    throw error;
  }
}
EOF

# Create API route for code execution
echo "📝 Creating API route for code execution..."
cat > app/api/execute/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { executeCode } from '@/lib/judge0/client';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json();

    if (!code || !language || !testCases) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submissions = await executeCode(code, language, testCases);

    const results = submissions.map((sub: any) => ({
      passed: sub.status.id === 3, // Status 3 = Accepted
      input: sub.input,
      expected: sub.expected,
      actual: sub.stdout?.trim(),
      error: sub.stderr || sub.compile_output,
      time: sub.time,
      memory: sub.memory,
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Execute error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code', details: error.message },
      { status: 500 }
    );
  }
}
EOF

# Create CodeEditor component
echo "📝 Creating CodeEditor component..."
cat > components/editor/CodeEditor.tsx << 'EOF'
'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual?: string;
  error?: string;
  time?: string;
  memory?: number;
}

interface CodeEditorProps {
  challengeId: string;
  starterCode: string;
  language: 'python' | 'javascript';
  testCases: { input: string; expected: string }[];
  onSuccess?: () => void;
}

export default function CodeEditor({
  challengeId,
  starterCode,
  language,
  testCases,
  onSuccess,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute code');
      }

      const results = await response.json();
      setTestResults(results);

      // Check if all tests passed
      const allPassed = results.every((r: TestResult) => r.passed);
      if (allPassed && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error running code:', error);
      alert('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border rounded-lg overflow-hidden min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>

      <div className="mt-4">
        <Button
          onClick={handleRunCode}
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>Running Tests...</>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 mr-2" />
              Run Code
            </>
          )}
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-lg">Test Results:</h3>
          {testResults.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                {result.passed ? (
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    Test Case {index + 1}: {result.passed ? 'Passed ✓' : 'Failed ✗'}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Input:</span> {result.input}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Expected:</span> {result.expected}
                    </p>
                    {!result.passed && result.actual && (
                      <p className="text-red-600">
                        <span className="font-medium">Got:</span> {result.actual}
                      </p>
                    )}
                    {result.error && (
                      <p className="text-red-600">
                        <span className="font-medium">Error:</span> {result.error}
                      </p>
                    )}
                    {result.time && (
                      <p className="text-gray-500">
                        <span className="font-medium">Time:</span> {result.time}s
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {testResults.every(r => r.passed) && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 All tests passed! Great job!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
EOF

# Create challenge page
echo "📝 Creating challenge page..."
cat > app/challenge/[id]/page.tsx << 'EOF'
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CodeEditor from '@/components/editor/CodeEditor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: challenge, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !challenge) {
    notFound();
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  }[challenge.difficulty];

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left: Problem Description */}
        <div className="space-y-6 overflow-y-auto max-h-screen pb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {challenge.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge className={difficultyColor}>
                {challenge.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline">{challenge.category}</Badge>
              <Badge variant="outline">{challenge.points} points</Badge>
            </div>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Examples</h2>
            <div className="space-y-4">
              {challenge.test_cases.slice(0, 2).map((tc: any, i: number) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-mono text-sm">
                    <span className="font-semibold">Input:</span> {tc.input}
                  </p>
                  <p className="font-mono text-sm">
                    <span className="font-semibold">Output:</span> {tc.expected}
                  </p>
                  {tc.explanation && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Explanation:</span> {tc.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {challenge.hints && challenge.hints.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">💡 Hints</h2>
              <ul className="space-y-2">
                {challenge.hints.map((hint: any, i: number) => (
                  <li key={i} className="text-gray-700">
                    <span className="font-semibold">{i + 1}.</span> {hint.text}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(challenge.time_complexity || challenge.space_complexity) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">Constraints</h2>
              {challenge.time_complexity && (
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Time Complexity:</span>{' '}
                  {challenge.time_complexity}
                </p>
              )}
              {challenge.space_complexity && (
                <p className="text-gray-700">
                  <span className="font-semibold">Space Complexity:</span>{' '}
                  {challenge.space_complexity}
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Right: Code Editor */}
        <div className="lg:sticky lg:top-4 lg:h-screen lg:pb-8">
          <CodeEditor
            challengeId={challenge.id}
            starterCode={challenge.starter_code_python || '# Write your solution here'}
            language="python"
            testCases={challenge.test_cases}
            onSuccess={() => {
              // TODO: Update user_challenges table
              console.log('Challenge completed!');
            }}
          />
        </div>
      </div>
    </div>
  );
}
EOF

# Create home page placeholder
echo "📝 Creating home page..."
cat > app/page.tsx << 'EOF'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();

  const { data: challenges } = await supabase
    .from('challenges')
    .select('id, title, difficulty, category, points')
    .order('order_index', { ascending: true })
    .limit(5);

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to Reps 🎯</h1>
          <p className="text-xl text-gray-600">
            Daily coding practice for technical interviews
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Challenges</h2>
          {challenges?.map((challenge) => (
            <Card key={challenge.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                  <div className="flex gap-2">
                    <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                      {challenge.difficulty}
                    </span>
                    <span className="text-sm px-2 py-1 bg-blue-100 rounded">
                      {challenge.category}
                    </span>
                  </div>
                </div>
                <Link href={`/challenge/${challenge.id}`}>
                  <Button>Start Challenge</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
EOF

# Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Environment variables
.env.local
.env

# Judge0
judge0/
EOF

# Create installation instructions
echo "📝 Creating installation instructions..."
cat > SETUP_INSTRUCTIONS.md << 'EOF'
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
EOF

echo ""
echo "✅ Setup complete! All files created."
echo ""
echo "📋 Next steps:"
echo "1. Install dependencies: npm install @supabase/supabase-js @supabase/ssr @monaco-editor/react monaco-editor axios @heroicons/react"
echo "2. Update .env.local with your Supabase and Judge0 credentials"
echo "3. Add missing shadcn component: npx shadcn@latest add badge"
echo "4. Run: npm run dev"
echo ""
echo "📖 See SETUP_INSTRUCTIONS.md for detailed next steps"
echo ""
