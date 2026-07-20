import { getAllDocSlugs, getDocBySlug, slugToHref } from "@/lib/docs";

export async function GET() {
  const slugs = await getAllDocSlugs();
  const parts: string[] = [
    "# integrate.dev full documentation",
    "",
  ];

  for (const slug of slugs.sort((a, b) =>
    slugToHref(a).localeCompare(slugToHref(b)),
  )) {
    const doc = await getDocBySlug(slug);
    if (!doc) continue;
    parts.push(`# ${doc.meta.title ?? slugToHref(slug)}`);
    if (doc.meta.description) parts.push(doc.meta.description);
    parts.push("");
    parts.push(doc.content);
    parts.push("\n---\n");
  }

  return new Response(parts.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
