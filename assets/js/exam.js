/* Режим экзамена: случайный билет, таймер, самопроверка, разбор по блокам. */

import { renderMarkdown, renderInline, decorate, typeset } from './md.js';
import { store, plural } from './store.js';

export function initExam(questions) {
  const el = id => document.getElementById(id);

  const blocks = [];
  questions.forEach(q => {
    if (!blocks.some(b => b.key === q.block)) blocks.push({ key: q.block, title: q.blockTitle });
  });
  blocks.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.key;
    opt.textContent = b.title;
    el('examBlocks').appendChild(opt);
  });

  let run = null;
  let tick = null;

  function show(view) {
    el('examSetup').hidden = view !== 'setup';
    el('examRun').hidden = view !== 'run';
    el('examResult').hidden = view !== 'result';
  }

  function shuffled(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- запуск ---------- */
  el('examStart').addEventListener('click', () => {
    const wanted = Number(el('examCount').value);
    const block = el('examBlocks').value;
    const pool = block ? questions.filter(q => q.block === block) : questions;
    if (!pool.length) return;

    run = {
      items: shuffled(pool).slice(0, Math.min(wanted, pool.length)),
      index: 0,
      scores: [],
      minutes: Number(el('examTime').value),
      endsAt: null,
      startedAt: Date.now()
    };
    if (run.minutes > 0) run.endsAt = Date.now() + run.minutes * 60000;

    show('run');
    startTimer();
    renderQuestion();
  });

  el('examAbort').addEventListener('click', () => { if (run) finish(true); });

  /* ---------- таймер ---------- */
  function startTimer() {
    clearInterval(tick);
    if (!run.endsAt) {
      el('examTimer').textContent = '∞';
      return;
    }
    const paint = () => {
      const left = Math.max(0, run.endsAt - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      el('examTimer').textContent = `${m}:${String(s).padStart(2, '0')}`;
      el('examTimer').classList.toggle('low', left < 120000);
      if (left <= 0) { clearInterval(tick); finish(false, true); }
    };
    paint();
    tick = setInterval(paint, 1000);
  }

  /* ---------- вопрос ---------- */
  function renderQuestion() {
    const q = run.items[run.index];
    el('examMeta').innerHTML = `<i>${q.id}</i>${q.blockTitle}`;
    el('examQ').innerHTML = renderInline(q.question);
    const a = el('examA');
    a.innerHTML = renderMarkdown(q.answer);
    decorate(a);
    a.hidden = true;
    el('examReveal').hidden = false;
    el('examHint').hidden = false;
    el('examJudge').hidden = true;
    el('examCounter').textContent = `${run.index + 1} / ${run.items.length}`;
    el('examBar').style.width = `${(run.index / run.items.length) * 100}%`;
  }

  el('examReveal').addEventListener('click', () => {
    el('examA').hidden = false;
    el('examReveal').hidden = true;
    el('examHint').hidden = true;
    el('examJudge').hidden = false;
    typeset(el('examA'));
  });

  el('examJudge').addEventListener('click', e => {
    const btn = e.target.closest('[data-ok]');
    if (!btn || !run) return;
    run.scores.push({ q: run.items[run.index], score: Number(btn.dataset.ok) });
    run.index++;
    if (run.index >= run.items.length) finish(false);
    else renderQuestion();
  });

  /* ---------- итоги ---------- */
  function finish(aborted, timeout) {
    clearInterval(tick);
    const answered = run.scores;
    const max = (aborted ? answered.length : run.items.length) * 2;
    const got = answered.reduce((s, r) => s + r.score, 0);
    const percent = max ? Math.round((got / max) * 100) : 0;

    const byBlock = {};
    answered.forEach(({ q, score }) => {
      byBlock[q.blockTitle] ??= { got: 0, max: 0 };
      byBlock[q.blockTitle].got += score;
      byBlock[q.blockTitle].max += 2;
    });

    const weak = answered.filter(r => r.score < 2);
    const minutes = Math.round((Date.now() - run.startedAt) / 60000);

    const history = store.get('exam-history', []) || [];
    history.unshift({ date: new Date().toISOString(), percent, count: answered.length, minutes });
    store.set('exam-history', history.slice(0, 12));

    el('examResult').innerHTML = `
      <div class="result">
        <div class="scorebig"><b>${percent}%</b><span>${got} из ${max} баллов${timeout ? ' · время вышло' : aborted ? ' · завершено досрочно' : ''}</span></div>
        <p class="hint">${answered.length} ${plural(answered.length, 'вопрос', 'вопроса', 'вопросов')} за ${minutes || '<1'} мин. Каждый вопрос: 2 балла за полный ответ, 1 за частичный.</p>
        <h2 class="secttl">По блокам</h2>
        <div class="bars">
          ${Object.entries(byBlock).map(([name, v]) => {
            const p = Math.round((v.got / v.max) * 100);
            return `<div class="barrow">
              <span>${name}</span>
              <span class="track"><i class="${p < 60 ? 'bad' : ''}" style="width:${p}%"></i></span>
              <span class="val">${p}%</span>
            </div>`;
          }).join('')}
        </div>
        ${weak.length ? `<h2 class="secttl">Разобрать ещё раз</h2>
          <div class="qa" id="weakList"></div>` : '<p>Все вопросы закрыты полностью — редкий случай, проверьте себя ещё раз на другом билете.</p>'}
        <div class="controls">
          <button class="btn primary" id="examAgain" type="button">Новый билет</button>
        </div>
      </div>`;

    if (weak.length) {
      const wrap = el('weakList');
      weak.forEach(({ q }) => {
        const d = document.createElement('details');
        const s = document.createElement('summary');
        s.innerHTML = `<b>${q.id}</b>${renderInline(q.question)}`;
        const body = document.createElement('div');
        body.className = 'body';
        body.innerHTML = renderMarkdown(q.answer);
        decorate(body);
        d.append(s, body);
        d.addEventListener('toggle', () => { if (d.open) typeset(body); });
        wrap.appendChild(d);
      });
    }

    el('examAgain').addEventListener('click', () => { show('setup'); renderHistory(); });
    show('result');
    run = null;
  }

  /* ---------- история попыток ---------- */
  function renderHistory() {
    const history = store.get('exam-history', []) || [];
    el('examHistory').innerHTML = history.length
      ? `<h2 class="secttl">Предыдущие попытки</h2>
         <div class="histlist">${history.map(h => `
           <div class="h">
             <span>${new Date(h.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                   · ${h.count} ${plural(h.count, 'вопрос', 'вопроса', 'вопросов')} · ${h.minutes || '<1'} мин</span>
             <b>${h.percent}%</b>
           </div>`).join('')}</div>`
      : '';
  }

  renderHistory();
  show('setup');
}
