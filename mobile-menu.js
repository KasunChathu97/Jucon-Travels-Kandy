(function () {
  function initMobileMenu() {
    var menuBtn = document.getElementById('menuBtn');
    var mobilePanel = document.getElementById('mobilePanel');
    if (!menuBtn || !mobilePanel) return;

    if (menuBtn.dataset && menuBtn.dataset.mobileMenuBound === '1') return;
    if (menuBtn.dataset) menuBtn.dataset.mobileMenuBound = '1';

    function setOpen(open) {
      if (open) {
        mobilePanel.classList.add('open');
      } else {
        mobilePanel.classList.remove('open');
      }
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    // Capture-phase handler prevents duplicate inline scripts from toggling twice.
    menuBtn.addEventListener(
      'click',
      function (e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        var isOpen = mobilePanel.classList.contains('open');
        setOpen(!isOpen);
      },
      true
    );

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    mobilePanel.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!mobilePanel.classList.contains('open')) return;
      var target = e.target;
      if (!target) return;
      if (mobilePanel.contains(target) || menuBtn.contains(target)) return;
      setOpen(false);
    });

    // Close when switching to desktop widths.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setOpen(false);
    });

    setOpen(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
