/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AlpacaGetPositionParams { symbol: string }

export interface AlpacaListOrdersParams {
    status?: string;
    limit?: number;
    after?: string;
    until?: string;
    direction?: string;
    nested?: boolean;
    symbols?: string;
  }

export interface AlpacaGetOrderParams { order_id: string; nested?: boolean }

export interface AlpacaCreateOrderParams {
    symbol: string;
    side: string;
    type: string;
    time_in_force: string;
    qty?: string;
    notional?: string;
    limit_price?: string;
    stop_price?: string;
    trail_percent?: string;
    trail_price?: string;
    extended_hours?: boolean;
    client_order_id?: string;
  }

export interface AlpacaCancelOrderParams { order_id: string }

export interface AlpacaCancelAllOrdersParams { symbols?: string }

export interface AlpacaGetCalendarParams { start: string; end: string }

export interface AlpacaListAssetsParams { status?: string; asset_class?: string }

export interface AlpacaGetAssetParams { symbol_or_id: string }

export interface AlpacaGetPortfolioHistoryParams {
    period?: string;
    timeframe?: string;
    date_end?: string;
    extended_hours?: boolean;
  }

