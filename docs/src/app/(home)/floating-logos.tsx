'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export type LogoItem = {
  name: string;
  logoUrl: string;
};

type FloatingLogosProps = {
  logos: LogoItem[];
};

const positions = [
  { top: '12%', left: '4%', rotate: 0 },
  { top: '18%', left: '16%', rotate: -8 },
  { top: '12%', left: '24%', rotate: 5 },
  { top: '16%', right: '32%', rotate: 0 },
  { top: '10%', right: '16%', rotate: 6 },
  { top: '14%', right: '3%', rotate: -4 },
  { top: '45%', left: '3%', rotate: 3 },
  { top: '55%', left: '12%', rotate: -6 },
  { top: '70%', left: '5%', rotate: 0 },
  { top: '42%', right: '4%', rotate: -5 },
  { top: '58%', right: '14%', rotate: 4 },
  { top: '72%', right: '6%', rotate: 0 },
  { top: '78%', right: '22%', rotate: -3 },
];

export function FloatingLogos({ logos }: FloatingLogosProps) {
  const [mounted, setMounted] = useState(false);
  const [animationDelays, setAnimationDelays] = useState<number[]>([]);

  useEffect(() => {
    const delays = positions.map(() => Math.random() * 0.6);
    setAnimationDelays(delays);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayLogos = logos.slice(0, positions.length);

  return (
    <div className="hidden md:block pointer-events-none absolute inset-0 overflow-hidden">
      {displayLogos.map((logo, index) => {
        const pos = positions[index];
        const delay = animationDelays[index] || 0;

        return (
          <motion.div
            key={logo.name}
            className="absolute"
            style={{
              top: pos.top,
              left: 'left' in pos ? pos.left : undefined,
              right: 'right' in pos ? pos.right : undefined,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
            transition={{
              duration: 0.4,
              delay,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <div className="size-12 md:size-14">
              <img
                src={logo.logoUrl}
                alt={logo.name}
                className="h-full w-full rounded-xl object-contain"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
