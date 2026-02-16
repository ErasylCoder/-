const form = document.getElementById('registerForm');
const citySelect = document.getElementById('citySelect');
const schoolSelect = document.getElementById('schoolSelect');

let csrfToken = '';

async function ensureCsrf() {
  if (csrfToken) return csrfToken;
  const response = await fetch('/api/csrf', { credentials: 'include' });
  const data = await response.json();
  csrfToken = data.token;
  return csrfToken;
}

function populateSchools() {
  if (!citySelect || !schoolSelect) return;
  const schools = citySchools[citySelect.value] || [];
  schoolSelect.innerHTML = schools.map((name) => `<option value="${name}">${name}</option>`).join('');
}

function validateForm(payload) {
  if (!payload.username || payload.username.length < 3) return 'Username must be at least 3 characters';
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return 'Invalid email';
  if (!payload.password || payload.password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fd = new FormData(form);
  const payload = {
    username: String(fd.get('name') || '').trim(),
    email: String(fd.get('email') || '').trim().toLowerCase(),
    password: String(fd.get('password') || ''),
    role: String(fd.get('role') || ''),
    city: String(fd.get('city') || ''),
    school: String(fd.get('school') || '')
  };

  const validationError = validateForm(payload);
  if (validationError) {
    alert(validationError);
    return;
  }

  try {
    await ensureCsrf();
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Registration failed');
      return;
    }

    const localUser = registerUser({
      name: payload.username,
      age: Number(fd.get('age') || 0),
      role: payload.role,
      city: payload.city,
      school: payload.school
    });
    logActivity('User registration', { userName: localUser.name });

    alert('Registration completed successfully');
    form.reset();
    populateSchools();
    location.href = 'tasks.html';
  } catch {
    alert('Network or server error');
  }
});

citySelect?.addEventListener('change', populateSchools);

document.addEventListener('DOMContentLoaded', () => {
  populateSchools();
});
