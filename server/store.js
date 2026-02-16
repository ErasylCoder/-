const users = [];
const sessions = new Map();
const csrfTokens = new Map();
const rateMap = new Map();

function now() { return Date.now(); }

function addUser(user) { users.push(user); return user; }
function findUserByEmail(email) { return users.find((u) => u.email === email); }
function findUserById(id) { return users.find((u) => u.id === id); }

function createSession(userId, sid) {
  sessions.set(sid, { userId, createdAt: now() });
}
function getSession(sid) { return sessions.get(sid); }
function deleteSession(sid) { sessions.delete(sid); }

function setCsrf(sessionKey, token) { csrfTokens.set(sessionKey, token); }
function getCsrf(sessionKey) { return csrfTokens.get(sessionKey); }

function rateLimitCheck(ip, limit = 120, windowMs = 60_000) {
  const entry = rateMap.get(ip) || { count: 0, start: now() };
  if (now() - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now();
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count <= limit;
}

module.exports = {
  addUser,
  findUserByEmail,
  findUserById,
  createSession,
  getSession,
  deleteSession,
  setCsrf,
  getCsrf,
  rateLimitCheck
};
