/**
 * Spotify-inspired CSS styles for the Playbar
 * Uses Shadow DOM for complete style isolation
 */
export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:host {
  --pb-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --pb-bg-hover: linear-gradient(135deg, #1f1f3a 0%, #1a2744 100%);
  --pb-accent: #1db954;
  --pb-accent-hover: #1ed760;
  --pb-text-primary: #ffffff;
  --pb-text-secondary: #b3b3b3;
  --pb-progress-bg: rgba(255, 255, 255, 0.1);
  --pb-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --pb-radius: 12px;
  
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Fixed position classes */
:host(.position-fixed) {
  position: fixed;
  z-index: 999999;
}

:host(.position-top-left) {
  top: 20px;
  left: 20px;
}

:host(.position-top-right) {
  top: 20px;
  right: 20px;
}

:host(.position-bottom-left) {
  bottom: 20px;
  left: 20px;
}

:host(.position-bottom-right) {
  bottom: 20px;
  right: 20px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.playbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--pb-bg);
  border-radius: var(--pb-radius);
  box-shadow: var(--pb-shadow);
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.playbar:hover {
  background: var(--pb-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

/* Album Artwork */
.artwork-container {
  position: relative;
  flex-shrink: 0;
}

.artwork {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.playbar:hover .artwork {
  transform: scale(1.05);
}

.artwork-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.artwork-placeholder svg {
  width: 28px;
  height: 28px;
  fill: rgba(255, 255, 255, 0.8);
}

/* Track Info */
.track-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--pb-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}

.track-artist {
  font-size: 12px;
  font-weight: 400;
  color: var(--pb-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Progress Bar */
.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.time {
  font-size: 10px;
  font-weight: 500;
  color: var(--pb-text-secondary);
  min-width: 50px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--pb-progress-bg);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: height 0.15s ease;
}

.progress-bar:hover {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: var(--pb-accent);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
  position: relative;
}

.progress-bar:hover .progress-fill {
  background: var(--pb-accent-hover);
}

.progress-fill::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  width: 12px;
  height: 12px;
  background: var(--pb-text-primary);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease;
}

.progress-bar:hover .progress-fill::after {
  transform: translateY(-50%) scale(1);
}

/* Play/Pause Button */
.play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--pb-accent);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
}

.play-btn:hover {
  background: var(--pb-accent-hover);
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(29, 185, 84, 0.4);
}

.play-btn:active {
  transform: scale(0.95);
}

.play-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.play-btn:disabled:hover {
  transform: none;
}

.play-btn svg {
  width: 18px;
  height: 18px;
  fill: #000;
}

.play-btn .play-icon {
  margin-left: 2px;
}

/* Loading Spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Loading/Buffering Animation for artwork */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading .artwork {
  animation: pulse 1.5s ease-in-out infinite;
}
`;
