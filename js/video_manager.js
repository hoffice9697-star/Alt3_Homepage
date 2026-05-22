// Scroll-driven dual video — supports local mp4 and Vimeo URL

function _getVimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function initVideoManager() {
  const el1   = document.getElementById('vid1');
  const el2   = document.getElementById('vid2');
  const track = document.getElementById('scrollTrack');
  const fill  = document.getElementById('progressFill');
  const hint  = document.getElementById('scrollCue');

  if (!el1 || !el2 || !track) return;

  const src1 = lsGet('vid1') || 'https://vimeo.com/1194171718';
  const src2 = lsGet('vid2') || 'https://vimeo.com/1194171729';

  const id1 = _getVimeoId(src1);
  const id2 = _getVimeoId(src2);

  // ── HTML5 video setup ──
  function _makeVideo(el, src) {
    const v = document.createElement('video');
    v.src = src; v.muted = true; v.playsInline = true;
    v.preload = 'auto'; v.loop = true;
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
    el.appendChild(v);
    return v;
  }

  // ── Vimeo player setup — background mode auto-plays and loops ──
  if (id1) {
    new Vimeo.Player(el1, { id: id1, background: true, muted: true, loop: true, width: window.innerWidth });
  } else {
    const v = _makeVideo(el1, src1);
    v.play().catch(() => {});
  }

  if (id2) {
    new Vimeo.Player(el2, { id: id2, background: true, muted: true, loop: true, width: window.innerWidth });
  } else {
    const v = _makeVideo(el2, src2);
  }

  // ── Progress ──
  function _getProgress() {
    const maxScroll = track.offsetTop + track.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, window.scrollY / maxScroll));
  }

  function _applyProgress(p) {
    if (fill) fill.style.width = (p * 100) + '%';
    if (hint) hint.style.opacity = p > 0.05 ? '0' : '1';

    document.querySelectorAll('.stage-chapter').forEach(ch => {
      const from = parseFloat(ch.dataset.from);
      const to   = parseFloat(ch.dataset.to);
      ch.classList.toggle('visible', p >= from && p < to);
    });

    // 스크롤 위치에 따라 어떤 영상을 보여줄지 opacity 토글
    const show1 = p < 0.5;
    el1.classList.toggle('active', show1);
    el2.classList.toggle('active', !show1);
  }

  window.addEventListener('scroll', () => { _applyProgress(_getProgress()); }, { passive: true });
  _applyProgress(0);
}
