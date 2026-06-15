/**
 * Generate integration documentation MDX pages at build time.
 *
 * Usage: bun run scripts/generate-integration-docs.ts
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Project, SyntaxKind } from "ts-morph";
import {
  INTEGRATION_LIBRARY_METADATA,
  type IntegrationCategory,
} from "../../src/integrations/library-metadata.js";
import {
  resolveIntegrationDocsMetadata,
  type IntegrationAuthMode,
} from "../../src/integrations/integration-docs-metadata.js";
import { methodToToolName } from "../../src/utils/naming.js";

const DOCS_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SDK_ROOT = path.resolve(DOCS_ROOT, "..");
const INTEGRATIONS_DIR = path.join(SDK_ROOT, "src/integrations");
const OUTPUT_DIR = path.join(DOCS_ROOT, "content/docs/integrations");
const TOOL_PARAMS_DIR = path.join(DOCS_ROOT, "generated/tool-params");
const META_PATH = path.join(OUTPUT_DIR, "meta.json");

const EXCLUDED_FILES = new Set([
  "types.ts",
  "generic.ts",
  "server-client.ts",
  "integration-summary.ts",
  "library-metadata.ts",
  "integration-docs-metadata.ts",
]);

type ClientMethod = {
  methodName: string;
  toolName: string;
  description: string;
  paramsTypeName: string | null;
  paramsTypeText: string | null;
  exampleParams: string;
};

type IntegrationSpec = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory | undefined;
  camelName: string;
  configTypeName: string | null;
  tools: string[];
  scopes: string[];
  authMode: IntegrationAuthMode;
  authorizationEndpoint?: string;
  envPrefix: string;
  hasOAuth: boolean;
  clientMethods: ClientMethod[];
  clientPath: string | null;
};

function pascalCase(id: string): string {
  return id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function camelCase(id: string): string {
  const pascal = pascalCase(id);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function envPrefixFor(id: string): string {
  return id.toUpperCase();
}

function escapeMdx(text: string): string {
  return text.replace(/\\/g, "\\\\");
}

function firstLine(text: string): string {
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

function toolDescription(toolName: string, method?: ClientMethod): string {
  if (method?.description) return method.description;
  const action = toolName.replace(/^[^_]+_/, "").split("_").join(" ");
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function isEmptyParamsType(typeText: string | null): boolean {
  if (!typeText) return true;
  const normalized = typeText.replace(/\s/g, "");
  return (
    normalized === "Record<string,never>" ||
    normalized === "{}" ||
    normalized === "undefined"
  );
}

function formatParamsExport(name: string, typeText: string): string {
  const trimmed = typeText.trim();
  if (trimmed.startsWith("{")) {
    return `export interface ${name} ${trimmed}`;
  }
  return `export type ${name} = ${trimmed};`;
}

function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function pageTitle(name: string): string {
  return /integration$/i.test(name.trim()) ? name : `${name} Integration`;
}

function buildExampleParams(typeText: string | null): string {
  if (!typeText || isEmptyParamsType(typeText)) return "{}";
  const requiredString = typeText.match(/(\w+)\s*:\s*string(?!\?)/);
  if (requiredString) {
    return `{\n  ${requiredString[1]}: "value",\n}`;
  }
  return "{}";
}

function paramsTypeNameFor(
  integrationName: string,
  methodName: string,
): string {
  return `${integrationName}${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}Params`;
}

function findExportedTypeNames(clientPath: string): Set<string> {
  const project = new Project({
    tsConfigFilePath: path.join(SDK_ROOT, "tsconfig.json"),
  });
  const sourceFile = project.getSourceFile(clientPath);
  if (!sourceFile) return new Set();

  const names = new Set<string>();
  for (const iface of sourceFile.getInterfaces()) {
    const name = iface.getName();
    if (!name.endsWith("IntegrationClient")) {
      names.add(name);
    }
  }
  for (const alias of sourceFile.getTypeAliases()) {
    names.add(alias.getName());
  }
  return names;
}

function referencedTypes(typeText: string, exportedTypes: Set<string>): string[] {
  const refs: string[] = [];
  for (const name of exportedTypes) {
    if (typeText.includes(name)) {
      refs.push(name);
    }
  }
  return refs.sort();
}

function extractStringLiteral(nodeText: string): string | undefined {
  const match = nodeText.match(/^["'`](.+)["'`]$/s);
  return match?.[1];
}

function extractTools(source: string, filePath: string): string[] {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(filePath, source, {
    overwrite: true,
  });
  const tools: string[] = [];

  for (const variable of sourceFile.getVariableDeclarations()) {
    const name = variable.getName();
    if (!name.endsWith("_TOOLS")) continue;
    const initializer = variable.getInitializer();
    if (!initializer || !initializer.isKind(SyntaxKind.AsExpression)) continue;
    const arrayLiteral = initializer.getExpressionIfKind(
      SyntaxKind.ArrayLiteralExpression,
    );
    if (!arrayLiteral) continue;
    for (const element of arrayLiteral.getElements()) {
      const value = extractStringLiteral(element.getText());
      if (value) tools.push(value);
    }
  }

  return tools;
}

function extractScopes(source: string, filePath: string): string[] {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(filePath, source, {
    overwrite: true,
  });
  const scopes: string[] = [];

  for (const variable of sourceFile.getVariableDeclarations()) {
    const name = variable.getName();
    if (!name.endsWith("_SCOPES")) continue;
    const initializer = variable.getInitializer();
    if (!initializer || !initializer.isKind(SyntaxKind.AsExpression)) continue;
    const arrayLiteral = initializer.getExpressionIfKind(
      SyntaxKind.ArrayLiteralExpression,
    );
    if (!arrayLiteral) continue;
    for (const element of arrayLiteral.getElements()) {
      const value = extractStringLiteral(element.getText());
      if (value) scopes.push(value);
    }
  }

  return scopes;
}

function extractConfigTypeName(source: string, filePath: string): string | null {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(filePath, source, {
    overwrite: true,
  });
  const iface = sourceFile.getInterfaces().find(
    (i) =>
      i.getName().endsWith("IntegrationConfig") ||
      i.getName().endsWith("IntegrationOptions"),
  );
  return iface?.getName() ?? null;
}

function extractAuthorizationEndpoint(source: string): string | undefined {
  const match = source.match(
    /authorization_endpoint\s*:\s*["'`]([^"'`]+)["'`]/,
  );
  return match?.[1];
}

function inferAuthMode(source: string): IntegrationAuthMode {
  if (/authType\s*:\s*["'`]apiKey["'`]/.test(source)) {
    return "apiKey";
  }
  if (/authType\s*:\s*["'`]oauth["'`]/.test(source)) {
    return "oauth";
  }
  if (/const\s+oauth\s*:\s*OAuthConfig/.test(source) || /\boauth\s*,/.test(source)) {
    return "oauth";
  }
  if (/getHeaders\s*\(/.test(source)) {
    return "apiKey";
  }
  return "none";
}

function extractReturnMetadata(
  source: string,
  filePath: string,
): { id?: string; name?: string; description?: string; category?: string } {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(filePath, source, {
    overwrite: true,
  });

  const fn = sourceFile
    .getFunctions()
    .find((f) => f.getName()?.endsWith("Integration"));
  if (!fn) return {};

  const returnStmt = fn.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0];
  const expression = returnStmt?.getExpression();
  if (!expression?.isKind(SyntaxKind.ObjectLiteralExpression)) return {};

  const result: { id?: string; name?: string; description?: string; category?: string } =
    {};

  for (const prop of expression.getProperties()) {
    if (!prop.isKind(SyntaxKind.PropertyAssignment)) continue;
    const name = prop.getName();
    const init = prop.getInitializer();
    if (!init) continue;
    const value = extractStringLiteral(init.getText());
    if (!value) continue;
    if (name === "id") result.id = value;
    if (name === "name") result.name = value;
    if (name === "description") result.description = value;
    if (name === "category") result.category = value;
  }

  return result;
}

function extractClientMethods(
  integrationId: string,
  integrationPascal: string,
  clientPath: string,
): ClientMethod[] {
  const project = new Project({
    tsConfigFilePath: path.join(SDK_ROOT, "tsconfig.json"),
  });
  const sourceFile = project.getSourceFile(clientPath);
  if (!sourceFile) return [];

  const iface = sourceFile
    .getInterfaces()
    .find((i) => i.getName().endsWith("IntegrationClient"));
  if (!iface) return [];

  const methods: ClientMethod[] = [];

  for (const method of iface.getMethods()) {
    const methodName = method.getName();
    const toolName = methodToToolName(methodName, integrationId);
    const docs = method.getJsDocs().map((d) => d.getDescription().trim()).filter(Boolean);
    const description = firstLine(docs.join("\n"));

    const params = method.getParameters()[0];
    let paramsTypeText: string | null = null;
    let paramsTypeName: string | null = null;

    if (params) {
      const typeNode = params.getTypeNode();
      if (typeNode) {
        paramsTypeText = typeNode.getText();
        if (!isEmptyParamsType(paramsTypeText)) {
          paramsTypeName = paramsTypeNameFor(integrationPascal, methodName);
        }
      }
    }

    methods.push({
      methodName,
      toolName,
      description,
      paramsTypeName,
      paramsTypeText,
      exampleParams: buildExampleParams(paramsTypeText),
    });
  }

  return methods;
}

async function discoverIntegrations(): Promise<IntegrationSpec[]> {
  const files = (await readdir(INTEGRATIONS_DIR)).filter(
    (file) =>
      file.endsWith(".ts") &&
      !file.endsWith("-client.ts") &&
      !EXCLUDED_FILES.has(file),
  );

  const specs: IntegrationSpec[] = [];

  for (const file of files) {
    const filePath = path.join(INTEGRATIONS_DIR, file);
    const source = await readFile(filePath, "utf8");
    if (!source.includes("Integration")) continue;

    const fnMatch = source.match(/export function (\w+Integration)\s*\(/);
    if (!fnMatch) continue;

    const fileId = file.replace(/\.ts$/, "");
    const returnMeta = extractReturnMetadata(source, filePath);
    const id = returnMeta.id ?? fileId;
    const integrationPascal = pascalCase(id);
    const camelName = camelCase(id);
    const configTypeName = extractConfigTypeName(source, filePath);
    const tools = extractTools(source, filePath);
    const scopes = extractScopes(source, filePath);
    const inferredAuthMode = inferAuthMode(source);
    const authorizationEndpoint = extractAuthorizationEndpoint(source);
    const docsMeta = resolveIntegrationDocsMetadata(id, {
      inferredAuthMode,
      authorizationEndpoint,
    });

    const library = INTEGRATION_LIBRARY_METADATA[id];
    const description =
      returnMeta.description ??
      library?.description ??
      `Manage ${returnMeta.name ?? integrationPascal} through the Integrate MCP server.`;

    const clientPath = path.join(INTEGRATIONS_DIR, `${id}-client.ts`);
    let clientMethods: ClientMethod[] = [];
    let hasClient = false;
    try {
      await readFile(clientPath, "utf8");
      hasClient = true;
      clientMethods = extractClientMethods(id, integrationPascal, clientPath);
    } catch {
      clientMethods = [];
    }

    specs.push({
      id,
      name: returnMeta.name ?? integrationPascal,
      description,
      category: (returnMeta.category as IntegrationCategory | undefined) ??
        library?.category,
      camelName,
      configTypeName,
      tools,
      scopes,
      authMode: docsMeta.authMode,
      authorizationEndpoint,
      envPrefix: envPrefixFor(id),
      hasOAuth: docsMeta.authMode === "oauth",
      clientMethods,
      clientPath: hasClient ? clientPath : null,
    });
  }

  return specs.sort((a, b) => a.id.localeCompare(b.id));
}

async function writeToolParamsFile(
  spec: IntegrationSpec,
  clientPath: string | null,
): Promise<void> {
  const interfaces = spec.clientMethods.filter((m) => m.paramsTypeName && m.paramsTypeText);
  if (interfaces.length === 0) return;

  const exportedTypes = clientPath ? findExportedTypeNames(clientPath) : new Set<string>();
  const importNames = new Set<string>();
  for (const method of interfaces) {
    for (const ref of referencedTypes(method.paramsTypeText!, exportedTypes)) {
      importNames.add(ref);
    }
  }

  const lines = [
    "/** @generated — do not edit. Produced by generate-integration-docs.ts */",
    "",
  ];

  if (importNames.size > 0 && clientPath) {
    const relativeClient = path
      .relative(TOOL_PARAMS_DIR, clientPath)
      .replace(/\\/g, "/")
      .replace(/\.ts$/, ".js");
    lines.push(
      `import type { ${[...importNames].sort().join(", ")} } from "${relativeClient}";`,
      "",
    );
  }

  for (const method of interfaces) {
    lines.push(formatParamsExport(method.paramsTypeName!, method.paramsTypeText!));
    lines.push("");
  }

  const outPath = path.join(TOOL_PARAMS_DIR, `${spec.id}.ts`);
  await writeFile(outPath, `${lines.join("\n")}\n`, "utf8");
}

