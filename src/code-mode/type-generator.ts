/**
 * Code Mode: TypeScript type generator
 *
 * Converts enabled MCPTool definitions into a TypeScript API surface
 * (`.d.ts`-style string) grouped by integration namespace. The output is
 * embedded in the `execute_code` tool description so the LLM can write
 * code against a typed `client.<integration>.<method>(...)` API.
 */

import type { MCPTool, ToolInputSchema } from "../protocol/messages.js";
import { toolNameToMethod } from "../utils/naming.js";

export interface GeneratedTypes {
  /** The full TypeScript source to embed in the LLM prompt. */
  source: string;
  /** Compact method listing (no JSDoc, param names only) for the tool description. */
  compact: string;
  /** Map from dotted method path (e.g. `github.createIssue`) to MCP tool name. */
  methodMap: Record<string, string>;
  /** Per-integration tool counts, useful for logging. */
  integrationCounts: Record<string, number>;
  /** Per-integration full type source for on-demand lookup. */
  perIntegration: Record<string, string>;
}

const RESERVED_TS = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for",
  "function", "if", "import", "in", "instanceof", "new", "null", "return", "super",
  "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with",
  "as", "implements", "interface", "let", "package", "private", "protected", "public",
  "static", "yield",
]);

function safeIdent(name: string): string {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) || RESERVED_TS.has(name)) {
    return JSON.stringify(name);
  }
  return name;
}

function integrationFromToolName(toolName: string): string {
  const idx = toolName.indexOf("_");
  return idx === -1 ? toolName : toolName.slice(0, idx);
}

/**
 * Convert a single JSON Schema property node into a TypeScript type literal.
 * Handles the subset actually used by MCP tool schemas: primitives, enums,
 * arrays, objects with `properties`, and `type: "null"`. Unknown shapes
 * degrade to `unknown`.
 */
function jsonSchemaToTs(schema: unknown, indent: string): string {
  if (!schema || typeof schema !== "object") return "unknown";
  const s = schema as Record<string, unknown>;

  if (Array.isArray(s.enum) && s.enum.length > 0) {
    return s.enum
      .map((v) => (typeof v === "string" ? JSON.stringify(v) : typeof v === "number" || typeof v === "boolean" ? String(v) : "unknown"))
      .join(" | ");
  }

  if (Array.isArray(s.type)) {
    return s.type.map((t) => jsonSchemaToTs({ ...s, type: t }, indent)).join(" | ");
  }

  const t = s.type;
  switch (t) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "array": {
      const items = s.items;
      if (Array.isArray(items)) return "unknown[]";
      const inner = jsonSchemaToTs(items, indent);
      return /[|&]/.test(inner) ? `Array<${inner}>` : `${inner}[]`;
    }
    case "object":
      return objectShape(s, indent);
    default:
      if (s.properties && typeof s.properties === "object") return objectShape(s, indent);
      return "unknown";
  }
}

function objectShape(schema: Record<string, unknown>, indent: string): string {
  const props = (schema.properties && typeof schema.properties === "object"
    ? (schema.properties as Record<string, unknown>)
    : {});
  const keys = Object.keys(props);
  if (keys.length === 0) {
    return schema.additionalProperties === false ? "Record<string, never>" : "Record<string, unknown>";
  }
  const required = new Set(Array.isArray(schema.required) ? (schema.required as string[]) : []);
  const inner = indent + "  ";
  const lines: string[] = ["{"];
  for (const key of keys) {
    const prop = props[key] as Record<string, unknown> | undefined;
    const desc = prop && typeof prop.description === "string" ? prop.description : undefined;
    if (desc) lines.push(`${inner}/** ${desc.replace(/\*\//g, "*\\/")} */`);
    const optional = required.has(key) ? "" : "?";
    const type = jsonSchemaToTs(prop, inner);
    lines.push(`${inner}${safeIdent(key)}${optional}: ${type};`);
  }
  lines.push(`${indent}}`);
  return lines.join("\n");
}

function argsType(schema: ToolInputSchema | undefined): string {
  if (!schema) return "Record<string, unknown>";
  const hasProps = schema.properties && Object.keys(schema.properties).length > 0;
  if (!hasProps) return "Record<string, unknown>";
  return objectShape(schema as unknown as Record<string, unknown>, "  ");
}

function methodHasRequiredArgs(schema: ToolInputSchema | undefined): boolean {
  if (!schema || !schema.properties) return false;
  const req = Array.isArray(schema.required) ? schema.required : [];
  return req.length > 0;
}

