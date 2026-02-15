const form = document.getElementById('registerForm');
const usersList = document.getElementById('usersList');
const citySelect = document.getElementById('citySelect');
const schoolSelect = document.getElementById('schoolSelect');

function populateSchools() {
  if (!citySelect || !schoolSelect) return;
  const schools = citySchools[citySelect.value] || [];
  schoolSelect.innerHTML = schools.map((name) => `<option value="${name}">${name}</option>`).join('');
}

function renderUsers() {
  if (!usersList) return;
  const users = getUsers();
  usersList.innerHTML = users.length
    ? users.map((u) => `<li><span>${u.name} · ${u.age} · ${u.school}</span><b>${u.city}</b></li>`).join('')
    : `<li><span>${t('noUsers')}</span><b>—</b></li>`;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  const created = registerUser(payload);
  logActivity('User registration', { userId: created.id, userName: created.name });
  form.reset();
  populateSchools();
  renderUsers();
  alert(`${t('submit')} ✓`);
  if (location.pathname.endsWith('/index.html') || location.pathname === '/') {
    location.href = 'tasks.html';
  }
});

citySelect?.addEventListener('change', populateSchools);

document.addEventListener('DOMContentLoaded', () => {
  populateSchools();
  renderUsers();
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.lang-btn')) setTimeout(renderUsers, 0);
});
