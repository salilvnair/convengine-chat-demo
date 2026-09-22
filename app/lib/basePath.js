/**
 * Prefixes an in-app path with the deploy base path.
 *
 * The static export is served from salilvnair.github.io/framework/convengine-chat,
 * and next/link adds that prefix for us — but window.open(), plain <a href> and
 * the URLs handed to the widget (fullscreenTabUrl, auditExplorerUrl) do not, so
 * '/audit' would open the site root's /audit instead of the demo's.
 *
 * NEXT_PUBLIC_BASE_PATH is set only by the export build (salilvnair.github.io's
 * scripts/sync-chat-demo.js); in `next dev` it is empty and paths pass through.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const withBase = (path) => `${BASE_PATH}${path}`;
