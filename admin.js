const users = getUsers();
const reports = getReports();

const usersCount = document.getElementById('usersCount');
const reportsCount = document.getElementById('reportsCount');
const adminUsers = document.getElementById('adminUsers');
const adminReports = document.getElementById('adminReports');

usersCount.textContent = users.length;
reportsCount.textContent = reports.length;

adminUsers.innerHTML = users.length
  ? users.map((u) => `<li><span>${u.name} · ${u.age} · ${u.school}</span><b>${u.city}</b></li>`).join('')
  : `<li><span>${t('noUsers')}</span><b>—</b></li>`;

adminReports.innerHTML = reports.length
  ? reports.map((r) => `<article class="card"><p><b>ID task:</b> ${r.taskId}</p><p>${r.comment || ''}</p>${r.photoBase64 ? `<img class="preview-img" src="${r.photoBase64}" alt="report"/>` : ''}</article>`).join('')
  : `<p class="muted">No reports yet.</p>`;
