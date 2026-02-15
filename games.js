const guessResult = document.getElementById('guessResult');
const puzzleStatus = document.getElementById('puzzleStatus');

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
      '✅ Верно! Пластик можно перерабатывать.', '❌ Неверно, попробуй снова.',
      '✅ Correct! Plastic can be recycled.', '❌ Wrong, try again.',
      '✅ Дұрыс! Пластик қайта өңделеді.', '❌ Қате, қайта көріңіз.',
      isOk
    );
    logActivity('Play recycle game', { correct: isOk });
  });
});

let puzzleStep = 1;

document.querySelectorAll('.puzzle-piece').forEach((piece) => {
  piece.addEventListener('click', () => {
    const step = Number(piece.dataset.step);
    if (step === puzzleStep) {
      piece.classList.add('ok');
      puzzleStep += 1;
      piece.disabled = true;
      if (puzzleStep === 4) {
        puzzleStatus.textContent = '🎉 Отлично! Ты построил путь к чистому будущему!';
        logActivity('Solve puzzle game', { result: 'completed' });
      } else {
        puzzleStatus.textContent = 'Хорошо! Продолжай.';
      }
    } else {
      puzzleStatus.textContent = 'Попробуй другой порядок.';
      logActivity('Puzzle wrong step', { clicked: step, expected: puzzleStep });
    }
  });
});