function formatDescription(desc: string | undefined, indent: string): string {
  if (!desc) return "";
  const cleaned = desc.replace(/\*\//g, "*\\/").trim();
  if (!cleaned.includes("\n")) return `${indent}/** ${cleaned} */\n`;
  const lines = cleaned.split("\n").map((l) => `${indent} * ${l}`).join("\n");
  return `${indent}/**\n${lines}\n${indent} */\n`;
}

/**
 * Build the TypeScript API surface from a set of enabled MCP tools.
 */
export function generateCodeModeTypes(tools: MCPTool[]): GeneratedTypes {
  const byIntegration: Record<string, MCPTool[]> = {};
  for (const tool of tools) {
    const integration = integrationFromToolName(tool.name);
    (byIntegration[integration] ??= []).push(tool);
  }

  const methodMap: Record<string, string> = {};
  const integrationCounts: Record<string, number> = {};
  const sections: string[] = [];
  const compactLines: string[] = [];
  const perIntegration: Record<string, string> = {};

  const integrationIds = Object.keys(byIntegration).sort();

  sections.push("/**");
  sections.push(" * Integrate SDK — available APIs inside `execute_code`.");
  sections.push(" * Every method is async and returns the MCP tool-call response.");
  sections.push(" * Call them via the exported `client` object, e.g.");
  sections.push(" *   const repos = await client.github.listRepos();");
  sections.push(" */");
  sections.push("");

  for (const integrationId of integrationIds) {
    const integrationTools = byIntegration[integrationId]!.slice().sort((a, b) => a.name.localeCompare(b.name));
    integrationCounts[integrationId] = integrationTools.length;

    const interfaceName = pascalCase(integrationId) + "Client";

    // --- Full types (for per-integration on-demand lookup) ---
    const fullSections: string[] = [];
    fullSections.push(`export interface ${interfaceName} {`);
    sections.push(`export interface ${interfaceName} {`);

    // --- Compact method signatures ---
    const compactMethods: string[] = [];

    for (const tool of integrationTools) {
      const methodName = toolNameToMethod(tool.name);
      methodMap[`${integrationId}.${methodName}`] = tool.name;

      // Full version (with JSDoc + detailed types)
      const fullDesc = formatDescription(tool.description, "  ");
      fullSections.push(fullDesc);
      sections.push(fullDesc);
      const argType = argsType(tool.inputSchema);
      const argIsOptional = !methodHasRequiredArgs(tool.inputSchema);
      const paramName = argIsOptional ? "args?" : "args";
      const fullLine = `  ${safeIdent(methodName)}(${paramName}: ${argType}): Promise<ToolResult>;`;
      fullSections.push(fullLine);
      sections.push(fullLine);

      // Compact version (param names only, no types, no JSDoc)
      const compactArgs = compactArgsSignature(tool.inputSchema);
      const compactParam = argIsOptional ? `args?: ${compactArgs}` : `args: ${compactArgs}`;
      compactMethods.push(`  ${safeIdent(methodName)}(${compactParam}): Promise<ToolResult>`);
    }
    sections.push("}");
    sections.push("");
    fullSections.push("}");

    // Store per-integration full types
    perIntegration[integrationId] = fullSections.join("\n");

    // Add to compact output
    compactLines.push(`client.${integrationId}:`);
    for (const m of compactMethods) {
      compactLines.push(m);
    }
  }

  sections.push("export interface ToolResult {");
  sections.push("  content: Array<{ type: 'text' | 'image' | 'resource'; text?: string; data?: string; mimeType?: string; [key: string]: unknown }>;");
  sections.push("  isError?: boolean;");
  sections.push("  structuredContent?: Record<string, unknown>;");
  sections.push("}");
  sections.push("");

  sections.push("export interface Client {");
  for (const integrationId of integrationIds) {
    const interfaceName = pascalCase(integrationId) + "Client";
    sections.push(`  ${safeIdent(integrationId)}: ${interfaceName};`);
  }
  sections.push("}");
  sections.push("");
  sections.push("export declare const client: Client;");

  return {
    source: sections.filter((line, idx, arr) => !(line === "" && arr[idx - 1] === "")).join("\n"),
    compact: compactLines.join("\n"),
    methodMap,
    integrationCounts,
    perIntegration,
  };
}

/**
 * Build a compact args signature showing only parameter names (no types, no descriptions).
 * e.g. `{ owner, repo, title, body?, labels? }`
 */
function compactArgsSignature(schema: ToolInputSchema | undefined): string {
  if (!schema || !schema.properties || Object.keys(schema.properties).length === 0) {
    return "{}";
  }
  const required = new Set(Array.isArray(schema.required) ? (schema.required as string[]) : []);
  const params = Object.keys(schema.properties).map(
    (key) => `${safeIdent(key)}${required.has(key) ? "" : "?"}`
  );
  return `{ ${params.join(", ")} }`;
}

function pascalCase(id: string): string {
  return id
    .split(/[^A-Za-z0-9]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("") || "Unknown";
}
