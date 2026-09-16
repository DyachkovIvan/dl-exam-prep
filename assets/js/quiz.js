/* Тесты с вариантами ответа и задания на сопоставление.

   Формат в content/questions/*.md — строки сразу под заголовком вопроса:
     - [ ] неверный вариант
     - [x] верный вариант
   Один верный вариант — выбирается один, несколько — «отметьте все верные».

   Сопоставление — таблица «строки × столбцы»:
     = столбец 1; столбец 2; столбец 3
     ~ строка :: столбец 1; столбец 3      (верные столбцы строки; можно оставить пустым)

   Всё остальное под вопросом — разбор, он показывается после проверки. */

import { renderInline } from './md.js';

const LETTERS = 'АБВГДЕЖЗИКЛМНОП';

export const isInteractive = q => Boolean(q.options?.length || q.match?.rows?.length);

/** Баллы как в режиме экзамена: 2 — полностью верно, 1 — частично, 0 — неверно. */
function verdict(score) {
  if (score === 2) return ['ok', 'Верно'];
  if (score === 1) return ['part', 'Частично верно'];
  return ['bad', 'Неверно'];
}

const pressed = b => b.getAttribute('aria-pressed') === 'true';

/**
 * Рисует интерактивный тест в root. onCheck({ score }) вызывается после «Проверить».
 * Возвращает контроллер: reveal() — показать правильный ответ без выставления баллов.
 */
export function mountQuiz(root, q, onCheck) {
  root.hidden = false;
  root.innerHTML = '';
  return q.options?.length ? mountChoice(root, q, onCheck) : mountMatching(root, q, onCheck);
}

function hintLine(text) {
  const p = document.createElement('p');
  p.className = 'quizhint';
  p.textContent = text;
  return p;
}

function checkBar(onClick) {
  const row = document.createElement('div');
  row.className = 'quizbar';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn primary';
  btn.textContent = 'Проверить';
  const out = document.createElement('span');
  out.className = 'verdict';
  out.setAttribute('aria-live', 'polite');
  btn.addEventListener('click', onClick);
  row.append(btn, out);
  return { row, btn, out };
}

function mountChoice(root, q, onCheck) {
  const total = q.options.filter(o => o.correct).length;
  const multi = total > 1;
  let done = false;

  const list = document.createElement('div');
  list.className = `opts${multi ? ' multi' : ''}`;
  const bar = checkBar(() => finish(true));
  bar.btn.disabled = true;

  const buttons = q.options.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt';
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="mk">${LETTERS[i] || i + 1}</span><span class="tx">${renderInline(o.text)}</span>`;
    b.addEventListener('click', () => {
      if (done) return;
      const on = !pressed(b);
      if (!multi) buttons.forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', String(on));
      bar.btn.disabled = !buttons.some(pressed);
    });
    list.appendChild(b);
    return b;
  });

  root.append(hintLine(multi ? 'Отметьте все верные варианты' : 'Выберите один вариант'), list, bar.row);

  function finish(scored) {
    if (done) return;
    done = true;
    let right = 0, wrong = 0;
    buttons.forEach((b, i) => {
      const picked = pressed(b);
      const ok = q.options[i].correct;
      b.disabled = true;
      if (ok && picked) { b.classList.add('ok'); right++; }
      else if (ok) b.classList.add('miss');
      else if (picked) { b.classList.add('bad'); wrong++; }
    });
    bar.btn.hidden = true;
    if (!scored) {
      bar.out.textContent = 'Верные варианты отмечены';
      return;
    }
    const score = right === total && wrong === 0 ? 2 : multi && right > 0 && wrong === 0 ? 1 : 0;
    const [cls, text] = verdict(score);
    bar.out.className = `verdict ${cls}`;
    bar.out.textContent = text;
    onCheck?.({ score });
  }

  return { reveal: () => finish(false) };
}

function mountMatching(root, q, onCheck) {
  const { cols, rows } = q.match;
  let done = false;

  rows.forEach(r => r.correct.forEach(c => {
    if (!cols.includes(c)) console.warn(`${q.id}: «${c}» нет среди столбцов сопоставления`);
  }));

  const wrap = document.createElement('div');
  wrap.className = 'tw';
  const table = document.createElement('table');
  table.className = 'mtable';
  table.innerHTML = `<thead><tr><th></th>${cols.map(c => `<th scope="col">${renderInline(c)}</th>`).join('')}</tr></thead>`;
  const tbody = document.createElement('tbody');

  const cells = rows.map(r => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.innerHTML = renderInline(r.label);
    tr.appendChild(th);
    const rowCells = cols.map(c => {
      const td = document.createElement('td');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `${r.label} — ${c}`);
      b.addEventListener('click', () => {
        if (!done) b.setAttribute('aria-pressed', String(!pressed(b)));
      });
      td.appendChild(b);
      tr.appendChild(td);
      return b;
    });
    tbody.appendChild(tr);
    return rowCells;
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  const bar = checkBar(() => finish(true));
  root.append(hintLine('Отметьте в каждой строке все подходящие столбцы (строка может остаться пустой)'), wrap, bar.row);

  function finish(scored) {
    if (done) return;
    done = true;
    let exactRows = 0;
    rows.forEach((r, i) => {
      let rowOk = true;
      cols.forEach((c, j) => {
        const b = cells[i][j];
        const picked = pressed(b);
        const ok = r.correct.includes(c);
        b.disabled = true;
        if (ok && picked) b.classList.add('ok');
        else if (ok) { b.classList.add('miss'); rowOk = false; }
        else if (picked) { b.classList.add('bad'); rowOk = false; }
      });
      if (rowOk) exactRows++;
    });
    bar.btn.hidden = true;
    if (!scored) {
      bar.out.textContent = 'Верные клетки отмечены';
      return;
    }
    const score = exactRows === rows.length ? 2 : exactRows * 2 >= rows.length ? 1 : 0;
    const [cls, text] = verdict(score);
    bar.out.className = `verdict ${cls}`;
    bar.out.textContent = `${text} · строк без ошибок: ${exactRows} из ${rows.length}`;
    onCheck?.({ score });
  }

  return { reveal: () => finish(false) };
}

/** Неинтерактивный вид с отмеченными верными ответами — для режима «списком» и разбора. */
export function quizStatic(q) {
  if (q.options?.length) {
    return `<ul class="optstatic">${q.options.map(o =>
      `<li class="${o.correct ? 'ok' : ''}"><b>${o.correct ? '✓' : '·'}</b><span>${renderInline(o.text)}</span></li>`).join('')}</ul>`;
  }
  if (q.match?.rows?.length) {
    const { cols, rows } = q.match;
    return `<div class="tw"><table class="mtable static">
      <thead><tr><th></th>${cols.map(c => `<th scope="col">${renderInline(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr><th scope="row">${renderInline(r.label)}</th>${cols.map(c =>
        `<td>${r.correct.includes(c) ? '<b class="yes">✓</b>' : ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  }
  return '';
}
