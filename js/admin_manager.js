// Admin modal — © 트리거 클릭 시 비밀번호 입력 → admin.html 이동

function initAdminManager() {
  const trigger   = document.getElementById('adminTrigger');
  const modal     = document.getElementById('adminModal');
  const passInput = document.getElementById('adminPassInput');
  const submit    = document.getElementById('adminSubmit');
  const error     = document.getElementById('adminError');
  const closeBtn  = document.getElementById('adminModalClose');

  function _getPass() {
    return lsGet('jack_admin_pass') || 'changeme';
  }

  function _tryLogin() {
    if (passInput.value === _getPass()) {
      sessionStorage.setItem('jack_auth', '1');
      window.location.href = 'admin.html';
    } else {
      error.textContent = 'Incorrect password.';
      passInput.value = '';
      passInput.focus();
    }
  }

  if (trigger)  trigger.addEventListener('click', () => {
    modal.classList.add('open');
    passInput.value = '';
    error.textContent = '';
    setTimeout(() => passInput.focus(), 50);
  });

  if (submit)    submit.addEventListener('click', _tryLogin);
  if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') _tryLogin(); });
  if (closeBtn)  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  if (modal)     modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}
