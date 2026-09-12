/* Теория: сборка конспекта из файлов, оглавление, отметки «пройдено», подсветка при скролле. */

import { renderMarkdown, decorate, typeset } from './md.js';
import { store } from './store.js';

export function initTheory(theory, cheatsheet) {
  const theoryEl = document.getElementById('theory');
  const cheatEl = document.getElementById('cheat');

  theoryEl.innerHTML = theory.map(t => renderMarkdown(t.body)).join('\n<hr>\n');
  decorate(theoryEl);
  typeset(theoryEl);

  cheatEl.innerHTML = renderMarkdown(cheatsheet);
  decorate(cheatEl);
  typeset(cheatEl);

  const done = store.get('theory-done', {}) || {};
  const heads = [...theoryEl.querySelectorAll('h1')];
  const toc = document.getElementById('toc');
  const links = [];

  heads.forEach((h, i) => {
    const meta = theory[i] || {};
    const id = `topic-${meta.id || i}`;
    h.id = id;

    const numEl = h.querySelector('.num');
    const label = (numEl ? h.textContent.replace(/^Тема \d+/, '') : h.textContent).trim();
    const num = meta.num ? String(meta.num) : '—';

    const li = document.createElement('li');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.id = `done-${id}`;
    box.checked = !!done[id];
    box.setAttribute('aria-label', `Отметить изученным: ${label}`);

    const a = document.createElement('a');
    a.href = `#${id}`;
    a.innerHTML = `<em>${num}</em><span>${label}</span>`;
    a.classList.toggle('done', box.checked);
    links.push(a);

    box.addEventListener('change', () => {
      done[id] = box.checked;
      store.set('theory-done', done);
      a.classList.toggle('done', box.checked);
      updateProgress();
    });
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) document.getElementById('side').classList.remove('open');
    });

    li.append(box, a);
    toc.appendChild(li);
  });

  const topicIds = theory.filter(t => t.num > 0).map(t => `topic-${t.id}`);

  function updateProgress() {
    const n = topicIds.filter(id => done[id]).length;
    document.getElementById('pgLabel').textContent = `${n} / ${topicIds.length}`;
    document.getElementById('pgBar').style.width = topicIds.length ? `${(n / topicIds.length) * 100}%` : '0%';
  }
  updateProgress();

  /* подсветка текущего раздела: последний заголовок, ушедший под шапку */
  let ticking = null, last = -1;
  function spy() {
    ticking = null;
    if (document.getElementById('pane-theory').hidden) return;
    let active = 0;
    for (let i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= 120) active = i;
      else break;
    }
    if (active === last) return;
    last = active;
    links.forEach((a, j) => a.classList.toggle('on', j === active));
    if (window.innerWidth > 900 && links[active]) {
      const side = document.getElementById('side');
      const r = links[active].getBoundingClientRect(), s = side.getBoundingClientRect();
      if (r.top < s.top || r.bottom > s.bottom) links[active].scrollIntoView({ block: 'nearest' });
    }
  }
  window.addEventListener('scroll', () => {
    if (ticking === null) ticking = requestAnimationFrame(spy);
  }, { passive: true });
  spy();
}
