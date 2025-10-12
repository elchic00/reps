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
