const guessResult = document.getElementById('guessResult');
const answerResult = document.getElementById('answerResult');

function msg(okRu, badRu, okEn, badEn, okKz, badKz, isOk) {
  const lang = getLang();
  if (lang === 'en') return isOk ? okEn : badEn;
  if (lang === 'kz') return isOk ? okKz : badKz;
  return isOk ? okRu : badRu;
}

document.querySelectorAll('.guess').forEach((button) => {
  button.addEventListener('click', () => {
    const isOk = button.dataset.ok === '1';
    guessResult.textContent = msg(
      '✅ Верно! Пластик можно перерабатывать.', '❌ Неверно. Попробуй ещё.',
      '✅ Correct! Plastic can be recycled.', '❌ Wrong. Try again.',
      '✅ Дұрыс! Пластикті қайта өңдеуге болады.', '❌ Қате. Қайта көріңіз.',
      isOk
    );
    logActivity('Play recycle game', { correct: isOk });
  });
});

document.querySelectorAll('.answer').forEach((button) => {
  button.addEventListener('click', () => {
    const isOk = button.dataset.a === '1';
    answerResult.textContent = msg(
      '✅ Отлично! Это помогает беречь воду.', '❌ Неправильно. Экономия выше.',
      '✅ Great! This helps save water.', '❌ Not correct. Real saving is higher.',
      '✅ Тамаша! Бұл суды үнемдейді.', '❌ Дұрыс емес. Нақты үнемдеу көп.',
      isOk
    );
    logActivity('Play water game', { correct: isOk });
  });
});
