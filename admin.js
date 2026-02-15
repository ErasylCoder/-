const pinForm = document.getElementById('pinForm');
const pinInput = document.getElementById('pinInput');
const gate = document.getElementById('adminGate');
const content = document.getElementById('adminContent');

function renderAdmin() {
  const users = getUsers();
  const reports = getReports();
  const logs = getActivityLogs().sort((a, b) => new Date(b.time) - new Date(a.time));

  document.getElementById('usersCount').textContent = users.length;
  document.getElementById('reportsCount').textContent = reports.length;
  document.getElementById('logsCount').textContent = logs.length;

  document.getElementById('adminUsers').innerHTML = users.length
    ? users.map((u) => `<li><span>${u.name} · ${u.age} · ${u.school}</span><b>${u.city}</b></li>`).join('')
    : `<li><span>${t('noUsers')}</span><b>—</b></li>`;

  document.getElementById('activityList').innerHTML = logs.length
    ? logs.slice(0, 60).map((l) => `<li><span>${new Date(l.time).toLocaleString()} · ${l.userName} · ${l.action}</span><b>${l.page}</b></li>`).join('')
    : '<li><span>No activity yet</span><b>—</b></li>';

  document.getElementById('adminReports').innerHTML = reports.length
    ? reports.map((r) => `<article class="card"><p><b>${new Date(r.createdAt).toLocaleString()}</b></p><p>Task: ${r.taskId}</p><p>${r.comment || ''}</p>${r.photoBase64 ? `<img class="preview-img" src="${r.photoBase64}" alt="report"/>` : ''}</article>`).join('')
    : '<p class="muted">No reports yet.</p>';
}

pinForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (pinInput.value === '2026') {
    gate.classList.add('hidden');
    content.classList.remove('hidden');
    renderAdmin();
  } else {
    alert('Wrong PIN');
  }
});
