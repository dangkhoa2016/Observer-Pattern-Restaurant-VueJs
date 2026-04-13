# About
This is a browser-only Vue 2 sample that demonstrates the Observer Pattern in a restaurant flow.

## Runtime notes
- The app runs directly in the browser without a build step.
- `assets/js/runtime.js` centralizes retry, timeout, cache and error reporting for HTML, JSON, `.vue` and plain script loading.
- `assets/js/loader.js` now loads runtime dependencies without using `eval`.
- `vue/stores/restaurantStore.js` keeps UI, tables, chefs and orders in separate state domains while preserving the existing `restaurantStore/*` API used by components.

## Improvements applied
- Replaced unsafe JS loading via `eval` with script injection plus retry/timeout handling.
- Added cache-backed loading for `assets/app.html`, `assets/data.json` and Vue SFC fetches.
- Fixed completed food delivery so updates are stored per table instead of overwriting one global list.
- Exposed `Order.table_id` as a public read-only field for traceability.
- Cleaned up highlight naming, button semantics and live-region accessibility for assistant and progress updates.
- Added baseline `.editorconfig`, ESLint and Prettier configuration for future maintenance.
