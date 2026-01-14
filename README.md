日本語 | [English](README-en.md)

# Shake StreamKit

Shake StreamKit is a browser overlay for Splatoon 3 Salmon Run Next Wave. It receives telemetry from ShakeScouter over WebSocket (or file import) and renders the overlay UI for OBS Browser Source or normal browsers.

## Features

- Overlay + controller UI for Salmon Run telemetry (waves, quota, timer, player status).
- Auto show/hide on quota met or wave finish, with configurable durations.
- Notifications/logs for WebSocket events and alerts.
- Voice alerts: wave announcements, 20s warning, Oomon spawn cue, Joe (Extra Wave) countdown/target callouts.
- Script feature: custom speech based on remaining time, editable in a dedicated Script Editor window.
- Multi-language UI (13 locales).

## Requirements

- Node.js 18+ (20 LTS recommended).
- Git LFS (for voice assets).

## Install

```bash
git lfs clone https://github.com/mntone/shake-streamkit.git
cd shake-streamkit
npm install
```

## Run

```bash
npm start
```

Open `http://localhost:5173/`.

Notes:
- The app expects `base: /shake-streamkit/` (see `vite.config.ts`). When deploying under a different path, update the Vite base accordingly.
- `npm run build` outputs to `dist/`. Use `npm run preview` for a local production check.

## Usage

### 1) WebSocket / File Input
- Settings -> Data Source
  - Server address is `host[:port]` (no scheme). Default is `.env` `VITE_WS_SERVER=localhost:4649`.
  - File input accepts NDJSON (one JSON event per line, `.json` extension).
  - Simulation playback can replay file input at 0.5x–10x speed.

If you connect mid-match, the banner will indicate that the current match is ignored and the overlay waits for the next matchmaking event.

### 2) Overlay Behavior
- Settings -> General/Advanced
  - Auto show/hide on quota met or wave finish.
  - Duration sliders for each trigger.
  - Player status overlay, color lock, reduced motion.

### 3) Script Feature (Custom Speech)
- Settings -> Script -> enable.
- Click Edit to open `/script-editor` in a new window.
- Format (one line per rule):
  - `remainingSeconds text`
  - Example: `20 20 seconds left`
- Supports 5 sets and Wave 1–5 tabs. Uses Web Speech (Japanese voices only, if available).

### 4) Voice Alerts
- Settings -> Advanced
  - Wave announcements (start + extra wave).
  - 20-second warning voice.
  - Oomon spawn alert (countdown cue).
  - Joe (Extra Wave) countdown/target switch alerts.

## Environment Variables / HTTPS

`.env` and `.env.local`:

```env
VITE_WS_SERVER=localhost:4649
SERVER_SSLCERT=.dev/ssl/localhost.crt
SERVER_SSLKEY=.dev/ssl/localhost.key
```

- Use `scripts/ssl_mac.sh` or `scripts/ssl_win.bat` to generate a local certificate with mkcert.
- Start with HTTPS: `npm start -- --https`.

## Localization

- Locale JSON files live in `public/locales/`.
- Add a new locale entry in `Shake-Streamkit-NW/modules/core/utils/language.ts`.

## Tests

```bash
npm test
```

## License

GPL-3.0-only. See `LICENSE`.

## Related

- ShakeScouter: https://github.com/mntone/ShakeScouter
