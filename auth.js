let csrf = '';

async function loadCsrf() {
  const response = await fetch('/api/csrf', { credentials: 'include' });
  const data = await response.json();
  csrf = data.token;
}

async function post(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    body: JSON.stringify(payload)
  });
  return res.json().then((data) => ({ ok: res.ok, data }));
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  const { ok, data } = await post('/api/auth/login', f);
  if (!ok) return alert(data.error || 'Кіру сәтсіз');
  location.href = 'index.html';
});

document.getElementById('registerAuthForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  const { ok, data } = await post('/api/auth/register', f);
  if (!ok) return alert(data.error || 'Тіркелу сәтсіз');
  location.href = 'index.html';
});

loadCsrf().catch(() => alert('CSRF токенді алу мүмкін болмады'));
