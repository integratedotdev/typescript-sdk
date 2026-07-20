/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface NetlifyGetAccountParams { account_id: string }

export interface NetlifyListSitesParams { filter?: string; page?: number; per_page?: number }

export interface NetlifyGetSiteParams { site_id: string }

export interface NetlifyCreateSiteParams { name?: string; account_slug?: string; repo_url?: string; repo_branch?: string; build_command?: string; publish_dir?: string }

export interface NetlifyUpdateSiteParams { site_id: string; name?: string; build_command?: string; publish_dir?: string; repo_branch?: string }

export interface NetlifyDeleteSiteParams { site_id: string }

export interface NetlifyEnableSiteParams { site_id: string }

export interface NetlifyDisableSiteParams { site_id: string }

export interface NetlifyListDeploysParams { site_id: string; page?: number; per_page?: number }

export interface NetlifyGetDeployParams { deploy_id: string }

export interface NetlifyCreateDeployParams { site_id: string; title?: string; branch?: string }

export interface NetlifyCancelDeployParams { site_id: string; deploy_id: string }

export interface NetlifyRestoreDeployParams { site_id: string; deploy_id: string }

export interface NetlifyLockDeployParams { deploy_id: string }

export interface NetlifyUnlockDeployParams { deploy_id: string }

export interface NetlifyListBuildsParams { site_id: string; page?: number; per_page?: number }

export interface NetlifyGetBuildParams { site_id: string; build_id: string }

export interface NetlifyTriggerBuildParams { site_id: string; clear_cache?: boolean }

export interface NetlifyListEnvVarsParams { account_id: string; site_id?: string; context?: string; scope?: string }

export interface NetlifyGetEnvVarParams { account_id: string; key: string; site_id?: string }

export interface NetlifyCreateEnvVarsParams { account_id: string; key: string; value: string; context?: string; scope?: string; site_id?: string }

export interface NetlifyUpdateEnvVarParams { account_id: string; key: string; value: string; context?: string; site_id?: string }

export interface NetlifyDeleteEnvVarParams { account_id: string; key: string; site_id?: string }

export interface NetlifyListBuildHooksParams { site_id: string }

export interface NetlifyCreateBuildHookParams { site_id: string; title: string; branch?: string }

export interface NetlifyDeleteBuildHookParams { site_id: string; hook_id: string }

export interface NetlifyListFormsParams { site_id: string }

export interface NetlifyListFormSubmissionsParams { form_id: string; page?: number; per_page?: number }

export interface NetlifyGetDnsRecordsParams { zone_id: string }

export interface NetlifyCreateDnsRecordParams { dns_zone_id: string; type: string; hostname: string; value: string; ttl?: number; priority?: number }

export interface NetlifyDeleteDnsRecordParams { record_id: string }

export interface NetlifyListFunctionsParams { site_id: string }

export interface NetlifyListFilesParams { site_id: string }

export interface NetlifyPurgeCacheParams { site_id?: string; cache_tags?: string }

