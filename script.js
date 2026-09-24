/* =============================================================================
   Tanner Johnson Media — landing page behavior
   Sections: config/pricing data · builder · pricing tabs · nav · reveal · CTA tracking
   ========================================================================== */
(function () {
  'use strict';

  var PHONE_DISPLAY = '(720) 587-9516';
  var PHONE_TEL = '+17205879516';
  var EMAIL = 'tannerjohnsonmedia@gmail.com';
  // Booking portal host. Used to classify portal clicks as contact_booking —
  // keep in step with the href on the Book online links in index.html.
  var PORTAL_HOST = 'portal.tannerjmedia.com';

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
    '0-2000':     { price: 1000, mins: 120 },   // your 0–4,000 band
    '2001-4000':  { price: 1000, mins: 120 },
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
    var wantsTour = addons.indexOf('tour') > -1;
    // only the Ultimate tiers include a 3D tour
    var upgradedForTour = wantsTour && !LARGE[sqft];
    var r = { includes: [], notes: [], mins: null, price: null, custom: false };

    if (media === 'photo') {
      if (sqft === '0-2000' && !wantsTour) {
        r.name = 'Basic Photography Package';
        r.sub = 'The right fit for condos, townhomes, rentals, and quick property updates.';
        r.price = 245;
        r.includes = ['20 professionally edited HDR images', '10 aerial photos'];
      } else if (sqft === '2001-4000' && !wantsTour) {
        r.name = 'Premium Photography Package';
        r.sub = 'The standard-listing workhorse — enough coverage for any typical single-family home.';
        r.price = 325;
        r.includes = ['35 professionally edited HDR images', 'Aerial photos',
                      'Schematic floor plan', 'Property website'];
      } else {
        var up = ULTIMATE_PHOTO[sqft];
        r.name = 'Ultimate Photography Package';
        r.sub = 'Built for larger homes and luxury listings that need complete coverage.';
        r.price = up.price;
        r.mins = up.mins;
        r.custom = up.price === null;
        r.includes = ['Unlimited HDR images', '15 aerial photos', 'Zillow 3D tour',
                      'Schematic floor plan', 'Property website'];
      }
      r.includes.push('MLS-sized + full-resolution files', 'Next-business-day delivery');

    } else if (media === 'video') {
      if (sqft === '0-2000' && !wantsAerial) {
        r.name = 'Walkthrough Video';
        r.sub = 'Clean, professional ground-level coverage for a standard listing.';
        r.price = 350;
        r.includes = ['Up to 90 seconds of edited footage', 'Interior + exterior ground-level coverage',
                      'Social-ready vertical cut'];
      } else if (!LARGE[sqft]) {
        r.name = 'Premium Cinematic Video';
        r.sub = 'A polished listing film with aerial footage for a more complete presentation.';
        r.price = 500;
        r.includes = ['Up to 2 minutes of edited footage', 'Cinematic edit with aerial footage',
                      'Interior + exterior coverage', 'Social-ready vertical cut'];
      } else {
        r.name = 'Ultimate Cinematic Video';
        r.sub = 'Our most complete film — built for maximum exposure and engagement across platforms.';
        r.price = 700;
        r.includes = ['3–5 minute cinematic film', 'Smooth interior walkthrough footage',
                      'Full aerial & drone coverage', 'Optional agent narration',
                      '1-minute vertical social media reel'];
      }
      r.includes.push('Next-business-day delivery');

    } else { // photovideo
      if (sqft === '0-2000' && !wantsAerial && !wantsTour) {
        r.name = 'Basic Photo & Video Package';
        r.sub = 'Professional photos and video coverage in one visit — the efficient starter package.';
        r.price = 500;
        r.includes = ['HDR photography package', 'Listing video coverage'];
      } else if (!LARGE[sqft] && !wantsTour) {
        r.name = 'Premium Photo & Video Package';
        r.sub = 'A complete media package for listings that need a stronger, more polished presence online.';
        r.price = 750;
        r.includes = ['35 professionally edited HDR photos', '10–15 aerial photos',
                      'Schematic floor plan', 'Property website',
                      'Premium Cinematic Video — up to 2 minutes'];
      } else {
        var uc = ULTIMATE_COMBO[sqft];
        r.name = 'Ultimate Photo & Video Package';
        r.sub = 'Our most complete listing package — for larger homes, luxury properties, and full high-end marketing.';
        r.price = uc.price;
        r.mins = uc.mins;
        r.includes = ['Unlimited HDR photography', '3–5 minute cinematic video',
                      'Full aerial & drone coverage', 'Zillow 3D tour',
                      '1-minute vertical social media reel'];
      }
      r.includes.push('MLS-sized + full-resolution files', 'Next-business-day delivery');
    }

    // Add-ons
    r.total = r.price;
    if (wantsTwilight) {
      r.includes.push('Twilight photoshoot — warm, glowing hero image');
      if (r.total !== null) r.total += TWILIGHT_PRICE;
      r.twilight = true;
    }
    if (wantsTour && media === 'video') {
      r.notes.push('A 3D tour is captured alongside the photography, so it isn\'t part of a video-only package — say the word on the call and we\'ll fold one in.');
    } else if (upgradedForTour) {
      r.notes.push('The Ultimate package is the one that includes a 3D tour, so that\'s what\'s recommended here — the smaller packages don\'t come with one.');
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
     HERO MESSAGE MATCH
     Point each Google Ads ad group at ?s=<key> and the hero speaks to what the
     visitor actually searched for. Everything below the hero stays put, so
     there's still only one page and one copy of the pricing.

     The URL only picks a key — nothing from it is ever inserted into the page,
     so a crafted link can't inject markup. An unknown key leaves the default.

     The headline carries class "reveal" (opacity 0 until the reveal observer
     runs), so the swap happens before it is ever painted — no flicker.
     ------------------------------------------------------------------------ */
  var HERO_VARIANTS = {
    photos: {
      eyebrow: 'Denver Metro &amp; Front Range · Real Estate Photography',
      h1: 'Listing photos that<br class="br-lg" />make buyers <em>stop scrolling.</em>',
      sub: 'MLS-ready HDR photography, hand-edited and delivered next business day. Packages from $175.'
    },
    video: {
      eyebrow: 'Denver Metro &amp; Front Range · Real Estate Video',
      h1: 'Video that keeps them<br class="br-lg" /><em>on the listing.</em>',
      sub: 'Cinematic listing films, walkthrough tours, and vertical cuts built for Reels — one shoot, every platform.'
    },
    drone: {
      eyebrow: 'Denver Metro &amp; Front Range · Aerial &amp; Drone',
      h1: 'Show the lot, the roof,<br class="br-lg" />the <em>whole neighborhood.</em>',
      sub: 'Aerial photography and drone video, included in every listing package rather than billed as an extra.'
    },
    twilight: {
      eyebrow: 'Denver Metro &amp; Front Range · Twilight Photography',
      h1: 'The one shot that makes<br class="br-lg" />a listing <em>stand out.</em>',
      sub: 'Warm windows, a dusk sky, and a hero image buyers stop for. Add twilight to any shoot for $250.'
    },
    condo: {
      eyebrow: 'Denver Metro &amp; Front Range · Condos &amp; Townhomes',
      h1: 'Smaller spaces,<br class="br-lg" />shot to <em>feel bigger.</em>',
      sub: 'Bright, straight-lined HDR photography for condos, townhomes, and rentals. Packages from $175.'
    },
    tours: {
      eyebrow: 'Denver Metro &amp; Front Range · 3D Tours',
      h1: 'Let buyers walk the house<br class="br-lg" />before they <em>ever visit.</em>',
      sub: 'Zillow 3D Home and Matterport tours, captured alongside your photos and live on the listing next business day.'
    },
    book: {
      eyebrow: 'Denver Metro &amp; Front Range · Real Estate Media',
      h1: 'Get your next listing<br class="br-lg" /><em>on the calendar.</em>',
      sub: 'Photography, video, and drone from a single visit. Book online any hour, or call and we\'ll find a date this week.'
    }
  };

  (function applyHeroVariant() {
    var key;
    try { key = new URLSearchParams(window.location.search).get('s'); } catch (e) { return; }
    if (!key) return;

    var v = HERO_VARIANTS[key.toLowerCase()];
    if (!v) return;   // unknown key — leave the default headline alone

    var hero = document.querySelector('.hero-inner');
    if (!hero) return;
    var eyebrow = hero.querySelector('.eyebrow');
    var h1 = hero.querySelector('h1');
    var sub = hero.querySelector('.hero-sub');
    if (eyebrow && v.eyebrow) eyebrow.innerHTML = v.eyebrow;
    if (h1 && v.h1) h1.innerHTML = v.h1;
    if (sub && v.sub) sub.textContent = v.sub;

    document.body.setAttribute('data-hero', key.toLowerCase());
    track('hero_variant', { variant: key.toLowerCase() });
  })();

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
     3D TOURS
     Same click-to-load treatment as the videos — these viewers are full 3D apps
     and cost several megabytes each.

     Some hosts refuse to be framed. That can't be detected reliably across
     origins, so every tour keeps a visible "Open in a new tab" link beneath it:
     if the frame comes up blank, the visitor still has a way through. Setting
     data-mode="link" on a facade skips the embed entirely and just opens the
     tour, for any host that turns out to block framing.
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.tour-facade'), function (btn) {
    btn.addEventListener('click', function () {
      var url = btn.getAttribute('data-tour');
      var label = btn.getAttribute('data-label') || '3D tour';
      if (!url) return;

      if (btn.getAttribute('data-mode') === 'link') {
        window.open(url, '_blank', 'noopener');
        track('tour_open', { tour: label, mode: 'newtab' });
        return;
      }

      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = label;
      iframe.setAttribute('allowfullscreen', '');
      iframe.allow = 'fullscreen; xr-spatial-tracking; gyroscope; accelerometer';
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      btn.replaceWith(iframe);
      track('tour_open', { tour: label, mode: 'embed' });
    });
  });

  /* ---------------------------------------------------------------------------
     PRICING TABS
     ------------------------------------------------------------------------ */
  /* Scoped per .tabs group — pricing and the 3D tours each have their own set,
     and a page-wide query would let one group deactivate the other's panels. */
  Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('.tab'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (!panel) return;
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          panel.classList.toggle('is-active', on);
          panel.hidden = !on;
        });
        track('tab_switch', { group: group.getAttribute('aria-label') || '', tab: tab.textContent.trim() });
      });
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
    if (header) header.classList.toggle('is-stuck', y > 40);
    if (mobileBar) mobileBar.classList.toggle('is-visible', y > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      mobileNav.hidden = open;
      if (!open && header) header.classList.add('is-stuck');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      closeNav();
    });
    // Resizing past the desktop breakpoint hides the panel in CSS — keep ARIA honest.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1140) closeNav();
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
  /* Google Ads conversion labels, keyed by the event that earns them. Only real
     leads are here: contact_booking is deliberately absent because it only means
     the visitor left for the external portal, which is not a booking. Nor are
     builder_step, tour_open, video_play or hero_variant, which are diagnostics. */
  var ADS_CONVERSIONS = {
    builder_complete: 'AW-18094494567/DqVRCIfJ8oIdEOemkLRD',
    contact_call:     'AW-18094494567/LJazCP-Q64IdEOemkLRD',
    contact_text:     'AW-18094494567/SrzxCIKR64IdEOemkLRD',
    contact_email:    'AW-18094494567/1mdLCIWR64IdEOemkLRD'
  };
  /* A listener bound twice would otherwise report two leads for one action.
     Short window rather than once-per-page-view, so a genuine second enquiry
     minutes later still counts. */
  var CONVERSION_DEDUPE_MS = 1000;
  var conversionSentAt = {};

  function track(event, params) {
    var payload = params || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: event }, payload));
      if (typeof window.gtag !== 'function') return;   // ad blocker — page must still work
      window.gtag('event', event, payload);

      if (!Object.prototype.hasOwnProperty.call(ADS_CONVERSIONS, event)) return;
      var now = Date.now();
      if (conversionSentAt[event] && now - conversionSentAt[event] < CONVERSION_DEDUPE_MS) return;
      conversionSentAt[event] = now;
      window.gtag('event', 'conversion', {
        'send_to': ADS_CONVERSIONS[event],
        'value': 1.0,
        'currency': 'USD'
      });
    } catch (err) { /* tracking must never break the page */ }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-cta]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var type = href.indexOf('tel:') === 0 ? 'call'
             : href.indexOf('sms:') === 0 ? 'text'
             : href.indexOf('mailto:') === 0 ? 'email'
             : href.indexOf(PORTAL_HOST) > -1 ? 'booking' : 'navigate';
    track(type === 'navigate' ? 'cta_click' : 'contact_' + type, {
      location: el.getAttribute('data-cta'),
      label: el.textContent.trim().slice(0, 60)
    });
  });

  /* ---------------------------------------------------------------------------
     VIDEO — click-to-load YouTube
     Each player is a poster image until clicked, then the real embed swaps in.
     Loading three iframes up front would cost every visitor over a megabyte of
     player JS, most of whom never press play.
     ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.yt-facade'), function (btn) {
    var img = btn.querySelector('img');
    var sources = (btn.getAttribute('data-posters') || '').split(',').filter(Boolean);
    var i = 0;

    // Walk the list: a local poster if you've added one, else YouTube's own thumbnail
    function nextPoster() {
      if (i >= sources.length) { img.removeAttribute('src'); return; }
      img.src = sources[i++];
    }
    img.addEventListener('error', nextPoster);
    nextPoster();

    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      if (!id) return;

      var params = 'autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white';
      if (btn.getAttribute('data-yt-loop')) params += '&loop=1&playlist=' + id;

      var iframe = document.createElement('iframe');
      // nocookie: no tracking cookies until someone actually plays something
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?' + params;
      iframe.title = btn.getAttribute('aria-label') || 'Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

      btn.replaceWith(iframe);
      track('video_play', { id: id, label: btn.getAttribute('aria-label') });
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
