const DB_KEYS = {
  users: 'ecobala_users',
  tasks: 'ecobala_tasks',
  reports: 'ecobala_reports'
};

const seedTasks = [
  { id: 1, title: 'Убрать территорию школы', points: 120, level: 'Легкий', topic: 'Чистота территории' },
  { id: 2, title: 'Сократить расход воды дома 7 дней', points: 180, level: 'Средний', topic: 'Экономия воды' },
  { id: 3, title: 'Посадить дерево во дворе', points: 300, level: 'Средний', topic: 'Озеленение' },
  { id: 4, title: 'Собрать макулатуру и сдать на переработку', points: 150, level: 'Легкий', topic: 'Сортировка мусора' }
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
}

function registerUser(user) {
  const users = readDB(DB_KEYS.users);
  users.push({ ...user, id: Date.now(), createdAt: new Date().toISOString() });
  writeDB(DB_KEYS.users, users);
}

function getTasks() {
  return readDB(DB_KEYS.tasks, seedTasks);
}

function saveReport(report) {
  const reports = readDB(DB_KEYS.reports);
  reports.push({ ...report, id: Date.now(), createdAt: new Date().toISOString() });
  writeDB(DB_KEYS.reports, reports);
}

initDB();
