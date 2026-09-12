/* Тонкая обёртка над localStorage: всё состояние приложения хранится локально в браузере. */

const PREFIX = 'dl-exam:';

export const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* приватный режим */ }
  },
  /** Все ключи приложения — для экспорта прогресса одним файлом. */
  dump() {
    const out = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k));
      }
    } catch { /* нет доступа к хранилищу */ }
    return out;
  },
  restore(obj) {
    Object.entries(obj || {}).forEach(([k, v]) => this.set(k, v));
  }
};

export const today = () => new Date().toISOString().slice(0, 10);

export function addDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + Math.round(days));
  return d.toISOString().slice(0, 10);
}

export function humanInterval(days) {
  if (days < 1) return 'снова';
  if (days < 30) return `${Math.round(days)} д`;
  if (days < 365) return `${Math.round(days / 30)} мес`;
  return `${(days / 365).toFixed(1)} г`;
}

/** Русские числительные: plural(3, 'вопрос', 'вопроса', 'вопросов') → 'вопроса'. */
export function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}
