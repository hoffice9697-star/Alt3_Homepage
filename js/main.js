// Entry point — init managers only

initNavManager();
initVideoManager();
initScrollManager();
initCursorManager();
initAdminManager();
initSkillRadarManager();
initLangManager();
initCharAnimation();

function _wrapChars(el) {
  let idx = 0;
  function wrap(node) {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char-ani';
        s.style.animationDelay = (idx * (window._animDelay || 0.075)) + 's';
        s.textContent = ch;
        frag.appendChild(s);
        if (ch.trim()) idx++;
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1) {
      [...node.childNodes].forEach(wrap);
    }
  }
  wrap(el);
}

function initCharAnimation() {
  const ch1 = document.querySelector('.stage-chapter[data-from="0"]');
  if (!ch1) return;
  ['.ch-eyebrow', '.ch-name'].forEach(sel => {
    const el = ch1.querySelector(sel);
    if (el) _wrapChars(el);
  });
}

// lang 변경 시 ch-eyebrow 텍스트 교체 후 재애니메이션
window.reAnimateEyebrow = function(text) {
  const ch1 = document.querySelector('.stage-chapter[data-from="0"]');
  if (!ch1) return;
  const el = ch1.querySelector('.ch-eyebrow');
  if (!el) return;
  el.innerHTML = '';
  el.textContent = text;
  _wrapChars(el);
  if (ch1.classList.contains('visible')) {
    el.querySelectorAll('.char-ani').forEach(s => { s.style.animationPlayState = 'running'; });
  }
};
