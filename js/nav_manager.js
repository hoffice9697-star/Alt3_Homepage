// Smooth scroll + 스크롤 위치에 따른 활성 nav 링크 업데이트

function initNavManager() {
  const links = document.querySelectorAll('.nav-link[data-section]');

  // 부드러운 스크롤
  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 스크롤 감지 → 현재 섹션에 맞는 링크에 .active 부여
  const sections = [
    { id: 'about',    el: document.getElementById('about') },
    { id: 'projects', el: document.getElementById('projects') },
    { id: 'contact',  el: document.getElementById('contact') },
  ].filter(s => s.el);

  const indicator = document.getElementById('navIndicator');
  const pill      = document.querySelector('.nav-pill');

  function _moveIndicator() {
    if (!indicator || !pill) return;
    const active = pill.querySelector('.nav-link.active');
    if (!active) return;
    const pillRect   = pill.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    indicator.style.left  = (activeRect.left - pillRect.left) + 'px';
    indicator.style.width = activeRect.width + 'px';
  }

  function _updateActive() {
    const vh    = window.innerHeight;
    let current = 'top';

    sections.forEach(({ id, el }) => {
      if (el.getBoundingClientRect().top <= vh * 0.4) current = id;
    });

    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });

    _moveIndicator();
  }

  // 클릭 시에도 즉시 인디케이터 이동
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      _moveIndicator();
    });
  });

  // 전역 노출 — lang 전환 후 인디케이터 즉시 갱신용
  window._moveNavIndicator = _moveIndicator;

  window.addEventListener('scroll', _updateActive, { passive: true });
  window.addEventListener('resize', _moveIndicator);
  _updateActive();
  requestAnimationFrame(_moveIndicator);
}
