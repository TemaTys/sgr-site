(function () {
  // Theme toggle
  var toggle = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  var theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  function renderIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  renderIcon();
  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      renderIcon();
    });
  }

  // Auto-update copyright year
  var yearEls = document.querySelectorAll('[data-year]');
  if (yearEls.length) {
    var currentYear = String(new Date().getFullYear());
    yearEls.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  // Mobile nav toggle
  var navToggle = document.querySelector('[data-nav-toggle]');
  var header = document.querySelector('[data-site-header]');
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
      var open = header.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
