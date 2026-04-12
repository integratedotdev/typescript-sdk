/**
 * Code Mode public surface
 *
 * Re-exports the pieces needed to build the `execute_code` tool that AI
 * helpers hand to the LLM and the server-side executor that runs that code
 * in a Vercel Sandbox.
 */

export {
  generateCodeModeTypes,
  type GeneratedTypes,
} from "./type-generator.js";

export {
  executeSandboxCode,
  __setSandboxFactoryForTests,
  type ExecuteSandboxCodeOptions,
  type ExecuteSandboxCodeResult,
} from "./executor.js";

export { RUNTIME_STUB_SOURCE } from "./runtime-stub.js";

export {
  buildCodeModeTool,
  canUseCodeMode,
  CODE_MODE_TOOL_NAME,
  TYPES_TOOL_NAME,
  type CodeModeToolOptions,
  type CodeModeToolDefinition,
  type TypesToolDefinition,
  type CodeModeTools,
} from "./tool-builder.js";
