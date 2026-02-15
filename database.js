const DB_KEYS = {
  users: 'ecobala_users',
  tasks: 'ecobala_tasks',
  reports: 'ecobala_reports',
  language: 'ecobala_language'
};

const seedTasks = [
  { id: 1, title: 'Clean school yard', points: 120, level: 'Easy', topic: 'School territory' },
  { id: 2, title: 'Save water at home for 7 days', points: 180, level: 'Medium', topic: 'Water saving' },
  { id: 3, title: 'Plant a tree in your area', points: 300, level: 'Medium', topic: 'Greening' },
  { id: 4, title: 'Collect and recycle paper', points: 150, level: 'Easy', topic: 'Waste sorting' }
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
  if (!localStorage.getItem(DB_KEYS.language)) localStorage.setItem(DB_KEYS.language, 'ru');
}

function registerUser(user) {
  const users = readDB(DB_KEYS.users);
  users.push({ ...user, id: Date.now(), createdAt: new Date().toISOString() });
  writeDB(DB_KEYS.users, users);
}

function getUsers() {
  return readDB(DB_KEYS.users, []);
}

function getTasks() {
  return readDB(DB_KEYS.tasks, seedTasks);
}

function saveReport(report) {
  const reports = readDB(DB_KEYS.reports);
  reports.push({ ...report, id: Date.now(), createdAt: new Date().toISOString() });
  writeDB(DB_KEYS.reports, reports);
}

function getReports() {
  return readDB(DB_KEYS.reports, []);
}

initDB();
