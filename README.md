# Ghoomte Phirte (घूमते फिरते) — Nostalgic Indian Road-Trip

A responsive, cinematic single-page web application capturing the nostalgic feeling of driving through a bustling vintage Indian street from inside an old car, listening to classic Hindi songs with ambient environmental sounds and dynamic weather.

[![Ghoomte Phirte Hero Preview](/images/ghoomte-phirte-hero.jpg)](https://yashuum.github.io/ghoomtephirte/)

---

## ✨ Features

- **Cinematic Vintage Art Direction**:
  - Uses the authentic full-viewport illustration of a classic car windshield overlooking an old Indian marketplace.
  - Preserves the baked-in Hindi headline **"घूमते फिरते"** without intrusive overlay duplication.
  - Ultra-frosted glassmorphic interface (`backdrop-filter: blur(24px) saturate(160%)`) with warm terracotta, cream, olive, and espresso accents.

- **Atmosphere & Weather Engine**:
  - **☀ Day Mode**: Warm golden sunshine, subtle sunbeam reflections, and natural daylight grading.
  - **☾ Night Mode**: Cinematic indigo-espresso multiplication tint, amber dashboard illumination (steering wheel, gauges, Ganpati idol), and distant bokeh lights.
  - **☔ Rain Mode**: High-performance animated canvas rendering diagonal rain streaks and windshield water drops that collect and slide down the glass. Can be toggled independently alongside Day or Night.
  - **Reset Scene**: Instantly resets to default daytime driving conditions.

- **Vintage Radio & Ambient Audio (Web Audio API)**:
  - **Vintage Radio AM Hiss**: Programmatically synthesized pink noise with bandpass filtering (3.2kHz lowpass, 450Hz highpass) and gentle tube crackle.
  - **Monsoon Rain**: Programmatically synthesized droplets and roof wash simulating rain hitting the car roof and windshield.
  - Zero external sound files required; strictly guarded by user gestures to respect browser audio policies.

- **Floating Glass Music Player**:
  - Horizontal stadium-shaped pill on desktop and compact bottom sheet on mobile.
  - **Vinyl Record Animation**: Realistic grooved vinyl disc with center label that spins smoothly when playing and pauses smoothly.
  - Real-time track metadata and duration/current time display (`0:13 / 3:35`).
  - Seekable progress bar, volume slider, mute toggle, and track skip controls.

- **YouTube IFrame API Integration**:
  - Official playlist: `PLEOiStG7CxDKEx0W4AMsDlEDk2qrlns0I`.
  - Connects to YouTube IFrame API with support for play/pause, next/previous, seek, volume, and playback state synchronization.
  - Direct links to open the playlist on YouTube if embedding is restricted or blocked by the network.

- **Smooth Desktop Cursor Follower**:
  - Warm glowing ember and delayed ambient halo powered by `requestAnimationFrame` lerping.
  - Automatically disabled on touchscreens (`pointer: coarse`) and when `prefers-reduced-motion` is active.
  - Pointer-events transparent (`pointer-events: none`), ensuring no interference with clicks or controls.

- **Interactive Drawers**:
  - **Playlists Drawer**: Curated nostalgic listening moods (*Old Hindi Classics, Evening Drive, Monsoon Memories, Golden Hour, Quiet Roads, Late Night Journey*).
  - **Songs Drawer**: Real-time queue view and embedded YouTube playlist controller.
  - **Install Drawer**: Step-by-step PWA installation instructions for Android, iOS Safari, and Desktop Chrome with one-click installation when supported (`beforeinstallprompt`).

- **Progressive Web App (PWA)**:
  - Valid `manifest.json` with theme color `#2d140f` and custom app icons.
  - Service worker (`sw.js`) pre-caching the application shell, styling, scripts, and the hero image for instant offline launch.

- **Contact Link**:
  - Clickable footer link: `contact: singhyashwant559@gmail.com`.

---

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Icons**: Lucide React
- **Audio**: Web Audio API (ambient sound synthesis) + YouTube IFrame Player API
- **Styling**: Modern CSS variables, glassmorphism, responsive media queries

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "C:\Users\singh\.gemini\antigravity\scratch\ghoomte-phirte"

# Install dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Production Build
```bash
npm run build
npm run preview
```
The optimized production files will be output to the `dist/` directory.

---

## 🎧 Browser & Playback Notes

1. **Audio Autoplay Policies**: Modern browsers require an explicit user gesture (e.g., clicking *"Start the Journey"* or the *"Play"* button) before starting audio playback or resuming the Web Audio `AudioContext`.
2. **YouTube Embedded Limitations**: Certain videos on YouTube may enforce copyright restrictions that disable third-party embedded playback in specific regions. If a video in the playlist cannot be embedded, the app provides a one-click link to open the playlist directly on YouTube.
3. **PWA Standalone Mode**: On iOS Safari, tap the Share icon and choose **"Add to Home Screen"** to experience the app full-screen without browser UI.
