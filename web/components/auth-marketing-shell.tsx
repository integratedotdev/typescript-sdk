import Image from "next/image";
import Link from "next/link";

export function AuthMarketingShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background font-mono text-foreground">
      <header className="border-b border-dashed border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-sm">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image
              src="/logo-black.png"
              alt="integrate"
              width={20}
              height={20}
              className="dark:hidden"
            />
            <Image
              src="/logo-white.png"
              alt="integrate"
              width={20}
              height={20}
              className="hidden dark:block"
            />
            <span className="font-bold">integrate</span>
          </Link>
          <nav className="flex items-center gap-x-1">
            <Link
              href="/docs"
              className="px-1 text-foreground no-underline hover:text-link hover:underline"
            >
              Documentation
            </Link>
            <span className="text-muted-foreground" aria-hidden>
              |
            </span>
            <Link href="/" className="px-1 text-link no-underline hover:underline">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-8 border border-dashed border-border p-6">
          {children}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Tell your agent to run{" "}
          <code className="rounded border border-dashed border-border bg-muted px-1 py-0.5 text-foreground">
            bunx integrate-dev@cli init
          </code>
        </p>
      </main>
    </div>
  );
}
