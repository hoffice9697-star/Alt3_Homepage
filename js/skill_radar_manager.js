// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// skill_radar_manager.js
// About 섹션 우측의 스킬을 SVG 레이더 차트로 렌더링
// 다각형이 숨쉬듯이 펄스하는 CSS 애니메이션 포함
// web_agents.md 규칙: 초기화 함수만 export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const _DEFAULT_SKILLS = [
  { name: 'Auto CAD',    pct: 1.0 },
  { name: 'Rhino',       pct: 1.0 },
  { name: 'Revit',       pct: 1.0 },
  { name: 'Lumion',      pct: 1.0 },
  { name: 'Twinmotion',  pct: 1.0 },
  { name: 'SketchUp',    pct: 0.8 },
  { name: 'V-Ray',       pct: 0.8 },
  { name: 'Photoshop',   pct: 0.8 },
  { name: 'Illustrator', pct: 0.8 },
];

// admin에서 저장한 값(0~100) 읽어서 0~1로 변환
const _savedSkills = (function() {
  try {
    const s = lsGet('skills');
    if (s) return JSON.parse(s).map(sk => ({ name: sk.name, pct: sk.pct / 100 }));
  } catch(e) {}
  return null;
})();

const _SKILLS = _savedSkills || _DEFAULT_SKILLS;

const _SIZE    = 380;
const _CX      = _SIZE / 2;
const _CY      = _SIZE / 2;
const _R       = 136;   // 118 * 1.15 ≈ 136 (15% 확대)
const _N       = _SKILLS.length;
const _ACCENT  = '#D7E2EA';
const _GLOW    = '#8AA5BE';
const _RINGS   = [0.25, 0.5, 0.75, 1.0];
const _SVG_NS  = 'http://www.w3.org/2000/svg';

function _pt(i, pct, r) {
  r = r !== undefined ? r : _R;
  const a = (i * 2 * Math.PI / _N) - Math.PI / 2;
  return { x: _CX + r * pct * Math.cos(a), y: _CY + r * pct * Math.sin(a) };
}

function _polyPoints(r) {
  r = r !== undefined ? r : _R;
  return _SKILLS.map((s, i) => {
    const p = _pt(i, s.pct, r);
    return p.x.toFixed(2) + ',' + p.y.toFixed(2);
  }).join(' ');
}

function _el(tag, attrs) {
  const e = document.createElementNS(_SVG_NS, tag);
  Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
  return e;
}

