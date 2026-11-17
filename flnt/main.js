/* FLNT Films: intro, menu, scroll reveal, shoot builder and copy-email. No libraries. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Intro ---------- */
  var intro = $('.intro');

  function release() {
    root.classList.remove('intro-on');
    if (intro) intro.classList.remove('is-playing', 'is-leaving', 'is-skipping');
  }

  if (intro && root.classList.contains('intro-on')) {
    try {
      try { sessionStorage.setItem('flnt-intro', 'seen'); } catch (e) { /* storage blocked */ }

      // A few sparks drifting up from the ember
      var sparks = $('.intro-sparks', intro);
      var r = function (a, b) { return a + Math.random() * (b - a); };
      for (var i = 0; i < 14; i++) {
        var s = document.createElement('span');
        s.className = 'spark';
        s.style.setProperty('--x', r(-26, 26).toFixed(1) + 'px');
        s.style.setProperty('--dx', r(-46, 46).toFixed(1) + 'px');
        s.style.setProperty('--h', r(130, 280).toFixed(0) + 'px');
        s.style.setProperty('--d', r(1.3, 2.2).toFixed(2) + 's');
        s.style.setProperty('--delay', r(0.2, 1.4).toFixed(2) + 's');
        s.style.setProperty('--s', r(2, 3.4).toFixed(1) + 'px');
        sparks.appendChild(s);
      }

      var done = false;
      var timer;
      var finish = function (skipped) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (skipped) intro.classList.add('is-skipping');
        intro.classList.add('is-leaving');
        setTimeout(release, skipped ? 350 : 600);
        removeEventListener('keydown', skip);
        removeEventListener('wheel', skip);
      };
      var skip = function () { finish(true); };

      // Click, tap, any key or a scroll attempt skips the intro
      intro.addEventListener('click', skip);
      addEventListener('keydown', skip);
      addEventListener('wheel', skip, { passive: true });

      requestAnimationFrame(function () { intro.classList.add('is-playing'); });
      timer = setTimeout(function () { finish(false); }, 2900);   // fade out 2.9s → gone at 3.5s
    } catch (e) {
      release();
    }
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var links = $('#nav-links');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a') && links.classList.contains('is-open')) toggle.click();
  });

  /* ---------- Scroll reveal (content stays visible if this never runs) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    root.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Build your shoot ---------- */
  // Prices to confirm: keep in step with the Pricing and Monthly sections in index.html.
  var EMAIL = 'hello@flntfilms.com';
  var PRICES = {
    base: {
      social:    { name: 'Social cuts', price: 900 },
      signature: { name: 'Signature video', price: 1800 },
      bundle:    { name: 'Signature + social', price: 2500 }
    },
    extraEdit: 120,
    addon: {
      interview: { name: 'Chef or owner interview', price: 300 },
      location:  { name: 'Second location', price: 350 },
      rush:      { name: 'Rush delivery', price: 400 }
    },
    monthly: {
      '4':  { name: 'Four reels a month', price: 750 },
      '8':  { name: 'Eight reels a month', price: 1300 },
      '12': { name: 'Twelve reels a month', price: 1800 }
    }
  };
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };

  var form = $('#builder');
  var extra = 0;
  var MAX_EXTRA = 12;

  function readState() {
    var base = form.elements.base.value || 'signature';
    var addons = $$('input[name="addon"]:checked', form).map(function (i) { return i.value; });
    var monthly = form.elements.monthly.value;
    return { base: base, addons: addons, monthly: monthly };
  }

  function render() {
    var st = readState();
    var lines = [];
    var once = 0;
    var b = PRICES.base[st.base];
    lines.push([b.name, b.price]); once += b.price;
    if (extra > 0) { lines.push([extra + ' extra vertical edit' + (extra > 1 ? 's' : ''), extra * PRICES.extraEdit]); once += extra * PRICES.extraEdit; }
    st.addons.forEach(function (k) { var a = PRICES.addon[k]; lines.push([a.name, a.price]); once += a.price; });

    $('#total-once').textContent = money(once);

    var m = PRICES.monthly[st.monthly];
    $('#summary-lines').textContent = lines.map(function (l) { return l[0]; }).concat(m ? [m.name] : []).join(' · ');
    var mRow = $('#monthly-row');
    mRow.hidden = !m;
    if (m) $('#total-monthly').textContent = money(m.price) + ' a month';

    $('#extra-count').textContent = extra;
    $('#extra-minus').disabled = extra === 0;
    $('#extra-plus').disabled = extra === MAX_EXTRA;

    // Prefilled email with the whole estimate
    var body = 'Hi FLNT Films,\n\nHere is the shoot I put together on your site:\n\n' +
      lines.map(function (l) { return '- ' + l[0] + ': ' + money(l[1]); }).join('\n') +
      '\n\nEstimated one-time total: ' + money(once) +
      (m ? '\nMonthly plan: ' + m.name + ' (' + money(m.price) + '/mo)' : '') +
      '\n\nRestaurant:\nLocation:\nIdeal shoot dates:\n';
    $('#send-estimate').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Shoot estimate: ' + b.name) + '&body=' + encodeURIComponent(body);
    $('#estimate-status').textContent = 'Estimate ' + money(once) + (m ? ' plus ' + money(m.price) + ' a month' : '');
  }

  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  $('#extra-minus').addEventListener('click', function () { extra = Math.max(0, extra - 1); render(); });
  $('#extra-plus').addEventListener('click', function () { extra = Math.min(MAX_EXTRA, extra + 1); render(); });

  // "Build with this" and "Add a plan" buttons preselect the builder
  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      var input = $('input[name="base"][value="' + a.dataset.pick + '"]', form);
      if (input) { input.checked = true; render(); }
    });
  });
  $$('[data-monthly]').forEach(function (a) {
    a.addEventListener('click', function () {
      var input = $('input[name="monthly"][value="' + a.dataset.monthly + '"]', form);
      if (input) { input.checked = true; render(); }
    });
  });
  render();

  /* ---------- Copy email address ---------- */
  var copyBtn = $('#copy-email');
  var status = $('#copy-status');
  var statusTimer;
  function say(msg) {
    status.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { status.textContent = ''; }, 2500);
  }
  function selectAddress() {
    var range = document.createRange();
    range.selectNodeContents($('#email-address'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  copyBtn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(
        function () { say('Copied'); },
        function () { selectAddress(); say('Address selected'); }
      );
    } else {
      selectAddress();
      say('Address selected');
    }
  });

  $('#year').textContent = new Date().getFullYear();
})();
