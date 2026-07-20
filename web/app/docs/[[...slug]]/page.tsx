import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc, extractToc } from "@/components/docs-toc";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mdxComponents } from "@/components/mdx-components";
import { getDocBySlug, getDocsNav, slugToHref } from "@/lib/docs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return { title: "Docs" };
  return {
    title: doc.meta.title ?? "Docs",
    description: doc.meta.description,
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug = [] } = await params;
  const [doc, tree] = await Promise.all([
    getDocBySlug(slug),
    getDocsNav(),
  ]);

  if (!doc) notFound();

  const toc = extractToc(doc.content);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 lg:flex-row">
        <DocsSidebar tree={tree} />
        <article className="min-w-0 flex-1">
          <p className="mb-2 text-xs text-muted-foreground">
            <a href={`${slugToHref(slug)}.mdx`} className="text-link">
              View as Markdown
            </a>
          </p>
          {doc.meta.title && (
            <h1 className="mb-2 text-2xl font-bold tracking-tight">
              {doc.meta.title}
            </h1>
          )}
          {doc.meta.description && (
            <p className="mb-8 text-muted-foreground">{doc.meta.description}</p>
          )}
          <div className="docs-prose">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      {
                        theme: {
                          light: "github-light",
                          dark: "github-dark-high-contrast",
                        },
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </article>
        <DocsToc headings={toc} />
      </div>
      <SiteFooter />
    </div>
  );
}
