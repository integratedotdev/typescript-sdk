/**
 * Node.js OAuth Route Adapter Utilities
 * Provides utility functions for converting Node.js request objects to Web API Request objects
 */

import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';

/**
 * Convert Node.js IncomingHttpHeaders to Web Headers
 * 
 * @param nodeHeaders - Node.js request headers
 * @returns Web API Headers object
 */
export function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers {
  const webHeaders = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => webHeaders.append(key, v));
      } else {
        webHeaders.set(key, value);
      }
    }
  }
  return webHeaders;
}

/**
 * Convert Node.js IncomingMessage to Web Request
 * 
 * @param req - Node.js request object
 * @returns Web API Request object
 */
export async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const protocol = (req.socket as any).encrypted ? 'https' : 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url}`;

  const headers = fromNodeHeaders(req.headers);

  // Get body for POST/PUT/PATCH requests
  let body: string | undefined;
  if (req.method && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }

  return new Request(url, {
    method: req.method,
    headers,
    body: body || undefined,
  });
}

/**
 * Send Web API Response to Node.js ServerResponse
 * 
 * @param webRes - Web API Response object
 * @param nodeRes - Node.js response object
 */
export async function sendWebResponse(webRes: Response, nodeRes: ServerResponse): Promise<void> {
  nodeRes.statusCode = webRes.status;

  webRes.headers.forEach((value, key) => {
    nodeRes.setHeader(key, value);
  });

  const body = await webRes.text();
  nodeRes.end(body);
}

