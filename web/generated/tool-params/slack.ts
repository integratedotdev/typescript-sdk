/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SlackSendMessageParams {
    /** Channel ID or name */
    channel: string;
    /** Message text */
    text: string;
    /** Parent message timestamp (to reply in a thread) */
    thread_ts?: string;
    /** Enable/disable link unfurling */
    unfurl_links?: boolean;
    /** Enable/disable media unfurling */
    unfurl_media?: boolean;
  }

export interface SlackListMessagesParams {
    /** Channel ID */
    channel: string;
    /** Max messages to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Only messages after this Unix timestamp */
    oldest?: string;
    /** Only messages before this Unix timestamp */
    latest?: string;
    /** Include messages at boundary timestamps */
    inclusive?: boolean;
  }

export interface SlackGetThreadRepliesParams {
    /** Channel ID */
    channel: string;
    /** Timestamp of the parent message */
    thread_ts: string;
    /** Max replies to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }

export interface SlackUpdateMessageParams {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message to update */
    timestamp: string;
    /** New message text */
    text: string;
  }

export interface SlackDeleteMessageParams {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message to delete */
    timestamp: string;
  }

export interface SlackScheduleMessageParams {
    /** Channel ID */
    channel: string;
    /** Message text */
    text: string;
    /** Unix timestamp (as string) for when to send */
    post_at: string;
    /** Thread timestamp to reply to */
    thread_ts?: string;
  }

export interface SlackGetPermalinkParams {
    /** Channel ID */
    channel: string;
    /** Timestamp of the message */
    timestamp: string;
  }

export interface SlackSearchMessagesParams {
    /** Search query string */
    query: string;
    /** Results per page (max 100) */
    count?: number;
    /** Page number */
    page?: number;
    /** Sort order: score or timestamp */
    sort?: "score" | "timestamp";
    /** Sort direction */
    sort_dir?: "asc" | "desc";
  }

export interface SlackListChannelsParams {
    /** Exclude archived channels (default: true) */
    exclude_archived?: boolean;
    /** Max channels to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Comma-separated types: public_channel, private_channel, mpim, im */
    types?: string;
  }

export interface SlackGetChannelParams {
    /** Channel ID */
    channel: string;
    /** Include member count */
    include_num_members?: boolean;
  }

export interface SlackCreateChannelParams {
    /** Channel name */
    name: string;
    /** Create as private channel (default: false) */
    is_private?: boolean;
  }

export interface SlackInviteToChannelParams {
    /** Channel ID */
    channel: string;
    /** Comma-separated user IDs */
    users: string;
  }

export interface SlackListChannelMembersParams {
    /** Channel ID */
    channel: string;
    /** Max members to return (max 1000) */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
  }

export interface SlackSetChannelTopicParams {
    /** Channel ID */
    channel: string;
    /** New topic text */
    topic: string;
  }

export interface SlackArchiveChannelParams {
    /** Channel ID */
    channel: string;
  }

export interface SlackListUsersParams {
    /** Max users to return */
    limit?: number;
    /** Pagination cursor */
    cursor?: string;
    /** Include locale info */
    include_locale?: boolean;
  }

export interface SlackGetUserParams {
    /** User ID */
    user: string;
    /** Include locale info */
    include_locale?: boolean;
  }

export interface SlackLookupUserByEmailParams {
    /** Email address */
    email: string;
  }

export interface SlackAddReactionParams {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
    /** Emoji name without colons (e.g., thumbsup) */
    name: string;
  }

export interface SlackRemoveReactionParams {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
    /** Emoji name without colons */
    name: string;
  }

export interface SlackGetReactionsParams {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }

export interface SlackUploadFileParams {
    /** Comma-separated channel IDs */
    channels: string;
    /** File content as text */
    content: string;
    /** Filename */
    filename: string;
    /** File type (e.g., text, python, json) */
    filetype?: string;
    /** Comment to post with the file */
    initial_comment?: string;
    /** File title */
    title?: string;
    /** Thread timestamp to attach to */
    thread_ts?: string;
  }

export interface SlackPinMessageParams {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }

export interface SlackUnpinMessageParams {
    /** Channel ID */
    channel: string;
    /** Message timestamp */
    timestamp: string;
  }

export interface SlackListPinsParams {
    /** Channel ID */
    channel: string;
  }

export interface SlackSetChannelPurposeParams {
    /** Channel ID */
    channel: string;
    /** New purpose text */
    purpose: string;
  }

export interface SlackRenameChannelParams {
    /** Channel ID */
    channel: string;
    /** New channel name */
    name: string;
  }

export interface SlackJoinChannelParams {
    /** Channel ID or name */
    channel: string;
  }

export interface SlackLeaveChannelParams {
    /** Channel ID */
    channel: string;
  }

export interface SlackKickFromChannelParams {
    /** Channel ID */
    channel: string;
    /** User ID to remove */
    user: string;
  }

export interface SlackUnarchiveChannelParams {
    /** Channel ID */
    channel: string;
  }

export interface SlackOpenDmParams {
    /** Comma-separated user IDs (supports group DMs) */
    users: string;
  }

export interface SlackGetUserPresenceParams {
    /** User ID */
    user: string;
  }

export interface SlackGetDndInfoParams {
    /** User ID */
    user: string;
  }

export interface SlackListFilesParams {
    /** Filter to files in this channel */
    channel?: string;
    /** Filter to files uploaded by this user */
    user?: string;
    /** Comma-separated file types to filter (e.g., "images,pdfs") */
    types?: string;
    /** Number of files to return */
    count?: number;
    /** Page number */
    page?: number;
  }

export interface SlackGetFileParams {
    /** File ID */
    file: string;
  }

export interface SlackDeleteFileParams {
    /** File ID */
    file: string;
  }

export interface SlackListBookmarksParams {
    /** Channel ID */
    channel: string;
  }

export interface SlackAddBookmarkParams {
    /** Channel ID */
    channel: string;
    /** Bookmark title */
    title: string;
    /** URL to bookmark */
    link: string;
  }

export interface SlackAddReminderParams {
    /** Reminder text */
    text: string;
    /** When to send the reminder — Unix timestamp or natural language (e.g. "in 20 minutes") */
    time: string;
  }

export interface SlackListUsergroupsParams {
    /** Whether to include user lists for each group */
    include_users?: boolean;
    /** Whether to include disabled groups */
    include_disabled?: boolean;
  }

