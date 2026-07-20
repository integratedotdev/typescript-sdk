/** @generated — do not edit. Produced by generate-integration-docs.ts */

import type { TelegramAuthCredentialParams, TelegramPeerParams } from "../../../src/integrations/telegram-client.js";

export type TelegramAuthSendCodeParams = TelegramAuthCredentialParams & {
    phone_number: string;
  };

export type TelegramAuthSignInParams = TelegramAuthCredentialParams & {
    phone_number: string;
    phone_code_hash: string;
    code: string;
  };

export type TelegramAuthCheckPasswordParams = TelegramAuthCredentialParams & {
    password: string;
  };

export type TelegramGetMeParams = TelegramAuthCredentialParams;

export type TelegramResolveUsernameParams = TelegramAuthCredentialParams & {
    username: string;
  };

export type TelegramListDialogsParams = TelegramAuthCredentialParams & {
    limit?: number;
  };

export type TelegramGetHistoryParams = TelegramAuthCredentialParams & TelegramPeerParams & {
    limit?: number;
    offset_id?: number;
  };

export type TelegramSearchMessagesParams = TelegramAuthCredentialParams & TelegramPeerParams & {
    query: string;
    limit?: number;
  };

export type TelegramSendMessageParams = TelegramAuthCredentialParams & TelegramPeerParams & {
    message: string;
    silent?: boolean;
    no_webpage?: boolean;
  };