function _buildSVG() {
  const svg = _el('svg', {
    viewBox: '0 0 ' + _SIZE + ' ' + _SIZE,
    width: '100%',
    style: 'overflow:visible;max-width:' + _SIZE + 'px;width:100%;display:block;margin:0 auto',
  });

  // ── defs: 글로우 필터 + 그라디언트 ──
  const defs = _el('defs', {});

  const f1 = _el('filter', { id: 'sr-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
  const blur1 = _el('feGaussianBlur', { stdDeviation: '4', result: 'b' });
  const merge1 = _el('feMerge', {});
  merge1.appendChild(_el('feMergeNode', { in: 'b' }));
  merge1.appendChild(_el('feMergeNode', { in: 'SourceGraphic' }));
  f1.appendChild(blur1); f1.appendChild(merge1);

  const f2 = _el('filter', { id: 'sr-glow2', x: '-100%', y: '-100%', width: '300%', height: '300%' });
  const blur2 = _el('feGaussianBlur', { stdDeviation: '10', result: 'b' });
  const merge2 = _el('feMerge', {});
  merge2.appendChild(_el('feMergeNode', { in: 'b' }));
  merge2.appendChild(_el('feMergeNode', { in: 'SourceGraphic' }));
  f2.appendChild(blur2); f2.appendChild(merge2);

  const rg = _el('radialGradient', { id: 'sr-grad', cx: '50%', cy: '50%', r: '50%' });
  const s1 = _el('stop', { offset: '0%',   'stop-color': _ACCENT, 'stop-opacity': '0.3' });
  const s2 = _el('stop', { offset: '100%', 'stop-color': _GLOW,   'stop-opacity': '0.06' });
  rg.appendChild(s1); rg.appendChild(s2);

  defs.appendChild(f1); defs.appendChild(f2); defs.appendChild(rg);
  svg.appendChild(defs);

  // ── 동심 링 ──
  _RINGS.forEach((r, i) => {
    svg.appendChild(_el('polygon', {
      points: _polyPoints(_R * r),
      fill: 'none',
      stroke: 'rgba(137,170,204,' + (0.06 + i * 0.04) + ')',
      'stroke-width': '1',
    }));
  });

  // ── 축 선 ──
  _SKILLS.forEach((_, i) => {
    const p = _pt(i, 1.0);
    svg.appendChild(_el('line', {
      x1: _CX, y1: _CY, x2: p.x.toFixed(2), y2: p.y.toFixed(2),
      stroke: 'rgba(137,170,204,0.12)', 'stroke-width': '1',
    }));
  });

  // ── 외부 글로우 다각형 (pulse 애니메이션) ──
  const polyGlow = _el('polygon', {
    points: _polyPoints(),
    fill: 'none',
    stroke: _GLOW,
    'stroke-width': '6',
    'stroke-opacity': '0.25',
    filter: 'url(#sr-glow2)',
    class: 'sr-breathe',
  });
  svg.appendChild(polyGlow);

  // ── 채움 다각형 ──
  svg.appendChild(_el('polygon', {
    points: _polyPoints(),
    fill: 'url(#sr-grad)',
    class: 'sr-breathe',
  }));

  // ── 외곽선 다각형 ──
  svg.appendChild(_el('polygon', {
    points: _polyPoints(),
    fill: 'none',
    stroke: _ACCENT,
    'stroke-width': '1.5',
    filter: 'url(#sr-glow)',
    class: 'sr-breathe',
  }));

  // ── 꼭짓점 도트 ──
  _SKILLS.forEach((s, i) => {
    const p = _pt(i, s.pct);
    svg.appendChild(_el('circle', {
      cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: '4',
      fill: _ACCENT,
      filter: 'url(#sr-glow)',
      class: 'sr-dot',
      style: 'animation-delay:' + (i * 0.12) + 's',
    }));
  });

  // ── 중심 도트 ──
  svg.appendChild(_el('circle', {
    cx: _CX, cy: _CY, r: '5',
    fill: _ACCENT,
    filter: 'url(#sr-glow2)',
    class: 'sr-breathe',
  }));

  // ── 레이블 ──
  _SKILLS.forEach((s, i) => {
    const p  = _pt(i, 1.32);
    const anchor = p.x < _CX - 5 ? 'end' : p.x > _CX + 5 ? 'start' : 'middle';
    const t  = _el('text', {
      x: p.x.toFixed(2), y: p.y.toFixed(2),
      'text-anchor': anchor,
      'dominant-baseline': 'middle',
      'font-size': '13',
      fill: 'rgba(215,226,234,0.8)',
      'font-family': "'Kanit', sans-serif",
      'letter-spacing': '0.04em',
    });
    t.textContent = s.name;
    svg.appendChild(t);
  });

  return svg;
}

function initSkillRadarManager() {
  const container = document.getElementById('skillRadarContainer');
  if (!container) return;

  // CSS 주입 (중복 방지)
  if (!document.getElementById('sr-style')) {
    const style = document.createElement('style');
    style.id = 'sr-style';
    style.textContent = `
      @keyframes sr-pulse {
        0%,100% { opacity:.72; }
        50%      { opacity:1; }
      }
      @keyframes sr-dot-pulse {
        0%,100% { r:3.5; opacity:.8; }
        50%      { r:5.5; opacity:1; }
      }
      .sr-breathe { animation: sr-pulse 3s ease-in-out infinite; }
      .sr-dot     { animation: sr-dot-pulse 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }

  container.innerHTML = '';
  container.appendChild(_buildSVG());
}
