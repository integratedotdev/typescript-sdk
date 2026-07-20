/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface BinanceGetExchangeInfoParams { symbol?: string; symbols?: string }

export interface BinanceGetTickerPriceParams { symbol?: string }

export interface BinanceGetTicker24hrParams { symbol?: string; symbols?: string }

export interface BinanceGetOrderBookParams { symbol: string; limit?: number }

export interface BinanceGetRecentTradesParams { symbol: string; limit?: number }

export interface BinanceGetKlinesParams {
    symbol: string;
    interval: string;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }

export interface BinanceGetOpenOrdersParams { symbol?: string }

export interface BinanceGetAllOrdersParams {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }

export interface BinanceGetMyTradesParams {
    symbol: string;
    orderId?: number;
    startTime?: number;
    endTime?: number;
    fromId?: number;
    limit?: number;
  }

