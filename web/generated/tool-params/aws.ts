/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface AwsEc2DescribeRegionsParams { region_names?: string }

export interface AwsEc2DescribeInstancesParams {
    instance_ids?: string;
    max_results?: number;
    next_token?: string;
  }

export interface AwsLambdaListFunctionsParams { max_items?: number; marker?: string }

export interface AwsCloudformationListStacksParams { stack_status_filter?: string; next_token?: string }

