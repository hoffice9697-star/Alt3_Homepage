// Custom cursor — circular, mix-blend-mode: difference, expands on hover

function initCursorManager() {
  const cursor = document.createElement('div');
  cursor.id = 'customCursor';
  document.body.appendChild(cursor);

  // Follow mouse
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }, { passive: true });

  // Expand on interactive/media elements
  const _expandOn = 'img, video, a, button';

  document.addEventListener('mouseover', e => {
    if (e.target.matches(_expandOn) || e.target.closest(_expandOn)) {
      cursor.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.matches(_expandOn) || e.target.closest(_expandOn)) {
      cursor.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => cursor.classList.add('cursor-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('cursor-hidden'));
}
