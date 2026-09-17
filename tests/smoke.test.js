import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('page exposes the required accessible application shell', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<meta[^>]+name="viewport"/);
  assert.match(html, /<h1[^>]*>/);
  for (const id of [
    'selected-date', 'day-context', 'daily-progress', 'task-list', 'calendar',
    'roadmap', 'previous-day', 'next-day', 'today', 'reset-progress',
    'storage-warning', 'overall-progress', 'current-streak', 'completed-days',
    'remaining-days'
  ]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /type="module" src="src\/app\.js"/);
});

test('schedule exports six unique tasks and covers the full range', async () => {
  const data = await import('../src/data.js');
  assert.equal(data.START_DATE, '2026-09-16');
  assert.equal(data.END_DATE, '2026-10-30');
  assert.equal(data.TASKS.length, 6);
  assert.equal(new Set(data.TASKS.map((task) => task.id)).size, 6);
  assert.equal(data.ROADMAP.at(0).start, data.START_DATE);
  assert.equal(data.ROADMAP.at(-1).end, data.END_DATE);
});

test('application wires rendering, persistence, navigation, and safe reset', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /from '\.\/data\.js'/);
  assert.match(app, /from '\.\/progress\.js'/);
  assert.match(app, /createProgressStore/);
  assert.match(app, /addEventListener\('change'/);
  assert.match(app, /addEventListener\('click'/);
  assert.match(app, /window\.confirm/);
  assert.match(app, /storage-warning/);
});

test('stylesheet defines responsive, accessible, and stateful presentation', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media[^\{]+max-width/);
  assert.match(css, /@media[^\{]+min-width/);
  assert.match(css, /\.calendar-day\.is-selected/);
  assert.match(css, /\.task\.is-complete/);
  assert.match(css, /\.warning/);
});

test('page uses the editorial today-first layout without AI dashboard decoration', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /class="utility-header/);
  assert.match(html, /class="progress-summary/);
  assert.match(html, /class="planner-layout/);
  assert.match(html, /class="daily-workspace/);
  assert.match(html, /class="syllabus/);
  assert.doesNotMatch(html, /class="ambient/);
  assert.doesNotMatch(html, /class="hero/);
  assert.doesNotMatch(html, /class="stat-card/);
});

test('editorial stylesheet avoids glow and glass dashboard patterns', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /--paper:/);
  assert.match(css, /--ink:/);
  assert.match(css, /--accent:/);
  assert.match(css, /\.daily-workspace/);
  assert.match(css, /\.syllabus/);
  assert.doesNotMatch(css, /backdrop-filter/);
  assert.doesNotMatch(css, /filter:\s*blur/);
  assert.doesNotMatch(css, /box-shadow:[^;]*0 0/);
}
);

test('GitHub Pages workflow deploys main with required permissions', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /enablement:\s*true/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /environment:\s*\n\s*name:\s*github-pages/);
});

test('README documents local usage, tests, persistence, and live URL', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(readme, /python3 -m http\.server 4173/);
  assert.match(readme, /npm test/);
  assert.match(readme, /npm run check/);
  assert.match(readme, /localStorage/);
  assert.match(readme, /https:\/\/mokshagna-p\.github\.io\/sde-prep-tracker\//);
});
