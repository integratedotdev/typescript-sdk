import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TelegramPeerParams {
  peer_username?: string;
  peer_type?: "self" | "user" | "chat" | "channel";
  peer_id?: string;
  access_hash?: string;
}

export interface TelegramAuthCredentialParams {
  api_id?: number;
  api_hash?: string;
  session_id?: string;
}

export interface TelegramIntegrationClient {
  authSendCode(params: TelegramAuthCredentialParams & {
    phone_number: string;
  }): Promise<MCPToolCallResponse>;

  authSignIn(params: TelegramAuthCredentialParams & {
    phone_number: string;
    phone_code_hash: string;
    code: string;
  }): Promise<MCPToolCallResponse>;

  authCheckPassword(params: TelegramAuthCredentialParams & {
    password: string;
  }): Promise<MCPToolCallResponse>;

  getMe(params?: TelegramAuthCredentialParams): Promise<MCPToolCallResponse>;

  resolveUsername(params: TelegramAuthCredentialParams & {
    username: string;
  }): Promise<MCPToolCallResponse>;

  listDialogs(params?: TelegramAuthCredentialParams & {
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  getHistory(params: TelegramAuthCredentialParams & TelegramPeerParams & {
    limit?: number;
    offset_id?: number;
  }): Promise<MCPToolCallResponse>;

  searchMessages(params: TelegramAuthCredentialParams & TelegramPeerParams & {
    query: string;
    limit?: number;
  }): Promise<MCPToolCallResponse>;

  sendMessage(params: TelegramAuthCredentialParams & TelegramPeerParams & {
    message: string;
    silent?: boolean;
    no_webpage?: boolean;
  }): Promise<MCPToolCallResponse>;
}
