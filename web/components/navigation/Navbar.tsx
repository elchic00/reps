import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  showBackButton?: boolean;
  backHref?: string;
}

export default function Navbar({ showBackButton = false, backHref = '/' }: NavbarProps) {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            )}
            <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              Reps 🎯
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Challenges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
