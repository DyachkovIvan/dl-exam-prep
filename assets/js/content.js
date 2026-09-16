/* Загрузка контента из папки content/.

   Чтобы добавить тему или вопрос, править код не нужно:
   — новая тема: положить .md в content/theory/ и добавить запись в manifest.json;
   — новые вопросы: дописать их в существующий файл content/questions/*.md
     в формате «**X12. Вопрос**» + абзац ответа, либо создать новый файл
     и добавить его в manifest.json.                                            */

async function text(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Не удалось загрузить ${path} (${res.status})`);
  return res.text();
}

export async function loadContent() {
  const manifest = await (await fetch('content/manifest.json', { cache: 'no-cache' })).json();

  const [theoryFiles, questionFiles, cheatsheet, express] = await Promise.all([
    Promise.all(manifest.theory.map(t => text(t.file))),
    Promise.all(manifest.questions.map(q => text(q.file))),
    text(manifest.cheatsheet),
    text(manifest.express)
  ]);

  const theory = manifest.theory.map((meta, i) => ({ ...meta, body: theoryFiles[i] }));

  const questions = [];
  manifest.questions.forEach((meta, i) => {
    parseQuestions(questionFiles[i]).forEach(q => {
      questions.push({ ...q, block: meta.block, blockTitle: meta.title });
    });
  });

  // экспресс-вопросы попадают в общий банк — они короткие и хорошо работают карточками
  parseExpress(express).forEach(q => {
    questions.push({ ...q, block: 'Э', blockTitle: 'Экспресс-вопросы' });
  });

  return { manifest, theory, questions, cheatsheet };
}

/** Разбор файла вопросов: «**A1. Текст**» и абзацы ответа до следующего вопроса.

    Внутри вопроса дополнительно распознаются (формат описан в quiz.js):
    «- [ ] / - [x]» — варианты теста, «= …» и «~ строка :: …» — сопоставление,
    «> 📌 … P0 …» — строка источника, из неё берётся приоритет P0–P3. */
export function parseQuestions(md) {
  const out = [];
  let current = null;
  const split = s => s.split(';').map(x => x.trim()).filter(Boolean);
  const flush = () => {
    if (current) {
      current.answer = current.answer.join('\n').trim();
      if (current.match && !current.match.rows.length) current.match = null;
      out.push(current);
      current = null;
    }
  };

  md.split('\n').forEach(line => {
    if (/^##?\s+/.test(line)) { flush(); return; }
    const head = line.match(/^\*\*([A-ZА-Я]+\d+)\.\s+([\s\S]+?)\*\*\s*$/);
    if (head) {
      flush();
      current = { id: head[1], question: head[2], answer: [], options: [], match: null, priority: null };
      return;
    }
    if (!current) return;

    const opt = line.match(/^- \[([ xX])\]\s+(.+)$/);
    if (opt) { current.options.push({ text: opt[2].trim(), correct: opt[1] !== ' ' }); return; }
    const cols = line.match(/^=\s+(.+)$/);
    if (cols) { current.match = { cols: split(cols[1]), rows: [] }; return; }
    const row = line.match(/^~\s+(.+?)\s*::\s*(.*)$/);
    if (row && current.match) { current.match.rows.push({ label: row[1], correct: split(row[2]) }); return; }

    const source = line.match(/^>\s*📌.*?\b(P[0-3])\b/);
    if (source) current.priority = source[1];
    current.answer.push(line);
  });
  flush();
  return out;
}

/** Экспресс-тест: нумерованный список вопросов и такой же список ответов. */
export function parseExpress(md) {
  const [questionsPart = '', answersPart = ''] = md.split(/\*\*Ответы:\*\*/);
  const items = part => {
    const found = [];
    const re = /^(\d+)\.\s+([\s\S]*?)(?=\n\d+\.\s|\n*$)/gm;
    let m;
    while ((m = re.exec(part)) !== null) found.push(m[2].trim());
    return found;
  };
  const qs = items(questionsPart);
  const as = items(answersPart);
  // префикс «Э», а не «E»: иначе id совпадали с блоком E и карточки делили прогресс повторений
  return qs.map((question, i) => ({ id: `Э${i + 1}`, question, answer: as[i] || '—' }));
}
