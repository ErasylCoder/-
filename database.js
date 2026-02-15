const DB_KEYS = {
  users: 'ecobala_users',
  tasks: 'ecobala_tasks',
  reports: 'ecobala_reports',
  language: 'ecobala_language',
  sessionUserId: 'ecobala_session_user_id',
  activity: 'ecobala_activity_logs'
};

const citySchools = {
  Chromtau: [
    'Хромтауская школа №1',
    'Хромтауская школа №2',
    'Хромтауская школа №3',
    'Хромтауская школа №4',
    'Хромтауская школа №5',
    'Хромтауская школа №6',
    'Хромтауская школа №7'
  ]
};

const seedTasks = [
  { id: 1, title: 'Clean school yard', points: 120, level: 'Easy', topic: 'School territory' },
  { id: 2, title: 'Save water for 7 days', points: 180, level: 'Medium', topic: 'Water saving' },
  { id: 3, title: 'Plant a tree', points: 300, level: 'Medium', topic: 'Greening' },
  { id: 4, title: 'Recycle paper', points: 150, level: 'Easy', topic: 'Waste sorting' }
];

function readDB(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeDB(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initDB() {
  if (!localStorage.getItem(DB_KEYS.tasks)) writeDB(DB_KEYS.tasks, seedTasks);
  if (!localStorage.getItem(DB_KEYS.users)) writeDB(DB_KEYS.users, []);
  if (!localStorage.getItem(DB_KEYS.reports)) writeDB(DB_KEYS.reports, []);
  if (!localStorage.getItem(DB_KEYS.activity)) writeDB(DB_KEYS.activity, []);
  if (!localStorage.getItem(DB_KEYS.language)) localStorage.setItem(DB_KEYS.language, 'ru');
}

function registerUser(user) {
  const users = readDB(DB_KEYS.users);
  const id = Date.now();
  const next = { ...user, id, createdAt: new Date().toISOString() };
  users.push(next);
  writeDB(DB_KEYS.users, users);
  localStorage.setItem(DB_KEYS.sessionUserId, String(id));
  return next;
}

function getUsers() { return readDB(DB_KEYS.users, []); }
function getTasks() { return readDB(DB_KEYS.tasks, seedTasks); }
function getReports() { return readDB(DB_KEYS.reports, []); }
function getActivityLogs() { return readDB(DB_KEYS.activity, []); }

function saveReport(report) {
  const reports = readDB(DB_KEYS.reports);
  reports.push({ ...report, id: Date.now(), createdAt: new Date().toISOString() });
  writeDB(DB_KEYS.reports, reports);
}

function getSessionUser() {
  const id = Number(localStorage.getItem(DB_KEYS.sessionUserId));
  return getUsers().find((u) => u.id === id) || null;
}

function logActivity(action, extra = {}) {
  const logs = readDB(DB_KEYS.activity);
  const user = getSessionUser();
  logs.push({
    id: Date.now() + Math.floor(Math.random() * 10),
    action,
    time: new Date().toISOString(),
    page: location.pathname,
    userName: user?.name || 'Guest',
    ...extra
  });
  writeDB(DB_KEYS.activity, logs.slice(-1000));
}

initDB();
