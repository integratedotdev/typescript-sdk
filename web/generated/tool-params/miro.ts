/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface MiroListBoardsParams { limit?: number; cursor?: string }

export interface MiroGetBoardParams { board_id: string }

export interface MiroCreateBoardParams { board_json: string }

export interface MiroListBoardItemsParams { board_id: string; limit?: number; cursor?: string; type?: string }

export interface MiroCreateBoardItemParams { board_id: string; item_json: string }

export interface MiroListCommentsParams { board_id: string; limit?: number; cursor?: string }

export interface MiroListBoardMembersParams { board_id: string }

