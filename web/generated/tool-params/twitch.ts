/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface TwitchGetUsersParams { id?: string; login?: string }

export interface TwitchGetStreamsParams { user_id?: string; user_login?: string; game_id?: string; first?: number; after?: string }

export interface TwitchGetChannelsParams { broadcaster_id?: string }

export interface TwitchModifyChannelParams { broadcaster_id?: string; channel_json: string }

export interface TwitchCreateClipParams { broadcaster_id?: string; has_delay?: boolean }

export interface TwitchGetVideosParams { id?: string; user_id?: string; game_id?: string; first?: number; after?: string }

export interface TwitchGetGamesParams { id?: string; name?: string }

export interface TwitchGetChannelFollowersParams { broadcaster_id?: string; user_id?: string; first?: number; after?: string }

export interface TwitchGetBroadcasterSubscriptionsParams { broadcaster_id?: string; user_id?: string; first?: number; after?: string }

