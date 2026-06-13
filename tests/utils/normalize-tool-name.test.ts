import { describe, expect, test } from "bun:test";
import { normalizeToolName } from "../../src/utils/normalize-tool-name.js";

const candidates = ["github", "gmail", "google_calendar"];

describe("normalizeToolName", () => {
  test("resolves alias table", () => {
    expect(normalizeToolName("github_list_repo_contents", candidates)).toBe(
      "github_get_file_contents"
    );
  });

  test("converts integration___method typo to integration_method", () => {
    expect(normalizeToolName("github___list_repos", candidates)).toBe(
      "github_list_repos"
    );
  });

  test("strips prefix for meta-tools with leading underscore suffix", () => {
    expect(normalizeToolName("github____list_tools", candidates)).toBe(
      "___list_tools"
    );
  });

  test("strips duplicate integration prefix", () => {
    expect(normalizeToolName("github_github_list_repos", candidates)).toBe(
      "github_list_repos"
    );
  });
});
