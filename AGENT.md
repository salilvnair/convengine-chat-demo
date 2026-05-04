# AGENT.md

Implementation guide for humans and coding agents working on this demo repository.

## 1. Mission

Maintain a high-quality reference implementation for `@salilvnair/convengine-chat` inside a Next.js App Router project.

Primary goals:
- Keep onboarding simple for first-time integrators.
- Demonstrate realistic chat embedding patterns.
- Preserve API and payload examples used by docs/playground surfaces.
- Keep static-export deployment flow reliable.

## 2. Core Product Areas

### Landing and View Router

- File focus: `app/page.jsx`
- Responsibility: top-level view state and navigation among `landing`, `demo`, `quickstart`.

### Demo Surface

- Dashboard-like business UI with chat integration.
- Exercises runtime mode switching and practical renderers.

### Quickstart + Docs Surface

- File focus: settings and docs components under `app/components/chat/settings/`.
- Responsibility: live configuration, API examples, renderer previews, token customization.

### Fullscreen Route

- File focus: `app/fullscreen/page.jsx`.
- Responsibility: read URL params and map to chat config for embeddable fullscreen previews.

### Local Mock Backend

- File focus: `app/api/v1/conversation/message/route.js`.
- Responsibility: emulate ConvEngine backend contract and payload behavior.

## 3. Working Rules

### Preserve API Contract Shape

When editing conversation handlers:
- Keep response body compatible with existing frontend parsing (`payload` contract).
- Preserve message enrichment behavior (text and JSON modes).
- Avoid breaking renderer routing assumptions.

### Keep Examples Honest

When editing Quickstart/docs examples:
- Match real package behavior and actual defaults.
- Do not advertise unsupported props or events.
- Prefer complete snippets plus minimal snippets.

### Keep Modes Stable

Chat mode UX (`panel`, `sidepanel`, `fullscreen`) is a key demo feature.
- Avoid regressions in mode switching.
- Validate align/position interactions if changing mode logic.

### Respect App Router Patterns

- Client-only chat pages should remain `'use client'` where needed.
- Keep route handlers in `app/api/.../route.js`.

## 4. Local Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run build:sync
```

Use `build:sync` when validating static-export deployment behavior.

## 5. Static Export and Deployment Notes

Deployment helper script:
- `scripts/build-all.mjs`

Behavior:
1. Forces export build with `NEXT_EXPORT=1`.
2. Verifies `out/` exists.
3. Syncs build output to sibling pages repository dist path.

If path assumptions change, update script constants and README together.

## 6. Change Checklist

Before finishing any non-trivial change, verify:
- App boots in dev mode.
- Demo and Quickstart views still render.
- Chat opens and sends messages successfully against local API route.
- Fullscreen route still accepts query-driven overrides.
- Static export flow still produces `out/` and syncs as expected.

## 7. Preferred Editing Strategy for Agents

1. Read relevant files first (do not assume behavior).
2. Make focused edits with minimal unrelated formatting churn.
3. Keep naming and style aligned with surrounding code.
4. Run targeted checks after edits.
5. Update docs when behavior, scripts, or integration contracts change.

## 8. Non-Goals

- Do not convert this into a generic dashboard starter.
- Do not remove local mock APIs in favor of mandatory remote dependencies.
- Do not hide advanced configuration details that are useful for integrators.

## 9. Good Commit Scope Guidance

Good:
- "Add new renderer example + docs snippet + mock payload support"
- "Improve fullscreen query params docs and validation"

Avoid:
- Large mixed refactors that alter styling, behavior, and docs in one change without clear need.

## 10. Source of Truth Priority

When conflicts occur, use this order:
1. Runtime behavior in app code.
2. Route contracts and payload handling.
3. README and in-app docs snippets.
4. This AGENT.md guidance.
