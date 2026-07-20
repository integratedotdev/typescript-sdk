import Link from "next/link";
import type { NavNode } from "@/lib/docs";

function NavItems({
  nodes,
  depth = 0,
}: {
  nodes: NavNode[];
  depth?: number;
}) {
  return (
    <ul className={depth === 0 ? "space-y-1" : "mt-1 space-y-1 pl-3"}>
      {nodes.map((node) => (
        <li key={node.href ?? node.title}>
          {node.href ? (
            <Link
              href={node.href}
              className="block text-sm text-foreground no-underline hover:text-link hover:underline"
            >
              {node.title}
            </Link>
          ) : (
            <span className="block text-sm font-bold text-foreground">
              {node.title}
            </span>
          )}
          {node.children && node.children.length > 0 && (
            <NavItems nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function DocsSidebar({ tree }: { tree: NavNode[] }) {
  return (
    <aside className="w-full shrink-0 border-b border-dashed border-border pb-6 lg:w-56 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Docs
      </p>
      <NavItems nodes={tree} />
    </aside>
  );
}
