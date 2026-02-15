const guessResult = document.getElementById('guessResult');
const answerResult = document.getElementById('answerResult');

function msg(okRu, badRu, okEn, badEn, okKz, badKz, isOk) {
  const lang = getLang();
  if (lang === 'en') return isOk ? okEn : badEn;
  if (lang === 'kz') return isOk ? okKz : badKz;
  return isOk ? okRu : badRu;
}

document.querySelectorAll('.guess').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOk = btn.dataset.ok === '1';
    guessResult.textContent = msg(
      '✅ Верно! Пластик можно перерабатывать.',
      '❌ Неверно. Попробуй ещё.',
      '✅ Correct! Plastic can be recycled.',
      '❌ Wrong. Try again.',
      '✅ Дұрыс! Пластикті қайта өңдеуге болады.',
      '❌ Қате. Қайта көріңіз.',
      isOk
    );
  });
});

document.querySelectorAll('.answer').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOk = btn.dataset.a === '1';
    answerResult.textContent = msg(
      '✅ Отлично! Это помогает беречь воду.',
      '❌ Неправильно. Экономия значительно выше.',
      '✅ Great! This helps save water.',
      '❌ Not correct. Real saving is much higher.',
      '✅ Тамаша! Бұл суды үнемдеуге көмектеседі.',
      '❌ Дұрыс емес. Нақты үнемдеу әлдеқайда көп.',
      isOk
    );
  });
});
