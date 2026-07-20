import { getAllDocSlugs, getDocBySlug, slugToHref } from "@/lib/docs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const slugs = await getAllDocSlugs();
  const results: { title: string; href: string; description?: string }[] = [];

  for (const slug of slugs) {
    const doc = await getDocBySlug(slug);
    if (!doc) continue;
    const haystack = `${doc.meta.title ?? ""} ${doc.meta.description ?? ""} ${doc.content}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        title: doc.meta.title ?? slugToHref(slug),
        href: slugToHref(slug),
        description: doc.meta.description,
      });
      if (results.length >= 20) break;
    }
  }

  return NextResponse.json({ results });
}
