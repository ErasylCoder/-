const city = document.getElementById('directorCity');
const schoolList = document.getElementById('schoolList');

function renderSchools() {
  const schools = citySchools[city.value] || [];
  schoolList.innerHTML = schools.map((name, index) => `<li><span>${index + 1}. ${name}</span><b>${index === 5 ? 'School №6 highlighted' : ''}</b></li>`).join('');
}

function renderMetrics() {
  document.getElementById('dUsers').textContent = getUsers().length;
  document.getElementById('dReports').textContent = getReports().length;
  document.getElementById('dLogs').textContent = getActivityLogs().length;
}

city?.addEventListener('change', renderSchools);
document.addEventListener('DOMContentLoaded', () => {
  renderSchools();
  renderMetrics();
});
