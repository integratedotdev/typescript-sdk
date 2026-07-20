/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PinterestListBoardsParams { page_size?: number; bookmark?: string }

export interface PinterestGetBoardParams { board_id: string }

export interface PinterestCreatePinParams { pin_json: string }

export interface PinterestGetPinParams { pin_id: string }

export interface PinterestSearchPinsParams { query?: string; ad_account_id?: string; bookmark?: string; page_size?: number }

export interface PinterestListAdAccountsParams { page_size?: number; bookmark?: string }

export interface PinterestListCampaignsParams { ad_account_id: string; page_size?: number; bookmark?: string }

