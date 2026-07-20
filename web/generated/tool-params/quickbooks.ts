/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface QuickbooksGetCompanyInfoParams { company_id: string; minorversion?: number }

export interface QuickbooksQueryParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksListCustomersParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksGetCustomerParams { company_id: string; customer_id: string; minorversion?: number }

export interface QuickbooksCreateCustomerParams { company_id: string; customer_json: string; minorversion?: number }

export interface QuickbooksListVendorsParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksCreateVendorParams { company_id: string; vendor_json: string; minorversion?: number }

export interface QuickbooksListItemsParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksCreateItemParams { company_id: string; item_json: string; minorversion?: number }

export interface QuickbooksListAccountsParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksListInvoicesParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksGetInvoiceParams { company_id: string; invoice_id: string; minorversion?: number }

export interface QuickbooksCreateInvoiceParams { company_id: string; invoice_json: string; minorversion?: number }

export interface QuickbooksListBillsParams { company_id: string; query: string; minorversion?: number }

export interface QuickbooksCreateBillParams { company_id: string; bill_json: string; minorversion?: number }

export interface QuickbooksCreatePaymentParams { company_id: string; payment_json: string; minorversion?: number }

export interface QuickbooksGetReportParams { company_id: string; report_name: string; start_date?: string; end_date?: string; accounting_method?: string; minorversion?: number }

