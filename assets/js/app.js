/* Точка входа: загрузка контента, вкладки, тема оформления. */

import { loadContent } from './content.js';
import { setup as setupMarkdown } from './md.js';
import { initTheory } from './theory.js';
import { initTrainer } from './trainer.js';
import { initExam } from './exam.js';
import { initTools } from './tools.js';
import { store, plural } from './store.js';

const PANES = ['theory', 'cheat', 'train', 'exam', 'tools'];

function initTabs() {
  const shell = document.getElementById('shell');
  const side = document.getElementById('side');

  function activate(pane, push = true) {
    document.querySelectorAll('.tabs button').forEach(b =>
      b.setAttribute('aria-selected', String(b.dataset.pane === pane)));
    PANES.forEach(p => { document.getElementById(`pane-${p}`).hidden = p !== pane; });

    const withSide = pane === 'theory';
    side.style.display = withSide ? '' : 'none';
    shell.classList.toggle('solo', !withSide);
    if (withSide) side.classList.remove('open');
    if (push && location.hash.slice(1) !== pane) history.replaceState(null, '', `#${pane}`);
    window.scrollTo({ top: 0 });
  }

  document.querySelectorAll('.tabs button').forEach(btn =>
    btn.addEventListener('click', () => activate(btn.dataset.pane)));

  document.getElementById('navToggle').addEventListener('click', e => {
    const open = side.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });

  const fromHash = location.hash.slice(1);
  activate(PANES.includes(fromHash) ? fromHash : 'theory', false);
}

function initTheme() {
  const saved = store.get('theme', null);
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('themeBtn').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current
      ? current === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('theme', next);
  });
}

async function main() {
  initTheme();
  initTabs();

  if (!window.marked) {
    document.getElementById('theory').innerHTML =
      '<p class="empty">Не загрузился marked.js с CDN. Проверьте интернет или положите библиотеку локально — см. README, раздел «Работа без интернета».</p>';
    return;
  }
  setupMarkdown();

  try {
    const { theory, questions, cheatsheet } = await loadContent();
    initTheory(theory, cheatsheet);
    initTrainer(questions);
    initExam(questions);
    initTools();
    const topics = theory.filter(t => t.num > 0).length;
    document.getElementById('brandMeta').textContent =
      `${topics} ${plural(topics, 'тема', 'темы', 'тем')} · ${questions.length} ${plural(questions.length, 'вопрос', 'вопроса', 'вопросов')}`;
  } catch (err) {
    document.getElementById('theory').innerHTML =
      `<p class="empty">Контент не загрузился: ${err.message}<br>
       Если вы открыли index.html двойным кликом — так не заработает: браузер запрещает читать
       соседние файлы с <code>file://</code>. Запустите локальный сервер, команда есть в README.</p>`;
  }
}

main();
