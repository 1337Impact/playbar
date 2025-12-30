import { Playbar } from './Playbar';
import { TrackConfig, PlaybarOptions, PlayerPosition } from './types';

// Export types and main class
export { Playbar, TrackConfig, PlaybarOptions, PlayerPosition };

// Backwards compatibility alias
export { Playbar as MiniPlayer };
export type MiniPlayerOptions = PlaybarOptions;

// Auto-initialization for script tag usage
function autoInit(): void {
    // Find all elements with data-playbar attribute (and legacy data-mini-player)
    const elements = document.querySelectorAll('[data-playbar], [data-mini-player]');

    elements.forEach((el) => {
        const container = el as HTMLElement;

        // Skip if already initialized
        if (container.shadowRoot) return;

        // Read configuration from data attributes
        const src = container.dataset.src;
        const title = container.dataset.title || 'Unknown Track';
        const artist = container.dataset.artist || 'Unknown Artist';
        const artwork = container.dataset.artwork;
        const autoplay = container.dataset.autoplay === 'true';
        const position = container.dataset.position as PlayerPosition | undefined;

        if (!src) {
            console.warn('Playbar: Missing data-src attribute', container);
            return;
        }

        // Create player instance
        new Playbar(container, {
            src,
            title,
            artist,
            artwork,
            autoplay,
            position
        });
    });
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        // DOM already loaded
        autoInit();
    }
}

// Default export
export default Playbar;
