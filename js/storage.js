const SITE_PREFIX = 'jack_';

function lsGet(key) {
  try { return localStorage.getItem(SITE_PREFIX + key); } catch { return null; }
}

function lsSet(key, val) {
  try { localStorage.setItem(SITE_PREFIX + key, val); } catch {}
}
