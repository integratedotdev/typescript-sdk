/**
 * Amazon Web Services Integration
 * Control-plane tools (STS, EC2, S3, Lambda, CloudFormation, IAM) via SigV4.
 * Pass IAM access keys or temporary credentials in the Authorization bearer JSON payload (server-side only).
 */

import type { MCPIntegration } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("AWS");

const AWS_TOOLS = [
  "aws_sts_get_caller_identity",
  "aws_ec2_describe_regions",
  "aws_ec2_describe_instances",
  "aws_s3_list_buckets",
  "aws_lambda_list_functions",
  "aws_cloudformation_list_stacks",
  "aws_iam_list_account_aliases",
] as const;

/** Static or session credentials used for SigV4 (never log or expose client-side). */
export interface AwsIntegrationCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  /** Default region for regional APIs (defaults to AWS_REGION / AWS_DEFAULT_REGION or us-east-1 on the server). */
  region?: string;
}

export interface AwsIntegrationOptions {
  /**
   * Explicit credentials. If omitted, reads `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
   * (and optional `AWS_SESSION_TOKEN`, `AWS_REGION` / `AWS_DEFAULT_REGION`) from the environment.
   */
  credentials?: AwsIntegrationCredentials;
}

function resolveCredentials(opts: AwsIntegrationOptions): AwsIntegrationCredentials {
  const c = opts.credentials;
  const accessKeyId = c?.accessKeyId ?? getEnv("AWS_ACCESS_KEY_ID");
  const secretAccessKey = c?.secretAccessKey ?? getEnv("AWS_SECRET_ACCESS_KEY");
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "awsIntegration requires accessKeyId and secretAccessKey (or AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)"
    );
  }
  return {
    accessKeyId,
    secretAccessKey,
    sessionToken: c?.sessionToken ?? getEnv("AWS_SESSION_TOKEN"),
    region: c?.region ?? getEnv("AWS_REGION") ?? getEnv("AWS_DEFAULT_REGION"),
  };
}

/** Compact JSON for the MCP Authorization bearer (parsed only by the MCP server). */
export function encodeAwsCredentialsPayload(c: AwsIntegrationCredentials): string {
  const o: Record<string, string> = {
    accessKeyId: c.accessKeyId,
    secretAccessKey: c.secretAccessKey,
  };
  if (c.sessionToken) {
    o.sessionToken = c.sessionToken;
  }
  if (c.region) {
    o.region = c.region;
  }
  return JSON.stringify(o);
}

export function awsIntegration(options: AwsIntegrationOptions = {}): MCPIntegration<"aws"> {
  const creds = resolveCredentials(options);

  return {
    id: "aws",
    name: "Amazon Web Services",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/aws.png",
    description:
      "Query AWS accounts and resources using SigV4 (control-plane read APIs: STS, EC2, S3, Lambda, CloudFormation, IAM).",
    category: "Infrastructure",
    tools: [...AWS_TOOLS],
    authType: "apiKey",
    getHeaders() {
      return {
        Authorization: `Bearer ${encodeAwsCredentialsPayload(creds)}`,
      };
    },

    async onInit(_client) {
      logger.debug("AWS integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("AWS integration connected");
    },
  };
}

export type AwsTools = (typeof AWS_TOOLS)[number];

export type { AwsIntegrationClient } from "./aws-client.js";
