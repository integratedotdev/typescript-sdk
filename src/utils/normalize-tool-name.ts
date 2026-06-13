/**
 * Known hallucinated tool names → real MCP tool names.
 * Extend as discovered in production apps.
 */
export const TOOL_ALIASES: Record<string, string> = {
  github_list_repo_contents: "github_get_file_contents",
  gdrive_list: "gdrive_list_files",
  gdrive_get: "gdrive_get_file",
  gdrive_delete: "gdrive_delete_file",
  gdrive_trash: "gdrive_trash_file",
  gdrive_upload: "gdrive_upload_text_file",
  gdrive_download: "gdrive_download_file",
  slack_send: "slack_send_message",
  gmail_send: "gmail_send_email",
  notion_create_page: "notion_create_page",
};

/**
 * Normalize common client-side tool name mistakes before forwarding to mcp.integrate.dev:
 * 1. Alias table for known hallucinated names
 * 2. `integration___method` → `integration_method` (triple-underscore typo)
 * 3. Meta-tools: `integration___list_tools` → `___list_tools` when suffix starts with `_`
 * 4. Strip duplicate integration prefix: `github_github_X` → `github_X`
 */
export function normalizeToolName(
  toolName: string,
  integrationCandidates: string[] = []
): string {
  if (TOOL_ALIASES[toolName]) {
    return TOOL_ALIASES[toolName];
  }

  const tripleIdx = toolName.indexOf("___");
  if (tripleIdx > 0) {
    const prefix = toolName.slice(0, tripleIdx);
    const suffix = toolName.slice(tripleIdx + 3);
    if (integrationCandidates.some((c) => c === prefix)) {
      // Meta-tools: integration + ___ + _meta_name → ___meta_name
      if (suffix.startsWith("_")) {
        return `___${suffix.slice(1)}`;
      }
      return `${prefix}_${suffix}`;
    }
  }

  for (const candidate of integrationCandidates) {
    const doublePrefix = `${candidate}_${candidate}_`;
    if (toolName.startsWith(doublePrefix)) {
      return `${candidate}_${toolName.slice(doublePrefix.length)}`;
    }
  }

  const firstUnderscore = toolName.indexOf("_");
  if (firstUnderscore > 0) {
    const prefix = toolName.slice(0, firstUnderscore);
    const rest = toolName.slice(firstUnderscore + 1);
    if (
      integrationCandidates.includes(prefix) &&
      rest.startsWith(`${prefix}_`)
    ) {
      return `${prefix}_${rest.slice(prefix.length + 1)}`;
    }
  }

  return toolName;
}
