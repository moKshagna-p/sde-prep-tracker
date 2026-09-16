# SDE Prep Tracker Design

## Purpose

Build a small, responsive website that helps Mokshagna follow a structured SDE interview-preparation routine from September 16 through October 30, 2026. The site must make today's work obvious, preserve progress between visits, and deploy reliably on GitHub Pages.

## Technical approach

The project will use dependency-free HTML, CSS, and JavaScript. GitHub Pages will serve the static files, and a GitHub Actions workflow will deploy the repository whenever changes reach the default branch.

Application logic will be separated from DOM rendering so schedule and progress behavior can be tested with Node's built-in test runner. No backend, login, framework, package dependency, or external API is required.

## User experience

The homepage will provide:

- A prominent view of the selected date and its completion percentage.
- Previous-day, next-day, and today navigation.
- Six daily preparation categories: DSA, Core CS, Development, Revision, Interview Speaking, and Applications.
- A compact calendar for September 16 through October 30 with visual completion states.
- Overall completion, current streak, completed-day count, and remaining-day summaries.
- A weekly roadmap showing the DSA and Core CS focus for each period.
- A clear bad-day minimum so the routine remains usable during busy college days.
- A reset action that requires confirmation before deleting stored progress.

The design will use a polished dark interface, strong typography, high-contrast states, responsive cards, keyboard-accessible controls, and reduced-motion support.

## Schedule

The tracker covers every calendar day from September 16 through October 30, 2026. The daily checklist contains:

1. Solve two DSA problems and record the pattern and complexity.
2. Study one Core CS topic for 45 minutes.
3. Build or debug the flagship project for 60–90 minutes.
4. Review yesterday's work and one older mistake.
5. Explain one interview answer aloud.
6. Apply for a role, improve application material, or prepare a behavioral answer.

Sundays will emphasize revision while retaining the same trackable categories. Weekly roadmap content will progress through arrays and hashing, sliding-window patterns, binary search and linked lists, stacks and queues, trees and recursion, graphs, and mixed interview practice.

## Data model and persistence

Progress will be stored in browser `localStorage` under a versioned key. Each date maps to the completion state of the six task identifiers. The application will validate loaded data and fall back to an empty state when storage is unavailable or malformed.

The current streak counts consecutive fully completed days ending on the selected date or the latest preceding completed date. Overall progress is the number of completed checklist items divided by all checklist items in the date range.

## Project structure

- `index.html`: semantic page structure and metadata.
- `styles.css`: responsive visual system and component styles.
- `src/data.js`: date range, daily tasks, and roadmap content.
- `src/progress.js`: pure schedule, persistence, progress, and streak logic.
- `src/app.js`: DOM rendering and event handling.
- `tests/progress.test.js`: behavior tests using Node's built-in test runner.
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow.
- `README.md`: usage, local development, testing, and deployment notes.

## Error handling

If browser storage fails, the tracker will remain usable for the current session and show a concise warning that progress may not persist. Dates outside the supported range will be clamped to the nearest valid date. Resetting progress will require explicit confirmation.

## Testing and acceptance criteria

Automated tests will verify date-range generation, percentage calculations, streak calculations, invalid stored-data handling, and supported-date clamping. Tests will be written before the related production logic.

Before deployment, the project must pass:

- The complete automated test suite.
- JavaScript syntax checks.
- An HTML validation or equivalent structural check available in the environment.
- A local static-server smoke test confirming the page and assets load successfully.
- A responsive visual inspection at desktop and mobile sizes.

The repository will be public at `moKshagna-p/sde-prep-tracker`. The final acceptance condition is a successful GitHub Pages deployment with a reachable public URL.

## Explicit exclusions

Version one will not include accounts, cloud synchronization, notifications, social features, external databases, analytics, or third-party APIs. These features are unnecessary for the personal tracker and would weaken the simplicity of GitHub Pages hosting.
