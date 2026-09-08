# Codex instructions — Aniot Financial Banking MiniApp

## Goal
Maintain this repository as a lightweight finance/banking MiniApp that can be previewed from Codex and deployed as a static site.

## Runtime
- Zero external runtime dependencies: Node.js is enough for local preview/build.
- `npm run dev` starts the app on `PORT` or 4173.
- `npm run build` produces `dist/`.
- `npm run preview` serves `dist/`.
- Primary entrypoint: `index.html`.

## Architecture
- Multi-page HTML application.
- Shared styles: `assets/css/site.css`.
- Page styles: `assets/css/pages/*.css`.
- Shared UI/navigation: `assets/js/site.js`.
- Demo data: `assets/js/demo-data.js`.
- Page behavior: `assets/js/pages/*.js`.
- Bootstrap is vendored under `assets/vendor/bootstrap/`; keep runtime independent of a CDN.

## MiniApp compatibility rules
- Keep asset and page links relative because the app can be mounted under a nested base path.
- Do not require secrets, payment-card data, or real customer banking data.
- Keep demo datasets synthetic/anonymized and visibly labeled as simulated.
- Core navigation and data browsing must work as a static build.
- Preserve responsive behavior for embedded/narrow MiniApp viewports.
- If APIs are added later, isolate them behind a small client module and keep a mock/demo fallback.

## Validation
Run `npm run build`, then `npm run preview` and test the main pages. Use `node --check` for changed JavaScript files.
