/* =============================================================================
   Tanner Johnson Media — landing page behavior
   Sections: config/pricing data · builder · pricing tabs · nav · reveal · CTA tracking
   ========================================================================== */
(function () {
  'use strict';

  var PHONE_DISPLAY = '(720) 587-9516';
  var PHONE_TEL = '+17205879516';
  var EMAIL = 'tannerjohnsonmedia@gmail.com';

  /* ---------------------------------------------------------------------------
     PRICING DATA — single source of truth for the Build Your Shoot recommender.
     These mirror the package prices shown in the Pricing section; if you change
     a price on your booking platform, change it here and in index.html.
     ------------------------------------------------------------------------ */
  var SQFT_LABELS = {
    '0-2000':     'Under 2,000 sq ft',
    '2001-4000':  '2,001 – 4,000 sq ft',
    '4001-6000':  '4,001 – 6,000 sq ft',
    '6001-8000':  '6,001 – 8,000 sq ft',
    '8001-10000': '8,001 – 10,000 sq ft',
    '10000+':     '10,000+ sq ft'
  };

  var TWILIGHT_PRICE = 250;

  // Ultimate Photography Package — priced by square footage
  var ULTIMATE_PHOTO = {
    '0-2000':     { price: 450, mins: 60 },
    '2001-4000':  { price: 475, mins: 70 },
    '4001-6000':  { price: 500, mins: 75 },
    '6001-8000':  { price: 525, mins: 90 },
    '8001-10000': { price: 550, mins: 100 },
    '10000+':     { price: null, mins: null }   // custom quote
  };

  // Ultimate Photo & Video Package — priced by square footage
  // Only reached at 4,001+ sq ft — smaller homes get the Basic/Premium combo instead.
  var ULTIMATE_COMBO = {
    '4001-6000':  { price: 1100, mins: 150 },
    '6001-8000':  { price: 1200, mins: 150 },
    '8001-10000': { price: 1300, mins: 180 },
    '10000+':     { price: 1500, mins: 240 }
  };

  var LARGE = { '4001-6000': 1, '6001-8000': 1, '8001-10000': 1, '10000+': 1 };

  /* ---------------------------------------------------------------------------
     RECOMMENDER
     ------------------------------------------------------------------------ */
  function recommend(a) {
    var sqft = a.sqft, media = a.media, addons = a.addons;
    var wantsAerial = addons.indexOf('aerial') > -1;
    var wantsTwilight = addons.indexOf('twilight') > -1;
    var wantsRush = addons.indexOf('rush') > -1;
    var r = { includes: [], notes: [], mins: null, price: null, custom: false };

    if (media === 'photo') {
      if (sqft === '0-2000') {
        r.name = 'Basic Photography Package';
        r.sub = 'The right fit for condos, townhomes, rentals, and quick property updates.';
        r.price = 245;
        r.includes = ['Professionally edited HDR images', 'Full interior + exterior coverage'];
      } else if (sqft === '2001-4000') {
        r.name = 'Premium Photography Package';
        r.sub = 'The standard-listing workhorse — enough coverage for any typical single-family home.';
        r.price = 325;
        r.includes = ['35 professionally edited HDR images', 'Full interior + exterior coverage'];
      } else {
        var up = ULTIMATE_PHOTO[sqft];
        r.name = 'Ultimate Photography Package';
        r.sub = 'Built for larger homes and luxury listings that need complete coverage.';
        r.price = up.price;
        r.mins = up.mins;
        r.custom = up.price === null;
        r.includes = ['Unlimited HDR images', 'Complete interior, exterior & detail coverage'];
      }
      r.includes.push('MLS-sized + full-resolution files', 'Next-business-day delivery');
      if (wantsAerial) {
        r.notes.push('Aerial coverage isn\'t bundled into photo-only packages — we\'ll price drone stills for this property on the call.');
      }

    } else if (media === 'video') {
      if (sqft === '0-2000' && !wantsAerial) {
        r.name = 'Walkthrough Video';
        r.sub = 'Clean, professional ground-level coverage for a standard listing.';
        r.price = 350;
        r.includes = ['Up to 90 seconds of edited footage', 'Interior + exterior ground-level coverage'];
      } else if (!LARGE[sqft]) {
        r.name = 'Premium Cinematic Video';
        r.sub = 'A polished listing film with aerial footage for a more complete presentation.';
        r.price = 500;
        r.includes = ['Cinematic edit with aerial footage', 'Interior + exterior coverage'];
      } else {
        r.name = 'Ultimate Cinematic Video';
        r.sub = 'Our most complete film — built for maximum exposure and engagement across platforms.';
        r.price = 700;
        r.includes = ['3–5 minute cinematic film', 'Smooth interior walkthrough footage', 'Full aerial & drone coverage'];
      }
      r.includes.push('Social-ready vertical cut', 'Next-business-day delivery');

    } else { // photovideo
      if (sqft === '0-2000' && !wantsAerial) {
        r.name = 'Basic Photo & Video Package';
        r.sub = 'Professional photos and video coverage in one visit — the efficient starter package.';
        r.price = 500;
        r.includes = ['HDR photography package', 'Listing video coverage'];
      } else if (!LARGE[sqft]) {
        r.name = 'Premium Photo & Video Package';
        r.sub = 'A complete media package for listings that need a stronger, more polished presence online.';
        r.price = 750;
        r.includes = ['Premium HDR photography', 'Cinematic video with aerial footage'];
      } else {
        var uc = ULTIMATE_COMBO[sqft];
        r.name = 'Ultimate Photo & Video Package';
        r.sub = 'Our most complete listing package — for larger homes, luxury properties, and full high-end marketing.';
        r.price = uc.price;
        r.mins = uc.mins;
        r.includes = ['Unlimited HDR photography', '3–5 minute cinematic video', 'Full aerial & drone coverage'];
      }
      r.includes.push('Social-ready vertical cut', 'MLS-sized + full-resolution files', 'Next-business-day delivery');
    }

    // Add-ons
    r.total = r.price;
    if (wantsTwilight) {
      r.includes.push('Twilight photoshoot — warm, glowing hero image');
      if (r.total !== null) r.total += TWILIGHT_PRICE;
      r.twilight = true;
    }
    if (wantsRush) {
      r.notes.push('Rush turnaround is available most weeks — mention your deadline on the call and we\'ll confirm same-day delivery.');
    }
    if (addons.indexOf('unsure') > -1) {
      r.notes.push('Not sure on the extras? We\'ll walk through what this specific property needs — no upsell.');
    }
    if (r.custom) {
      r.notes.push('Properties over 10,000 sq ft are quoted individually so the scope matches the home.');
    }
    return r;
  }

  function money(n) { return '$' + n.toLocaleString('en-US'); }

  /* ---------------------------------------------------------------------------
     BUILDER
     ------------------------------------------------------------------------ */
  var form = document.getElementById('builderForm');
  if (form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll('.step'));
    var total = steps.length;
    var current = 0;

    var progressBar = document.getElementById('progressBar');
    var stepLabel = document.getElementById('stepLabel');
    var backBtn = document.getElementById('backBtn');
    var nextBtn = document.getElementById('nextBtn');
    var errorEl = document.getElementById('builderError');
    var resultEl = document.getElementById('builderResult');

    function paint() {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      progressBar.style.width = ((current + 1) / total * 100) + '%';
      stepLabel.textContent = 'Step ' + (current + 1) + ' of ' + total;
      backBtn.hidden = current === 0;
      nextBtn.textContent = current === total - 1 ? 'Show my package' : 'Continue';
      hideError();
    }

    function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }
    function hideError() { errorEl.hidden = true; }

    function validate() {
      var step = steps[current];
      var radios = step.querySelectorAll('input[type="radio"]');
      if (radios.length && !step.querySelector('input[type="radio"]:checked')) {
        showError('Pick one option to continue.');
        return false;
      }
      var inputs = Array.prototype.slice.call(step.querySelectorAll('input[required]'));
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (!el.value.trim()) { showError('Please fill in your ' + el.name + '.'); el.focus(); return false; }
        if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) {
          showError('That email address doesn\'t look right.'); el.focus(); return false;
        }
        if (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10) {
          showError('Please enter a 10-digit phone number.'); el.focus(); return false;
        }
      }
      return true;
    }

    function collect() {
      var d = new FormData(form);
      return {
        sqft: d.get('sqft'),
        media: d.get('media'),
        addons: d.getAll('addon'),
        name: (d.get('name') || '').trim(),
        phone: (d.get('phone') || '').trim(),
        email: (d.get('email') || '').trim(),
        address: (d.get('address') || '').trim()
      };
    }

    function summaryText(a, r) {
      var lines = [
        'Name: ' + a.name,
        'Phone: ' + a.phone,
        'Email: ' + a.email,
        'Property: ' + (a.address || 'TBD'),
        'Size: ' + SQFT_LABELS[a.sqft],
        'Recommended: ' + r.name,
        'Estimate: ' + (r.total === null ? 'Custom quote' : money(r.total))
      ];
      if (a.addons.length) lines.push('Add-ons: ' + a.addons.join(', '));
      return lines.join('\n');
    }

    function renderResult() {
      var a = collect();
      var r = recommend(a);

      document.getElementById('resultTitle').textContent = r.name;
      document.getElementById('resultSub').textContent = r.sub;
      document.getElementById('resultPrice').textContent = r.total === null ? 'Custom quote' : money(r.total);

      var meta = [SQFT_LABELS[a.sqft]];
      if (r.mins) meta.push('about ' + r.mins + ' min on site');
      if (r.twilight && r.total !== null) meta.push('includes ' + money(TWILIGHT_PRICE) + ' twilight add-on');
      document.getElementById('resultMeta').textContent = meta.join(' · ');

      var list = document.getElementById('resultList');
      list.innerHTML = '';
      r.includes.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      r.notes.forEach(function (note) {
        var li = document.createElement('li');
        li.className = 'is-note';
        li.textContent = note;
        list.appendChild(li);
      });

      var body = 'Hi Tanner — here\'s my shoot from your website:\n\n' + summaryText(a, r) +
                 '\n\nWhen can you get out there?';

      document.getElementById('resultEmail').href =
        'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Shoot request — ' + (a.address || r.name)) +
        '&body=' + encodeURIComponent(body);

      document.getElementById('resultText').href =
        'sms:' + PHONE_TEL + '?&body=' + encodeURIComponent(
          'Hi Tanner — ' + a.name + ' here. ' + r.name + ' for ' + (a.address || 'my listing') +
          ' (' + SQFT_LABELS[a.sqft] + ').'
        );

      form.hidden = true;
      resultEl.hidden = false;
      progressBar.style.width = '100%';
      stepLabel.hidden = true;
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      track('builder_complete', { package: r.name, value: r.total, sqft: a.sqft, media: a.media });
    }

    nextBtn.addEventListener('click', function () {
      if (!validate()) return;
      if (current === total - 1) { renderResult(); return; }
      current++;
      paint();
      track('builder_step', { step: current + 1 });
    });

    backBtn.addEventListener('click', function () {
      if (current === 0) return;
      current--;
      paint();
    });

    // Choosing a radio advances automatically — fewer taps, fewer drop-offs.
    form.addEventListener('change', function (e) {
      hideError();
      if (e.target.type !== 'radio' || current === total - 1) return;
      window.setTimeout(function () {
        if (steps[current].contains(e.target)) { current++; paint(); }
      }, 240);
    });

    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); nextBtn.click(); }
    });

    document.getElementById('restartBtn').addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      resultEl.hidden = true;
      stepLabel.hidden = false;
      current = 0;
      paint();
      document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    paint();
  }

  /* ---------------------------------------------------------------------------
     PRICING TABS
     ------------------------------------------------------------------------ */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
      });
      track('pricing_tab', { tab: tab.textContent.trim() });
    });
  });

  /* ---------------------------------------------------------------------------
     HEADER / MOBILE NAV / STICKY BAR
     ------------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  var mobileBar = document.getElementById('mobileBar');
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-stuck', y > 40);
    if (mobileBar) mobileBar.classList.toggle('is-visible', y > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      mobileNav.hidden = open;
      if (!open) header.classList.add('is-stuck');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      closeNav();
    });
    // Resizing past the desktop breakpoint hides the panel in CSS — keep ARIA honest.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) closeNav();
    });
  }

  function closeNav() {
    if (!navToggle) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  }

  /* ---------------------------------------------------------------------------
     REVEAL ON SCROLL
     ------------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal, .card, .price-card, .step-item, .quote, .shot');
  if ('IntersectionObserver' in window) {
    revealables.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        window.setTimeout(function () { el.classList.add('is-in'); }, i * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------------------
     CONVERSION TRACKING
     Every call/email/text button carries data-cta. Events push to dataLayer
     (GTM) and gtag (GA4) if either is installed — nothing breaks if neither is.
     ------------------------------------------------------------------------ */
  function track(event, params) {
    var payload = params || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event }, payload));
      if (typeof window.gtag === 'function') window.gtag('event', event, payload);
    } catch (err) { /* tracking must never break the page */ }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-cta]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var type = href.indexOf('tel:') === 0 ? 'call'
             : href.indexOf('sms:') === 0 ? 'text'
             : href.indexOf('mailto:') === 0 ? 'email' : 'navigate';
    track(type === 'navigate' ? 'cta_click' : 'contact_' + type, {
      location: el.getAttribute('data-cta'),
      label: el.textContent.trim().slice(0, 60)
    });
  });

  /* ---------------------------------------------------------------------------
     MISSING PHOTOS DEGRADE QUIETLY
     Before the real files land in /assets, hide the broken <img> and let the
     tile's gradient and caption stand on their own.
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.shot img'), function (img) {
    function fail() { img.style.display = 'none'; img.closest('.shot').classList.add('is-empty'); }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------------------------------------------------------------------------
     MISC
     ------------------------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
