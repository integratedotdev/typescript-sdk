/**
 * Concurrency Control Utilities
 * Utilities for controlling parallel execution with limits
 */

/**
 * Execute an array of async functions with a concurrency limit
 * Similar to p-map but simplified for our use case
 * 
 * @param items - Array of items to process
 * @param fn - Async function to execute for each item
 * @param limit - Maximum number of concurrent executions (default: 3)
 * @returns Promise that resolves to array of results
 * 
 * @example
 * ```typescript
 * const results = await parallelWithLimit(
 *   ['a', 'b', 'c', 'd', 'e'],
 *   async (item) => fetchData(item),
 *   2 // Only 2 concurrent requests at a time
 * );
 * ```
 */
export async function parallelWithLimit<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit: number = 3
): Promise<R[]> {
  const results: R[] = [];
  const executing: Array<Promise<void>> = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!; // Non-null assertion since we're iterating with index
    const index = i;

    // Create promise for this item
    const promise = fn(item)
      .then(result => {
        results[index] = result;
      })
      .catch(() => {
        // Store undefined on error to maintain array order
        results[index] = undefined as R;
      });

    // Add to executing list
    executing.push(promise);

    // When we hit the limit, wait for one to complete and remove it
    if (executing.length >= limit) {
      const completedIndex = await Promise.race(
        executing.map((p, idx) => p.then(() => idx).catch(() => idx))
      );
      executing.splice(completedIndex, 1);
    }
  }

  // Wait for all remaining promises
  await Promise.all(executing);

  return results;
}