function renderOAuthSetup(spec: IntegrationSpec, docsMeta: ReturnType<typeof resolveIntegrationDocsMetadata>): string {
  const portal = docsMeta.developerPortal;
  const envId = `${spec.envPrefix}_CLIENT_ID`;
  const envSecret = `${spec.envPrefix}_CLIENT_SECRET`;
  const scopeSnippet =
    spec.scopes.length > 0
      ? `\n      scopes: [${spec.scopes.map((s) => `"${s}"`).join(", ")}], // Optional`
      : "";

  const steps = docsMeta.setupSteps?.length
    ? docsMeta.setupSteps
    : portal
      ? [
          { label: portal.label, url: portal.url },
        ]
      : [];

  const stepLines = steps.length
    ? steps
        .map((step, index) => {
          const label = step.url
            ? `[${step.label}](${step.url})`
            : step.label;
          if (index === 0) {
            return `1. Go to ${label}\n2. Create a new OAuth application\n3. Configure your redirect URI\n4. Note your Client ID and Client Secret`;
          }
          return `${index + 1}. ${label}`;
        })
        .join("\n")
    : `1. Create an OAuth application for ${spec.name}\n2. Configure your redirect URI\n3. Note your Client ID and Client Secret`;

  const notes = docsMeta.setupNotes ? `\n\n${docsMeta.setupNotes}` : "";

  return `### 1. Create ${articleFor(spec.name)} ${spec.name} OAuth App

${stepLines}

### 2. Configure the Integration on Your Server

Add the ${spec.name} integration to your server configuration. The integration automatically reads \`${envId}\` and \`${envSecret}\` from your environment variables:

\`\`\`typescript
import { createMCPServer, ${spec.camelName}Integration } from "integrate-sdk/server";

export const { client: serverClient } = createMCPServer({
  apiKey: process.env.INTEGRATE_API_KEY,
  integrations: [
    ${spec.camelName}Integration({${scopeSnippet}
    }),
  ],
});
\`\`\`

You can override the environment variables by passing explicit values:

\`\`\`typescript
${spec.camelName}Integration({
  clientId: process.env.CUSTOM_${spec.envPrefix}_ID,
  clientSecret: process.env.CUSTOM_${spec.envPrefix}_SECRET,${scopeSnippet}
});
\`\`\`

### 3. Client-Side Usage

The default client automatically includes all integrations. You can use it directly:

\`\`\`typescript
import { client } from "integrate-sdk";

await client.authorize("${spec.id}");
${renderClientExample(spec)}
\`\`\`

If you're using a custom client, add the integration to the integrations array:

\`\`\`typescript
import { createMCPClient, ${spec.camelName}Integration } from "integrate-sdk";

const customClient = createMCPClient({
  integrations: [${spec.camelName}Integration()],
});
\`\`\`${notes}`;
}

