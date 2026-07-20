/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface DiscordListMyGuildsParams {
    limit?: number;
    before?: string;
    after?: string;
  }

export interface DiscordGetGuildParams {
    guild_id: string;
    with_counts?: boolean;
  }

export interface DiscordListGuildChannelsParams { guild_id: string }

export interface DiscordGetChannelParams { channel_id: string }

export interface DiscordSendMessageParams {
    channel_id: string;
    content: string;
    tts?: boolean;
    reply_to_message_id?: string;
  }

export interface DiscordListMessagesParams {
    channel_id: string;
    limit?: number;
    before?: string;
    after?: string;
  }

export interface DiscordEditMessageParams {
    channel_id: string;
    message_id: string;
    content: string;
  }

export interface DiscordDeleteMessageParams {
    channel_id: string;
    message_id: string;
  }

