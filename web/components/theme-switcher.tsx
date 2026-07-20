"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const order = ["system", "light", "dark"] as const;

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = (mounted ? (theme ?? "system") : "system") as
    | (typeof order)[number]
    | string;

  const cycle = () => {
    const current = order.includes(active as (typeof order)[number])
      ? (active as (typeof order)[number])
      : "system";
    const idx = order.indexOf(current);
    setTheme(order[(idx + 1) % order.length]);
  };

  const DisplayIcon =
    !mounted || active === "system"
      ? Monitor
      : active === "dark"
        ? Moon
        : Sun;

  const label =
    active === "system"
      ? "System theme"
      : active === "light"
        ? "Light theme"
        : "Dark theme";

  return (
    <button
      type="button"
      onClick={cycle}
      className={`inline-flex items-center text-muted-foreground hover:text-link ${className ?? ""}`}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
    >
      <DisplayIcon className="size-4" aria-hidden />
    </button>
  );
}
