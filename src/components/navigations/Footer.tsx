'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/neurobot')) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <span className="text-2xl font-bold text-white font-display">
                NEUROFIT<span className="text-xs font-mono font-normal text-muted-foreground">2.0</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 sm:max-w-md">
              Personalized fitness planning powered by AI. Find your perfect gym and book your membership with intelligent recommendations.
            </p>
            <p className="text-sm text-white/60 sm:max-w-md">
              Have feedback or questions? We'd love to hear from you!
            </p>
            <p className="text-sm text-white/60">
              Developed by{' '}
              <a
                className="text-white hover:text-white/80 transition-colors underline"
                target="_blank"
                rel="noopener noreferrer"
                href="#"
              >
                Xavier
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white font-mono">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/neurobot" className="text-sm text-white/60 transition-colors hover:text-white">
                    Find Gym
                  </Link>
                </li>
                <li>
                  <Link href="/program" className="text-sm text-white/60 transition-colors hover:text-white">
                    Programs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white font-mono">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Fitness Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Gym Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white font-mono">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/60">© {new Date().getFullYear()} Neurofit. All rights reserved.</p>
            <p className="text-sm text-white/60">Made with passion for fitness</p>
          </div>
        </div>
      </div>
    </footer>
  );
}