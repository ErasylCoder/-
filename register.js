const form = document.getElementById('registerForm');
const usersList = document.getElementById('usersList');

function renderUsers() {
  const users = JSON.parse(localStorage.getItem('ecobala_users') || '[]');
  usersList.innerHTML = users.length
    ? users.map((u) => `<li><span>${u.name} · ${u.age} лет · ${u.school}</span><b>${u.city}</b></li>`).join('')
    : '<li><span>Пока нет зарегистрированных учеников</span><b>—</b></li>';
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(form).entries());
  registerUser(payload);
  form.reset();
  renderUsers();
  alert('Регистрация успешна!');
});

renderUsers();
