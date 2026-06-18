"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

type BrandLogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
};

export function BrandLogo({
  size = 28,
  className = "",
  showWordmark = true,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const src =
    resolvedTheme === "dark" ? "/logo-white.png" : "/logo-black.png";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src={src}
        alt="Integrate"
        width={size}
        height={size}
        className="rounded-lg"
        style={{ width: size, height: size }}
      />
      {showWordmark ? (
        <span className="font-semibold tracking-tight">Integrate</span>
      ) : null}
    </span>
  );
}
