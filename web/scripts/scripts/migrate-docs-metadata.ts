/**
 * One-time helper: extract developer portal links from existing integration MDX
 * and print entries suitable for integration-docs-metadata.ts.
 *
 * Usage: bun run scripts/migrate-docs-metadata.ts
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INTEGRATIONS_MDX_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../content/docs/integrations",
);

const LINK_PATTERN =
  /Go to \[([^\]]+)\]\((https?:\/\/[^)]+)\)/;

async function main() {
  const files = (await readdir(INTEGRATIONS_MDX_DIR)).filter((f) =>
    f.endsWith(".mdx"),
  );

  const entries: Record<
    string,
    { developerPortal: { label: string; url: string }; authMode: "oauth" }
  > = {};

  for (const file of files) {
    if (file === "default.mdx") continue;
    const id = file.replace(/\.mdx$/, "");
    const content = await readFile(path.join(INTEGRATIONS_MDX_DIR, file), "utf8");
    const match = content.match(LINK_PATTERN);
    if (!match) continue;
    entries[id] = {
      authMode: "oauth",
      developerPortal: { label: match[1], url: match[2] },
    };
  }

  const sorted = Object.keys(entries).sort();
  console.log("export const MIGRATED_DOCS_METADATA = {");
  for (const id of sorted) {
    const entry = entries[id];
    console.log(`  ${id}: {`);
    console.log(`    authMode: "oauth",`);
    console.log(
      `    developerPortal: { label: ${JSON.stringify(entry.developerPortal.label)}, url: ${JSON.stringify(entry.developerPortal.url)} },`,
    );
    console.log(`  },`);
  }
  console.log("} as const;");
  console.error(`\nExtracted ${sorted.length} developer portal entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
