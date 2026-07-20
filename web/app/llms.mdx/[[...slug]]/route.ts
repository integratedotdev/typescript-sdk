import { getDocBySlug } from "@/lib/docs";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function GET(_req: Request, { params }: Props) {
  const { slug = [] } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();

  const frontmatter = [
    "---",
    doc.meta.title ? `title: ${JSON.stringify(doc.meta.title)}` : null,
    doc.meta.description
      ? `description: ${JSON.stringify(doc.meta.description)}`
      : null,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(frontmatter + doc.content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
