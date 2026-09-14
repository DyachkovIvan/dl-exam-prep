/* Рендер markdown + формулы.

   marked ломает LaTeX (подчёркивания превращаются в курсив), поэтому формулы
   вырезаются до парсинга, а после — возвращаются на место и отдаются MathJax. */

const MATH_OPEN = 'MATHSLOT';
const MATH_CLOSE = 'ENDSLOT';

export function renderMarkdown(md) {
  if (!md) return '';
  const math = [];
  const protectedMd = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, body) => {
    math.push(body.trim());
    return `\n\n${MATH_OPEN}${math.length - 1}${MATH_CLOSE}\n\n`;
  });

  /* «<» в формуле (y_{<t}) браузер принял бы за начало тега; MathJax читает текст уже раскодированным */
  const tex = i => math[+i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = window.marked.parse(protectedMd);
  html = html.replace(
    new RegExp(`<p>\\s*${MATH_OPEN}(\\d+)${MATH_CLOSE}\\s*</p>`, 'g'),
    (_, i) => `<div class="fx">$$${tex(i)}$$</div>`
  );
  html = html.replace(
    new RegExp(`${MATH_OPEN}(\\d+)${MATH_CLOSE}`, 'g'),
    (_, i) => `<span class="fx">$$${tex(i)}$$</span>`
  );
  return html;
}

export function renderInline(md) {
  return window.marked.parseInline(md || '');
}

/** Доводка отрендеренного HTML: прокрутка таблиц, выноски-ловушки, номера тем. */
export function decorate(root) {
  root.querySelectorAll('table').forEach(table => {
    if (table.parentElement?.classList.contains('tw')) return;
    const wrap = document.createElement('div');
    wrap.className = 'tw';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  root.querySelectorAll('blockquote').forEach(quote => {
    if (quote.textContent.includes('⚠')) {
      quote.classList.add('trap');
      quote.innerHTML = quote.innerHTML.replace(/⚠️?\s*/g, '');
    }
  });

  root.querySelectorAll('h1').forEach(h => {
    const m = h.textContent.match(/^Тема (\d+)\.\s*(.+)$/);
    if (!m) return;
    h.classList.add('topic-head');
    h.innerHTML = `<span class="num">Тема ${m[1]}</span><span>${m[2]}</span>`;
  });

  return root;
}

/** Просим MathJax отрисовать формулы внутри элемента (он грузится асинхронно). */
export function typeset(el) {
  const mj = window.MathJax;
  if (!mj) return Promise.resolve();
  if (mj.typesetPromise) return mj.typesetPromise([el]).catch(() => {});
  if (mj.startup?.promise) return mj.startup.promise.then(() => mj.typesetPromise([el])).catch(() => {});
  return Promise.resolve();
}

export function setup() {
  window.marked.setOptions({ gfm: true, breaks: false });
}
