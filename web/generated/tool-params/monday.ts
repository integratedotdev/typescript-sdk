/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface MondayListBoardsParams { workspace_ids?: string; limit?: number }

export interface MondayGetBoardParams { board_id: string }

export interface MondayListBoardItemsParams { board_id: string; limit?: number }

export interface MondayNextItemsPageParams { cursor: string }

export interface MondayGetItemsParams { item_ids: string }

export interface MondayCreateItemParams {
    board_id: string;
    item_name: string;
    group_id?: string;
    column_values?: string;
  }

export interface MondayUpdateItemColumnsParams {
    board_id: string;
    item_id: string;
    column_values: string;
  }

export interface MondayCreateUpdateParams { item_id: string; body: string }

export interface MondayDeleteItemParams { item_id: string }

