const guessResult = document.getElementById('guessResult');
const answerResult = document.getElementById('answerResult');

document.querySelectorAll('.guess').forEach((btn) => {
  btn.addEventListener('click', () => {
    guessResult.textContent = btn.dataset.ok === '1'
      ? '✅ Верно! Пластик можно перерабатывать при правильной сортировке.'
      : '❌ Неверно. Попробуй выбрать перерабатываемый материал.';
  });
});

document.querySelectorAll('.answer').forEach((btn) => {
  btn.addEventListener('click', () => {
    answerResult.textContent = btn.dataset.a === '1'
      ? '✅ Отлично! Это помогает беречь воду каждый день.'
      : '❌ Неправильно. Реальная экономия значительно выше.';
  });
});
