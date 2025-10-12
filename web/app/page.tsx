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
