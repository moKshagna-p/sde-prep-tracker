# SDE Prep Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a responsive personal SDE-preparation tracker for September 16 through October 30, 2026.

**Architecture:** A dependency-free static site separates immutable schedule data, pure progress calculations, and DOM rendering. Browser localStorage persists progress, Node's built-in test runner verifies pure logic, and GitHub Actions deploys the static repository to GitHub Pages.

**Tech Stack:** Semantic HTML5, modern CSS, JavaScript ES modules, Node.js built-in test runner, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-16-sde-prep-tracker-design.md`

## Global Constraints

- Support every date from `2026-09-16` through `2026-10-30`, inclusive.
- Use no runtime framework, external API, backend, database, analytics, or third-party client dependency.
- Store browser progress under a versioned localStorage key and continue in memory if storage is unavailable.
- Provide six daily categories: DSA, Core CS, Development, Revision, Interview Speaking, and Applications.
- Use a responsive, keyboard-accessible dark interface with reduced-motion support.
- Deploy the public repository `moKshagna-p/sde-prep-tracker` with GitHub Pages.

---

## File map

- `index.html`: semantic application shell, metadata, dashboard sections, and accessible controls.
- `styles.css`: tokens, responsive layout, components, completion states, focus states, and reduced motion.
- `src/data.js`: date boundaries, task definitions, and weekly roadmap.
- `src/progress.js`: date generation, validation, completion statistics, streaks, and storage adapter.
- `src/app.js`: state ownership, rendering, navigation, task toggles, reset confirmation, and storage warning.
- `tests/progress.test.js`: pure behavior tests for schedule and progress functions.
- `tests/smoke.test.js`: structural checks for the page and deployment-critical assets.
- `.github/workflows/pages.yml`: Pages build and deployment workflow.
- `package.json`: module mode and test/check scripts.
- `README.md`: local usage, testing, persistence behavior, and deployment documentation.

### Task 1: Progress domain and persistence validation

**Files:**
- Create: `package.json`
- Create: `src/progress.js`
- Create: `tests/progress.test.js`

**Interfaces:**
- Produces: `enumerateDates(start, end): string[]`
- Produces: `clampDate(value, start, end): string`
- Produces: `sanitizeProgress(value, taskIds): Record<string, Record<string, boolean>>`
- Produces: `calculateStats(progress, dates, taskIds): { completedItems, totalItems, percentage, completedDays }`
- Produces: `calculateStreak(progress, dates, taskIds, selectedDate): number`
- Produces: `createProgressStore(storage, key, taskIds): { load, save, clear, persistent }`

- [ ] **Step 1: Create the Node test setup**

Create `package.json` with module mode and scripts:

```json
{
  "name": "sde-prep-tracker",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "check": "node --check src/data.js && node --check src/progress.js && node --check src/app.js"
  }
}
```

- [ ] **Step 2: Write failing domain tests**

Create tests that assert: the inclusive date range has 45 dates; out-of-range dates clamp to the nearest boundary; malformed progress and unknown task IDs are removed; statistics count items and fully completed days; a streak spans consecutive completed days and stops at a gap; unavailable storage returns an in-memory, non-persistent store.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  enumerateDates, clampDate, sanitizeProgress,
  calculateStats, calculateStreak, createProgressStore
} from '../src/progress.js';

const tasks = ['dsa', 'core'];
test('enumerates the inclusive preparation range', () => {
  const dates = enumerateDates('2026-09-16', '2026-10-30');
  assert.equal(dates.length, 45);
  assert.equal(dates.at(0), '2026-09-16');
  assert.equal(dates.at(-1), '2026-10-30');
});
```

- [ ] **Step 3: Run tests and verify RED**

Run: `npm test`
Expected: FAIL because `src/progress.js` does not exist.

- [ ] **Step 4: Implement the pure progress module**

