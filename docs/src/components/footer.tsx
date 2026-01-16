import Link from 'next/link';
import { ThemeToggle } from './ui/theme-toggle';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-semibold text-zinc-900 dark:text-white">Integrate</p>
            <p className="max-w-xs text-zinc-600 dark:text-zinc-400">
              The fastest gateway to any third party API for AI agents and apps.
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-zinc-900 dark:text-white">Product</p>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-zinc-900 dark:hover:text-white">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-zinc-900 dark:text-white">Developers</p>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/docs/getting-started/quick-start" className="hover:text-zinc-900 dark:hover:text-white">
                  Quick Start
                </Link>
              </li>
              <li>
                <Link href="/docs/reference/api-reference" className="hover:text-zinc-900 dark:hover:text-white">
                  API Reference
                </Link>
              </li>
              <li>
                <a href="https://github.com/integratedotdev/examples" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
                  Examples
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-zinc-900 dark:text-white">Community</p>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="https://github.com/integrate-dev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.gg/7bAnb7CGGm" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/integratedev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Integrate. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
