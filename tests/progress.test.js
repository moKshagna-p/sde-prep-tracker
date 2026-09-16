import test from 'node:test';
import assert from 'node:assert/strict';
import {
  enumerateDates,
  clampDate,
  sanitizeProgress,
  calculateStats,
  calculateStreak,
  createProgressStore
} from '../src/progress.js';

const taskIds = ['dsa', 'core'];

test('enumerates the inclusive preparation range', () => {
  const dates = enumerateDates('2026-09-16', '2026-10-30');
  assert.equal(dates.length, 45);
  assert.equal(dates.at(0), '2026-09-16');
  assert.equal(dates.at(-1), '2026-10-30');
});

test('clamps dates to the preparation range', () => {
  assert.equal(clampDate('2026-09-01', '2026-09-16', '2026-10-30'), '2026-09-16');
  assert.equal(clampDate('2026-11-02', '2026-09-16', '2026-10-30'), '2026-10-30');
  assert.equal(clampDate('2026-10-01', '2026-09-16', '2026-10-30'), '2026-10-01');
  assert.equal(clampDate('invalid', '2026-09-16', '2026-10-30'), '2026-09-16');
});

test('sanitizes malformed progress and unknown tasks', () => {
  const result = sanitizeProgress({
    '2026-09-16': { dsa: true, core: 'yes', unknown: true },
    bad: null
  }, taskIds);
  assert.deepEqual(result, { '2026-09-16': { dsa: true } });
});

test('calculates item and completed-day statistics', () => {
  const dates = ['2026-09-16', '2026-09-17'];
  const progress = {
    '2026-09-16': { dsa: true, core: true },
    '2026-09-17': { dsa: true }
  };
  assert.deepEqual(calculateStats(progress, dates, taskIds), {
    completedItems: 3,
    totalItems: 4,
    percentage: 75,
    completedDays: 1
  });
});

test('calculates consecutive completed-day streak ending at the latest eligible day', () => {
  const dates = ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19'];
  const progress = {
    '2026-09-16': { dsa: true, core: true },
    '2026-09-18': { dsa: true, core: true },
    '2026-09-19': { dsa: true, core: true }
  };
  assert.equal(calculateStreak(progress, dates, taskIds, '2026-09-19'), 2);
  assert.equal(calculateStreak(progress, dates, taskIds, '2026-09-17'), 1);
});

test('falls back to memory when browser storage is unavailable', () => {
  const brokenStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); }
  };
  const store = createProgressStore(brokenStorage, 'test', taskIds);
  assert.equal(store.persistent, false);
  store.save({ '2026-09-16': { dsa: true } });
  assert.deepEqual(store.load(), { '2026-09-16': { dsa: true } });
  store.clear();
  assert.deepEqual(store.load(), {});
});

test('loads sanitized progress from available storage', () => {
  const values = new Map([['test', JSON.stringify({ '2026-09-16': { dsa: true, core: false } })]]);
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); }
  };
  const store = createProgressStore(storage, 'test', taskIds);
  assert.equal(store.persistent, true);
  assert.deepEqual(store.load(), { '2026-09-16': { dsa: true, core: false } });
});
