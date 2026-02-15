const button = document.getElementById('toggleScenario');
const text = document.getElementById('scenarioText');

let dryMode = true;

button?.addEventListener('click', () => {
  if (dryMode) {
    text.textContent = '❌ Без экономии воды: пересохшие реки, дефицит питьевой воды и рост болезней. Школы тратят больше бюджета на ресурсы.';
    button.textContent = 'Показать позитивный сценарий';
  } else {
    text.textContent = '✅ С экологическими привычками: чистые реки, зеленые дворы и экономия бюджета школы. Ученики получают награды за реальную пользу.';
    button.textContent = 'Показать сценарий';
  }

  dryMode = !dryMode;
});
