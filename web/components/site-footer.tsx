import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-dashed border-border">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="font-bold">integrate</p>
          <p className="max-w-xs text-muted-foreground">
            The fastest gateway to any third-party API for AI agents and apps.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-bold">Product</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/docs">Documentation</Link>
            </li>
            <li>
              <Link href="/integrations">Integrations</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-bold">Developers</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/docs/getting-started/installation">Quick start</Link>
            </li>
            <li>
              <Link href="/docs/reference/options">API reference</Link>
            </li>
            <li>
              <a
                href="https://github.com/integratedotdev/typescript-sdk"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-bold">Community</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <a
                href="https://discord.gg/7bAnb7CGGm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/integratedev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-5xl border-t border-dashed border-border px-6 py-6 text-sm text-muted-foreground">
        © 2026 Integrate. All rights reserved.
      </div>
    </footer>
  );
}
