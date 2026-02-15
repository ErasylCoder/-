const form = document.getElementById('registerForm');
const usersList = document.getElementById('usersList');

function renderUsers() {
  const users = getUsers();
  usersList.innerHTML = users.length
    ? users.map((u) => `<li><span>${u.name} · ${u.age} · ${u.school}</span><b>${u.city}</b></li>`).join('')
    : `<li><span>${t('noUsers')}</span><b>—</b></li>`;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  registerUser(payload);
  form.reset();
  renderUsers();
  alert(`${t('registerBtn')} ✓`);
});

document.addEventListener('DOMContentLoaded', renderUsers);
document.addEventListener('click', (e) => {
  if (e.target.closest('.lang-btn')) setTimeout(renderUsers, 0);
});
