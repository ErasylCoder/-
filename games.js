const guessResult = document.getElementById('guessResult');
const puzzleStatus = document.getElementById('puzzleStatus');

function gameMessage(ok) {
  return ok ? t('gameGood') : t('gameBad');
}

document.querySelectorAll('.guess').forEach((button) => {
  button.addEventListener('click', () => {
    const isOk = button.dataset.ok === '1';
    guessResult.textContent = gameMessage(isOk);
    guessResult.style.color = isOk ? '#12a150' : '#d95555';
    button.classList.add(isOk ? 'ok' : 'shake');
    setTimeout(() => button.classList.remove('ok', 'shake'), 500);
    logActivity('Play recycle game', { correct: isOk });
  });
});

let puzzleStep = 1;
let streak = 0;

document.querySelectorAll('.puzzle-piece').forEach((piece) => {
  piece.addEventListener('click', () => {
    const step = Number(piece.dataset.step);
    if (step === puzzleStep) {
      piece.classList.add('ok');
      piece.disabled = true;
      puzzleStep += 1;
      streak += 1;
      puzzleStatus.textContent = streak < 3 ? 'Керемет! Жалғастырыңыз.' : '🎉 Жеңіс! Таза болашақ жолын құрдыңыз!';
      puzzleStatus.style.color = '#0f9d58';
      if (streak >= 3) logActivity('Solve puzzle game', { result: 'completed' });
    } else {
      puzzleStatus.textContent = gameMessage(false);
      puzzleStatus.style.color = '#d95555';
      logActivity('Puzzle wrong step', { clicked: step, expected: puzzleStep });
    }
  });
});
