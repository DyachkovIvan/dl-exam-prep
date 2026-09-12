/* Интервальное повторение, алгоритм SM-2 (как в Anki/SuperMemo, в упрощённом виде).

   Состояние карточки:
     ef       — фактор лёгкости, стартует с 2.5, не опускается ниже 1.3;
     interval — текущий интервал в днях;
     reps     — сколько раз подряд вспомнили;
     lapses   — сколько раз забыли;
     due      — дата следующего показа (YYYY-MM-DD).

   Оценки в интерфейсе: 1 «не знал», 2 «трудно», 3 «знаю», 4 «легко».  */

import { store, today, addDays } from './store.js';

const KEY = 'srs';
const MIN_EF = 1.3;

export const GRADES = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };

export function loadDeck() {
  return store.get(KEY, {}) || {};
}

export function saveDeck(deck) {
  store.set(KEY, deck);
}

export function newCard() {
  return { ef: 2.5, interval: 0, reps: 0, lapses: 0, due: today() };
}

/** Чистая функция: по состоянию карточки и оценке возвращает новое состояние. */
export function schedule(card, grade) {
  const next = { ...(card || newCard()) };

  if (grade === GRADES.AGAIN) {
    next.reps = 0;
    next.lapses = (next.lapses || 0) + 1;
    next.interval = 0;                       // вернётся в этой же сессии
    next.ef = Math.max(MIN_EF, next.ef - 0.2);
    next.due = today();
    return next;
  }

  // качество ответа в шкале SM-2: 3 → 3, 4 → 4, 5 (легко) → 5
  const q = grade === GRADES.HARD ? 3 : grade === GRADES.GOOD ? 4 : 5;
  next.ef = Math.max(MIN_EF, next.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  next.reps = (next.reps || 0) + 1;

  if (next.reps === 1) next.interval = grade === GRADES.HARD ? 1 : grade === GRADES.EASY ? 4 : 2;
  else if (next.reps === 2) next.interval = grade === GRADES.HARD ? 3 : grade === GRADES.EASY ? 10 : 6;
  else {
    const factor = grade === GRADES.HARD ? 1.2 : grade === GRADES.EASY ? next.ef * 1.3 : next.ef;
    next.interval = Math.max(1, Math.round(next.interval * factor));
  }

  next.due = addDays(next.interval);
  return next;
}

/** Сколько дней до следующего показа при каждой оценке — для подписей на кнопках. */
export function previewIntervals(card) {
  return [1, 2, 3, 4].map(g => schedule(card, g).interval);
}

export function isDue(card) {
  return !card || card.due <= today();
}

export function isNew(card) {
  return !card || card.reps === 0 && (card.lapses || 0) === 0;
}

export function isHard(card) {
  return !!card && ((card.lapses || 0) >= 2 || card.ef < 2.1);
}

export function deckStats(questions, deck) {
  let learned = 0, due = 0, hard = 0, fresh = 0;
  questions.forEach(q => {
    const card = deck[q.id];
    if (!card || isNew(card)) fresh++;
    else learned++;
    if (isDue(card)) due++;
    if (isHard(card)) hard++;
  });
  return { total: questions.length, learned, due, hard, fresh };
}
