/* Калькуляторы: размер выхода свёртки, число параметров, графики активаций, softmax. */

const el = id => document.getElementById(id);
const num = id => Number(el(id).value);
const fmt = n => n.toLocaleString('ru-RU');

/* ---------- свёрточный слой ---------- */
function convSize(input, k, s, p, d) {
  return Math.floor((input + 2 * p - d * (k - 1) - 1) / s) + 1;
}

function renderConv() {
  const H = num('cH'), W = num('cW'), k = num('cK'), s = num('cS'), p = num('cP'), d = num('cD');
  const cin = num('cCin'), cout = num('cCout'), bias = el('cBias').checked;

  const outH = convSize(H, k, s, p, d);
  const outW = convSize(W, k, s, p, d);
  const valid = outH > 0 && outW > 0;

  const params = (k * k * cin + (bias ? 1 : 0)) * cout;
  const macs = valid ? params * outH * outW : 0;
  const kEff = d * (k - 1) + 1;

  el('convOut').innerHTML = `
    <div class="line"><span>Выход</span><b>${valid ? `${outH} × ${outW} × ${cout}` : 'не существует'}</b></div>
    <div class="line"><span>Параметры</span><b>${fmt(params)}</b></div>
    <div class="line"><span>Умножений (MAC)</span><b>${valid ? fmt(macs) : '—'}</b></div>
    <div class="line"><span>Эффективное ядро (с dilation)</span><b>${kEff} × ${kEff}</b></div>
    <div class="subst">H_out = ⌊(${H} + 2·${p} − ${d}·(${k}−1) − 1) / ${s}⌋ + 1 = ${valid ? outH : '—'}
params = (${k}·${k}·${cin}${bias ? ' + 1' : ''}) · ${cout} = ${fmt(params)}</div>
    ${!valid ? '<div class="warnline">Ядро с таким padding не помещается во вход — увеличьте padding или уменьшите ядро.</div>' : ''}
    ${valid && outH === H && outW === W ? '<div class="line"><span>Режим</span><b>same (размер сохранён)</b></div>' : ''}`;
}

/* ---------- полносвязный слой ---------- */
function renderDense() {
  const nin = num('dIn'), nout = num('dOut'), bias = el('dBias').checked;
  const params = nin * nout + (bias ? nout : 0);
  el('denseOut').innerHTML = `
    <div class="line"><span>Параметры</span><b>${fmt(params)}</b></div>
    <div class="line"><span>из них веса</span><b>${fmt(nin * nout)}</b></div>
    <div class="line"><span>из них смещения</span><b>${fmt(bias ? nout : 0)}</b></div>
    <div class="subst">params = ${fmt(nin)} · ${fmt(nout)}${bias ? ` + ${fmt(nout)}` : ''} = ${fmt(params)}</div>`;
}

/* ---------- функции активации ---------- */
const ACTIVATIONS = {
  sigmoid: {
    title: 'Sigmoid',
    f: x => 1 / (1 + Math.exp(-x)),
    df: x => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s); },
    note: 'Диапазон (0, 1). Максимум производной 0.25 — отсюда затухание градиента. Выход не центрирован в нуле. Место: выход бинарной классификации и multi-label.'
  },
  tanh: {
    title: 'Tanh',
    f: x => Math.tanh(x),
    df: x => 1 - Math.tanh(x) ** 2,
    note: 'Диапазон (−1, 1), центрирован в нуле — сходится быстрее сигмоиды. Всё ещё насыщается. Место: вентили и кандидаты в LSTM/GRU.'
  },
  relu: {
    title: 'ReLU',
    f: x => Math.max(0, x),
    df: x => (x > 0 ? 1 : 0),
    note: 'Не насыщается при x > 0 — градиент не затухает, считается почти бесплатно. Риск dying ReLU: при x < 0 производная ровно 0. Дефолт для скрытых слоёв.'
  },
  leaky: {
    title: 'Leaky ReLU (α=0.1)',
    f: x => (x > 0 ? x : 0.1 * x),
    df: x => (x > 0 ? 1 : 0.1),
    note: 'Производная в отрицательной зоне равна α ≠ 0, поэтому «умерший» нейрон может ожить. На графике α взята 0.1, чтобы наклон был заметен; на практике 0.01.'
  },
  gelu: {
    title: 'GELU',
    f: x => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    df: x => {
      const h = 1e-4;
      const f = ACTIVATIONS.gelu.f;
      return (f(x + h) - f(x - h)) / (2 * h);
    },
    note: 'Гладкая версия ReLU, стандарт в трансформерах. Небольшой отрицательный «провал» около нуля и плавная производная.'
  },
  elu: {
    title: 'ELU (α=1)',
    f: x => (x > 0 ? x : Math.exp(x) - 1),
    df: x => (x > 0 ? 1 : Math.exp(x)),
    note: 'Отрицательный хвост насыщается к −1, среднее активаций ближе к нулю. Дороже ReLU из-за экспоненты.'
  }
};

