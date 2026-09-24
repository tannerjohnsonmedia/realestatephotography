/* FLNT Films — "Strike"
   One rAF loop drives everything: sparks, light, cursor and the scroll-scrubbed scenes. */
(() => {
  'use strict';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const pad = (n, l = 2) => String(n).padStart(l, '0');

  const body = document.body;
  let W = innerWidth, H = innerHeight;

  /* ---------- Pointer + light ---------- */

  const pointer = { x: W / 2, y: H * 0.45, px: W / 2, py: H * 0.45, active: false, last: 0 };
  const light = { x: W / 2, y: H * 0.45 };
  let heat = 0; // 0..1, how much light the last sparks threw

  /* ---------- Sparks ---------- */

  const canvas = $('#sparks');
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  const sparks = [];
  const MAX_SPARKS = 900;

  function sizeCanvas() {
    W = innerWidth; H = innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(x, y, angle, speed, width, decay) {
    if (sparks.length >= MAX_SPARKS) sparks.shift();
    sparks.push({
      x, y, px: x, py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1, decay, w: width,
    });
  }

  // A strike: a fan of sparks, biased upward like a real flint strike.
  function strike(x, y, power = 1, dir = null) {
    if (reduce) return;
    const n = Math.round(16 * power);
    for (let i = 0; i < n; i++) {
      const a = dir == null
        ? -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3
        : dir + (Math.random() - 0.5) * 1.1;
      spawn(x, y, a, (1.5 + Math.random() * 5) * (0.7 + power * 0.3),
        0.4 + Math.random() * 0.8, 0.02 + Math.random() * 0.025);
    }
    flashes.push({ x, y, r: 30 + 60 * power, life: 0.5 });
    heat = clamp(heat + 0.35 * power, 0, 1);
    light.x = x; light.y = y;
    if (!body.classList.contains('has-struck')) body.classList.add('has-struck');
  }

  const flashes = [];

  function drawSparks() {
    ctx.clearRect(0, 0, W, H);
    if (!sparks.length && !flashes.length) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      g.addColorStop(0, `rgba(255,236,200,${0.55 * f.life})`);
      g.addColorStop(0.3, `rgba(255,140,50,${0.22 * f.life})`);
      g.addColorStop(1, 'rgba(255,90,31,0)');
      ctx.fillStyle = g;
      ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      f.life -= 0.07;
      if (f.life <= 0) flashes.splice(i, 1);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.px = p.x; p.py = p.y;
      p.vx *= 0.982;
      p.vy = p.vy * 0.982 + 0.2;
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;

      // Real flint sparks fork as the iron burns — split occasionally.
      if (p.w > 0.9 && p.life < 0.7 && Math.random() < 0.012) {
        for (let k = 0; k < 3; k++) {
          spawn(p.x, p.y, Math.random() * Math.PI * 2, 1 + Math.random() * 3, p.w * 0.45, 0.04 + Math.random() * 0.03);
        }
        p.w *= 0.6;
      }

      if (p.life <= 0 || p.y > H + 40) { sparks.splice(i, 1); continue; }

      const c = p.life > 0.72 ? '255,246,222' : p.life > 0.42 ? '255,184,80' : '255,96,36';
      ctx.strokeStyle = `rgba(${c},${Math.min(1, p.life * 1.5)})`;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(p.px - p.vx * 1.4, p.py - p.vy * 1.4);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Lit wordmarks (hero + footer) ---------- */

  const hero = $('.hero');
  const litwords = $$('.litword');

  function updateLight(t) {
    const idle = !pointer.active || t - pointer.last > 2600;
    let tx = pointer.x, ty = pointer.y;
    if (idle) {
      // Drift like a handheld lantern when nobody is steering it.
      tx = W * (0.5 + Math.sin(t * 0.00031) * 0.32);
      ty = H * (0.48 + Math.sin(t * 0.00053 + 1.2) * 0.16);
    }
    light.x = lerp(light.x, tx, idle ? 0.02 : 0.14);
    light.y = lerp(light.y, ty, idle ? 0.02 : 0.14);
    heat *= 0.965;

    const flicker = 1 + Math.sin(t * 0.021) * 0.03 + Math.sin(t * 0.047) * 0.02;
    const radius = (Math.max(170, Math.min(W, 1400) * 0.2) + heat * Math.max(W, 600) * 0.34) * flicker;

    for (const el of litwords) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) continue;
      el.style.setProperty('--lx', (light.x - r.left).toFixed(1) + 'px');
      el.style.setProperty('--ly', (light.y - r.top).toFixed(1) + 'px');
      el.style.setProperty('--lr', radius.toFixed(1) + 'px');
    }
    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) {
        hero.style.setProperty('--lx', (light.x - r.left).toFixed(1) + 'px');
        hero.style.setProperty('--ly', (light.y - r.top).toFixed(1) + 'px');
        hero.style.setProperty('--heat', heat.toFixed(3));
      }
    }
  }

  /* ---------- Cursor ---------- */

  const cursor = $('#cursor');
  const cursorLabel = $('#cursorLabel');
  const cur = { x: W / 2, y: H / 2 };
  if (finePointer && !reduce) body.classList.add('has-cursor');

  function updateCursor() {
    if (!finePointer) return;
    cur.x = lerp(cur.x, pointer.x, 0.22);
    cur.y = lerp(cur.y, pointer.y, 0.22);
    cursor.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
  }

  const HOVER_SEL = 'a, button, [data-cursor], select';
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest(HOVER_SEL);
    if (!t || t === hero) { cursor.classList.remove('is-hover'); return; }
    cursor.classList.add('is-hover');
    cursorLabel.textContent = t.dataset.cursor || (t.tagName === 'A' ? 'Open' : 'Go');
  });
  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget) cursor.classList.add('is-hidden');
  });
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));

  /* ---------- Pointer input ---------- */

  addEventListener('pointermove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY;
    pointer.active = true;
    pointer.last = performance.now();
    cursor.classList.remove('is-hidden');
    pointer.px = pointer.x; pointer.py = pointer.y;
  }, { passive: true });

  addEventListener('pointerdown', (e) => {
    cursor.classList.add('is-down');
    // Strikes stay in the hero so the rest of the page reads calmly.
    if (!hero || !e.target.closest('.hero') || e.target.closest('a, button')) return;
    strike(e.clientX, e.clientY, 1);
  });
  addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  function inView(el) {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < H;
  }

  /* ---------- Film leader ---------- */

  function roll() {
    body.classList.remove('is-loading');
    requestAnimationFrame(() => body.classList.add('is-rolling'));
    if (!reduce) setTimeout(() => strike(W / 2, H * 0.52, 1.2), 250);
  }

  function runLeader() {
    const el = $('#leader');
    if (!el) return roll();
    if (reduce) { el.remove(); return roll(); }
    const num = $('#leaderNum');
    let n = 3, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(timer);
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 900);
      roll();
    };
    const timer = setInterval(() => {
      n -= 1;
      if (n <= 0) finish(); else num.textContent = n;
    }, 700);
    el.addEventListener('click', finish);
    addEventListener('keydown', finish, { once: true });
  }

  /* ---------- Rack-focus manifesto ---------- */

  const focusSec = $('#manifesto');
  const focusText = $('#focusText');
  const focusFill = $('#focusFill');
  const focusDist = $('#focusDist');
  let words = [];

  function splitWords(root) {
    const out = [];
    for (const node of Array.from(root.childNodes)) {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.textContent = part;
          frag.appendChild(s); out.push(s);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) {
        out.push(...splitWords(node));
      }
    }
    return out;
  }
  if (focusText && !reduce) words = splitWords(focusText);

  function updateFocus(p) {
    if (!words.length) return;
    const plane = lerp(-0.08, 1.08, p);
    const n = words.length - 1;
    words.forEach((w, i) => {
      const d = i / n - plane;
      const blur = d <= 0 ? 0 : Math.min(9, d * 38);
      const op = d <= 0 ? 1 : Math.max(0.12, 1 - d * 3.2);
      const key = blur.toFixed(1) + '|' + op.toFixed(2);
      if (w._k === key) return;
      w._k = key;
      w.style.filter = blur ? `blur(${blur.toFixed(1)}px)` : 'none';
      w.style.opacity = op.toFixed(2);
    });
    focusFill.style.width = (p * 100).toFixed(1) + '%';
    focusDist.textContent = p > 0.96 ? '∞' : (0.6 / Math.max(0.04, 1 - p)).toFixed(1) + ' m';
  }

  /* ---------- Reel / film strip ---------- */

  const reelSec = $('#work');
  const reelSticky = $('.reel-sticky');
  const strip = $('#strip');
  const frames = $$('.frame');
  const reelIdx = $('#reelIdx');

  const reelTicks = $$('#reelTicks li');
  let reelActive = 0;

  function updateReel(p) {
    if (!strip || !frames.length) return;
    const n = frames.length;
    const step = n > 1 ? frames[1].offsetLeft - frames[0].offsetLeft : 0;
    // Each project holds center for a beat, then glides to the next.
    const pos = clamp((p - 0.05) / 0.9, 0, 1) * (n - 1);
    const i = Math.max(0, Math.min(n - 2, Math.floor(pos)));
    const t = clamp((pos - i - 0.25) / 0.5, 0, 1);
    const at = n > 1 ? i + t * t * (3 - 2 * t) : 0;
    strip.style.transform = `translate3d(${(-at * step).toFixed(1)}px,0,0)`;
    frames.forEach((f, k) => f.style.setProperty('--focus', clamp(1 - Math.abs(k - at), 0, 1).toFixed(3)));

    const active = Math.round(at);
    if (active !== reelActive) {
      reelActive = active;
      reelIdx.textContent = pad(active + 1);
      reelTicks.forEach((el, k) => el.classList.toggle('is-active', k === active));
    }

    // Letterbox in to scope as the reel starts, back out as it ends.
    const maxLb = Math.max(0, Math.min((H - W / 2.39) / 2, H * 0.09));
    const inAmt = ease(clamp(p / 0.08, 0, 1)) * (1 - ease(clamp((p - 0.94) / 0.06, 0, 1)));
    reelSticky.style.setProperty('--lb', (maxLb * inAmt).toFixed(1) + 'px');
  }

  frames.forEach((f) => {
    const v = $('video', f);
    if (!v) return;
    f.addEventListener('pointerenter', () => { v.play().catch(() => {}); });
    f.addEventListener('pointerleave', () => { v.pause(); });
  });

  /* ---------- Lens dial ---------- */

  const lensSec = $('#craft');
  const dial = $('#dial');
  const lensMm = $('#lensMm');
  const cards = $$('.lens-card');
  const lensIdx = $$('#lensIndex li');
  const MMS = cards.map((c) => +c.dataset.mm);
  const STEP = 34; // degrees between focal-length marks
  let dialLabels = [];
  let activeLens = 0;

  function buildDial() {
    if (!dial) return;
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 300, cy = 300;
    const el = (tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      dial.appendChild(e);
      return e;
    };
    el('circle', { cx, cy, r: 292, class: 'ring' });
    el('circle', { cx, cy, r: 264, class: 'knurl' });
    el('circle', { cx, cy, r: 212, class: 'ring' });
    for (let i = 0; i < 180; i++) {
      const a = (i * 2 - 90) * Math.PI / 180;
      const major = i % 5 === 0;
      const r1 = 238, r2 = major ? 216 : 226;
      el('line', {
        x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1,
        x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2,
        class: major ? 'tick major' : 'tick',
      });
    }
    dialLabels = MMS.map((mm, i) => {
      const a = (i * STEP - 90) * Math.PI / 180;
      const t = el('text', { x: cx + Math.cos(a) * 262, y: cy + Math.sin(a) * 262, transform: `rotate(${i * STEP} ${cx + Math.cos(a) * 262} ${cy + Math.sin(a) * 262})` });
      t.textContent = mm;
      return t;
    });
  }
  buildDial();

  function setLens(i) {
    if (i === activeLens) return;
    activeLens = i;
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    lensIdx.forEach((c, k) => c.classList.toggle('is-active', k === i));
    dialLabels.forEach((c, k) => c.classList.toggle('is-active', k === i));
  }

  function updateLens(p) {
    if (!dial) return;
    const n = MMS.length - 1;
    const pos = clamp(p * 1.1 - 0.05, 0, 1) * n;
    dial.style.transform = `rotate(${(-pos * STEP).toFixed(2)}deg)`;
    const i = Math.floor(pos), f = pos - i;
    const mm = i >= n ? MMS[n] : lerp(MMS[i], MMS[i + 1], ease(f));
    lensMm.textContent = Math.round(mm);
    setLens(Math.round(pos));
  }
  if (dialLabels[0]) dialLabels[0].classList.add('is-active');

  /* ---------- Process fuse ---------- */

  const processSec = $('#process');
  const fuseFill = $('#fuseFill');
  const steps = $$('#steps li');

  function updateFuse() {
    if (!processSec) return;
    const r = $('#steps').getBoundingClientRect();
    const p = clamp((H * 0.85 - r.top) / (r.height + H * 0.35), 0, 1);
    fuseFill.style.width = (p * 100).toFixed(1) + '%';
    steps.forEach((s, i) => s.classList.toggle('is-lit', p >= (i + 0.15) / steps.length));
  }

  /* ---------- HUD: timecode, scrubber, scene ---------- */

  const tc = $('#tc');
  const scrubFill = $('#scrubFill');
  const scrub = $('.scrub');
  const sceneEl = $('#scene');
  const fstopEl = $('#fstop');
  const RUNTIME_FRAMES = 3 * 60 * 24; // the page "runs" three minutes at 24 fps

  function updateHud() {
    const max = document.documentElement.scrollHeight - H;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    const f = Math.round(p * RUNTIME_FRAMES);
    tc.textContent = `00:${pad(Math.floor(f / 1440))}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
    scrubFill.style.transform = `scaleX(${p.toFixed(4)})`;
    scrub.style.setProperty('--p', (p * 100).toFixed(2) + '%');
  }

  const scenes = $$('[data-scene]');
  const sceneObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      sceneEl.textContent = e.target.dataset.scene;
      if (e.target.dataset.fstop) fstopEl.textContent = e.target.dataset.fstop;
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  scenes.forEach((s) => sceneObs.observe(s));

  /* ---------- Reveals ---------- */

  const revealEls = $$('.process h2, .process .eyebrow, .contact-head > *, .slate, .reel-head h2');
  revealEls.forEach((el) => el.classList.add('reveal'));
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObs.observe(el));

  /* ---------- Slate form ---------- */

  const slate = $('#slate');
  const status = $('#slateStatus');

  let audio;
  function clapSound() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const len = audio.sampleRate * 0.12;
      const buf = audio.createBuffer(1, len, audio.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
      const src = audio.createBufferSource();
      const bp = audio.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.7;
      const g = audio.createGain(); g.gain.value = 0.5;
      src.buffer = buf; src.connect(bp).connect(g).connect(audio.destination);
      src.start();
    } catch (e) { /* no audio, no problem */ }
  }

  function clap() {
    slate.classList.remove('is-clapped');
    void slate.offsetWidth;
    slate.classList.add('is-clapped');
    setTimeout(() => {
      clapSound();
      const r = $('.clap-bottom', slate).getBoundingClientRect();
      strike(r.left + r.width * 0.5, r.top, 0.8);
    }, 80);
    setTimeout(() => slate.classList.remove('is-clapped'), 900);
  }

  $('#clapper').addEventListener('click', clap);

  slate.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    $$('[required]', slate).forEach((f) => {
      const bad = !f.checkValidity();
      f.closest('.field').classList.toggle('is-invalid', bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) {
      status.className = 'slate-status is-err';
      status.textContent = 'Please add your name, email and project type.';
      return;
    }
    clap();
    const btn = $('.action', slate);
    btn.disabled = true;
    status.className = 'slate-status';
    status.textContent = 'Sending…';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(slate)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      status.className = 'slate-status is-ok';
      status.textContent = "Thanks! We'll reply within one business day.";
      slate.reset();
    } catch (err) {
      status.className = 'slate-status is-err';
      status.textContent = "That didn't send. Please email us at " + $('.contact-mail').textContent;
    } finally {
      btn.disabled = false;
    }
  });
  slate.addEventListener('input', (e) => {
    const f = e.target.closest('.field');
    if (f && e.target.checkValidity()) f.classList.remove('is-invalid');
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Main loop ---------- */

  function progress(el) {
    const r = el.getBoundingClientRect();
    const total = r.height - H;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  function frame(t) {
    updateLight(t);
    updateCursor();
    drawSparks();
    if (!reduce) {
      if (focusSec && inView(focusSec)) updateFocus(progress(focusSec));
      if (reelSec && inView(reelSec)) updateReel(progress(reelSec));
      if (lensSec && inView(lensSec)) updateLens(progress(lensSec));
      if (processSec && inView(processSec)) updateFuse();
    }
    updateHud();
    requestAnimationFrame(frame);
  }

  addEventListener('resize', sizeCanvas);

  sizeCanvas();
  if (reduce) steps.forEach((s) => s.classList.add('is-lit'));
  requestAnimationFrame(frame);
  if (document.readyState === 'complete') runLeader();
  else addEventListener('load', runLeader, { once: true });
})();
