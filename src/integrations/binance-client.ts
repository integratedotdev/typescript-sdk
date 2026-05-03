/**
 * Typed Binance integration methods (Spot read-only tools).
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface BinanceIntegrationClient {
  ping(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getServerTime(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getExchangeInfo(params?: { symbol?: string; symbols?: string }): Promise<MCPToolCallResponse>;
  getTickerPrice(params?: { symbol?: string }): Promise<MCPToolCallResponse>;
  getTicker24hr(params?: { symbol?: string; symbols?: string }): Promise<MCPToolCallResponse>;
  getOrderBook(params: { symbol: string; limit?: number }): Promise<MCPToolCallResponse>;
  getRecentTrades(params: { symbol: string; limit?: number }): Promise<MCPToolCallResponse>;
  getKlines(params: {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
  getAccount(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getOpenOrders(params?: { symbol?: string }): Promise<MCPToolCallResponse>;
  getAllOrders(params: {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
  getMyTrades(params: {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    fromId?: number;
    limit?: number;
  }): Promise<MCPToolCallResponse>;
}
