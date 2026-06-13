#!/usr/bin/env bun
/**
 * Download integration logos for review (temp folder, not uploaded to blob).
 */
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { $ } from "bun";

const DIR = import.meta.dir;
const TMP = join(DIR, ".tmp");

const LOGOS: Array<{ name: string; simpleIcon?: string; site?: string }> = [
  { name: "alpaca", site: "alpaca.markets" },
  { name: "astronomer", site: "astronomer.io" },
  { name: "auth0", simpleIcon: "auth0" },
  { name: "aws", simpleIcon: "amazonaws" },
  { name: "betterstack", site: "betterstack.com" },
  { name: "binance", simpleIcon: "binance" },
  { name: "clerk", simpleIcon: "clerk" },
  { name: "convex", simpleIcon: "convex" },
  { name: "etoro", site: "etoro.com" },
  { name: "granola", site: "granola.ai" },
  { name: "mercury", site: "mercury.com" },
  { name: "neon", simpleIcon: "neondatabase" },
  { name: "phantom", simpleIcon: "phantom" },
  { name: "postman", simpleIcon: "postman" },
  { name: "redis", simpleIcon: "redis" },
  { name: "resend", simpleIcon: "resend" },
  { name: "tldraw", simpleIcon: "tldraw" },
  { name: "trello", simpleIcon: "trello" },
  { name: "wix", simpleIcon: "wix" },
  { name: "workos", simpleIcon: "workos" },
];

async function fetchBytes(url: string, timeoutMs = 12_000): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > 0 ? buf : null;
  } catch {
    return null;
  }
}

async function svgToPng(svgPath: string, pngPath: string): Promise<boolean> {
  try {
    await $`qlmanage -t -s 512 -o ${dirname(svgPath)} ${svgPath}`.quiet();
    const generated = `${svgPath}.png`;
    await Bun.write(pngPath, Bun.file(generated));
    await unlink(generated).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

async function fromSimpleIcon(slug: string, pngPath: string): Promise<boolean> {
  const svg = await fetchBytes(`https://cdn.simpleicons.org/${slug}`);
  if (!svg) return false;
  const raw = join(TMP, `${slug}.svg`);
  await writeFile(raw, svg);
  const ok = await svgToPng(raw, pngPath);
  await unlink(raw).catch(() => {});
  return ok;
}

async function fromSite(domain: string, pngPath: string): Promise<boolean> {
  const urls = [
    `https://${domain}/apple-touch-icon.png`,
    `https://www.${domain}/apple-touch-icon.png`,
    `https://${domain}/favicon-32x32.png`,
    `https://www.${domain}/favicon-32x32.png`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
  ];
  for (const url of urls) {
    const buf = await fetchBytes(url);
    if (!buf) continue;
    const raw = join(TMP, "site.bin");
    await writeFile(raw, buf);
    const type = await $`file -b ${raw}`.text();
    if (type.includes("SVG")) {
      const svg = join(TMP, "site.svg");
      await writeFile(svg, buf);
      if (await svgToPng(svg, pngPath)) {
        await unlink(svg).catch(() => {});
        await unlink(raw).catch(() => {});
        return true;
      }
    } else if (/PNG|JPEG|image/i.test(type)) {
      await $`sips -s format png ${raw} --out ${pngPath}`.quiet();
      await unlink(raw).catch(() => {});
      return true;
    }
    await unlink(raw).catch(() => {});
  }
  return false;
}

await mkdir(TMP, { recursive: true });
const failed: string[] = [];

for (const logo of LOGOS) {
  process.stdout.write(`→ ${logo.name} `);
  const pngPath = join(DIR, `${logo.name}.png`);
  let ok = false;
  if (logo.simpleIcon) ok = await fromSimpleIcon(logo.simpleIcon, pngPath);
  if (!ok && logo.site) ok = await fromSite(logo.site, pngPath);
  if (ok) console.log("✓");
  else {
    console.log("✗");
    failed.push(logo.name);
  }
}

console.log(failed.length ? `\nManual review needed: ${failed.join(", ")}` : "\nAll logos downloaded.");
console.log(`Output: ${DIR}`);
