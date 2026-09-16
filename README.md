# SDE Prep Tracker

A focused 45-day placement-preparation dashboard covering September 16 through October 30, 2026. It tracks DSA, Core CS, development, revision, interview speaking, and applications without requiring an account or backend.

## Features

- Six daily preparation categories with completion percentages
- Overall progress, completed days, days remaining, and current streak
- Date navigation and a compact sprint calendar
- Seven-week DSA and Core CS roadmap
- Responsive keyboard-accessible interface
- Progress stored locally in browser `localStorage`
- Automated tests and GitHub Pages deployment

## Run locally

Clone the repository, enter its directory, and serve the static files:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser.

## Verify

```bash
npm test
npm run check
```

The test suite covers date generation, data validation, progress statistics, streaks, storage fallback, page structure, responsive style requirements, and deployment configuration.

## Persistence

Progress is saved only in the current browser using `localStorage`. Clearing browser data or using another device starts a separate tracker. When storage is blocked, the site remains usable for the current session and displays a warning.

## Deployment

Pushes to `main` run tests and deploy the static site through the workflow in `.github/workflows/pages.yml`.

Live site: <https://mokshagna-p.github.io/sde-prep-tracker/>
