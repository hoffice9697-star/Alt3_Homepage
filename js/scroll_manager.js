// Handles: hero fade-in, marquee, about char animation, services fade, stack cards

// ── Hero initial fade-in ──
function _initHeroFade() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-nav, .fade-heading, .fade-desc, .fade-cta, .fade-portrait')
      .forEach(el => el.classList.add('visible'));
  });
}

// ── Marquee scroll-driven offset ──
function _initMarquee() {
  const mq1     = document.getElementById('mq1');
  const mq2     = document.getElementById('mq2');
  const section = document.getElementById('marqueeSection');
  if (!mq1 || !mq2 || !section) return;

  window.addEventListener('scroll', () => {
    const top    = section.getBoundingClientRect().top + window.scrollY;
    const offset = (window.scrollY - top + window.innerHeight) * 0.3;
    mq1.style.transform = `translateX(${offset - 200}px)`;
    mq2.style.transform = `translateX(${-(offset - 200)}px)`;
  }, { passive: true });
}

// ── About bio character scroll animation ──
function _initCharAnimation() {
  const bio = document.getElementById('animBio');
  if (!bio) return;

  const text = bio.textContent.trim();
  bio.innerHTML = text.split('').map(ch =>
    `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');

  const chars = bio.querySelectorAll('.char');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const scrollListener = () => {
        const r        = bio.getBoundingClientRect();
        const progress = 1 - Math.max(0, Math.min(1, (r.top - window.innerHeight * 0.2) / (window.innerHeight * 0.6)));
        chars.forEach((ch, i) => {
          ch.style.opacity = progress > i / chars.length ? '1' : '0.2';
        });
      };

      window.addEventListener('scroll', scrollListener, { passive: true });
    });
  }, { threshold: 0.1 });

  obs.observe(bio);
}

// ── Services & generic fade-in-up ──
function _initFadeInUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.service-item, .fade-in-up, .fade-deco-l, .fade-deco-r').forEach(el => obs.observe(el));
}

// ── Stack cards scale effect ──
// 활성 .project-group 안의 카드만 대상 — 탭 전환 시 자동으로 현재 그룹 반영
function _initStackCards() {
  const _baseSize = Math.min(1, Math.max(0.5, parseFloat(lsGet('card_size')) || 0.85));

  function _updateCards() {
    const wraps = [...document.querySelectorAll('.project-group.active .stack-card-wrap')];
    const cards = [...document.querySelectorAll('.project-group.active .stack-card-inner')];
    const total = cards.length;
    if (!total) return;

    wraps.forEach((wrap, index) => {
      if (index === total - 1) {
        cards[index].style.transform = `scale(${_baseSize})`;
        return;
      }
      const nextWrap = wraps[index + 1];
      if (!nextWrap) return;

      const rect     = nextWrap.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));

      const targetScale = 1 - (total - 1 - index) * 0.03;
      const scale       = 1 - progress * (1 - targetScale);

      cards[index].style.transform = `scale(${Math.max(targetScale, scale) * _baseSize})`;
    });
  }

  window.addEventListener('scroll', _updateCards, { passive: true });
  _updateCards();
}

// ── Skill bars fill left-to-right on scroll ──
function _initSkillBars() {
  const skillList = document.querySelector('.skill-list');
  if (!skillList) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(b => b.classList.add('animated'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(skillList);
}

function initScrollManager() {
  _initHeroFade();
  _initMarquee();
  _initCharAnimation();
  _initFadeInUp();
  _initStackCards();
  _initSkillBars();
}
