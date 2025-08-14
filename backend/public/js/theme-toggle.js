function initThemeToggle() {
  const switchInput = document.getElementById('light-switch');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  if (!switchInput || !themeIcon) {
    setTimeout(initThemeToggle, 100); // Wait and try again
    return;
  }

  function setTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" fill="#000"/>
      `;
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5" fill="#000"/>
        <g stroke="#000" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </g>
      `;
    }
  }

  // Set default theme to dark if no theme is set
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark-theme');
  }
  
  let isDark = localStorage.getItem('theme') === 'dark-theme';
  switchInput.checked = isDark;
  setTheme(isDark);

  switchInput.addEventListener('change', function () {
    isDark = switchInput.checked;
    setTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark-theme' : 'light-theme');
  });

  // Make label clickable for icon toggle
  const label = switchInput.closest('label');
  if (label) {
    label.addEventListener('click', function (e) {
      if (e.target === switchInput) return;
      switchInput.checked = !switchInput.checked;
      switchInput.dispatchEvent(new Event('change'));
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Wait for toggle to be loaded
  initThemeToggle();
});

