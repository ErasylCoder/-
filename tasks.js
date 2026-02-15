const tasksGrid = document.getElementById('tasksGrid');
const taskSelect = document.getElementById('taskSelect');
const reportForm = document.getElementById('reportForm');
const photoInput = document.getElementById('photoInput');
const previewWrap = document.getElementById('previewWrap');

const tasks = getTasks();

tasksGrid.innerHTML = tasks.map((t) => `
  <article class="card">
    <h3>${t.title}</h3>
    <p>${t.topic} · ${t.level}</p>
    <p class="big">+${t.points}</p>
  </article>
`).join('');

taskSelect.innerHTML = tasks.map((t) => `<option value="${t.id}">${t.title}</option>`).join('');

photoInput?.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewWrap.innerHTML = `<img src="${reader.result}" alt="Фото-отчет" class="preview-img"/>`;
  };
  reader.readAsDataURL(file);
});

reportForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(reportForm);
  const photo = photoInput.files?.[0];
  if (!photo) return;
  const reader = new FileReader();
  reader.onload = () => {
    saveReport({
      taskId: Number(fd.get('taskId')),
      comment: fd.get('comment'),
      photoBase64: reader.result
    });
    alert(t('done'));
    reportForm.reset();
    previewWrap.innerHTML = '';
  };
  reader.readAsDataURL(photo);
});
