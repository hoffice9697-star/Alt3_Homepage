const DEFAULT_PROJECTS = [
  { id:'work-1', category:'work', cat:'Commercial Facility', cat_ko:'근린생활시설', title:'Nonhyeon-dong, Gangnam', title_ko:'강남구 논현동 80-24',
    images:['99_portfolio/02_work/1-1.png','99_portfolio/02_work/1-2.png','99_portfolio/02_work/1-3.png','99_portfolio/02_work/1-4.png','99_portfolio/02_work/1-5.png','99_portfolio/02_work/1-6.png'] },
  { id:'work-2', category:'work', cat:'Residential', cat_ko:'단독주택', title:'Najin-ri, Hwayang, Yeosu', title_ko:'여수시 화양면 나진리 431-1',
    images:['99_portfolio/02_work/2-1.png','99_portfolio/02_work/2-2.png','99_portfolio/02_work/2-3.png','99_portfolio/02_work/2-4.png','99_portfolio/02_work/2-5.png','99_portfolio/02_work/2-6.png','99_portfolio/02_work/2-7.png','99_portfolio/02_work/2-8.png','99_portfolio/02_work/2-9.png','99_portfolio/02_work/2-10.png','99_portfolio/02_work/001_FIN/001.jpg','99_portfolio/02_work/001_FIN/002.jpg','99_portfolio/02_work/001_FIN/003.jpg','99_portfolio/02_work/001_FIN/004.jpg','99_portfolio/02_work/001_FIN/005.jpg','99_portfolio/02_work/001_FIN/006.jpg','99_portfolio/02_work/001_FIN/007.jpg','99_portfolio/02_work/001_FIN/008.jpg','99_portfolio/02_work/001_FIN/009.jpg','99_portfolio/02_work/001_FIN/010.jpg'] },
  { id:'work-3', category:'work', cat:'Multi-family Housing', cat_ko:'다가구주택', title:'Yeonnam-dong, Mapo', title_ko:'마포구 연남동 245-72',
    images:['99_portfolio/02_work/3-1.png','99_portfolio/02_work/3-2.png','99_portfolio/02_work/3-3.png','99_portfolio/02_work/3-4.png','99_portfolio/02_work/3-5.png','99_portfolio/02_work/3-6.png','99_portfolio/02_work/3-7.png','99_portfolio/02_work/3-8.png'] },
  { id:'work-4', category:'work', cat:'Multi-family Housing', cat_ko:'다가구주택', title:'Bangbae-dong', title_ko:'방배동 941-17',
    images:['99_portfolio/02_work/4-1.png','99_portfolio/02_work/4-2.png','99_portfolio/02_work/4-3.png','99_portfolio/02_work/4-4.png'] },
  { id:'student-1', category:'student', cat:'Memorial', cat_ko:'기념관', title:'Memorial for Jang Sa Invasion', title_ko:'장사 상륙작전 기념관',
    images:['99_portfolio/01_student/1-1.png','99_portfolio/01_student/1-2.png','99_portfolio/01_student/1-3.png','99_portfolio/01_student/1-4.png','99_portfolio/01_student/1-5.png'] },
  { id:'student-2', category:'student', cat:'Competition', cat_ko:'공모전', title:'Museum San Competition', title_ko:'뮤지엄 산 공모전',
    images:['99_portfolio/01_student/2-1.png','99_portfolio/01_student/2-2.png','99_portfolio/01_student/2-3.png'] },
  { id:'student-3', category:'student', cat:'Visitor Center', cat_ko:'방문자 센터', title:'Contrast', title_ko:'대조',
    images:['99_portfolio/01_student/3-1.png','99_portfolio/01_student/3-2.png','99_portfolio/01_student/3-3.png','99_portfolio/01_student/3-4.png'] },
  { id:'student-4', category:'student', cat:'Cultural', cat_ko:'문화시설', title:'Conflict &amp; Disturbance', title_ko:'갈등과 소란',
    images:['99_portfolio/01_student/4-1.png','99_portfolio/01_student/4-2.png','99_portfolio/01_student/4-3.png','99_portfolio/01_student/4-4.png','99_portfolio/01_student/4-5.png','99_portfolio/01_student/4-6.png'] },
  { id:'student-5', category:'student', cat:'Residential', cat_ko:'주거', title:'Succeeding You Father', title_ko:'왕위를 계승하는 중입니다',
    images:['99_portfolio/01_student/5-1.png','99_portfolio/01_student/5-2.png','99_portfolio/01_student/5-3.png','99_portfolio/01_student/5-4.png','99_portfolio/01_student/5-5.png','99_portfolio/01_student/5-6.png'] },
  { id:'other-1', category:'other', cat:'Competition / Master Plan', cat_ko:'공모전 / 마스터플랜', title:'Other Projects', title_ko:'그 외 프로젝트',
    images:['99_portfolio/03_otherprojects/002.jpeg','99_portfolio/03_otherprojects/003.jpeg','99_portfolio/03_otherprojects/004.jpeg','99_portfolio/03_otherprojects/005.jpeg','99_portfolio/03_otherprojects/006.jpeg','99_portfolio/03_otherprojects/007.jpeg','99_portfolio/03_otherprojects/008.jpeg','99_portfolio/03_otherprojects/009.jpeg','99_portfolio/03_otherprojects/010.jpeg','99_portfolio/03_otherprojects/011.jpeg','99_portfolio/03_otherprojects/012.jpeg'] }
];

