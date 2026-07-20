export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~[\]]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Extract ## / ### headings from MDX source for a right-rail TOC. */
export function extractToc(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const text = match[2]
      .replace(/\{#[^}]+\}/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trim();
    if (!text) continue;

    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    headings.push({ id, text, level });
  }

  return headings;
}

export function DocsToc({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <aside className="hidden w-44 shrink-0 xl:block">
      <div className="sticky top-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1.5 border-l border-dashed border-border text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-muted-foreground no-underline hover:text-link hover:underline ${
                  heading.level === 3 ? "pl-5" : "pl-3"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
