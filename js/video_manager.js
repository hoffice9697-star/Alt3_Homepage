// Scroll-driven dual video — supports local mp4 and Vimeo URL

function _getVimeoId(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function initVideoManager() {
  const el1  = document.getElementById('vid1');
  const el2  = document.getElementById('vid2');
  const track = document.getElementById('scrollTrack');
  const fill  = document.getElementById('progressFill');
  const hint  = document.getElementById('scrollCue');

  if (!el1 || !el2 || !track) return;

  const src1 = lsGet('vid1') || 'videos/scene1.mp4';
  const src2 = lsGet('vid2') || 'videos/scene2.mp4';

  const id1 = _getVimeoId(src1);
  const id2 = _getVimeoId(src2);

  let vid1, vid2;          // HTML5 video elements
  let vp1, vp2;            // Vimeo Player instances
  let dur1 = 0, dur2 = 0;  // durations in seconds

  // ── Build video elements ──
  function _makeVideo(el, src) {
    const v = document.createElement('video');
    v.src = src; v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
    el.appendChild(v);
    v.addEventListener('loadedmetadata', () => {
      if (v === vid1) dur1 = v.duration;
      else            dur2 = v.duration;
    });
    return v;
  }

  // ── Build Vimeo players ──
  function _makeVimeo(el, videoId, onReady) {
    const p = new Vimeo.Player(el, {
      id: videoId, background: true, muted: true,
      width: el.offsetWidth || window.innerWidth,
    });
    p.getDuration().then(d => {
      if (onReady) onReady(d);
    });
    return p;
  }

  if (id1) {
    vp1 = _makeVimeo(el1, id1, d => { dur1 = d; });
  } else {
    vid1 = _makeVideo(el1, src1);
  }

  if (id2) {
    vp2 = _makeVimeo(el2, id2, d => { dur2 = d; });
  } else {
    vid2 = _makeVideo(el2, src2);
  }

  // ── Seek helpers ──
  let _seeking1 = false, _seeking2 = false;

  function _seek1(t) {
    if (vp1) {
      if (!_seeking1) { _seeking1 = true; vp1.setCurrentTime(t).then(() => { _seeking1 = false; }).catch(() => { _seeking1 = false; }); }
    } else if (vid1) { vid1.currentTime = t; }
  }

  function _seek2(t) {
    if (vp2) {
      if (!_seeking2) { _seeking2 = true; vp2.setCurrentTime(t).then(() => { _seeking2 = false; }).catch(() => { _seeking2 = false; }); }
    } else if (vid2) { vid2.currentTime = t; }
  }

  // ── Active toggle ──
  function _setActive(which) {
    el1.classList.toggle('active', which === 1);
    el2.classList.toggle('active', which === 2);
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

    if (p <= 0.5) {
      _setActive(1);
      _seek1((p / 0.5) * dur1);
    } else {
      _setActive(2);
      _seek2(((p - 0.5) / 0.5) * dur2);
    }
  }

  window.addEventListener('scroll', () => { _applyProgress(_getProgress()); }, { passive: true });
  _applyProgress(0);
}
