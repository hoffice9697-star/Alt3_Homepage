// Scroll-driven dual video — supports local mp4 (frame scrubbing) and Vimeo URL

function _getVimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

// Windows 절대 경로 → 파일명만 추출해서 기본 폴더 경로 사용
function _resolveVideoSrc(raw, defaultSrc) {
  if (!raw) return defaultSrc;
  if (/^https?:\/\//.test(raw)) return raw; // URL 그대로
  if (raw.includes('\\') || raw.includes('C:')) {
    // Windows 경로 → 파일명만 추출
    const filename = raw.split(/[\\\/]/).pop();
    return '99_portfolio/99_videos/' + filename;
  }
  return raw; // 상대 경로 그대로
}

function initVideoManager() {
  const el1   = document.getElementById('vid1');
  const el2   = document.getElementById('vid2');
  const track = document.getElementById('scrollTrack');
  const fill  = document.getElementById('progressFill');
  const hint  = document.getElementById('scrollCue');

  if (!el1 || !el2 || !track) return;

  const raw1 = lsGet('vid1');
  const raw2 = lsGet('vid2');
  const src1 = _resolveVideoSrc(raw1, '99_portfolio/99_videos/scene1.mp4');
  const src2 = _resolveVideoSrc(raw2, '99_portfolio/99_videos/scene2.mp4');

  const id1 = _getVimeoId(src1);
  const id2 = _getVimeoId(src2);

  let vid1, vid2;  // HTML5 video (frame scrubbing)
  let vp1,  vp2;   // Vimeo players (auto-play only)

  // ── HTML5 video (frame-by-frame scrubbing) ──
  function _makeVideo(el, src) {
    const v = document.createElement('video');
    v.src = src; v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
    el.appendChild(v);
    return v;
  }

  // ── Vimeo (auto-play background) ──
  function _makeVimeo(el, videoId) {
    return new Vimeo.Player(el, {
      id: videoId, background: true, muted: true, loop: true,
      width: window.innerWidth,
    });
  }

  if (id1) { vp1 = _makeVimeo(el1, id1); }
  else      { vid1 = _makeVideo(el1, src1); }

  if (id2) { vp2 = _makeVimeo(el2, id2); }
  else      { vid2 = _makeVideo(el2, src2); }

  let _pauseTimer = null;

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

    const show1 = p <= 0.5;
    el1.classList.toggle('active', show1);
    el2.classList.toggle('active', !show1);

    // HTML5 frame scrubbing
    if (vid1) vid1.currentTime = (p / 0.5) * (vid1.duration || 0);
    if (vid2) vid2.currentTime = ((p - 0.5) / 0.5) * (vid2.duration || 0);

    // Vimeo: 해당 영상만 재생 (반대쪽 정지)
    if (show1) {
      if (vp1) vp1.play().catch(() => {});
      if (vp2) vp2.pause().catch(() => {});
    } else {
      if (vp2) vp2.play().catch(() => {});
      if (vp1) vp1.pause().catch(() => {});
    }
  }

  window.addEventListener('scroll', () => {
    _applyProgress(_getProgress());
    // HTML5 비디오 스크롤 멈추면 일시정지
    if (vid1 || vid2) {
      clearTimeout(_pauseTimer);
      _pauseTimer = setTimeout(() => {
        if (vid1) vid1.pause();
        if (vid2) vid2.pause();
      }, 150);
    }
  }, { passive: true });

  _applyProgress(0);
}