Use UTC date arithmetic, boolean-only task state, and guarded JSON parsing. A completed day is one where every known task ID is `true`. Storage methods catch access and quota errors and retain an in-memory copy.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`
Expected: all progress tests PASS with zero failures.

- [ ] **Step 6: Commit the domain layer**

```bash
git add package.json src/progress.js tests/progress.test.js
git commit -m "feat: add tested progress domain"
```

### Task 2: Schedule data and accessible application shell

**Files:**
- Create: `src/data.js`
- Create: `index.html`
- Create: `tests/smoke.test.js`

**Interfaces:**
- Consumes: ES module support configured in `package.json`.
- Produces: `START_DATE`, `END_DATE`, `STORAGE_KEY`, `TASKS`, and `ROADMAP` exports.
- Produces: stable DOM IDs used by `src/app.js`: `selected-date`, `day-context`, `daily-progress`, `task-list`, `calendar`, `roadmap`, `previous-day`, `next-day`, `today`, `reset-progress`, `storage-warning`, `overall-progress`, `current-streak`, `completed-days`, and `remaining-days`.

- [ ] **Step 1: Write failing structural smoke tests**

Assert that `index.html` contains a viewport meta tag, page heading, all required DOM IDs, module script `src/app.js`, stylesheet `styles.css`, and an accessible reset dialog or confirmation control. Assert that `src/data.js` exports exactly six unique task IDs and roadmap entries covering the entire range.

- [ ] **Step 2: Run smoke tests and verify RED**

Run: `node --test tests/smoke.test.js`
Expected: FAIL because `index.html` and `src/data.js` do not exist.

- [ ] **Step 3: Implement schedule data**

Define the exact boundaries and six tasks. Each task contains `id`, `label`, `duration`, `description`, and a short category marker. Define seven roadmap periods with `start`, `end`, `dsa`, and `core` fields, ending on October 30.

- [ ] **Step 4: Implement semantic HTML shell**

Create a header with the date range, a main dashboard with summary cards, daily checklist and calendar sections, a roadmap section, a bad-day minimum callout, an `aria-live` warning region, and footer. Use buttons for every interaction and semantic progress elements where useful.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`
Expected: all domain and smoke tests PASS.

- [ ] **Step 6: Commit schedule and structure**

```bash
git add src/data.js index.html tests/smoke.test.js
git commit -m "feat: add preparation schedule and page structure"
```

### Task 3: Interactive tracker behavior

**Files:**
- Create: `src/app.js`
- Modify: `tests/smoke.test.js`

**Interfaces:**
- Consumes: all exports from `src/data.js` and `enumerateDates`, `clampDate`, `calculateStats`, `calculateStreak`, `createProgressStore` from `src/progress.js`.
- Produces: rendered task checkboxes, date navigation, calendar completion states, dashboard statistics, roadmap cards, reset confirmation, and local persistence.

- [ ] **Step 1: Extend smoke tests with interaction wiring requirements**

Assert `src/app.js` imports both modules, installs event handlers for task changes and navigation, calls the storage adapter, updates the warning region when persistence is unavailable, and asks for confirmation before clearing progress.

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `node --test tests/smoke.test.js`
Expected: FAIL because `src/app.js` does not exist.

- [ ] **Step 3: Implement minimal application state and rendering**

Select today's date when it is within range and otherwise clamp it. Render checkboxes from `TASKS`, store task completion by ISO date and task ID, render overall statistics and selected-day percentage, disable navigation at boundaries, and label calendar buttons with full dates and completion status.

- [ ] **Step 4: Add defensive behavior**

Show the persistence warning when `store.persistent` is false. Confirm reset with `window.confirm`, clear only after approval, preserve the selected date, and re-render from the cleared state.

- [ ] **Step 5: Verify tests and syntax**

Run: `npm test && npm run check`
Expected: all tests PASS and every JavaScript file passes syntax checking.

- [ ] **Step 6: Commit application behavior**

```bash
git add src/app.js tests/smoke.test.js
git commit -m "feat: add persistent tracker interactions"
```

