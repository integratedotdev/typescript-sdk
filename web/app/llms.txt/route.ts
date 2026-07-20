import { getAllDocSlugs, getDocBySlug, slugToHref } from "@/lib/docs";

export async function GET() {
  const slugs = await getAllDocSlugs();
  const lines = [
    "# integrate.dev documentation",
    "",
    "> Markdown index for AI agents. Prefer these URLs over scraping HTML.",
    "",
    "## Docs",
    "",
  ];

  for (const slug of slugs.sort((a, b) =>
    slugToHref(a).localeCompare(slugToHref(b)),
  )) {
    const doc = await getDocBySlug(slug);
    const href = slugToHref(slug);
    const title = doc?.meta.title ?? href;
    lines.push(`- [${title}](https://integrate.dev${href}.mdx)`);
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
