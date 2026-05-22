const SITE_CONFIG = {
  site_name:  "HeeJae Kim",
  site_title: "HeeJae Kim PORTFOLIO"
};

// ── 커서 효과 설정 & 프롬프트 레퍼런스 ──
// cursor_manager.js 가 이 값들을 참조한다
const CURSOR_CONFIG = {
  size_default: 18,          // 기본 커서 크기 (px)
  size_hover:   56,          // hover 시 커서 크기 (px)
  blend_mode:  'difference', // CSS mix-blend-mode
  prompt_ref:  "마우스 포인터를 커스텀 원형 커서로 변경해줘. 평소에는 작은 원 형태이다가, 이미지(<img>)나 인터랙티브한 요소 위에 올라가면 원의 크기가 2~3배로 커지도록 해줘. 특히 커서가 이미지와 겹치는 부분은 mix-blend-mode: difference를 적용해서 실시간으로 색상이 반전되는 세련된 효과를 넣어줘. 커서의 움직임은 마우스를 부드럽게 따라오도록 requestAnimationFrame이나 CSS 트랜지션을 활용해줘."
};