### Task 4: Responsive visual system

**Files:**
- Create: `styles.css`
- Modify: `tests/smoke.test.js`

**Interfaces:**
- Consumes: classes and semantic regions from `index.html` and state classes from `src/app.js`.
- Produces: responsive desktop/mobile layouts, visible focus states, completion states, and reduced-motion behavior.

- [ ] **Step 1: Add failing stylesheet contract tests**

Assert the stylesheet includes `:focus-visible`, an `@media (prefers-reduced-motion: reduce)` rule, mobile and desktop breakpoints, progress states, selected calendar state, completed task state, and storage warning styling.

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `node --test tests/smoke.test.js`
Expected: FAIL because `styles.css` does not exist.

- [ ] **Step 3: Implement visual tokens and layout**

Use CSS custom properties for a near-black navy background, elevated slate panels, white text, muted blue-gray copy, electric green progress, and violet focus accents. Build a two-column desktop dashboard that collapses to one column on mobile. Keep controls at least 44px tall.

- [ ] **Step 4: Implement component and state styling**

Style summary cards, task rows, custom checkbox states, calendar grid, roadmap cards, progress bars, warning callout, hover, focus-visible, selected, and completed states. Disable nonessential transitions for reduced-motion users.

- [ ] **Step 5: Run the full local verification**

Run: `npm test && npm run check`
Expected: all tests and syntax checks PASS.

- [ ] **Step 6: Commit styling**

```bash
git add styles.css tests/smoke.test.js
git commit -m "feat: add responsive tracker design"
```

### Task 5: Deployment, documentation, and final verification

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Modify: `tests/smoke.test.js`

**Interfaces:**
- Consumes: the complete static site at repository root.
- Produces: a Pages workflow using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`; contributor and usage documentation.

- [ ] **Step 1: Add failing deployment smoke tests**

Assert the workflow triggers on pushes to `main`, grants `pages: write` and `id-token: write`, uploads the repository root, and deploys to the `github-pages` environment. Assert README includes local serving, test commands, persistence notes, and the expected live URL.

- [ ] **Step 2: Run the smoke test and verify RED**

Run: `node --test tests/smoke.test.js`
Expected: FAIL because the workflow and README do not exist.

- [ ] **Step 3: Add GitHub Pages workflow and README**

Configure concurrency to cancel stale deployments, checkout the repository, configure Pages, upload the static root, and deploy. Document `python3 -m http.server 4173`, `npm test`, `npm run check`, browser-local persistence, and `https://mokshagna-p.github.io/sde-prep-tracker/`.

- [ ] **Step 4: Run complete automated verification**

Run: `npm test && npm run check`
Expected: all tests PASS with zero failures and syntax checks exit 0.

- [ ] **Step 5: Run a local HTTP smoke test**

Run the site with `python3 -m http.server 4173`, request `/`, `/styles.css`, `/src/app.js`, `/src/data.js`, and `/src/progress.js`, and confirm each returns HTTP 200.

- [ ] **Step 6: Perform responsive visual inspection**

Capture and inspect the home page at approximately 1440×1000 and 390×844. Verify no overflow, readable hierarchy, visible focus states, correct calendar layout, and usable task controls. Fix any observed defect and repeat automated checks.

- [ ] **Step 7: Commit deployment assets**

```bash
git add .github/workflows/pages.yml README.md tests/smoke.test.js
git commit -m "ci: deploy tracker to GitHub Pages"
```

- [ ] **Step 8: Create, push, and verify the GitHub repository**

Create public repository `moKshagna-p/sde-prep-tracker`, push local `main`, enable Pages through GitHub Actions if the workflow does not enable it automatically, and verify the workflow run reaches success.

- [ ] **Step 9: Verify the public deployment**

Open `https://mokshagna-p.github.io/sde-prep-tracker/` and confirm the document, stylesheet, and JavaScript assets load without errors. Toggle one task, refresh, and verify its state persists.

