import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "content/docs",
);

export type DocMeta = {
  title?: string;
  description?: string;
};

export type DocPage = {
  slug: string[];
  meta: DocMeta;
  content: string;
};

export type NavNode = {
  title: string;
  href?: string;
  children?: NavNode[];
};

function titleFromSlug(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function readMetaPages(dir: string): Promise<string[] | null> {
  try {
    const raw = await fs.readFile(path.join(dir, "meta.json"), "utf8");
    const parsed = JSON.parse(raw) as { pages?: string[] };
    return parsed.pages ?? null;
  } catch {
    return null;
  }
}

async function listEntries(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => !e.name.startsWith(".") && e.name !== "meta.json")
    .map((e) => e.name);
}

export async function getDocBySlug(
  slug: string[],
): Promise<DocPage | null> {
  const candidates = [
    path.join(CONTENT_ROOT, ...slug) + ".mdx",
    path.join(CONTENT_ROOT, ...slug, "index.mdx"),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        meta: {
          title: typeof data.title === "string" ? data.title : undefined,
          description:
            typeof data.description === "string" ? data.description : undefined,
        },
        content,
      };
    } catch {
      // try next candidate
    }
  }
  return null;
}

export async function getAllDocSlugs(): Promise<string[][]> {
  const slugs: string[][] = [];

  async function walk(dir: string, prefix: string[]) {
    const entries = await listEntries(dir);
    for (const name of entries) {
      const full = path.join(dir, name);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await walk(full, [...prefix, name]);
      } else if (name.endsWith(".mdx")) {
        const base = name.replace(/\.mdx$/, "");
        if (base === "index") {
          slugs.push(prefix);
        } else {
          slugs.push([...prefix, base]);
        }
      }
    }
  }

  await walk(CONTENT_ROOT, []);
  return slugs;
}

export async function getDocsNav(): Promise<NavNode[]> {
  async function buildDir(dir: string, prefix: string[]): Promise<NavNode[]> {
    const metaPages = await readMetaPages(dir);
    let names = await listEntries(dir);

    if (metaPages) {
      const ordered: string[] = [];
      for (const page of metaPages) {
        if (page === "...") {
          const rest = names.filter(
            (n) =>
              !metaPages.includes(n.replace(/\.mdx$/, "")) &&
              n !== "index.mdx",
          );
          ordered.push(...rest);
        } else if (
          names.includes(page) ||
          names.includes(`${page}.mdx`) ||
          names.includes(page)
        ) {
          ordered.push(
            names.includes(`${page}.mdx`) ? `${page}.mdx` : page,
          );
        }
      }
      // include anything not listed
      for (const n of names) {
        const key = n.replace(/\.mdx$/, "");
        if (!ordered.includes(n) && !ordered.includes(key)) {
          ordered.push(n);
        }
      }
      names = ordered;
    }

    const nodes: NavNode[] = [];

    for (const name of names) {
      const full = path.join(dir, name);
      try {
        const stat = await fs.stat(full);
        if (stat.isDirectory()) {
          const children = await buildDir(full, [...prefix, name]);
          const indexPath = path.join(full, "index.mdx");
          let hasIndex = false;
          try {
            await fs.access(indexPath);
            hasIndex = true;
          } catch {
            hasIndex = false;
          }
          nodes.push({
            title: titleFromSlug(name),
            href: hasIndex ? `/docs/${[...prefix, name].join("/")}` : undefined,
            children,
          });
        } else if (name.endsWith(".mdx") && name !== "index.mdx") {
          const base = name.replace(/\.mdx$/, "");
          let title = titleFromSlug(base);
          try {
            const raw = await fs.readFile(full, "utf8");
            const { data } = matter(raw);
            if (typeof data.title === "string") title = data.title;
          } catch {
            // keep default
          }
          nodes.push({
            title,
            href: `/docs/${[...prefix, base].join("/")}`,
          });
        } else if (name === "index.mdx" && prefix.length === 0) {
          let title = "Introduction";
          try {
            const raw = await fs.readFile(full, "utf8");
            const { data } = matter(raw);
            if (typeof data.title === "string") title = data.title;
          } catch {
            // keep default
          }
          nodes.push({ title, href: "/docs" });
        }
      } catch {
        // skip missing
      }
    }

    return nodes;
  }

  return buildDir(CONTENT_ROOT, []);
}

export function slugToHref(slug: string[]): string {
  return slug.length === 0 ? "/docs" : `/docs/${slug.join("/")}`;
}
