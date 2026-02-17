const path = require('path');
const express = require('express');
const {
  addUser,
  findUserByEmail,
  findUserById,
  createSession,
  getSession,
  deleteSession,
  setCsrf,
  getCsrf,
  rateLimitCheck
} = require('./store');
const {
  createSalt,
  hashPassword,
  timingSafeEqual,
  validateEmail,
  sanitize,
  randomToken
} = require('./security');

const app = express();
const PORT = process.env.PORT || 4173;

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (!rateLimitCheck(req.ip)) return res.status(429).json({ error: 'Сұрау тым көп' });
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const [k, v] = part.trim().split('=');
    if (k) acc[k] = decodeURIComponent(v || '');
    return acc;
  }, {});
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  parts.push('Path=/');
  res.append('Set-Cookie', parts.join('; '));
}

function authMiddleware(req, _res, next) {
  const sid = parseCookies(req).sid;
  if (!sid) return next();
  const session = getSession(sid);
  if (!session) return next();
  req.user = findUserById(session.userId) || null;
  req.sid = sid;
  next();
}

function csrfMiddleware(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookies = parseCookies(req);
  const sidOrGuest = cookies.sid || `guest:${req.ip}`;
  const expected = getCsrf(sidOrGuest);
  const received = req.headers['x-csrf-token'];
  if (!expected || !received || !timingSafeEqual(expected, String(received))) {
    return res.status(403).json({ error: 'CSRF токені жарамсыз' });
  }
  next();
}

app.use(authMiddleware);

app.get('/api/csrf', (req, res) => {
  const cookies = parseCookies(req);
  const sessionKey = cookies.sid || `guest:${req.ip}`;
  const token = randomToken(24);
  setCsrf(sessionKey, token);
  setCookie(res, 'csrf-token', token, { sameSite: 'Strict', maxAge: 60 * 60 * 2 });
  res.json({ token });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, user: { id: req.user.id, username: req.user.username, email: req.user.email } });
});

app.post('/api/auth/register', csrfMiddleware, async (req, res) => {
  try {
    const username = sanitize(req.body.username);
    const email = sanitize(String(req.body.email || '').toLowerCase());
    const password = String(req.body.password || '');

    if (username.length < 3) return res.status(400).json({ error: 'Аты тым қысқа' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Эл. пошта қате' });
    if (password.length < 8) return res.status(400).json({ error: 'Құпиясөз кемінде 8 таңба' });
    if (findUserByEmail(email)) return res.status(409).json({ error: 'Пайдаланушы бар' });

    const salt = createSalt();
    const hash = await hashPassword(password, salt);
    const user = addUser({
      id: randomToken(8),
      username,
      email,
      hash,
      salt,
      createdAt: new Date().toISOString()
    });

    const sid = randomToken(24);
    createSession(user.id, sid);
    setCookie(res, 'sid', sid, { httpOnly: true, sameSite: 'Strict', maxAge: 60 * 60 * 24 * 7 });

    res.status(201).json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch {
    res.status(500).json({ error: 'Ішкі қате' });
  }
});

app.post('/api/auth/login', csrfMiddleware, async (req, res) => {
  const email = sanitize(String(req.body.email || '').toLowerCase());
  const password = String(req.body.password || '');
  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Деректер қате' });

  const hash = await hashPassword(password, user.salt);
  if (!timingSafeEqual(hash, user.hash)) return res.status(401).json({ error: 'Деректер қате' });

  const sid = randomToken(24);
  createSession(user.id, sid);
  setCookie(res, 'sid', sid, { httpOnly: true, sameSite: 'Strict', maxAge: 60 * 60 * 24 * 7 });
  res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
});

app.post('/api/auth/logout', csrfMiddleware, (req, res) => {
  const sid = parseCookies(req).sid;
  if (sid) deleteSession(sid);
  setCookie(res, 'sid', '', { httpOnly: true, sameSite: 'Strict', maxAge: 0 });
  res.json({ ok: true });
});

app.use(express.static(path.resolve(__dirname, '..')));
app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, '..', 'index.html')));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`EcoBala server running at http://localhost:${PORT}`);
});
