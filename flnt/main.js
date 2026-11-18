/* FLNT Films: intro, hero entrance, menu, scroll motion, shoot builder and copy-email. No libraries. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // html.fx is added by the inline script in <head> when motion is allowed.
  var motion = root.classList.contains('fx');
  root.classList.add('fx-ready');

  /* ---------- Hero entrance ---------- */
  // Wrap each headline word so it can rise from below its own line.
  var h1 = $('.hero h1');
  if (motion && h1) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    var n = 0;
    var wrapWords = function (el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType === 1) { wrapWords(node); return; }
        if (node.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var outer = document.createElement('span');
          var inner = document.createElement('span');
          outer.className = 'wd'; outer.setAttribute('aria-hidden', 'true');
          inner.className = 'wd-in'; inner.style.setProperty('--i', n++);
          inner.textContent = part;
          outer.appendChild(inner); frag.appendChild(outer);
        });
        node.parentNode.replaceChild(frag, node);
      });
    };
    wrapWords(h1);
  }
  var heroIn = function () { root.classList.add('hero-in'); };
  setTimeout(heroIn, 4500);   // failsafe: the hero always ends up visible

  /* ---------- Intro ---------- */
  var intro = $('.intro');

  function release() {
    root.classList.remove('intro-on');
    if (intro) intro.classList.remove('is-playing', 'is-leaving', 'is-skipping');
    heroIn();
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
        heroIn();   // the hero starts arriving as the overlay fades
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
  } else {
    setTimeout(heroIn, 80);
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

  /* ---------- Prices count up to their figure ---------- */
  function countUp(price, delay) {
    var node = Array.prototype.filter.call(price.childNodes, function (n) { return n.nodeType === 3 && /\d/.test(n.textContent); })[0];
    if (!node) return;
    var finalText = node.textContent;
    var target = parseInt(finalText.replace(/[^\d]/g, ''), 10);
    var span = document.createElement('span');
    span.className = 'count';
    span.textContent = finalText;
    price.replaceChild(span, node);
    span.style.minWidth = span.getBoundingClientRect().width + 'px';   // lock the width first
    span.textContent = '0';
    setTimeout(function () {
      var start = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - start) / 1100);
        span.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(step); else span.textContent = finalText;
      })(start);
    }, delay);
  }

  /* ---------- Scroll reveal ---------- */
  if (motion) {
    // Stagger order for lists that arrive one item at a time
    $$('[data-stagger]').forEach(function (list) {
      Array.prototype.slice.call(list.children).forEach(function (child, i) { child.style.setProperty('--i', i); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
        $$('.price', en.target).forEach(function (price, i) { countUp(price, 250 + i * 90); });
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll-linked: header, hero flame drift, showreel push-in ---------- */
  var header = $('.site-header');
  var heroEl = $('.hero');
  var heroArt = $('.hero-art');
  var reelFrame = $('.reel-frame');
  var reelStage = $('.reel-stage');
  var monthly = $('.monthly');
  var outlines = $$('.outline');
  var footMark = $('.foot-mark');
  var footLetters = $$('.foot-mark span');
  var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
  var easeInOut = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  var lastY = window.scrollY;
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;

    // Header: frosted once the page moves; tucks away scrolling down, returns scrolling up
    header.classList.toggle('is-scrolled', y > 24);
    if (motion) {
      if (links.classList.contains('is-open') || y < 200 || y < lastY - 4) header.classList.remove('is-hidden');
      else if (y > lastY + 4) header.classList.add('is-hidden');
    }
    lastY = y;

    if (!motion) return;

    // Hero flame drifts upward like rising heat and fades as you leave the hero.
    // (Upward, so it never meets the hero's clipped bottom edge.)
    var hh = heroEl.offsetHeight;
    if (y < hh + 200) {
      heroArt.style.setProperty('--py', (Math.min(y, hh) * -0.18).toFixed(1) + 'px');
      heroArt.style.setProperty('--po', (1 - Math.min(1, y / hh) * 0.7).toFixed(3));
    }

    // Showreel: 0.94 -> 1 as it arrives, then pinned while it opens to full screen width
    var fw = reelFrame.offsetWidth, fh = reelFrame.offsetHeight;
    reelFrame.parentNode.style.setProperty('--fh', fh + 'px');
    var stage = reelStage.getBoundingClientRect();
    if (stage.top < vh && stage.bottom > 0) {
      var pinTop = Math.max(16, vh / 2 - fh / 2);
      var full = Math.min(document.documentElement.clientWidth / fw, (vh * 0.96) / fh);
      var hold = reelStage.offsetHeight - reelFrame.parentNode.offsetHeight;
      var pin = hold > 0 ? clamp01((pinTop - stage.top) / hold) : 0;
      var open = easeInOut(clamp01(pin / 0.75));
      var arrive = clamp01((vh - reelFrame.getBoundingClientRect().top) / Math.max(1, vh - pinTop));   // reaches 1 exactly at the pin
      var s = pin > 0 ? 1 + (full - 1) * open : 0.94 + 0.06 * arrive;
      reelFrame.style.setProperty('--reel-s', s.toFixed(4));
      reelFrame.parentNode.style.setProperty('--reel-p', open.toFixed(3));
    }

    // Outline words ignite as you pass them (the hero's as you scroll away from it)
    outlines.forEach(function (el) {
      var p;
      if (heroEl.contains(el)) p = clamp01(y / (hh * 0.5));
      else {
        var o = el.getBoundingClientRect();
        if (o.top > vh || o.bottom < 0) return;
        p = clamp01((vh * 0.85 - o.top) / (vh * 0.45));
      }
      el.style.setProperty('--fill', (p * 115).toFixed(1) + '%');
    });

    // Monthly panel opens from an inset card to full width
    var mr = monthly.getBoundingClientRect();
    if (mr.top < vh && mr.bottom > 0) monthly.style.setProperty('--mp', clamp01((vh - mr.top) / (vh * 0.75)).toFixed(3));

    // Closing wordmark: letters rise one after another, then burn left to right
    // (tied to the end of the page, so it always finishes at the very bottom)
    var fr = footMark.getBoundingClientRect();
    if (fr.top < vh) {
      var end = document.documentElement.scrollHeight - vh;
      var span = Math.max(1, Math.min(end, fr.height * 1.6));
      var fp = clamp01((y - (end - span)) / span);
      footLetters.forEach(function (l, i) {
        l.style.setProperty('--rise', easeInOut(clamp01(fp * 1.8 - i * 0.18)).toFixed(3));
        l.style.setProperty('--fill', (clamp01(fp * 3.2 - 1.2 - i * 0.3) * 115).toFixed(1) + '%');
      });
    }
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame);
  onFrame();

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

  // The one-time total counts smoothly to its new value
  var shownTotal = null;
  var totalRaf = 0;
  function showTotal(target) {
    var el = $('#total-once');
    if (!motion || shownTotal === null) { shownTotal = target; el.textContent = money(target); return; }
    var from = shownTotal;
    var start = performance.now();
    cancelAnimationFrame(totalRaf);
    (function step(now) {
      var k = Math.min(1, (now - start) / 450);
      shownTotal = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
      el.textContent = money(shownTotal);
      if (k < 1) totalRaf = requestAnimationFrame(step);
    })(start);
  }

  function render() {
    var st = readState();
    var lines = [];
    var once = 0;
    var b = PRICES.base[st.base];
    lines.push([b.name, b.price]); once += b.price;
    if (extra > 0) { lines.push([extra + ' extra vertical edit' + (extra > 1 ? 's' : ''), extra * PRICES.extraEdit]); once += extra * PRICES.extraEdit; }
    st.addons.forEach(function (k) { var a = PRICES.addon[k]; lines.push([a.name, a.price]); once += a.price; });

    showTotal(once);

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
