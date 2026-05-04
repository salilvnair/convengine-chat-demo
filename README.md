# ConvEngine Chat Demo

A production-style Next.js demo that showcases how to embed `@salilvnair/convengine-chat` into a modern app.

This project includes:
- A polished landing screen with two experiences: Demo and Quickstart.
- A dashboard-like product surface (metrics, orders, analytics, profile) with chat integrated.
- A live Quickstart/docs playground for tuning widget behavior and theme tokens.
- A local API route that mimics ConvEngine backend payloads so the UI works out of the box.
- A static export build flow for syncing to GitHub Pages distribution folders.

## Table of Contents

1. [What You Can Explore](#what-you-can-explore)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Scripts](#project-scripts)
5. [App Architecture](#app-architecture)
6. [Backend Mock Route](#backend-mock-route)
7. [Fullscreen Mode via URL Params](#fullscreen-mode-via-url-params)
8. [Static Export and Sync](#static-export-and-sync)
9. [Troubleshooting](#troubleshooting)

## What You Can Explore

### 1) Demo Experience

The main Demo flow simulates a business dashboard and mounts chat in multiple runtime modes:
- `panel`
- `sidepanel` (left/right)
- `fullscreen` handoff behavior

The chat instance in Demo is wired with:
- Live mode changes (`onModeChange`)
- Theme accent control
- Interactive renderers
- Optional feedback/audit/dark-mode controls

### 2) Quickstart Experience

Quickstart is designed as a living integration guide:
- A visual settings panel for chat behavior.
- API documentation sections embedded in-app.
- Theme token playground and icon customization.
- Renderer examples and actions API patterns.

The Quickstart chat uses the same ConvEngine component, but exposes many more config toggles to validate integration quickly.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- `@salilvnair/convengine-chat`

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Then open http://localhost:3000.

### Build for Production

```bash
npm run build
npm run start
```

## Project Scripts

- `npm run dev`: start local Next.js development server.
- `npm run build`: regular Next.js production build.
- `npm run start`: run the production server after build.
- `npm run lint`: run Next.js lint checks.
- `npm run build:sync`: static export plus sync to GitHub Pages dist target.
- `npm run build:all`: alias of `build:sync`.

## App Architecture

High-level structure:

```text
app/
  page.jsx                         # Root UI flow: Landing -> Demo / Quickstart
  layout.jsx                       # Global CSS + convengine-chat CSS import
  globals.css
  fullscreen/page.jsx              # Fullscreen route with URL-driven config
  api/v1/conversation/message/     # Local mock backend endpoint
  components/
    chat/                          # Renderers, settings docs/playground, UI helpers
    demo/                          # Dashboard panels and data views
  data/                            # Dashboard/demo data and fake chat responses
scripts/
  build-all.mjs                    # Static export + sync to external dist folder
next.config.mjs                    # NEXT_EXPORT-aware Next output config
```

Flow summary:
- `app/page.jsx` controls app-level view switching (`landing`, `demo`, `quickstart`).
- Both Demo and Quickstart mount `<ConvEngineChat />` with different config depth.
- Interactive renderer registration is centralized through shared renderer definitions.
- UI sample data and fake conversation responses are local, deterministic inputs for development.

## Backend Mock Route

`POST /api/v1/conversation/message` is implemented locally and shaped like a ConvEngine backend response.

Behavior highlights:
- Accepts `message` and optional `inputParams`.
- Handles message enrichment modes by extracting clean user text and prefix metadata.
- Simulates realistic latency (~300-900ms).
- Returns `payload` compatible with renderer-aware client parsing.

This allows frontend integration and renderer testing without needing a live backend service.

## Fullscreen Mode via URL Params

The fullscreen page reads URL query parameters and maps them into chat config.

Examples:
- `accent`
- `feedback`
- `audit`
- `engineStatus`
- `darkMode`
- `title`
- `subtitle`
- `placeholder`
- `headerDot`
- `landingAvatar`
- `landingSubtitle`
- `showNewChat`
- `showLayoutPicker`
- `showMaximize`
- `showMinimize`
- `composerShape`

Example URL:

```text
/fullscreen?accent=%236366f1&feedback=true&audit=false&composerShape=round
```

## Static Export and Sync

The script in `scripts/build-all.mjs` performs two steps:

1. Runs Next build with `NEXT_EXPORT=1` and `NEXT_BASE_PATH` (from `.env`), which activates `output: 'export'` in `next.config.mjs` and generates `out/`.
2. Copies `out/` into a GitHub Pages destination resolved from `.env`.

Default `.env` values in this repo:

```env
NEXT_BASE_PATH=/dist/demos/chat
GITHUB_IO_REPO_PATH=../../salilvnair.github.io
GITHUB_IO_SYNC_SUBDIR=dist/demos/chat
```

Effective destination with defaults:
`../../salilvnair.github.io/dist/demos/chat`

Run it with:

```bash
npm run build:sync
```

Important:
- This expects `GITHUB_IO_REPO_PATH` to point to an existing local clone of your github.io repo.
- The target folder is wiped and re-copied to avoid stale files.
- If you host under a different subpath, update both `NEXT_BASE_PATH` and `GITHUB_IO_SYNC_SUBDIR` in `.env`.

## Troubleshooting

### Build succeeds but no static output

Ensure build is run with export mode:
- Use `npm run build:sync` or `npm run build:all`.
- Confirm `next.config.mjs` keeps `output: 'export'` behind `NEXT_EXPORT=1`.

### Chat UI loads but responses are missing

Check:
- Frontend is calling the expected route.
- Mock API route is reachable (`/api/v1/conversation/message`).
- Payload shape is not altered by middleware/proxy layers.

### Sync script fails with parent directory error

Clone the sibling pages repo so this path exists:

```text
../../salilvnair.github.io
```

## Notes for Contributors

- Keep Demo and Quickstart behavior aligned with ConvEngine package capabilities.
- Favor small, explicit config changes over hidden defaults when updating examples.
- Preserve the local API route contract because renderers depend on payload shape.
