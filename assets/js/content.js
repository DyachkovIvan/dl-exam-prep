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

/** Разбор файла вопросов: «**A1. Текст**» и абзацы ответа до следующего вопроса. */
export function parseQuestions(md) {
  const out = [];
  let current = null;
  const flush = () => {
    if (current) {
      current.answer = current.answer.join('\n').trim();
      out.push(current);
      current = null;
    }
  };

  md.split('\n').forEach(line => {
    if (/^##?\s+/.test(line)) { flush(); return; }
    const head = line.match(/^\*\*([A-ZА-Я]+\d+)\.\s+([\s\S]+?)\*\*\s*$/);
    if (head) {
      flush();
      current = { id: head[1], question: head[2], answer: [] };
      return;
    }
    if (current) current.answer.push(line);
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
  return qs.map((question, i) => ({ id: `E${i + 1}`, question, answer: as[i] || '—' }));
}