let currentActivation = 'relu';

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawActivation() {
  const canvas = el('actCanvas');
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const act = ACTIVATIONS[currentActivation];

  const xMin = -5, xMax = 5, yMin = -1.5, yMax = 3;
  const px = x => ((x - xMin) / (xMax - xMin)) * W;
  const py = y => H - ((y - yMin) / (yMax - yMin)) * H;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = cssVar('--bg') || '#fff';
  ctx.fillRect(0, 0, W, H);

  // сетка
  ctx.strokeStyle = cssVar('--rule');
  ctx.lineWidth = 1;
  for (let x = xMin; x <= xMax; x++) {
    ctx.beginPath(); ctx.moveTo(px(x), 0); ctx.lineTo(px(x), H); ctx.stroke();
  }
  for (let y = Math.ceil(yMin); y <= yMax; y++) {
    ctx.beginPath(); ctx.moveTo(0, py(y)); ctx.lineTo(W, py(y)); ctx.stroke();
  }

  // оси
  ctx.strokeStyle = cssVar('--rule-strong');
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();

  // подписи осей
  ctx.fillStyle = cssVar('--ink-3');
  ctx.font = '12px ui-monospace, monospace';
  for (let x = xMin + 1; x <= xMax - 1; x++) if (x !== 0) ctx.fillText(String(x), px(x) + 3, py(0) + 14);
  for (let y = Math.ceil(yMin); y <= yMax; y++) if (y !== 0) ctx.fillText(String(y), px(0) + 5, py(y) - 3);

  const plot = (fn, color, dash) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.setLineDash(dash);
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= W; i++) {
      const x = xMin + (i / W) * (xMax - xMin);
      const y = fn(x);
      if (!Number.isFinite(y)) { started = false; continue; }
      const Y = py(y);
      if (!started) { ctx.moveTo(i, Y); started = true; } else ctx.lineTo(i, Y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  plot(act.f, cssVar('--accent'), []);
  plot(act.df, cssVar('--signal'), [5, 4]);

  // легенда
  ctx.font = '600 12px ui-monospace, monospace';
  ctx.fillStyle = cssVar('--accent');
  ctx.fillText(`f(x) — ${act.title}`, 12, 20);
  ctx.fillStyle = cssVar('--signal');
  ctx.fillText("f '(x) — производная", 12, 38);

  el('actOut').innerHTML = `
    <div class="line"><span>f(−2), f(0), f(2)</span><b>${act.f(-2).toFixed(3)} · ${act.f(0).toFixed(3)} · ${act.f(2).toFixed(3)}</b></div>
    <div class="line"><span>f&nbsp;'(−2), f&nbsp;'(0⁺), f&nbsp;'(2)</span><b>${act.df(-2).toFixed(3)} · ${act.df(0.001).toFixed(3)} · ${act.df(2).toFixed(3)}</b></div>
    <div class="subst">${act.note}</div>`;
}

function initActivationChips() {
  const chips = el('actChips');
  Object.entries(ACTIVATIONS).forEach(([key, act]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = act.title;
    b.setAttribute('aria-pressed', String(key === currentActivation));
    b.addEventListener('click', () => {
      currentActivation = key;
      [...chips.children].forEach((c, i) => c.setAttribute('aria-pressed', String(Object.keys(ACTIVATIONS)[i] === key)));
      drawActivation();
    });
    chips.appendChild(b);
  });
}

/* ---------- softmax ---------- */
function renderSoftmax() {
  const raw = el('smIn').value.split(/[,;\s]+/).map(Number).filter(Number.isFinite);
  const T = Math.max(0.01, num('smT'));
  if (!raw.length) {
    el('smOut').innerHTML = '<div class="warnline">Введите хотя бы одно число.</div>';
    return;
  }
  const scaled = raw.map(z => z / T);
  const max = Math.max(...scaled);                   // сдвиг для численной устойчивости
  const exps = scaled.map(z => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map(e => e / sum);

  el('smOut').innerHTML = `
    ${probs.map((p, i) => `
      <div class="probbar">
        <span>z${i + 1}=${raw[i]}</span>
        <span class="track"><i style="width:${(p * 100).toFixed(1)}%"></i></span>
        <span>${(p * 100).toFixed(1)}%</span>
      </div>`).join('')}
    <div class="line"><span>Сумма</span><b>${probs.reduce((a, b) => a + b, 0).toFixed(4)}</b></div>
    <div class="subst">softmax(z)ᵢ = exp(zᵢ/T) / Σⱼ exp(zⱼ/T); при вычислении вычитается max(z) — иначе экспонента переполняется.
T → 0 даёт argmax (почти one-hot), T → ∞ — равномерное распределение.</div>`;
}

export function initTools() {
  ['cH', 'cW', 'cK', 'cS', 'cP', 'cD', 'cCin', 'cCout', 'cBias']
    .forEach(id => el(id).addEventListener('input', renderConv));
  ['dIn', 'dOut', 'dBias'].forEach(id => el(id).addEventListener('input', renderDense));
  ['smIn', 'smT'].forEach(id => el(id).addEventListener('input', renderSoftmax));

  initActivationChips();
  renderConv();
  renderDense();
  renderSoftmax();
  drawActivation();

  // перерисовать график при смене темы
  new MutationObserver(drawActivation).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', drawActivation);
}
