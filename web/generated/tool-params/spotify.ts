/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface SpotifySearchParams { q: string; type: string; market?: string; limit?: number; offset?: number }

export interface SpotifyGetTrackParams { track_id: string; market?: string }

export interface SpotifyGetAlbumParams { album_id: string; market?: string }

export interface SpotifyListUserPlaylistsParams { limit?: number; offset?: number }

export interface SpotifyGetPlaylistParams { playlist_id: string; market?: string; fields?: string }

export interface SpotifyCreatePlaylistParams { user_id: string; playlist_json: string }

export interface SpotifyAddPlaylistItemsParams { playlist_id: string; items_json: string }

export interface SpotifyRemovePlaylistItemsParams { playlist_id: string; items_json: string }

export interface SpotifyGetSavedTracksParams { market?: string; limit?: number; offset?: number }

export interface SpotifySaveTracksParams { tracks_json: string }

export interface SpotifyRemoveSavedTracksParams { tracks_json: string }

export interface SpotifyGetPlaybackStateParams { market?: string }

export interface SpotifyStartPlaybackParams { device_id?: string; playback_json: string }

export interface SpotifyPausePlaybackParams { device_id?: string }