function renderApiKeySetup(spec: IntegrationSpec, docsMeta: ReturnType<typeof resolveIntegrationDocsMetadata>): string {
  const envKey = `${spec.envPrefix}_API_KEY`;
  const notes = docsMeta.setupNotes ? `\n\n${docsMeta.setupNotes}` : "";

  return `Add ${spec.name} to your server configuration. Provide credentials via environment variables or integration config:

\`\`\`typescript
import { createMCPServer, ${spec.camelName}Integration } from "integrate-sdk/server";

export const { client: serverClient } = createMCPServer({
  apiKey: process.env.INTEGRATE_API_KEY,
  integrations: [
    ${spec.camelName}Integration({
      // See configuration options below
    }),
  ],
});
\`\`\`

### Client-Side Usage

\`\`\`typescript
import { client } from "integrate-sdk";

${spec.authMode === "apiKey" ? "" : `await client.authorize("${spec.id}");\n`}${renderClientExample(spec)}
\`\`\`

## Environment Variables

- \`${envKey}\` (when supported by this integration)${notes}`;
}

function renderNoAuthSetup(spec: IntegrationSpec): string {
  return `Add ${spec.name} to your server configuration:

\`\`\`typescript
import { createMCPServer, ${spec.camelName}Integration } from "integrate-sdk/server";

export const { client: serverClient } = createMCPServer({
  apiKey: process.env.INTEGRATE_API_KEY,
  integrations: [
    ${spec.camelName}Integration(),
  ],
});
\`\`\`

### Client-Side Usage

\`\`\`typescript
import { client } from "integrate-sdk";

${renderClientExample(spec)}
\`\`\``;
}

