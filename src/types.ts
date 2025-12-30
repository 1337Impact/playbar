/**
 * Track configuration for the Playbar
 */
export interface TrackConfig {
    /** Audio file URL */
    src: string;
    /** Track title */
    title: string;
    /** Artist name */
    artist: string;
    /** Album artwork URL (optional) */
    artwork?: string;
}

/**
 * Position options for the fixed player
 */
export type PlayerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Playbar initialization options
 */
export interface PlaybarOptions extends TrackConfig {
    /** Auto-play on initialization */
    autoplay?: boolean;
    /** Initial volume (0-1) */
    volume?: number;
    /** Fixed position on screen (optional - if set, player is fixed positioned with high z-index) */
    position?: PlayerPosition;
}

// Backwards compatibility alias
export type MiniPlayerOptions = PlaybarOptions;
