function initLangManager() {
  let _lang = lsGet('lang') || 'en';

  function _apply() {
    // textContent 교체
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = _lang === 'en' ? el.dataset.en : (el.dataset.ko || el.dataset.en);
    });
    // innerHTML 교체 (br 포함 요소)
    document.querySelectorAll('[data-en-html]').forEach(el => {
      el.innerHTML = _lang === 'en' ? el.dataset.enHtml : (el.dataset.koHtml || el.dataset.enHtml);
    });
    // ch-eyebrow 재애니메이션
    const eyebrow = document.querySelector('.ch-eyebrow');
    if (eyebrow && typeof window.reAnimateEyebrow === 'function') {
      const text = _lang === 'en' ? (eyebrow.dataset.en || 'Architect') : (eyebrow.dataset.ko || '건축가');
      window.reAnimateEyebrow(text);
    }
    // 토글 버튼 텍스트 (현재 언어 표시)
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = _lang === 'en' ? 'EN' : 'KO';
    // html lang 속성
    document.documentElement.lang = _lang === 'en' ? 'en' : 'ko';
    // 프로젝트 카드 재렌더링
    if (typeof renderProjects === 'function') renderProjects();
    // 텍스트 너비 변경 후 nav 인디케이터 즉시 갱신
    requestAnimationFrame(() => {
      if (typeof window._moveNavIndicator === 'function') window._moveNavIndicator();
    });
  }

  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      _lang = _lang === 'en' ? 'ko' : 'en';
      lsSet('lang', _lang);
      _apply();
    });
  }

  _apply();
}
