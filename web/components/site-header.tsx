"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

const navLeft = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
];

function AuthLinks({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    return (
      <Link
        href="/dashboard/home"
        className="px-1 text-link no-underline hover:underline"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
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
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const signedIn = !isPending && !!session?.user;

  return (
    <header className="border-b border-dashed border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm">
        <div className="flex min-w-0 items-center gap-3">
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
            <span className="font-bold text-foreground">integrate</span>
          </Link>

          <nav className="hidden items-center gap-x-1 text-foreground md:flex">
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
        </div>

        <nav className="hidden shrink-0 items-center gap-x-1 text-foreground md:flex">
          <AuthLinks signedIn={signedIn} />
        </nav>

        <button
          type="button"
          className="shrink-0 text-link underline-offset-2 hover:underline md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close menu" : "menu"}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-dashed border-border px-6 py-4 text-sm md:hidden"
        >
          <nav className="flex flex-col gap-3">
            {navLeft.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground no-underline hover:text-link hover:underline"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-x-1 border-t border-dashed border-border pt-3">
              <AuthLinks signedIn={signedIn} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
