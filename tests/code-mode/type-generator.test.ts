/**
 * Tests for the Code Mode TypeScript type generator.
 */

import { describe, test, expect } from "bun:test";
import { generateCodeModeTypes } from "../../src/code-mode/type-generator.js";
import type { MCPTool } from "../../src/protocol/messages.js";

const sampleTools: MCPTool[] = [
  {
    name: "github_create_issue",
    description: "Create a new GitHub issue",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "Repo owner" },
        repo: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
        labels: { type: "array", items: { type: "string" } },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "github_list_repos",
    description: "List repos",
    inputSchema: {
      type: "object",
      properties: {
        visibility: { type: "string", enum: ["all", "public", "private"] },
      },
    },
  },
  {
    name: "gmail_send_message",
    description: "Send a Gmail message",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" },
      },
      required: ["to", "subject", "body"],
    },
  },
];

describe("generateCodeModeTypes", () => {
  test("groups tools by integration namespace", () => {
    const result = generateCodeModeTypes(sampleTools);
    expect(result.integrationCounts).toEqual({ github: 2, gmail: 1 });
  });

  test("emits a typed Client interface exposing each integration", () => {
    const { source } = generateCodeModeTypes(sampleTools);
    expect(source).toContain("export interface GithubClient");
    expect(source).toContain("export interface GmailClient");
    expect(source).toContain("export interface Client");
    expect(source).toContain("github: GithubClient");
    expect(source).toContain("gmail: GmailClient");
    expect(source).toContain("export declare const client: Client");
  });

  test("converts snake_case tool names to camelCase methods", () => {
    const { source, methodMap } = generateCodeModeTypes(sampleTools);
    expect(source).toContain("createIssue(");
    expect(source).toContain("listRepos(");
    expect(source).toContain("sendMessage(");
    expect(methodMap["github.createIssue"]).toBe("github_create_issue");
    expect(methodMap["github.listRepos"]).toBe("github_list_repos");
    expect(methodMap["gmail.sendMessage"]).toBe("gmail_send_message");
  });

  test("emits required vs optional args based on schema.required", () => {
    const { source } = generateCodeModeTypes(sampleTools);
    expect(source).toContain("owner: string");
    expect(source).toContain("labels?:");
    // When no fields are required, args parameter itself is optional
    expect(source).toContain("listRepos(args?:");
  });

  test("enum values become a union type literal", () => {
    const { source } = generateCodeModeTypes(sampleTools);
    expect(source).toContain('"all" | "public" | "private"');
  });

  test("arrays of primitives emit T[] syntax", () => {
    const { source } = generateCodeModeTypes(sampleTools);
    expect(source).toContain("string[]");
  });

  test("preserves tool descriptions as JSDoc", () => {
    const { source } = generateCodeModeTypes(sampleTools);
    expect(source).toContain("Create a new GitHub issue");
    expect(source).toContain("Send a Gmail message");
  });

  test("empty tool list still emits a Client interface", () => {
    const { source, integrationCounts } = generateCodeModeTypes([]);
    expect(source).toContain("export interface Client");
    expect(integrationCounts).toEqual({});
  });

  test("unknown schema shapes degrade to unknown without throwing", () => {
    const tools: MCPTool[] = [
      {
        name: "weird_thing",
        description: "Weird",
        inputSchema: {
          type: "object",
          properties: {
            data: { foo: "bar" } as any,
          },
        },
      },
    ];
    const { source } = generateCodeModeTypes(tools);
    expect(source).toContain("data?: unknown");
  });
});
