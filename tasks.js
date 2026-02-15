const tasksGrid = document.getElementById('tasksGrid');
const taskSelect = document.getElementById('taskSelect');
const reportForm = document.getElementById('reportForm');
const photoInput = document.getElementById('photoInput');
const previewWrap = document.getElementById('previewWrap');

const tasks = getTasks();

tasksGrid.innerHTML = tasks.map((task) => `
  <article class="card">
    <h3>${task.title}</h3>
    <p>${task.topic} · ${task.level}</p>
    <p class="big">+${task.points}</p>
  </article>
`).join('');

taskSelect.innerHTML = tasks.map((task) => `<option value="${task.id}">${task.title}</option>`).join('');

photoInput?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewWrap.innerHTML = `<img src="${reader.result}" alt="report" class="preview-img"/>`;
  };
  reader.readAsDataURL(file);
});

reportForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(reportForm);
  const file = photoInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const report = {
      taskId: Number(formData.get('taskId')),
      comment: String(formData.get('comment') || ''),
      photoBase64: reader.result,
      userId: getSessionUser()?.id || null
    };
    saveReport(report);
    logActivity('Upload report', { taskId: report.taskId, comment: report.comment });
    alert(t('done'));
    reportForm.reset();
    previewWrap.innerHTML = '';
  };
  reader.readAsDataURL(file);
});
