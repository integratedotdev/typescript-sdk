/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface TableauListSitesParams { tableau_base_url: string }

export interface TableauListWorkbooksParams { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }

export interface TableauGetWorkbookParams { site_id: string; workbook_id: string; tableau_base_url: string }

export interface TableauListViewsParams { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }

export interface TableauListDatasourcesParams { site_id: string; "pageSize"?: number; "pageNumber"?: number; tableau_base_url: string }

export interface TableauRunQueryViewDataParams { site_id: string; view_id: string; "maxAge"?: string; tableau_base_url: string }

