import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CodeEditorWrapper from '@/components/editor/CodeEditorWrapper';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: challenge, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !challenge) {
    notFound();
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  }[challenge.difficulty as 'easy' | 'medium' | 'hard'] || 'bg-gray-100 text-gray-800';

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
          <CodeEditorWrapper
            challengeId={challenge.id}
            starterCode={challenge.starter_code_python || '# Write your solution here'}
            language="python"
            testCases={challenge.test_cases}
          />
        </div>
      </div>
    </div>
  );
}
