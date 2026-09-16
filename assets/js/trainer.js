/* Тренажёр: карточки с интервальным повторением + режим «списком». */

import { renderMarkdown, renderInline, decorate, typeset } from './md.js';
import { store, humanInterval } from './store.js';
import { loadDeck, saveDeck, newCard, schedule, previewIntervals, deckStats, isDue, isNew, isHard } from './srs.js';
import { isInteractive, mountQuiz, quizStatic } from './quiz.js';

const EXAM_PRIORITIES = ['P0', 'P1'];

export function initTrainer(questions) {
  const el = id => document.getElementById(id);
  const deck = loadDeck();

  const state = {
    mode: store.get('trainer-mode', 'due'),
    bank: store.get('trainer-bank', ''),
    block: null,
    query: '',
    list: false,
    queue: [],
    index: 0,
    revealed: false,
    quizFor: null,   // id вопроса, для которого сейчас нарисован тест
    quizCtl: null,
    quizScore: null
  };

  el('srsMode').value = state.mode;
  el('bankFilter').value = state.bank;

  /* ---------- фильтрация ---------- */
  const blocks = [];
  questions.forEach(q => {
    if (!blocks.some(b => b.key === q.block)) blocks.push({ key: q.block, title: q.blockTitle });
  });

  function matches(q) {
    if (state.bank === 'exam' && !EXAM_PRIORITIES.includes(q.priority)) return false;
    if (state.bank === 'tests' && !isInteractive(q)) return false;
    if (state.block && q.block !== state.block) return false;
    if (state.query) {
      const hay = `${q.id} ${q.question} ${q.answer} ${(q.options || []).map(o => o.text).join(' ')}`.toLowerCase();
      if (!hay.includes(state.query.toLowerCase())) return false;
    }
    const card = deck[q.id];
    if (state.mode === 'due') return isDue(card);
    if (state.mode === 'new') return isNew(card);
    if (state.mode === 'hard') return isHard(card);
    return true;
  }

  /** Следующая карточка начинается с чистого теста. */
  function resetCard() {
    state.revealed = false;
    state.quizFor = null;
    state.quizCtl = null;
    state.quizScore = null;
  }

  function rebuild(keepPosition = false) {
    state.queue = questions.filter(matches);
    if (!keepPosition || state.index >= state.queue.length) state.index = 0;
    resetCard();
    render();
  }

  /* ---------- чипы блоков ---------- */
  const chips = el('blockChips');
  function chip(label, key) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.dataset.key = String(key);
    b.setAttribute('aria-pressed', String(state.block === key));
    b.addEventListener('click', () => {
      state.block = state.block === key ? null : key;
      [...chips.children].forEach(c => c.setAttribute('aria-pressed', String(c.dataset.key === String(state.block))));
      rebuild();
    });
    return b;
  }
  chips.appendChild(chip('Все блоки', null));
  blocks.forEach(b => chips.appendChild(chip(b.title, b.key)));

  /* ---------- статистика ---------- */
  function renderStats() {
    const s = deckStats(questions, deck);
    el('srsStats').innerHTML = `
      <div class="stat due"><b>${s.due}</b><span>к повторению</span></div>
      <div class="stat"><b>${s.learned}</b><span>в работе</span></div>
      <div class="stat"><b>${s.fresh}</b><span>не видели</span></div>
      <div class="stat hard"><b>${s.hard}</b><span>трудные</span></div>
      <div class="stat"><b>${s.total}</b><span>всего</span></div>`;
  }

  /* ---------- карточка ---------- */
  function renderQuiz(q) {
    const box = el('cardQuiz');
    if (!isInteractive(q)) {
      box.hidden = true;
      box.innerHTML = '';
      state.quizFor = null;
      return;
    }
    if (state.quizFor !== q.id) {
      state.quizFor = q.id;
      state.quizScore = null;
      state.quizCtl = mountQuiz(box, q, ({ score }) => {
        state.quizScore = score;
        state.revealed = true;
        render();
      });
    }
    // ответ открыли кнопкой, не проверяя, — просто подсвечиваем верные варианты
    if (state.revealed) state.quizCtl?.reveal();
  }

  function render() {
    renderStats();
    el('cardWrap').hidden = state.list;
    el('qaList').hidden = !state.list;
    if (state.list) return renderList();

    const q = state.queue[state.index];
    if (!q) {
      el('cardMeta').textContent = '';
      el('cardQ').textContent = state.mode === 'due'
        ? 'На сегодня всё повторено. Переключитесь на «Все подряд» или возвращайтесь завтра.'
        : 'Под фильтр ничего не попало — измените запрос или режим.';
      el('cardQuiz').hidden = true;
      el('cardA').hidden = true;
      el('cardCount').textContent = '';
      el('revealRow').hidden = false;
      el('gradeRow').hidden = true;
      return;
    }

    const card = deck[q.id];
    const tags = [];
    if (q.priority) tags.push(`<span class="tag prio p${q.priority[1]}">${q.priority}</span>`);
    if (isInteractive(q)) tags.push('<span class="tag">тест</span>');
    if (isNew(card)) tags.push('<span class="tag new">новый</span>');
    else if (isHard(card)) tags.push('<span class="tag lapse">трудный</span>');
    else tags.push(`<span class="tag">интервал ${humanInterval(card.interval || 1)}</span>`);

    el('cardMeta').innerHTML = `<i>${q.id}</i>${q.blockTitle}${tags.join('')}`;
    el('cardQ').innerHTML = renderInline(q.question);
    renderQuiz(q);

    const answer = el('cardA');
    answer.innerHTML = renderMarkdown(q.answer);
    decorate(answer);
    answer.hidden = !state.revealed || !q.answer;

    el('cardCount').textContent = `${state.index + 1} / ${state.queue.length}`;
    el('revealRow').hidden = state.revealed;
    el('revealBtn').textContent = isInteractive(q) ? 'Сдаться и показать ответ' : 'Показать ответ';
    el('gradeRow').hidden = !state.revealed;

    document.querySelectorAll('#gradeRow .grade').forEach(b => b.classList.remove('suggest'));
    if (state.revealed) {
      const iv = previewIntervals(card || newCard());
      el('iv2').textContent = humanInterval(iv[1]);
      el('iv3').textContent = humanInterval(iv[2]);
      el('iv4').textContent = humanInterval(iv[3]);
      // тест проверен автоматически — подсказываем оценку для интервального повторения
      if (state.quizScore !== null) {
        document.querySelector(`#gradeRow [data-grade="${[1, 2, 3][state.quizScore]}"]`)?.classList.add('suggest');
      }
      typeset(el('card'));
    }
  }

  function renderList() {
    const wrap = el('qaList');
    wrap.innerHTML = '';
    if (!state.queue.length) {
      wrap.innerHTML = '<p class="empty">Под фильтр ничего не попало.</p>';
      return;
    }
    let lastBlock = null;
    state.queue.forEach(q => {
      if (q.blockTitle !== lastBlock) {
        lastBlock = q.blockTitle;
        const h = document.createElement('h3');
        h.className = 'grp';
        h.textContent = q.blockTitle;
        wrap.appendChild(h);
      }
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.innerHTML = `<b>${q.id}</b>${renderInline(q.question)}`;
      const body = document.createElement('div');
      body.className = 'body';
      body.innerHTML = quizStatic(q) + renderMarkdown(q.answer);
      decorate(body);
      details.append(summary, body);
      details.addEventListener('toggle', () => { if (details.open) typeset(body); });
      wrap.appendChild(details);
    });
  }

  /* ---------- события ---------- */
  el('revealBtn').addEventListener('click', () => {
    if (!state.queue[state.index]) return;
    state.revealed = true;
    render();
  });
  el('skipBtn').addEventListener('click', () => {
    if (!state.queue.length) return;
    state.index = (state.index + 1) % state.queue.length;
    resetCard();
    render();
  });

  el('gradeRow').addEventListener('click', e => {
    const btn = e.target.closest('[data-grade]');
    if (!btn) return;
    const q = state.queue[state.index];
    if (!q) return;
    const grade = Number(btn.dataset.grade);
    deck[q.id] = schedule(deck[q.id] || newCard(), grade);
    saveDeck(deck);

    if (grade === 1) {
      // «не знал» — карточка уезжает на несколько позиций вперёд в этой же сессии
      const [item] = state.queue.splice(state.index, 1);
      state.queue.splice(Math.min(state.index + 5, state.queue.length), 0, item);
    } else if (state.mode === 'due') {
      state.queue.splice(state.index, 1);
      if (state.index >= state.queue.length) state.index = 0;
    } else {
      state.index = (state.index + 1) % state.queue.length;
    }
    resetCard();
    render();
  });

  el('srsMode').addEventListener('change', e => {
    state.mode = e.target.value;
    store.set('trainer-mode', state.mode);
    rebuild();
  });

  el('bankFilter').addEventListener('change', e => {
    state.bank = e.target.value;
    store.set('trainer-bank', state.bank);
    rebuild();
  });

  el('qSearch').addEventListener('input', e => { state.query = e.target.value.trim(); rebuild(); });

  el('listBtn').addEventListener('click', e => {
    state.list = !state.list;
    e.target.textContent = state.list ? 'Карточками' : 'Списком';
    render();
  });

  /* клавиатура: пробел — показать, 1–4 — оценка; в тесте до проверки 1–4 не работают */
  document.addEventListener('keydown', e => {
    if (document.getElementById('pane-train').hidden || state.list) return;
    if (e.target.matches('input, select, textarea, .opt, .cell')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!state.revealed) el('revealBtn').click();
    }
    if (state.revealed && ['1', '2', '3', '4'].includes(e.key)) {
      document.querySelector(`#gradeRow [data-grade="${e.key}"]`)?.click();
    }
  });

  /* ---------- перенос прогресса ---------- */
  el('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store.dump(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dl-exam-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  el('importBtn').addEventListener('click', () => el('importFile').click());
  el('importFile').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      store.restore(JSON.parse(await file.text()));
      location.reload();
    } catch {
      alert('Файл не читается: ожидается JSON, выгруженный этой же страницей.');
    }
  });

  el('resetBtn').addEventListener('click', () => {
    if (!confirm('Сбросить прогресс повторений и отметки пройденных тем?')) return;
    store.remove('srs');
    store.remove('theory-done');
    store.remove('exam-history');
    location.reload();
  });

  rebuild();
}
