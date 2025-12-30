# Playbar 🎵

A drop-in Spotify-style music player component that works on any website, regardless of framework.

<img src="assets/Screenshot.png" alt="Playbar Demo" style="width: 320px; max-width: 100%;" />

## Features

- 🎨 **Spotify-style UI** - Beautiful dark theme with glassmorphism effects
- 🎯 **Framework-agnostic** - Works with React, Vue, Angular, or vanilla HTML
- 🔒 **Style isolation** - Uses Shadow DOM to prevent CSS conflicts
- 📦 **Two integration methods** - Script tag or npm package
- ⚡ **Auto-initialization** - Just add data attributes and it works
- 🎛️ **Full API** - Programmatic control over playback

## Installation

### Option 1: Script Tag

```html
<script src="https://unpkg.com/playbar/dist/playbar.umd.js"></script>
```

### Option 2: NPM

```bash
npm install playbar
```

## Usage

### Script Tag (Auto-initialization)

Add the script and use data attributes for automatic initialization:

```html
<script src="playbar.umd.js"></script>

<div 
  data-playbar
  data-src="path/to/audio.mp3"
  data-title="Song Title"
  data-artist="Artist Name"
  data-artwork="path/to/cover.jpg"
></div>
```

### JavaScript API

Create players programmatically with full control:

```javascript
import { Playbar } from 'playbar';

const player = new Playbar('#container', {
  src: 'audio.mp3',
  title: 'Song Title',
  artist: 'Artist Name',
  artwork: 'cover.jpg',
  autoplay: false,
  volume: 0.8
});

// Control playback
player.play();
player.pause();
player.setVolume(0.5);
player.seekTo(30); // seconds

// Update track
player.setTrack({
  src: 'new-audio.mp3',
  title: 'New Song'
});

// Cleanup
player.destroy();
```

### React Example

```jsx
import { useEffect, useRef } from 'react';
import { Playbar } from 'playbar';

function Player({ track }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current = new Playbar(containerRef.current, track);
    return () => playerRef.current?.destroy();
  }, []);

  useEffect(() => {
    playerRef.current?.setTrack(track);
  }, [track]);

  return <div ref={containerRef} />;
}
```

### Vue Example

```vue
<template>
  <div ref="playerContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Playbar } from 'playbar';

const playerContainer = ref(null);
let player = null;

onMounted(() => {
  player = new Playbar(playerContainer.value, {
    src: 'audio.mp3',
    title: 'Song Title',
    artist: 'Artist Name'
  });
});

onUnmounted(() => player?.destroy());
</script>
```

## API Reference

### Constructor

```typescript
new Playbar(container: HTMLElement | string, options: PlaybarOptions)
```

**Options:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `src` | `string` | Yes | Audio file URL |
| `title` | `string` | Yes | Track title |
| `artist` | `string` | Yes | Artist name |
| `artwork` | `string` | No | Album artwork URL |
| `autoplay` | `boolean` | No | Auto-play on init (default: `false`) |
| `volume` | `number` | No | Initial volume 0-1 (default: `1`) |

### Methods

| Method | Description |
|--------|-------------|
| `play()` | Start playback |
| `pause()` | Pause playback |
| `setVolume(vol)` | Set volume (0-1) |
| `seekTo(time)` | Seek to time in seconds |
| `setTrack(options)` | Update track info |
| `destroy()` | Clean up player |

## Data Attributes

For auto-initialization, use these attributes on your container element:

| Attribute | Description |
|-----------|-------------|
| `data-playbar` | Required. Marks element for auto-init |
| `data-src` | Audio file URL |
| `data-title` | Track title |
| `data-artist` | Artist name |
| `data-artwork` | Album artwork URL |
| `data-autoplay` | Set to `"true"` for autoplay |

## Building from Source

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Watch mode for development
npm run dev
```

## License

MIT
