import { PlaybarOptions, PlayerPosition } from './types';
import { styles } from './styles';

/**
 * Playbar - A drop-in Spotify-style music player component
 */
export class Playbar {
    private container: HTMLElement;
    private shadow: ShadowRoot;
    private audio: HTMLAudioElement;
    private options: PlaybarOptions;

    // UI Elements
    private playBtn!: HTMLButtonElement;
    private progressFill!: HTMLElement;
    private progressBar!: HTMLElement;
    private currentTimeEl!: HTMLElement;
    private durationEl!: HTMLElement;
    private artworkEl!: HTMLElement;

    private isPlaying = false;
    private isLoading = false;

    constructor(container: HTMLElement | string, options: PlaybarOptions) {
        // Resolve container
        if (typeof container === 'string') {
            const el = document.querySelector(container) as HTMLElement;
            if (!el) throw new Error(`Playbar: Container "${container}" not found`);
            this.container = el;
        } else {
            this.container = container;
        }

        this.options = {
            volume: 1,
            autoplay: false,
            ...options
        };

        // Create Shadow DOM for style isolation
        this.shadow = this.container.attachShadow({ mode: 'open' });

        // Apply position classes to the host element
        if (this.options.position) {
            this.applyPosition(this.options.position);
        }

        // Create audio element
        this.audio = new Audio(this.options.src);
        this.audio.volume = this.options.volume!;

        // Build UI
        this.render();
        this.bindEvents();

        // Autoplay if enabled (handles browser restrictions)
        if (this.options.autoplay) {
            this.attemptAutoplay();
        }
    }

    private attemptAutoplay(): void {
        // Try to play immediately
        this.play().catch(() => {
            // Browser blocked autoplay - wait for first user interaction
            // These are the events browsers recognize as user gestures
            const interactionEvents = [
                'click',
                // 'dblclick',
                'keydown',
                // 'keyup',
                'touchstart',
                // 'touchend',
                'pointerdown',
                'mousedown'
            ];

            const startOnInteraction = () => {
                this.play();
                // Remove all listeners once triggered
                interactionEvents.forEach(event => {
                    document.removeEventListener(event, startOnInteraction);
                });
            };

            // Add listeners for all interaction events
            interactionEvents.forEach(event => {
                document.addEventListener(event, startOnInteraction, { once: true });
            });
        });
    }

    private applyPosition(position: PlayerPosition): void {
        this.container.classList.add('position-fixed', `position-${position}`);
    }

    private render(): void {
        const artworkHTML = this.options.artwork
            ? `<img class="artwork" src="${this.options.artwork}" alt="${this.options.title}" />`
            : `<div class="artwork-placeholder">
           <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
         </div>`;

        this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="playbar">
        <div class="artwork-container">
          ${artworkHTML}
        </div>
        
        <div class="track-info">
          <div class="track-title">${this.escapeHtml(this.options.title)}</div>
          <div class="track-artist">${this.escapeHtml(this.options.artist)}</div>
          
          <div class="progress-container">
            <span class="time current-time">0:00</span>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <span class="time duration">0:00</span>
          </div>
        </div>
        
        <button class="play-btn" aria-label="Play">
          <svg class="play-icon" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    `;

        // Cache DOM references
        this.playBtn = this.shadow.querySelector('.play-btn')!;
        this.progressFill = this.shadow.querySelector('.progress-fill')!;
        this.progressBar = this.shadow.querySelector('.progress-bar')!;
        this.currentTimeEl = this.shadow.querySelector('.current-time')!;
        this.durationEl = this.shadow.querySelector('.duration')!;
        this.artworkEl = this.shadow.querySelector('.artwork, .artwork-placeholder')!;
    }

    private bindEvents(): void {
        // Play/Pause button
        this.playBtn.addEventListener('click', () => this.togglePlay());

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.onEnded());

        // Loading state events
        this.audio.addEventListener('waiting', () => this.setLoading(true));
        this.audio.addEventListener('canplay', () => this.setLoading(false));
        this.audio.addEventListener('playing', () => this.setLoading(false));
        this.audio.addEventListener('loadstart', () => this.setLoading(true));

        // Progress bar click to seek
        this.progressBar.addEventListener('click', (e) => this.seek(e));
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
        this.updatePlayButton();
    }

    private togglePlay(): void {
        if (this.isLoading) return; // Don't toggle while loading

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    private updateProgress(): void {
        if (!isNaN(this.audio.duration)) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    private updateDuration(): void {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    private onEnded(): void {
        this.isPlaying = false;
        this.updatePlayButton();
        this.progressFill.style.width = '0%';
        this.audio.currentTime = 0;
    }

    private seek(e: MouseEvent): void {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }

    private updatePlayButton(): void {
        if (this.isLoading) {
            // Show loading spinner
            this.playBtn.innerHTML = `<div class="loading-spinner"></div>`;
            this.playBtn.setAttribute('aria-label', 'Loading');
            this.playBtn.disabled = true;
        } else {
            this.playBtn.disabled = false;
            const icon = this.isPlaying
                ? `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
                : `<svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

            this.playBtn.innerHTML = icon;
            this.playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
        }
    }

    private formatTime(seconds: number): string {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API

    /**
     * Start playback
     */
    play(): Promise<void> {
        this.isPlaying = true;
        this.updatePlayButton();
        return this.audio.play();
    }

    /**
     * Pause playback
     */
    pause(): void {
        this.isPlaying = false;
        this.updatePlayButton();
        this.audio.pause();
    }

    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Seek to a specific time (in seconds)
     */
    seekTo(time: number): void {
        this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
    }

    /**
     * Update track information
     */
    setTrack(options: Partial<PlaybarOptions>): void {
        if (options.src) {
            this.setLoading(true);
            this.audio.src = options.src;
            this.options.src = options.src;
        }
        if (options.title) {
            this.options.title = options.title;
            const titleEl = this.shadow.querySelector('.track-title');
            if (titleEl) titleEl.textContent = options.title;
        }
        if (options.artist) {
            this.options.artist = options.artist;
            const artistEl = this.shadow.querySelector('.track-artist');
            if (artistEl) artistEl.textContent = options.artist;
        }
        if (options.artwork) {
            this.options.artwork = options.artwork;
            const img = this.shadow.querySelector('.artwork') as HTMLImageElement;
            if (img) img.src = options.artwork;
        }
    }

    /**
     * Set the player position
     */
    setPosition(position: PlayerPosition): void {
        // Remove old position classes
        this.container.classList.remove(
            'position-fixed',
            'position-top-left',
            'position-top-right',
            'position-bottom-left',
            'position-bottom-right'
        );
        this.options.position = position;
        this.applyPosition(position);
    }

    /**
     * Destroy the player and clean up
     */
    destroy(): void {
        this.audio.pause();
        this.audio.src = '';
        this.shadow.innerHTML = '';
    }
}