function renderClientExample(spec: IntegrationSpec): string {
  const method = spec.clientMethods[0];
  if (!method) {
    return `// Use client.${spec.id} methods after connecting`;
  }
  return `const result = await client.${spec.id}.${method.methodName}(${method.exampleParams});

console.log(result);`;
}

function renderToolsSection(spec: IntegrationSpec): string {
  const methodByTool = new Map(
    spec.clientMethods.map((m) => [m.toolName, m] as const),
  );

  const toolNames = spec.tools.length > 0 ? spec.tools : spec.clientMethods.map((m) => m.toolName);
  if (toolNames.length === 0) {
    return "## Tools\n\nNo tools are registered for this integration.";
  }

  const sections = toolNames.map((toolName) => {
    const method = methodByTool.get(toolName);
    const description = escapeMdx(toolDescription(toolName, method));
    const lines = [`### \`${toolName}\``, "", description];

    if (method?.paramsTypeName) {
      lines.push(
        "",
        "<AutoTypeTable",
        `  path="generated/tool-params/${spec.id}.ts"`,
        `  name="${method.paramsTypeName}"`,
        "/>",
      );
    } else {
      lines.push("", "_No parameters._");
    }

    return lines.join("\n");
  });

  return `## Tools\n\n${sections.join("\n\n")}`;
}

