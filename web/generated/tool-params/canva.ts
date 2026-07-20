/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CanvaListDesignsParams {
    query?: string;
    continuation?: string;
    limit?: number;
    ownership?: string;
    sort_by?: string;
  }

export interface CanvaGetDesignParams { design_id: string }

export interface CanvaGetDesignExportFormatsParams { design_id: string }

export interface CanvaCreateDesignParams {
    title: string;
    preset_name?: string;
    custom_width?: number;
    custom_height?: number;
    asset_id?: string;
  }

export interface CanvaGetFolderParams { folder_id: string }

export interface CanvaListFolderItemsParams {
    folder_id: string;
    continuation?: string;
    limit?: number;
    item_types?: string;
    sort_by?: string;
    pin_status?: string;
  }

export interface CanvaCreateFolderParams { name: string; parent_folder_id: string }

export interface CanvaUpdateFolderParams { folder_id: string; name: string }

export interface CanvaDeleteFolderParams { folder_id: string }

export interface CanvaListBrandTemplatesParams {
    query?: string;
    continuation?: string;
    limit?: number;
    ownership?: string;
    sort_by?: string;
    dataset?: string;
  }

export interface CanvaGetBrandTemplateParams { brand_template_id: string }

export interface CanvaCreateExportJobParams { design_id: string; format: string }

export interface CanvaGetExportJobParams { job_id: string }

