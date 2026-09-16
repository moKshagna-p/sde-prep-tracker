const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toUtcDate(isoDate) {
  if (!ISO_DATE.test(isoDate)) return null;
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== isoDate ? null : date;
}

export function enumerateDates(start, end) {
  const first = toUtcDate(start);
  const last = toUtcDate(end);
  if (!first || !last || first > last) return [];

  const dates = [];
  for (const current = new Date(first); current <= last; current.setUTCDate(current.getUTCDate() + 1)) {
    dates.push(current.toISOString().slice(0, 10));
  }
  return dates;
}

export function clampDate(value, start, end) {
  if (!toUtcDate(value)) return start;
  if (value < start) return start;
  if (value > end) return end;
  return value;
}

export function sanitizeProgress(value, taskIds) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const knownTasks = new Set(taskIds);
  const clean = {};

  for (const [date, tasks] of Object.entries(value)) {
    if (!toUtcDate(date) || !tasks || typeof tasks !== 'object' || Array.isArray(tasks)) continue;
    const validTasks = {};
    for (const [taskId, completed] of Object.entries(tasks)) {
      if (knownTasks.has(taskId) && typeof completed === 'boolean') validTasks[taskId] = completed;
    }
    if (Object.keys(validTasks).length) clean[date] = validTasks;
  }
  return clean;
}

function isDayComplete(progress, date, taskIds) {
  return taskIds.length > 0 && taskIds.every((taskId) => progress[date]?.[taskId] === true);
}

export function calculateStats(progress, dates, taskIds) {
  const completedItems = dates.reduce((total, date) => (
    total + taskIds.filter((taskId) => progress[date]?.[taskId] === true).length
  ), 0);
  const totalItems = dates.length * taskIds.length;
  return {
    completedItems,
    totalItems,
    percentage: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
    completedDays: dates.filter((date) => isDayComplete(progress, date, taskIds)).length
  };
}

export function calculateStreak(progress, dates, taskIds, selectedDate) {
  let index = Math.min(dates.indexOf(selectedDate), dates.length - 1);
  if (index < 0) return 0;
  while (index >= 0 && !isDayComplete(progress, dates[index], taskIds)) index -= 1;

  let streak = 0;
  while (index >= 0 && isDayComplete(progress, dates[index], taskIds)) {
    streak += 1;
    index -= 1;
  }
  return streak;
}

export function createProgressStore(storage, key, taskIds) {
  let memory = {};
  let canPersist = true;

  try {
    storage?.getItem(key);
    if (!storage) canPersist = false;
  } catch {
    canPersist = false;
  }

  function load() {
    if (!canPersist) return structuredClone(memory);
    try {
      const raw = storage.getItem(key);
      memory = raw ? sanitizeProgress(JSON.parse(raw), taskIds) : {};
    } catch {
      canPersist = false;
    }
    return structuredClone(memory);
  }

  function save(progress) {
    memory = sanitizeProgress(progress, taskIds);
    if (canPersist) {
      try {
        storage.setItem(key, JSON.stringify(memory));
      } catch {
        canPersist = false;
      }
    }
  }

  function clear() {
    memory = {};
    if (canPersist) {
      try {
        storage.removeItem(key);
      } catch {
        canPersist = false;
      }
    }
  }

  return {
    load,
    save,
    clear,
    get persistent() { return canPersist; }
  };
}
