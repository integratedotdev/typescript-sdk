import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import Link from "next/link";

export function Callout({
  type = "info",
  children,
  title,
}: {
  type?: "info" | "warn" | "error" | "tip";
  children?: ReactNode;
  title?: string;
}) {
  const label =
    title ??
    ({ info: "Note", warn: "Warning", error: "Error", tip: "Tip" }[type] ??
      "Note");
  return (
    <aside className="mb-4 border border-dashed border-border bg-muted/50 p-4 text-sm">
      <p className="mb-2 font-bold">{label}</p>
      <div className="docs-prose [&>*:last-child]:mb-0">{children}</div>
    </aside>
  );
}

export function Cards({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">{children}</div>
  );
}

export function Card({
  title,
  description,
  href,
  children,
}: {
  title?: string;
  description?: string;
  href?: string;
  children?: ReactNode;
}) {
  const inner = (
    <>
      {title && <p className="font-bold text-foreground">{title}</p>}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </>
  );

  const className =
    "block border border-dashed border-border p-4 no-underline transition-colors hover:bg-muted/40";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

export function Tabs({ children }: { children?: ReactNode }) {
  return <div className="mb-4 space-y-3">{children}</div>;
}

export function Tab({
  value,
  children,
}: {
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-border">
      {value && (
        <div className="border-b border-dashed border-border bg-muted px-3 py-1.5 text-xs font-bold">
          {value}
        </div>
      )}
      <div className="p-3 docs-prose [&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}

export function Files({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-4 border border-dashed border-border p-3 text-sm">
      {children}
    </div>
  );
}

export function File({
  name,
  children,
}: {
  name?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-2">
      {name && <p className="font-bold">{name}</p>}
      {children}
    </div>
  );
}

export function Folder({
  name,
  children,
}: {
  name?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-2 pl-3">
      {name && <p className="font-bold">{name}/</p>}
      <div className="pl-3">{children}</div>
    </div>
  );
}

/** Renders a TypeScript interface/type from a local file as a dashed code block. */
export function AutoTypeTable({
  path: filePath,
  name,
}: {
  path: string;
  name: string;
}) {
  const candidates = [
    path.join(process.cwd(), filePath),
    path.join(process.cwd(), "..", filePath.replace(/^\.\.\//, "")),
    path.join(process.cwd(), filePath.replace(/^\.\.\//, "")),
  ];

  let source = "";
  for (const candidate of candidates) {
    try {
      source = fs.readFileSync(candidate, "utf8");
      break;
    } catch {
      // try next
    }
  }

  if (!source) {
    return (
      <pre className="mb-4 overflow-x-auto border border-dashed border-border bg-muted p-4 text-[13px]">
        <code>{`// ${name} — source not found (${filePath})`}</code>
      </pre>
    );
  }

  const patterns = [
    new RegExp(
      `(export\\s+(?:type|interface)\\s+${name}\\b[\\s\\S]*?(?:;|(?=\\nexport\\s)|$))`,
    ),
    new RegExp(
      `((?:type|interface)\\s+${name}\\b[\\s\\S]*?(?:;|(?=\\n(?:export\\s|type\\s|interface\\s)|$)))`,
    ),
  ];

  let extracted = "";
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match?.[1]) {
      extracted = match[1].trim();
      break;
    }
  }

  if (!extracted) {
    extracted = `// ${name}\n// See ${filePath}`;
  }

  return (
    <pre className="mb-4 overflow-x-auto border border-dashed border-border bg-muted p-4 text-[13px] leading-6">
      <code>{extracted}</code>
    </pre>
  );
}

export const mdxComponents = {
  Callout,
  Cards,
  Card,
  Tabs,
  Tab,
  Files,
  File,
  Folder,
  AutoTypeTable,
  a: ({
    href,
    children,
    ...props
  }: {
    href?: string;
    children?: ReactNode;
  }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};
