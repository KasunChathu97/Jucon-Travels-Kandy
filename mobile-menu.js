(function () {
  // ----------------------------
  // Google Translate (Home-only UI)
  // ----------------------------

  var GT_PAGE_LANG = 'en';

  // Fallback language list (used when Google's <select.goog-te-combo> isn't available yet).
  // This keeps the UI working even under slow loads; translation still requires the Google
  // translate script to be allowed by the browser/network.
  var GT_LANGS = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'sq', name: 'Albanian' },
    { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hy', name: 'Armenian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' },
    { code: 'be', name: 'Belarusian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' },
    { code: 'ny', name: 'Chichewa' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'co', name: 'Corsican' },
    { code: 'hr', name: 'Croatian' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'et', name: 'Estonian' },
    { code: 'tl', name: 'Filipino' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'fy', name: 'Frisian' },
    { code: 'gl', name: 'Galician' },
    { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ht', name: 'Haitian Creole' },
    { code: 'ha', name: 'Hausa' },
    { code: 'haw', name: 'Hawaiian' },
    { code: 'iw', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'km', name: 'Khmer' },
    { code: 'ko', name: 'Korean' },
    { code: 'ku', name: 'Kurdish (Kurmanji)' },
    { code: 'ky', name: 'Kyrgyz' },
    { code: 'lo', name: 'Lao' },
    { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lb', name: 'Luxembourgish' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'mg', name: 'Malagasy' },
    { code: 'ms', name: 'Malay' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mt', name: 'Maltese' },
    { code: 'mi', name: 'Maori' },
    { code: 'mr', name: 'Marathi' },
    { code: 'mn', name: 'Mongolian' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'no', name: 'Norwegian' },
    { code: 'or', name: 'Odia' },
    { code: 'ps', name: 'Pashto' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sm', name: 'Samoan' },
    { code: 'gd', name: 'Scots Gaelic' },
    { code: 'sr', name: 'Serbian' },
    { code: 'st', name: 'Sesotho' },
    { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'so', name: 'Somali' },
    { code: 'es', name: 'Spanish' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tg', name: 'Tajik' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ug', name: 'Uyghur' },
    { code: 'uz', name: 'Uzbek' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zulu' }
  ];

  function isHomePage() {
    var path = (window.location && window.location.pathname) ? window.location.pathname : '';
    if (!path || path === '/') return true;
    var last = path.split('/').pop();

    if (!last) return true;
    var low = last.toLowerCase();
    if (low === 'index.html' || low === 'index.htm' || low === 'index.php') return true;

    // If user opens the site folder without trailing slash, Apache usually redirects,
    // but handle it anyway by falling back to the page title.
    try {
      if (document && typeof document.title === 'string') {
        if (document.title.toLowerCase().indexOf('home') !== -1) return true;
      }
    } catch (e) {
      // ignore
    }

    return false;
  }

  function ensureTranslateDom(showUi) {
    // Always ensure the host exists (even hidden pages) so Google can apply cookie.
    var host = document.getElementById('google_translate_element');
    if (host) return;

    if (showUi) {
      var header = document.querySelector('.container-header');
      if (!header) return;

      // Some pages (notably Home) set overflow:hidden on the header container,
      // which would clip the dropdown panel. This class enables a safe override.
      header.classList.add('gt-openable');

      var wrap = document.createElement('div');
      wrap.className = 'gt-wrap';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gt-btn';
      btn.id = 'gtBtn';
      btn.setAttribute('aria-label', 'Change language');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'gtPanel');

      // Use Google's favicon as the "G" logo (hosted by Google)
      var img = document.createElement('img');
      img.className = 'gt-g';
      img.alt = 'Google';
      img.src = 'https://www.gstatic.com/marketing-cms/df/f8/bb8f34744545a14b8a800ad7845a/translate-logo.webp';
      btn.appendChild(img);

      var panel = document.createElement('div');
      panel.className = 'gt-panel';
      panel.id = 'gtPanel';
      panel.hidden = true;

      var langList = document.createElement('div');
      langList.className = 'gt-lang-list';
      langList.id = 'gtLangList';

      var googleHost = document.createElement('div');
      googleHost.className = 'gt-google';
      googleHost.id = 'google_translate_element';

      // Important: keep the Google widget host OUTSIDE the hidden panel.
      // If the host lives inside a display:none container, the widget may never
      // create the <select class="goog-te-combo">, resulting in an empty list.
      panel.appendChild(langList);
      wrap.appendChild(btn);
      wrap.appendChild(panel);
      wrap.appendChild(googleHost);
      header.appendChild(wrap);
      return;
    }

    // Non-home pages: keep host in DOM but hidden.
    var hidden = document.createElement('div');
    hidden.className = 'gt-google';
    hidden.id = 'google_translate_element';
    document.body.appendChild(hidden);
  }

  function initGoogleTranslateWidget() {
    if (!(window.google && window.google.translate && window.google.translate.TranslateElement)) return;
    var host = document.getElementById('google_translate_element');
    if (!host) return;
    if (host.dataset && host.dataset.translateBound === '1') return;
    if (host.dataset) host.dataset.translateBound = '1';

    new window.google.translate.TranslateElement(
      {
        pageLanguage: GT_PAGE_LANG,
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element'
    );
  }

  function setGoogTransCookie(lang) {
    // Website Translator uses the 'googtrans' cookie: /<src>/<dest>
    var value = '/' + GT_PAGE_LANG + '/' + lang;
    var parts = ['googtrans=' + value, 'path=/'];
    try {
      document.cookie = parts.join('; ');
      // Try also setting for current host (some browsers require explicit domain)
      if (location && location.hostname && location.hostname.indexOf('.') !== -1) {
        document.cookie = 'googtrans=' + value + '; path=/; domain=' + location.hostname;
      }
    } catch (e) {
      // ignore
    }
  }

  function applyLanguage(lang) {
    var combo = document.querySelector('select.goog-te-combo');
    if (combo) {
      combo.value = lang;
      try {
        combo.dispatchEvent(new Event('change'));
      } catch (e) {
        // ignore
      }
      return;
    }

    // Fallback: set cookie and reload; Google script (if allowed) will apply it.
    setGoogTransCookie(lang);
    try {
      window.location.reload();
    } catch (e) {
      // ignore
    }
  }

  function buildListFromArray(list, arr) {
    list.innerHTML = '';
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (!item || !item.code) continue;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gt-lang-item';
      btn.textContent = item.name;
      (function (value) {
        btn.addEventListener('click', function () {
          applyLanguage(value);
          closeGtPanel();
        });
      })(item.code);
      list.appendChild(btn);
    }
  }

  function loadGoogleTranslateScriptOnce() {
    if (document.documentElement.dataset && document.documentElement.dataset.googleTranslateScript === '1') return;
    if (document.documentElement.dataset) document.documentElement.dataset.googleTranslateScript = '1';

    window.googleTranslateElementInit = function () {
      try {
        initGoogleTranslateWidget();
        if (isHomePage()) buildLanguageListFromGoogle();
      } catch (e) {
        // ignore
      }
    };

    // If already loaded
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.defer = true;
    s.onerror = function () {
      try {
        var list = document.getElementById('gtLangList');
        if (list) {
          list.innerHTML = '<div class="gt-lang-status">Translator failed to load. If you use an ad blocker or strict privacy settings, allow translate.google.com and reload.</div>';
        }
      } catch (e) {
        // ignore
      }
    };
    document.head.appendChild(s);
  }

  function buildLanguageListFromGoogle() {
    var list = document.getElementById('gtLangList');
    if (!list) return;
    if (list.dataset && list.dataset.built === '1' && list.children && list.children.length > 0) return;

    // Ensure widget is bound (in case the callback hasn't run yet).
    initGoogleTranslateWidget();

    // Immediate, non-crashing UI: show fallback list right away.
    // We'll replace it with Google's own list as soon as the combo exists.
    if (!list.dataset || list.dataset.source !== 'fallback') {
      buildListFromArray(list, GT_LANGS);
      if (list.dataset) list.dataset.source = 'fallback';
    }

    // Wait for Google to create its language <select>
    var tries = 0;
    var timer = window.setInterval(function () {
      tries++;
      var combo = document.querySelector('select.goog-te-combo');
      if (!combo) {
        if (tries > 240) window.clearInterval(timer);
        return;
      }

      window.clearInterval(timer);
      if (list.dataset) list.dataset.built = '1';

      // Prefer Google's language list when available (it's the authoritative list).
      var items = [];
      for (var i = 0; i < combo.options.length; i++) {
        var opt = combo.options[i];
        if (!opt || !opt.value) continue;
        items.push({ code: opt.value, name: opt.text });
      }

      if (items.length > 0) {
        buildListFromArray(list, items);
        if (list.dataset) list.dataset.source = 'google';
      } else {
        // Keep fallback list.
        if (list.dataset) delete list.dataset.built;
      }
    }, 150);
  }

  function openGtPanel() {
    var btn = document.getElementById('gtBtn');
    var panel = document.getElementById('gtPanel');
    if (!btn || !panel) return;
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeGtPanel() {
    var btn = document.getElementById('gtBtn');
    var panel = document.getElementById('gtPanel');
    if (!btn || !panel) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  function bindGtUi() {
    var btn = document.getElementById('gtBtn');
    var panel = document.getElementById('gtPanel');
    if (!btn || !panel) return;
    if (btn.dataset && btn.dataset.bound === '1') return;
    if (btn.dataset) btn.dataset.bound = '1';

    btn.addEventListener('click', function () {
      if (panel.hidden) {
        openGtPanel();
        buildLanguageListFromGoogle();
      } else {
        closeGtPanel();
      }
    });

    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      var target = e.target;
      if (!target) return;
      if (panel.contains(target) || btn.contains(target)) return;
      closeGtPanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeGtPanel();
    });
  }

  function initGoogleTranslate() {
    if (document.documentElement.dataset && document.documentElement.dataset.googleTranslateBound === '1') return;
    if (document.documentElement.dataset) document.documentElement.dataset.googleTranslateBound = '1';

    var showUi = isHomePage();
    ensureTranslateDom(showUi);
    if (showUi) bindGtUi();
    loadGoogleTranslateScriptOnce();
  }

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
    document.addEventListener('DOMContentLoaded', function () {
      initMobileMenu();
      initGoogleTranslate();
    });
  } else {
    initMobileMenu();
    initGoogleTranslate();
  }
})();