function renderScopesSection(spec: IntegrationSpec): string {
  if (spec.scopes.length === 0) return "";
  const items = spec.scopes.map((scope) => `- \`${scope}\``).join("\n");
  return `\n\n## Default Scopes\n\nThese defaults are applied unless you override \`scopes\` in the integration config:\n\n${items}`;
}

function renderMdx(
  spec: IntegrationSpec,
  docsMeta: ReturnType<typeof resolveIntegrationDocsMetadata>,
): string {
  const intro = `The ${spec.name} integration provides access to ${spec.description.charAt(0).toLowerCase()}${spec.description.slice(1)} through the Integrate MCP server.`;

  let setup = "";
  if (spec.authMode === "oauth") {
    setup = renderOAuthSetup(spec, docsMeta);
  } else if (spec.authMode === "apiKey") {
    setup = renderApiKeySetup(spec, docsMeta);
  } else {
    setup = renderNoAuthSetup(spec);
  }

  const notes =
    spec.category || spec.authMode
      ? `\n\n## Notes\n\n- Category: ${spec.category ?? "Other"}\n- Authentication mode: ${spec.authMode === "apiKey" ? "API key" : spec.authMode === "oauth" ? "OAuth" : "None"}`
      : "";

  const configSection = spec.configTypeName
    ? `## Configuration Options

<AutoTypeTable
  path="../src/integrations/${spec.id}.ts"
  name="${spec.configTypeName}"
/>
`
    : "";

  return `---
title: "${pageTitle(spec.name).replace(/"/g, '\\"')}"
description: "${spec.description.replace(/"/g, '\\"')}"
---

${intro}

## Installation

The ${spec.name} integration is included with the SDK:

\`\`\`typescript
import { ${spec.camelName}Integration } from "integrate-sdk/server";
\`\`\`

## Setup

${setup}

${configSection}${renderScopesSection(spec)}

${renderToolsSection(spec)}${notes}
`;
}

async function main() {
  const specs = await discoverIntegrations();
  const warnings: string[] = [];

  await rm(TOOL_PARAMS_DIR, { recursive: true, force: true });
  await mkdir(TOOL_PARAMS_DIR, { recursive: true });

  const PRESERVED_MDX = new Set(["default.mdx", "index.mdx"]);
  const existing = (await readdir(OUTPUT_DIR)).filter(
    (f) => f.endsWith(".mdx") && !PRESERVED_MDX.has(f),
  );
  for (const file of existing) {
    await rm(path.join(OUTPUT_DIR, file));
  }

  for (const spec of specs) {
    const docsMeta = resolveIntegrationDocsMetadata(spec.id, {
      inferredAuthMode: spec.authMode,
      authorizationEndpoint: spec.authorizationEndpoint,
    });

    if (docsMeta.authMode === "oauth" && !docsMeta.developerPortal) {
      warnings.push(
        `${spec.id}: missing developerPortal metadata (OAuth integration)`,
      );
    }

    await writeToolParamsFile(spec, spec.clientPath);
    const mdx = renderMdx(spec, docsMeta);
    await writeFile(path.join(OUTPUT_DIR, `${spec.id}.mdx`), mdx, "utf8");
  }

  const pages = ["index", "default", ...specs.map((s) => s.id)];
  await writeFile(
    META_PATH,
    `${JSON.stringify({ pages }, null, 2)}\n`,
    "utf8",
  );

  console.log(`Generated ${specs.length} integration docs pages.`);
  if (warnings.length > 0) {
    console.warn(`\nWarnings (${warnings.length}):`);
    for (const warning of warnings.slice(0, 30)) {
      console.warn(`  - ${warning}`);
    }
    if (warnings.length > 30) {
      console.warn(`  ... and ${warnings.length - 30} more`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
