import { START_DATE, END_DATE, STORAGE_KEY, TASKS, ROADMAP } from './data.js';
import {
  enumerateDates,
  clampDate,
  calculateStats,
  calculateStreak,
  createProgressStore
} from './progress.js';

const dates = enumerateDates(START_DATE, END_DATE);
const taskIds = TASKS.map((task) => task.id);
const todayIso = new Date().toISOString().slice(0, 10);
const store = createProgressStore(window.localStorage, STORAGE_KEY, taskIds);
let selectedDate = clampDate(todayIso, START_DATE, END_DATE);
let progress = store.load();

const elements = Object.fromEntries([
  'selected-date', 'day-context', 'daily-progress', 'daily-progress-bar',
  'task-list', 'calendar', 'roadmap', 'previous-day', 'next-day', 'today',
  'reset-progress', 'storage-warning', 'overall-progress', 'overall-progress-bar',
  'current-streak', 'completed-days', 'remaining-days'
].map((id) => [id, document.getElementById(id)]));

function formatDate(isoDate, options = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('en-IN', { ...options, timeZone: 'UTC' })
    .format(new Date(`${isoDate}T00:00:00Z`));
}

function dateStatus(date) {
  const completed = taskIds.filter((taskId) => progress[date]?.[taskId]).length;
  return { completed, done: completed === taskIds.length, percentage: Math.round((completed / taskIds.length) * 100) };
}

function setSelectedDate(date) {
  selectedDate = clampDate(date, START_DATE, END_DATE);
  render();
}

function moveDate(offset) {
  const nextIndex = Math.max(0, Math.min(dates.length - 1, dates.indexOf(selectedDate) + offset));
  setSelectedDate(dates[nextIndex]);
}

function renderTasks() {
  elements['task-list'].replaceChildren();
  for (const task of TASKS) {
    const checked = progress[selectedDate]?.[task.id] === true;
    const label = document.createElement('label');
    label.className = `task${checked ? ' is-complete' : ''}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.dataset.taskId = task.id;
    input.setAttribute('aria-label', `${task.label} for ${formatDate(selectedDate)}`);

    const marker = document.createElement('span');
    marker.className = 'task-marker';
    marker.textContent = task.marker;

    const copy = document.createElement('span');
    copy.className = 'task-copy';
    const title = document.createElement('strong');
    title.textContent = task.label;
    const description = document.createElement('small');
    description.textContent = task.description;
    copy.append(title, description);

    const duration = document.createElement('span');
    duration.className = 'task-duration';
    duration.textContent = task.duration;
    label.append(input, marker, copy, duration);
    elements['task-list'].append(label);
  }
}

function renderCalendar() {
  elements.calendar.replaceChildren();
  const firstDay = new Date(`${START_DATE}T00:00:00Z`).getUTCDay();
  const mondayOffset = (firstDay + 6) % 7;
  for (let index = 0; index < mondayOffset; index += 1) {
    const spacer = document.createElement('span');
    spacer.className = 'calendar-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    elements.calendar.append(spacer);
  }

  for (const date of dates) {
    const status = dateStatus(date);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = [
      'calendar-day', status.done ? 'is-complete' : '',
      date === selectedDate ? 'is-selected' : '',
      date === todayIso ? 'is-today' : ''
    ].filter(Boolean).join(' ');
    button.textContent = new Date(`${date}T00:00:00Z`).getUTCDate();
    button.dataset.date = date;
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `${formatDate(date)}, ${status.percentage}% complete`);
    if (date === selectedDate) button.setAttribute('aria-current', 'date');
    elements.calendar.append(button);
  }
}

function renderRoadmap() {
  elements.roadmap.replaceChildren();
  for (const item of ROADMAP) {
    const active = selectedDate >= item.start && selectedDate <= item.end;
    const card = document.createElement('article');
    card.className = `roadmap-card${active ? ' is-active' : ''}`;
    const label = document.createElement('p');
    label.className = 'eyebrow';
    label.textContent = `WEEK ${item.week} · ${formatDate(item.start, { day: 'numeric', month: 'short' }).toUpperCase()}`;
    const dsa = document.createElement('h3');
    dsa.textContent = item.dsa;
    const core = document.createElement('p');
    core.textContent = item.core;
    card.append(label, dsa, core);
    elements.roadmap.append(card);
  }
}

function renderSummary() {
  const stats = calculateStats(progress, dates, taskIds);
  const day = dateStatus(selectedDate);
  elements['overall-progress'].textContent = `${stats.percentage}%`;
  elements['overall-progress-bar'].style.width = `${stats.percentage}%`;
  elements['current-streak'].textContent = calculateStreak(progress, dates, taskIds, selectedDate);
  elements['completed-days'].textContent = stats.completedDays;
  elements['remaining-days'].textContent = dates.length - stats.completedDays;
  elements['daily-progress'].textContent = `${day.percentage}%`;
  elements['daily-progress-bar'].style.width = `${day.percentage}%`;
}

function renderHeader() {
  const selectedIndex = dates.indexOf(selectedDate);
  const selectedDay = new Date(`${selectedDate}T00:00:00Z`).getUTCDay();
  elements['selected-date'].textContent = formatDate(selectedDate);
  elements['day-context'].textContent = selectedDay === 0 ? 'SUNDAY · REVIEW & RESET' : `DAY ${selectedIndex + 1} · TODAY'S MISSION`;
  elements['previous-day'].disabled = selectedIndex === 0;
  elements['next-day'].disabled = selectedIndex === dates.length - 1;
  elements['storage-warning'].hidden = store.persistent;
}

function render() {
  renderHeader();
  renderSummary();
  renderTasks();
  renderCalendar();
  renderRoadmap();
}

elements['task-list'].addEventListener('change', (event) => {
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;
  progress[selectedDate] = { ...progress[selectedDate], [input.dataset.taskId]: input.checked };
  store.save(progress);
  render();
});

elements.calendar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-date]');
  if (button) setSelectedDate(button.dataset.date);
});

elements['previous-day'].addEventListener('click', () => moveDate(-1));
elements['next-day'].addEventListener('click', () => moveDate(1));
elements.today.addEventListener('click', () => setSelectedDate(todayIso));
elements['reset-progress'].addEventListener('click', () => {
  if (!window.confirm('Reset every completed task? This cannot be undone.')) return;
  store.clear();
  progress = {};
  render();
});

render();
