"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { NavNode } from "@/lib/docs";

function pathIsUnder(pathname: string, node: NavNode): boolean {
  if (node.href && (pathname === node.href || pathname.startsWith(`${node.href}/`))) {
    return true;
  }
  return node.children?.some((child) => pathIsUnder(pathname, child)) ?? false;
}

function CollapsibleSection({
  node,
  depth,
}: {
  node: NavNode;
  depth: number;
}) {
  const pathname = usePathname();
  const hasChildren = !!node.children?.length;
  const active = pathIsUnder(pathname, node);
  const [open, setOpen] = useState(active);

  if (!hasChildren) {
    return (
      <li>
        {node.href ? (
          <Link
            href={node.href}
            className={`block text-sm no-underline hover:text-link hover:underline ${
              pathname === node.href
                ? "font-bold text-foreground"
                : "text-foreground"
            }`}
          >
            {node.title}
          </Link>
        ) : (
          <span className="block text-sm font-bold text-foreground">
            {node.title}
          </span>
        )}
      </li>
    );
  }

  return (
    <li>
      <div className="flex items-start gap-1">
        <button
          type="button"
          className="mt-0.5 shrink-0 text-xs text-muted-foreground hover:text-link"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "−" : "+"}
        </button>
        {node.href ? (
          <Link
            href={node.href}
            className="block text-sm font-bold text-foreground no-underline hover:text-link hover:underline"
          >
            {node.title}
          </Link>
        ) : (
          <button
            type="button"
            className="block text-left text-sm font-bold text-foreground hover:text-link"
            onClick={() => setOpen((v) => !v)}
          >
            {node.title}
          </button>
        )}
      </div>
      {open && (
        <ul className="mt-1 space-y-1 border-l border-dashed border-border pl-3">
          {node.children!.map((child) => (
            <CollapsibleSection
              key={child.href ?? child.title}
              node={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DocsSidebar({ tree }: { tree: NavNode[] }) {
  const pathname = usePathname();
  const nodes = useMemo(() => tree, [tree]);

  return (
    <aside className="w-full shrink-0 border-b border-dashed border-border pb-6 lg:w-56 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Docs
      </p>
      <ul className="space-y-2">
        {nodes.map((node) => (
          <CollapsibleSection
            key={node.href ?? node.title}
            node={node}
            depth={0}
          />
        ))}
      </ul>
      {/* keep pathname referenced for future active styles */}
      <span className="sr-only">{pathname}</span>
    </aside>
  );
}
