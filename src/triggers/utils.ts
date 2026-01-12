/**
 * Trigger Utilities
 * Helper functions for trigger pre-processing
 */

import { nanoid } from 'nanoid';
import type { TriggerStatus } from './types.js';

/**
 * Generate a unique trigger ID using nanoid
 * Format: trig_{12-character-nanoid}
 * 
 * @returns Unique trigger ID
 * 
 * @example
 * ```typescript
 * const id = generateTriggerId();
 * // Returns: "trig_abc123xyz789"
 * ```
 */
export function generateTriggerId(): string {
  return `trig_${nanoid(12)}`;
}

/**
 * Extract provider name from tool name
 * Tool names follow the pattern: {provider}_{action}
 * 
 * @param toolName - Full tool name (e.g., "gmail_send_email")
 * @returns Provider name (e.g., "gmail")
 * 
 * @example
 * ```typescript
 * extractProviderFromToolName("gmail_send_email"); // "gmail"
 * extractProviderFromToolName("github_create_issue"); // "github"
 * extractProviderFromToolName("notion_create_page"); // "notion"
 * ```
 */
export function extractProviderFromToolName(toolName: string): string {
  const parts = toolName.split('_');
  return parts[0] || toolName;
}

/**
 * Result of status transition validation
 */
export type StatusTransitionResult = 
  | { valid: true }
  | { valid: false; error: string };

/**
 * Validate status transitions for pause/resume operations
 * 
 * Rules:
 * - Can only pause triggers with status 'active'
 * - Can only resume triggers with status 'paused'
 * 
 * @param currentStatus - Current trigger status
 * @param targetStatus - Desired target status
 * @returns Validation result with error message if invalid
 * 
 * @example
 * ```typescript
 * validateStatusTransition('active', 'paused'); // { valid: true }
 * validateStatusTransition('paused', 'active'); // { valid: true }
 * validateStatusTransition('completed', 'paused'); // { valid: false, error: "..." }
 * ```
 */
export function validateStatusTransition(
  currentStatus: TriggerStatus,
  targetStatus: TriggerStatus
): StatusTransitionResult {
  // Attempting to pause
  if (targetStatus === 'paused' && currentStatus !== 'active') {
    return { 
      valid: false, 
      error: `Cannot pause trigger with status '${currentStatus}'. Only 'active' triggers can be paused.` 
    };
  }
  
  // Attempting to resume (set to active)
  if (targetStatus === 'active' && currentStatus !== 'paused') {
    return { 
      valid: false, 
      error: `Cannot resume trigger with status '${currentStatus}'. Only 'paused' triggers can be resumed.` 
    };
  }
  
  return { valid: true };
}

/**
 * Calculate whether more results are available for pagination
 * 
 * @param offset - Current pagination offset (number of items skipped)
 * @param returnedCount - Number of items returned in current page
 * @param total - Total number of items available
 * @returns True if more results are available
 * 
 * @example
 * ```typescript
 * calculateHasMore(0, 10, 25); // true (showing 0-9 of 25)
 * calculateHasMore(10, 10, 25); // true (showing 10-19 of 25)
 * calculateHasMore(20, 5, 25); // false (showing 20-24 of 25)
 * ```
 */
export function calculateHasMore(
  offset: number,
  returnedCount: number,
  total: number
): boolean {
  return (offset + returnedCount) < total;
}
