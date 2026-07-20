/**
 * Verify that the request is authenticated with the MCP_SERVER_SECRET
 * Used for scheduler endpoints that are called by the MCP server
 */
export function verifySchedulerAuth(request: Request): boolean {
  const apiKey = request.headers.get("X-API-Key");
  const secret = process.env.MCP_SERVER_SECRET;
  return apiKey === secret && !!secret;
}
