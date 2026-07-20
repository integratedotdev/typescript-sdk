import Link from "next/link";
import Image from "next/image";

const navLeft = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-dashed border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm">
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-2 text-foreground">
          <Link href="/" className="mr-3 flex items-center gap-2 no-underline">
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
            <span className="font-bold text-foreground">integrate</span>
          </Link>
          {navLeft.map((item, i) => (
            <span key={item.href} className="contents">
              {i > 0 && (
                <span className="text-muted-foreground" aria-hidden>
                  |
                </span>
              )}
              <Link
                href={item.href}
                className="px-1 text-foreground no-underline hover:text-link hover:underline"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
        <nav className="flex shrink-0 items-center gap-x-1 text-foreground">
          <Link
            href="/dashboard/login"
            className="px-1 text-foreground no-underline hover:text-link hover:underline"
          >
            Sign in
          </Link>
          <span className="text-muted-foreground" aria-hidden>
            |
          </span>
          <Link
            href="/dashboard/signup"
            className="px-1 text-link no-underline hover:underline"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
