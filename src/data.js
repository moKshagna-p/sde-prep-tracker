export const START_DATE = '2026-09-16';
export const END_DATE = '2026-10-30';
export const STORAGE_KEY = 'sde-prep-tracker:v1';

export const TASKS = [
  { id: 'dsa', label: 'DSA practice', duration: '90 min', marker: '01', description: 'Solve 2 problems. Record the pattern, complexity, and mistake.' },
  { id: 'core', label: 'Core CS', duration: '45 min', marker: '02', description: 'Study one DBMS, OS, networks, or OOP topic deeply.' },
  { id: 'development', label: 'Development', duration: '60–90 min', marker: '03', description: 'Build or debug your flagship full-stack project.' },
  { id: 'revision', label: 'Revision', duration: '30 min', marker: '04', description: 'Review yesterday plus one older mistake using spaced repetition.' },
  { id: 'speaking', label: 'Interview speaking', duration: '15 min', marker: '05', description: 'Explain one technical answer aloud with precise reasoning.' },
  { id: 'applications', label: 'Applications', duration: '15–30 min', marker: '06', description: 'Apply, improve your resume, or prepare one behavioral answer.' }
];

export const ROADMAP = [
  { start: '2026-09-16', end: '2026-09-22', week: 1, dsa: 'Arrays, strings & hashing', core: 'DBMS fundamentals and SQL' },
  { start: '2026-09-23', end: '2026-09-29', week: 2, dsa: 'Two pointers, sliding window & prefix sums', core: 'OS processes, threads and scheduling' },
  { start: '2026-09-30', end: '2026-10-06', week: 3, dsa: 'Binary search, sorting & linked lists', core: 'Networks, HTTP, DNS and TCP' },
  { start: '2026-10-07', end: '2026-10-13', week: 4, dsa: 'Stacks, queues & monotonic patterns', core: 'JavaScript and React fundamentals' },
  { start: '2026-10-14', end: '2026-10-20', week: 5, dsa: 'Trees, BST and recursion', core: 'DBMS indexing and transactions' },
  { start: '2026-10-21', end: '2026-10-27', week: 6, dsa: 'Graphs, BFS and DFS', core: 'Backend, authentication and caching' },
  { start: '2026-10-28', end: '2026-10-30', week: 7, dsa: 'Mixed timed interview sets', core: 'Project defence and system design basics' }
];
