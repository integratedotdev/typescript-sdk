"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type LogoItem = {
  name: string;
  logoUrl: string;
};

type FloatingLogosProps = {
  logos: LogoItem[];
};

const positions = [
  { top: "12%", left: "4%", rotate: 0 },
  { top: "18%", left: "16%", rotate: -8 },
  { top: "12%", left: "24%", rotate: 5 },
  { top: "16%", right: "32%", rotate: 0 },
  { top: "10%", right: "16%", rotate: 6 },
  { top: "14%", right: "3%", rotate: -4 },
  { top: "45%", left: "3%", rotate: 3 },
  { top: "55%", left: "12%", rotate: -6 },
  { top: "70%", left: "5%", rotate: 0 },
  { top: "42%", right: "4%", rotate: -5 },
  { top: "58%", right: "14%", rotate: 4 },
  { top: "72%", right: "6%", rotate: 0 },
  { top: "78%", right: "22%", rotate: -3 },
];

const SLOT_COUNT = positions.length;
const SWAP_INTERVAL_MS = 2200;

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function pickInitialSlots(logos: LogoItem[]): LogoItem[] {
  return shuffle(logos).slice(0, Math.min(SLOT_COUNT, logos.length));
}

function pickNextLogo(slots: LogoItem[], logos: LogoItem[]): LogoItem | null {
  const used = new Set(slots.map((logo) => logo.name));
  const available = logos.filter((logo) => !used.has(logo.name));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function FloatingLogos({ logos }: FloatingLogosProps) {
  const [mounted, setMounted] = useState(false);
  const [slots, setSlots] = useState<LogoItem[]>([]);
  const [animationDelays, setAnimationDelays] = useState<number[]>([]);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const logosRef = useRef(logos);

  useEffect(() => {
    logosRef.current = logos;
  }, [logos]);

  useEffect(() => {
    if (logos.length === 0) return;

    const delays = positions.map(() => Math.random() * 0.6);
    setAnimationDelays(delays);
    setSlots(pickInitialSlots(logos));
    setMounted(true);
  }, [logos]);

  useEffect(() => {
    if (!mounted) return;
    const timeout = window.setTimeout(() => setInitialAnimationDone(true), 1000);
    return () => window.clearTimeout(timeout);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || logos.length <= SLOT_COUNT) return;

    const interval = window.setInterval(() => {
      setSlots((current) => {
        const pool = logosRef.current;
        if (pool.length <= SLOT_COUNT) return current;

        const slotIndex = Math.floor(Math.random() * current.length);
        const nextLogo = pickNextLogo(current, pool);
        if (!nextLogo) return current;

        const updated = [...current];
        updated[slotIndex] = nextLogo;
        return updated;
      });
    }, SWAP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [mounted, logos.length]);

  if (!mounted || slots.length === 0) return null;

  return (
    <div className="hidden md:block pointer-events-none absolute inset-0 overflow-hidden">
      {slots.map((logo, index) => {
        const pos = positions[index];
        const delay = animationDelays[index] ?? 0;

        return (
          <div
            key={index}
            className="absolute"
            style={{
              top: pos.top,
              left: "left" in pos ? pos.left : undefined,
              right: "right" in pos ? pos.right : undefined,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={logo.name}
                className="size-12 md:size-14"
                initial={{ opacity: 0, scale: 0.5, rotate: pos.rotate }}
                animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
                exit={{ opacity: 0, scale: 0.5, rotate: pos.rotate }}
                transition={{
                  duration: 0.4,
                  delay: initialAnimationDone ? 0 : delay,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