function getProjects() {
  try { const s = lsGet('projects'); if (s) return JSON.parse(s); } catch(e) {}
  return DEFAULT_PROJECTS.map(p => Object.assign({}, p));
}

function saveProjects(arr) { lsSet('projects', JSON.stringify(arr)); }

function _esc(s) {
  return (s||'').replace(/&amp;/g,'&').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let _projCache = [];

function renderProjects() {
  _projCache = getProjects();
  ['work','student','other'].forEach(cat => {
    const group = document.getElementById('group-' + cat);
    if (!group) return;
    group.innerHTML = '';
    const list = _projCache.filter(p => p.category === cat);
    list.forEach((p, idx) => {
      const num  = String(idx+1).padStart(2,'0');
      const wrap = document.createElement('div');
      const lang = (typeof lsGet === 'function' && lsGet('lang')) || 'en';
      const dispCat   = lang === 'ko' && p.cat_ko   ? p.cat_ko   : p.cat;
      const dispTitle = lang === 'ko' && p.title_ko ? p.title_ko : p.title;
      const viewBtn   = lang === 'ko' ? '전체 보기 ↗' : 'View All ↗';
      wrap.className = 'stack-card-wrap';
      if (idx === list.length - 1) wrap.style.height = '1400px';
      wrap.innerHTML = `
        <div class="stack-card-inner" style="top:96px;z-index:${idx+1};">
          <div class="card-top-row">
            <span class="card-num">${num}</span>
            <div class="card-meta">
              <span class="card-cat">${_esc(dispCat)}</span>
              <span class="card-title">${_esc(dispTitle)}</span>
            </div>
            <button class="live-btn" data-proj-id="${p.id}">${viewBtn}</button>
          </div>
          <div class="card-img-grid">
            <div class="card-col-big"><img src="${p.images[0]||''}" loading="lazy" alt=""></div>
            <div class="card-col-small">
              <img src="${p.images[1]||p.images[0]||''}" loading="lazy" alt="">
              <img src="${p.images[2]||p.images[0]||''}" loading="lazy" alt="">
            </div>
          </div>
        </div>`;
      group.appendChild(wrap);
    });
  });

  document.querySelectorAll('.live-btn[data-proj-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = _projCache.find(x => x.id === btn.dataset.projId);
      if (p) openProjectImages(p.images, p.title);
    });
  });
}
