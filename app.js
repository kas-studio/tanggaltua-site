/**
 * Tanggal Tua — Marketing Landing Page & Playtest Funnel Layer
 * Zero external runtime dependencies: Web Audio kosan SFX synthesizer,
 * Saklar Lampu Ibu Kos Easter Egg, Authentic Canvas2D Food Sprites + Magic Com 450VA Pot,
 * Live Thermal Receipt Renderer, & Resilient Leads + Playtest Feedback Funnel.
 */

// ============================================================================
// 1. STORE LINKS & LEADS / FEEDBACK FUNNEL CONFIG
// ============================================================================
const IS_EN_PAGE = (document.documentElement.lang || '').toLowerCase().startsWith('en');

const SITE_CONFIG = {
  // Paused App Store public URL while KAS Studio Organization conversion completes (waitlist via KAS Admin):
  iosUrl: '',
  iosBadgeSub: IS_EN_PAGE ? 'Release Waitlist' : 'Daftar Tunggu • iOS',

  // Paste your Google Play Closed/Open Testing opt-in URL or store URL when live:
  androidUrl: '',
  androidBadgeSub: IS_EN_PAGE ? 'Closed Beta • Join' : 'Closed Beta • Daftar',

  // Optional external form overrides (leave empty to use the built-in in-page modal forms!):
  androidWaitlistFormUrl: '',
  feedbackFormUrl: '',

  leadsInboxEmail: ['halo', 'tanggaltua.id'].join('@'),
  contactEmail: ['halo', 'tanggaltua.id'].join('@'),

  // Official Threads Accounts (Single source of truth for links & 1-tap share intents):
  threadsGameHandle: 'tanggaltuagame',
  threadsStudioHandle: 'kasstudio.id',

  // KAS Admin Supabase (oxciczkwxwcvjliamxsh) public publishable RPC layer for live community votes & hybrid bailouts:
  supabaseUrl: 'https://oxciczkwxwcvjliamxsh.supabase.co',
  supabasePublishableKey: 'sb_publishable_RTH8hQ2z-10d9NXBrPbR-w_NNJlQcPq',
};

const KAS_ADMIN_HUB_ENDPOINTS = [
  ['https:', '', 'admin.kasstudio.id', 'api', 'public', 'inquiries'].join('/'),
  ['https:', '', 'kas-admin.vercel.app', 'api', 'public', 'inquiries'].join('/'),
];

// Shared bespoke SVG icons matching src/ui/icons.ts (zero generic OS emojis)
const GAME_ICONS = {
  bowl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a8 8 0 0 1-16 0Z"/><path d="M8 20h8"/><path d="M9 7c0-1.5 1-2 1-3"/><path d="M14 7c0-1.5 1-2 1-3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .8-4.5 2.5C10.5 3.8 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
};

// ============================================================================
// 2. HANDCRAFTED ACOUSTIC KOSAN FOLEY (Matches src/audio/soundEngine.ts — zero synth laser chirps!)
// ============================================================================
let audioCtx = null;
let siteNoiseWhite = null;
let siteNoisePink = null;

function getAudio() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    const sr = audioCtx.sampleRate;
    const len = Math.floor(sr * 1.5);
    siteNoiseWhite = audioCtx.createBuffer(1, len, sr);
    siteNoisePink = audioCtx.createBuffer(1, len, sr);
    const w = siteNoiseWhite.getChannelData(0);
    const p = siteNoisePink.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      w[i] = white;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      p[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playSiteNylonPluck(ctx, midi, when, velocity = 0.16) {
  const sr = ctx.sampleRate;
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const total = Math.floor(sr * 1.6);
  const buf = ctx.createBuffer(1, total, sr);
  const out = buf.getChannelData(0);
  const brightness = 0.48;
  const N = Math.max(8, Math.round(sr / freq + brightness));
  const ring = new Float32Array(N);
  let prev = 0;
  for (let i = 0; i < N; i++) {
    const n = Math.random() * 2 - 1;
    prev = prev * 0.66 + n * 0.34;
    ring[i] = prev * 0.72 + Math.sin((Math.PI * i) / N) * 0.28;
  }
  let ptr = 0;
  for (let i = 0; i < total; i++) {
    const cur = ring[ptr];
    const next = ring[(ptr + 1) % N];
    out[i] = cur;
    ring[ptr] = (cur * 0.52 + next * 0.48) * 0.995;
    ptr = (ptr + 1) % N;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const modelPeriod = N - brightness * ((N - 1) / N);
  src.playbackRate.setValueAtTime(freq / (sr / modelPeriod), when);
  const body = ctx.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.value = 225;
  body.Q.value = 1.3;
  body.gain.value = 3.5;
  const g = ctx.createGain();
  g.gain.setValueAtTime(velocity, when);
  src.connect(body).connect(g).connect(ctx.destination);
  src.start(when);
}

const sfx = {
  click(on = true) {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Crisp Indonesian Broco plastic wall rocker switch two-stage contact click
    if (siteNoiseWhite) {
      [
        { off: 0, freq: on ? 2250 : 1750, amp: 0.11 },
        { off: 0.013, freq: on ? 2950 : 1380, amp: 0.15 },
      ].forEach(({ off, freq, amp }) => {
        const src = ctx.createBufferSource();
        src.buffer = siteNoiseWhite;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = freq;
        bp.Q.value = 2.8;
        const g = ctx.createGain();
        g.gain.setValueAtTime(amp, now + off);
        g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.018);
        src.connect(bp).connect(g).connect(ctx.destination);
        src.start(now + off, Math.random() * 0.8, 0.024);
      });
    }
    const box = ctx.createOscillator();
    const bGain = ctx.createGain();
    box.type = 'sine';
    box.frequency.setValueAtTime(on ? 260 : 195, now);
    box.frequency.exponentialRampToValueAtTime(110, now + 0.028);
    bGain.gain.setValueAtTime(0.095, now);
    bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
    box.connect(bGain).connect(ctx.destination);
    box.start(now);
    box.stop(now + 0.036);
  },

  sizzle() {
    const ctx = getAudio();
    if (!ctx || !siteNoisePink) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = siteNoisePink;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2750, now);
    filter.Q.value = 0.95;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.008, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now, Math.random() * 0.6, 0.55);
    // Organic oil/water droplet micro-pops
    for (let i = 0; i < 4; i++) {
      const t = now + 0.04 + Math.random() * 0.36;
      const pop = ctx.createOscillator();
      const pg = ctx.createGain();
      const f = 680 + Math.random() * 920;
      pop.type = 'sine';
      pop.frequency.setValueAtTime(f, t);
      pop.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.022);
      pg.gain.setValueAtTime(0.04, t);
      pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.026);
      pop.connect(pg).connect(ctx.destination);
      pop.start(t);
      pop.stop(t + 0.03);
    }
  },

  jeklek() {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (siteNoiseWhite) {
      const snap = ctx.createBufferSource();
      snap.buffer = siteNoiseWhite;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1420;
      bp.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.24, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
      snap.connect(bp).connect(g).connect(ctx.destination);
      snap.start(now, 0.1, 0.05);
    }
    const down = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    down.type = 'triangle';
    down.frequency.setValueAtTime(148, now + 0.015);
    down.frequency.exponentialRampToValueAtTime(34, now + 0.36);
    lp.type = 'lowpass';
    lp.frequency.value = 360;
    gain.gain.setValueAtTime(0.22, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    down.connect(lp).connect(gain).connect(ctx.destination);
    down.start(now + 0.015);
    down.stop(now + 0.4);
  },

  pln() {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.145, 0.29].forEach((offset) => {
      const osc = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(3120, now + offset);
      bp.type = 'bandpass';
      bp.frequency.value = 3120;
      bp.Q.value = 4.5;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.linearRampToValueAtTime(0.078, now + offset + 0.0025);
      gain.gain.setValueAtTime(0.078, now + offset + 0.068);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.076);
      osc.connect(bp).connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.08);
    });
  },

  knock() {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.155, 0.315].forEach((delay, idx) => {
      const t = now + delay;
      const accent = idx === 2 ? 1.15 : 1.0;
      if (siteNoisePink) {
        const hit = ctx.createBufferSource();
        hit.buffer = siteNoisePink;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1150;
        bp.Q.value = 1.7;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.2 * accent, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);
        hit.connect(bp).connect(g).connect(ctx.destination);
        hit.start(t, Math.random() * 0.8, 0.03);
      }
      [
        { fStart: 158, fEnd: 118, dur: 0.095, gain: 0.24 * accent },
        { fStart: 312, fEnd: 258, dur: 0.055, gain: 0.12 * accent },
      ].forEach(({ fStart, fEnd, dur, gain }) => {
        const mode = ctx.createOscillator();
        const g = ctx.createGain();
        mode.type = 'sine';
        mode.frequency.setValueAtTime(fStart, t);
        mode.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
        g.gain.setValueAtTime(gain, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.01);
        mode.connect(g).connect(ctx.destination);
        mode.start(t);
        mode.stop(t + dur + 0.015);
      });
    });
  },

  vn() {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [60, 64, 67, 71, 72].forEach((midi, i) => {
      playSiteNylonPluck(ctx, midi, now + i * 0.082, 0.15);
    });
  },
};

// ============================================================================
// 3. SAKLAR LAMPU KOS + IN-GAME MONOGRAM AVATAR TOAST (src/ui/hudController.ts)
// ============================================================================
const switchBtn = document.getElementById('btn-light-switch');
const switchLabel = document.getElementById('switch-label');
const ibuToast = document.getElementById('ibu-toast');
const ibuToastBadge = document.getElementById('ibu-toast-badge');
const ibuToastText = document.getElementById('ibu-toast-text');
let toastTimer = null;

const TOAST_BADGES = {
  ibu_kos: { code: 'IK', bg: '#F59E0B', fg: '#181625' },
  pln: { code: 'PLN', bg: '#3B82F6', fg: '#FFFFFF' },
  rmh: { code: 'RMH', bg: '#10B981', fg: '#FFFFFF' },
  kos: { code: 'KOS', bg: '#F27D42', fg: '#FFFFFF' },
};

function showKosToast(msg, badgeKey = 'ibu_kos') {
  if (!ibuToast || !ibuToastText) return;
  const badge = TOAST_BADGES[badgeKey] || TOAST_BADGES.ibu_kos;
  if (ibuToastBadge) {
    ibuToastBadge.textContent = badge.code;
    ibuToastBadge.style.background = badge.bg;
    ibuToastBadge.style.color = badge.fg;
  }
  ibuToastText.textContent = msg;
  ibuToast.classList.remove('hidden');
  ibuToast.setAttribute('aria-hidden', 'false');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    ibuToast.classList.add('hidden');
    ibuToast.setAttribute('aria-hidden', 'true');
  }, 3200);
}

const IS_EN = IS_EN_PAGE;

function timeoutSignal(ms = 8000) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

async function copyTextSafe(text) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to offscreen textarea below
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return Boolean(ok);
  } catch {
    return false;
  }
}

const preloadedScreenUrls = new Set();
function preloadScreenUrl(src) {
  if (!src || preloadedScreenUrls.has(src)) return;
  preloadedScreenUrls.add(src);
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

async function swapScreenImage(imgEl, nextSrc, onCommitCaption) {
  if (!imgEl || !nextSrc) {
    if (onCommitCaption) onCommitCaption();
    return;
  }
  if (imgEl.getAttribute('src') === nextSrc) {
    if (onCommitCaption) onCommitCaption();
    return;
  }
  const token = (imgEl._swapToken || 0) + 1;
  imgEl._swapToken = token;
  imgEl.classList.add('is-swapping');
  try {
    const probe = new Image();
    probe.decoding = 'async';
    probe.src = nextSrc;
    if (typeof probe.decode === 'function') {
      await probe.decode().catch(() => {});
    }
  } catch {
    // Ignore decode errors
  }
  if (imgEl._swapToken !== token) return;
  imgEl.src = nextSrc;
  if (onCommitCaption) onCommitCaption();
  requestAnimationFrame(() => {
    if (imgEl._swapToken === token) imgEl.classList.remove('is-swapping');
  });
}

switchBtn?.addEventListener('click', () => {
  const isNight = document.documentElement.getAttribute('data-theme') === 'night';
  const next = isNight ? 'day' : 'night';
  document.documentElement.setAttribute('data-theme', next);
  switchBtn.setAttribute('aria-pressed', String(next === 'night'));
  if (switchLabel) {
    switchLabel.textContent = IS_EN
      ? next === 'night'
        ? 'LIGHT • OFF'
        : 'LIGHT • ON'
      : next === 'night'
        ? 'LAMPU • OFF'
        : 'LAMPU • ON';
  }
  sfx.click(next === 'day');
  showKosToast(
    IS_EN
      ? next === 'night'
        ? 'Lights out! Landlady Ibu Kos thinks you are asleep — safe.'
        : 'Lights back on! A new morning at Kosan Gang Kancil.'
      : next === 'night'
        ? 'Lampu dimatikan! Ibu Kos kira kamu udah tidur — aman.'
        : 'Lampu nyala lagi! Pagi baru di Kosan Gang Kancil.',
    'ibu_kos'
  );
});

// ============================================================================
// 4. HERO PHONE CYCLER & 3-PHASE DAILY LOOP SHOWCASE
// ============================================================================
const HERO_SLIDES = IS_EN
  ? [
      { src: '/assets/screen-kitchen.jpg', label: '450VA Rice Cooker • 36 Secret Recipes!' },
      { src: '/assets/screen-market.jpg', label: 'Dusk Alley Market & Bang Udin Cart' },
      { src: '/assets/screen-ojol.jpg', label: 'Saturday Scooter Delivery Hustle (New!)' },
      { src: '/assets/screen-hustle.jpg', label: 'Sudirman Car-Free Day Thrift Stall' },
      { src: '/assets/screen-night.jpg', label: 'Midnight Texts & Landlady Knocks' },
      { src: '/assets/screen-receipt.jpg', label: 'Struk 2.0 • Archetype & Signature Dish!' },
    ]
  : [
      { src: '/assets/screen-kitchen.jpg', label: 'Masak 36 Resep di Magic Com 450VA!' },
      { src: '/assets/screen-market.jpg', label: 'Belanja Sore di Gerobak Sayur Bang Udin' },
      { src: '/assets/screen-ojol.jpg', label: 'Narik Kurir Ojol Gang Kancil • Baru!' },
      { src: '/assets/screen-hustle.jpg', label: 'Lapak Preloved CFD • Tolak Nawar 5rb!' },
      { src: '/assets/screen-night.jpg', label: 'Chat Malam & Ketukan Ibu Kos' },
      { src: '/assets/screen-receipt.jpg', label: 'Struk 2.0 • Gelar Kos & Masakan Andalan!' },
    ];

const heroImg = document.getElementById('hero-screen-img');
const heroLabel = document.getElementById('hero-screen-label');
const heroDotsWrap = document.getElementById('hero-dots');
let heroIdx = 0;
let heroTimer = null;
let heroInView = true;

if (heroDotsWrap) {
  HERO_SLIDES.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `hero-dot${idx === 0 ? ' active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', IS_EN_PAGE ? `Show screen ${idx + 1}` : `Tampilkan layar ${idx + 1}`);
    dot.setAttribute('aria-selected', String(idx === 0));
    dot.addEventListener('click', () => {
      sfx.click(true);
      setHeroSlide(idx);
      resetHeroAutoCycle();
    });
    heroDotsWrap.appendChild(dot);
  });
}

function setHeroSlide(idx) {
  heroIdx = ((idx % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
  const slide = HERO_SLIDES[heroIdx];
  heroDotsWrap?.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.classList.toggle('active', i === heroIdx);
    d.setAttribute('aria-selected', String(i === heroIdx));
  });
  void swapScreenImage(heroImg, slide.src, () => {
    if (heroLabel) heroLabel.textContent = slide.label;
  });
}

const motionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)');
function shouldCycleHero() {
  if (motionMedia?.matches) return false;
  if (document.hidden) return false;
  if (!heroInView) return false;
  const modalEl = document.getElementById('store-modal');
  if (modalEl && !modalEl.classList.contains('hidden')) return false;
  return true;
}

function resetHeroAutoCycle() {
  if (heroTimer) clearInterval(heroTimer);
  if (motionMedia?.matches) return;
  heroTimer = setInterval(() => {
    if (shouldCycleHero()) setHeroSlide(heroIdx + 1);
  }, 4200);
}

if (typeof IntersectionObserver === 'function' && heroImg) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroInView = entry.isIntersecting;
      });
    },
    { threshold: 0.15 }
  );
  obs.observe(heroImg);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resetHeroAutoCycle();
});
resetHeroAutoCycle();

const LOOP_SCREENS = IS_EN
  ? {
      market: { src: '/assets/screen-market.jpg', caption: 'Bang Udin Veggie Cart & Yellow-Tag Clearance' },
      kitchen: { src: '/assets/screen-kitchen.jpg', caption: '5×4 Communal Fridge & 450VA Rice Cooker Dial' },
      night: { src: '/assets/screen-night.jpg', caption: 'Midnight Kosan Texts • Dodge Landlady & Loan Spam' },
      hustle: { src: '/assets/screen-ojol.jpg', caption: 'Weekend Side Hustles • Ojol Delivery, CFD Stall & TV Gig' },
    }
  : {
      market: { src: '/assets/screen-market.jpg', caption: 'Gerobak Bang Udin & Rak Kuning Kosmart 24J' },
      kitchen: { src: '/assets/screen-kitchen.jpg', caption: 'Kulkas Kos 5×4 & Jarum Listrik Magic Com 450VA' },
      night: { src: '/assets/screen-night.jpg', caption: 'Chat Kosan • Ngumpet dari Ibu Kos & Tutup Spam Pinjol' },
      hustle: { src: '/assets/screen-ojol.jpg', caption: 'Sabtu–Minggu • Kurir Ojol, Lapak CFD & Studio TV' },
    };

const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 250));
scheduleIdle(() => {
  HERO_SLIDES.forEach((s) => preloadScreenUrl(s.src));
  Object.values(LOOP_SCREENS).forEach((s) => preloadScreenUrl(s.src));
});

const loopImg = document.getElementById('loop-screen-img');
const loopCaption = document.getElementById('loop-screen-caption');

document.querySelectorAll('.loop-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.loop;
    const data = LOOP_SCREENS[key];
    if (!data) return;
    sfx.click(true);
    document.querySelectorAll('.loop-tab').forEach((t) => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });
    void swapScreenImage(loopImg, data.src, () => {
      if (loopCaption) loopCaption.textContent = data.caption;
    });
  });
});

// ============================================================================
// 5. AUTHENTIC IN-GAME CANVAS2D SPRITES (Ported 1:1 from src/rendering/itemSprites.ts)
// ============================================================================
const SPRITE_INK = '#2C1E26';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawItemSprite(ctx, defId, cx, cy, size) {
  const s = size / 32;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.strokeStyle = SPRITE_INK;
  ctx.lineWidth = 1.9;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (defId) {
    case 'mie': {
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, -12, -11, 24, 22, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E63946';
      ctx.fillRect(-11, -10, 22, 7);
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(-11, -3, 22, 4);
      ctx.strokeStyle = '#E07A22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-7, 5);
      ctx.quadraticCurveTo(-4, 2, 0, 5);
      ctx.quadraticCurveTo(4, 8, 7, 5);
      ctx.stroke();
      ctx.strokeStyle = SPRITE_INK;
      ctx.lineWidth = 1.4;
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, -11);
        ctx.lineTo(i, -8.5);
        ctx.moveTo(i, 11);
        ctx.lineTo(i, 8.5);
        ctx.stroke();
      }
      break;
    }

    case 'beras': {
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(-7, -11);
      ctx.lineTo(7, -11);
      ctx.quadraticCurveTo(13, -3, 11, 10);
      ctx.quadraticCurveTo(0, 13, -11, 10);
      ctx.quadraticCurveTo(-13, -3, -7, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E63946';
      roundRect(ctx, -6, -9, 12, 3.5, 1.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2EC4B6';
      ctx.beginPath();
      ctx.ellipse(0, 2, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.ellipse(0, 2, 2.5, 1.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'telur': {
      ctx.fillStyle = '#C89F74';
      roundRect(ctx, -13, 1, 26, 9, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F5CBA7';
      ctx.beginPath();
      ctx.ellipse(-5.5, -2, 6.2, 8.2, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FAD7A0';
      ctx.beginPath();
      ctx.ellipse(5.5, -2, 6.2, 8.2, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(2.5, -5);
      ctx.lineTo(5.5, -2);
      ctx.lineTo(4, 0.5);
      ctx.lineTo(7.5, 2.5);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(-7.5, -5, 1.5, 2.5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'tempe': {
      ctx.fillStyle = '#52B788';
      roundRect(ctx, -12, -8, 24, 18, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F3DFC1';
      roundRect(ctx, -8, -11, 16, 17, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#C89666';
      [
        [-4, -7],
        [2, -6],
        [-2, -2],
        [4, -1],
        [-4, 2],
        [2, 3],
      ].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(dx, dy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'bayam': {
      ctx.fillStyle = '#2D6A4F';
      ctx.beginPath();
      ctx.ellipse(-5, -4, 6, 8, -0.35, 0, Math.PI * 2);
      ctx.ellipse(5, -4, 6, 8, 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#52B788';
      ctx.beginPath();
      ctx.ellipse(0, -6, 6.5, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#95D5B2';
      roundRect(ctx, -4, 1, 8, 10, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E63946';
      ctx.fillRect(-5, 4, 10, 3);
      ctx.strokeRect(-5, 4, 10, 3);
      break;
    }

    case 'kerupuk': {
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const r = i % 2 === 0 ? 11.5 : 8;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, Math.PI * 0.5, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'kecap': {
      ctx.fillStyle = '#4A2C2A';
      roundRect(ctx, -9, -11, 15, 22, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.fillRect(-7, -3, 11, 6);
      ctx.fillStyle = '#E63946';
      roundRect(ctx, 1, -6, 10, 17, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#52B788';
      ctx.fillRect(4, -4, 4, 3);
      break;
    }

    case 'sarden': {
      ctx.fillStyle = '#D62828';
      roundRect(ctx, -12, -6, 24, 16, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.ellipse(0, -6, 12, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.ellipse(-1, 3, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 3);
      ctx.lineTo(8, 0);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'tahu': {
      ctx.fillStyle = '#FFFDF5';
      roundRect(ctx, -11, -3, 12, 12, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FEF9E7';
      roundRect(ctx, -1, -10, 12, 12, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, -5, -1, 12, 11, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(46, 196, 182, 0.45)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.lineTo(3, 2);
      ctx.stroke();
      break;
    }

    case 'kol': {
      ctx.fillStyle = '#B7E4C7';
      ctx.beginPath();
      ctx.arc(-3, -1, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#52B788';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-3, -1, 6, 0.4, Math.PI * 1.5);
      ctx.stroke();
      ctx.strokeStyle = SPRITE_INK;
      ctx.lineWidth = 1.8;
      ctx.fillStyle = '#F27D42';
      ctx.beginPath();
      ctx.arc(6, 5, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.arc(6, 5, 2.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'sosis': {
      ctx.fillStyle = '#D94E5A';
      roundRect(ctx, -10, -9, 8.5, 19, 4.2);
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, 0.5, -7, 8.5, 19, 4.2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-7.5, -5);
      ctx.lineTo(-7.5, 4);
      ctx.moveTo(3, -3);
      ctx.lineTo(3, 6);
      ctx.stroke();
      ctx.fillStyle = '#FFD166';
      ctx.strokeStyle = SPRITE_INK;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(8, -7, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'pisang': {
      ctx.fillStyle = '#FFD166';
      [-4, 0, 4].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(-6 + offset, -9);
        ctx.quadraticCurveTo(6 + offset, -1, 1 + offset, 10);
        ctx.quadraticCurveTo(-5 + offset, 6, -9 + offset, -6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      ctx.fillStyle = '#52B788';
      roundRect(ctx, -9, -11, 12, 4, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'kornet': {
      ctx.fillStyle = '#B91C1C';
      roundRect(ctx, -11, -9, 22, 19, 3.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(-10, -2, 20, 7);
      ctx.fillStyle = '#E2E8F0';
      roundRect(ctx, -6, -12, 12, 3.5, 1.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.ellipse(0, 1.5, 5.2, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bawang_cabe': {
      ctx.fillStyle = '#9D4EDD';
      ctx.beginPath();
      ctx.ellipse(-4.5, 2, 6.2, 7.2, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E0AAFF';
      ctx.beginPath();
      ctx.ellipse(-6, 0, 1.8, 3.5, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E63946';
      ctx.beginPath();
      ctx.moveTo(1, -7);
      ctx.quadraticCurveTo(12, -2, 8, 9);
      ctx.quadraticCurveTo(2, 6, 1, -7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#2D6A4F';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(2, -7);
      ctx.quadraticCurveTo(0, -11, 4, -11);
      ctx.stroke();
      break;
    }

    case 'roti_tawar': {
      ctx.fillStyle = '#D97706';
      roundRect(ctx, -11, -7, 19, 17, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FFFDF5';
      roundRect(ctx, -8.5, -4.5, 14, 12, 2.5);
      ctx.fill();
      ctx.fillStyle = '#B45309';
      roundRect(ctx, -7, -10, 19, 6.5, 3.2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.arc(1.5, 1.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'santan': {
      ctx.fillStyle = '#ECFDF5';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(12, 9);
      ctx.lineTo(-12, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(-9.5, 4.5);
      ctx.lineTo(9.5, 4.5);
      ctx.lineTo(12, 9);
      ctx.lineTo(-12, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(0, 0.5, 4.2, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-3.2, 0.3, 6.4, 1.8);
      break;
    }

    default: {
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ============================================================================
// 6. INTERACTIVE MINI-TOY #1: MAGIC COM 450VA + STAINLESS POT
// ============================================================================
const TOY_INGREDIENTS = IS_EN_PAGE
  ? [
      { id: 'mie', name: 'Instant Noodles', price: 'Rp3.5k', watt: 70 },
      { id: 'telur', name: 'Cracked Egg', price: 'Rp3.5k', watt: 65 },
      { id: 'beras', name: 'Retail Rice', price: 'Rp4k', watt: 75 },
      { id: 'kornet', name: 'Corned Beef', price: 'Rp6k', watt: 70 },
      { id: 'tempe', name: 'Tempeh Slab', price: 'Rp4k', watt: 60 },
      { id: 'bayam', name: 'Spinach Bunch', price: 'Rp3.5k', watt: 50 },
      { id: 'sarden', name: 'Canned Sardines', price: 'Rp8k', watt: 100 },
      { id: 'roti_tawar', name: 'Night-Sale Bread', price: 'Rp6.5k', watt: 45 },
      { id: 'santan', name: 'Mini Coconut Milk', price: 'Rp3.5k', watt: 50 },
      { id: 'bawang_cabe', name: 'Shallot & Rawit', price: 'Rp3k', watt: 30 },
      { id: 'kecap', name: 'Sweet Soy & Chili', price: 'Rp2.5k', watt: 25 },
      { id: 'kerupuk', name: 'Warung Crackers', price: 'Rp2k', watt: 35 },
    ]
  : [
      { id: 'mie', name: 'Mie Instan', price: 'Rp3,5rb', watt: 70 },
      { id: 'telur', name: 'Telur Retak', price: 'Rp3,5rb', watt: 65 },
      { id: 'beras', name: 'Beras Eceran', price: 'Rp4rb', watt: 75 },
      { id: 'kornet', name: 'Kornet Sachet', price: 'Rp6rb', watt: 70 },
      { id: 'tempe', name: 'Tempe Papan', price: 'Rp4rb', watt: 60 },
      { id: 'bayam', name: 'Ikat Bayam', price: 'Rp3,5rb', watt: 50 },
      { id: 'sarden', name: 'Sarden Kaleng', price: 'Rp8rb', watt: 100 },
      { id: 'roti_tawar', name: 'Roti Tawar Diskon', price: 'Rp6,5rb', watt: 45 },
      { id: 'santan', name: 'Santan Segitiga', price: 'Rp3,5rb', watt: 50 },
      { id: 'bawang_cabe', name: 'Bawang & Rawit', price: 'Rp3rb', watt: 30 },
      { id: 'kecap', name: 'Kecap & Sambal', price: 'Rp2,5rb', watt: 25 },
      { id: 'kerupuk', name: 'Kerupuk Warung', price: 'Rp2rb', watt: 35 },
    ];

const RARITY_BADGE_LABELS = IS_EN_PAGE
  ? { keramat: 'SACRED', kreatif: 'CLEVER', biasa: 'BASIC' }
  : { keramat: 'KERAMAT', kreatif: 'KREATIF', biasa: 'BIASA' };

const TOY_RECIPES = IS_EN_PAGE
  ? [
      { req: ['mie', 'telur', 'kornet'], name: 'Sultan Warkop Internet', rarity: 'keramat', gut: 34, sanity: 28, note: 'Indomie + Egg + Corned Beef midnight royalty!' },
      { req: ['kerupuk', 'telur', 'bawang_cabe'], name: 'Emergency Cracker Seblak', rarity: 'keramat', gut: 26, sanity: 26, note: 'Boiled crackers in fiery chili-egg broth' },
      { req: ['beras', 'santan', 'bawang_cabe'], name: 'Rice-Cooker Nasi Liwet', rarity: 'keramat', gut: 33, sanity: 24, note: 'Savory coconut rice scents the whole hall' },
      { req: ['beras', 'mie', 'telur'], name: 'Rice-Cooker Magelangan', rarity: 'keramat', gut: 32, sanity: 24, note: 'Carb-on-carb legend, full till noon' },
      { req: ['beras', 'tempe', 'telur'], name: 'Kosan Warteg Platter', rarity: 'keramat', gut: 36, sanity: 22, note: 'Complete Day-25 balanced meal' },
      { req: ['beras', 'bayam', 'tempe'], name: 'Kosan Pecel Rice Bowl', rarity: 'keramat', gut: 36, sanity: 20, note: 'Healthy & cheap, tastes like home' },
      { req: ['beras', 'sarden', 'bayam'], name: 'Sultan Green Sardine Rice', rarity: 'keramat', gut: 36, sanity: 26, note: 'End-of-month boarding house feast' },
      { req: ['mie', 'telur', 'bayam'], name: 'Loaded Dok-Dok Noodles', rarity: 'keramat', gut: 28, sanity: 18, note: 'Safe! Does not count as plain noodles' },
      { req: ['beras', 'kerupuk', 'kecap'], name: 'Soy-Drizzled Cracker Rice', rarity: 'kreatif', gut: 20, sanity: 18, note: 'Day-29 spare-change lifesaver' },
      { req: ['mie', 'santan'], name: 'Creamy Coconut Ramen KW', rarity: 'keramat', gut: 30, sanity: 26, note: 'Kosan hack turns instant noodles into ramen!' },
      { req: ['sarden', 'bawang_cabe'], name: 'Mercon Chili Sardines', rarity: 'keramat', gut: 28, sanity: 24, note: 'Fiery bird’s-eye chili kick for late-night study' },
      { req: ['beras', 'sarden'], name: 'Early-Payday Sardine Rice', rarity: 'keramat', gut: 34, sanity: 28, note: 'Aroma drifts down the whole hallway' },
      { req: ['mie', 'sarden'], name: 'Thick Sardine Broth Noodles', rarity: 'keramat', gut: 28, sanity: 24, note: 'Real fish protein, gut stays happy' },
      { req: ['beras', 'mie'], name: 'Noodle-Seasoned Fried Rice', rarity: 'keramat', gut: 22, sanity: 18, note: 'Classic kosan double-carb combo' },
      { req: ['telur', 'kerupuk'], name: 'Chewy Cracker Omelet', rarity: 'keramat', gut: 18, sanity: 16, note: 'Stale crackers reborn crispy & savory' },
      { req: ['beras', 'kornet'], name: 'Scrambled Corned-Beef Rice', rarity: 'kreatif', gut: 28, sanity: 20, note: 'Timeless boarding-house comfort bowl' },
      { req: ['roti_tawar', 'telur'], name: 'Folded Egg Toast', rarity: 'kreatif', gut: 27, sanity: 20, note: 'Street-style toast seared on the pot base!' },
      { req: ['mie', 'telur'], name: 'Poached-Egg Noodles', rarity: 'kreatif', gut: 16, sanity: 14, note: 'Add an egg to keep gastritis away' },
      { req: ['mie', 'bayam'], name: 'Green Veggie Noodle Soup', rarity: 'kreatif', gut: 20, sanity: 10, note: 'Mom back home would be relieved' },
      { req: ['tempe', 'kecap'], name: 'Spicy Sweet-Soy Orek Tempeh', rarity: 'kreatif', gut: 22, sanity: 14, note: 'Keeps well for tomorrow' },
      { req: ['beras', 'kecap'], name: 'Legendary Sweet-Soy Rice', rarity: 'biasa', gut: 14, sanity: 12, note: 'Ultra-lean meal when cash runs thin' },
      { req: ['telur'], name: 'Steamed Rice-Cooker Egg', rarity: 'biasa', gut: 16, sanity: 10, note: 'Zero stove or cooking oil needed' },
      { req: ['mie'], name: 'Plain Instant Noodles', rarity: 'biasa', gut: 6, sanity: 4, note: 'Avoid 4 days straight—watch your gut!' },
    ]
  : [
      { req: ['mie', 'telur', 'kornet'], name: 'Internet Warkop Sultan', rarity: 'keramat', gut: 34, sanity: 28, note: 'Mie + Telur + Kornet, kasta tertinggi tengah malam!' },
      { req: ['kerupuk', 'telur', 'bawang_cabe'], name: 'Seblak Kerupuk Darurat', rarity: 'keramat', gut: 26, sanity: 26, note: 'Kerupuk direbus rawit & telur, pedas nagih!' },
      { req: ['beras', 'santan', 'bawang_cabe'], name: 'Nasi Liwet Magic Com', rarity: 'keramat', gut: 33, sanity: 24, note: 'Beras gurih santan & bawang wangi se-kosan!' },
      { req: ['beras', 'mie', 'telur'], name: 'Magelangan Magic Com', rarity: 'keramat', gut: 32, sanity: 24, note: 'Kenyang pol sampai besok siang' },
      { req: ['beras', 'tempe', 'telur'], name: 'Nasi Warteg Komplit KW', rarity: 'keramat', gut: 36, sanity: 22, note: 'Paket lengkap tanggal 25' },
      { req: ['beras', 'bayam', 'tempe'], name: 'Nasi Pecel Anak Kos', rarity: 'keramat', gut: 36, sanity: 20, note: 'Sehat murah berasa di rumah' },
      { req: ['beras', 'sarden', 'bayam'], name: 'Nasi Sarden Hijau Sultan', rarity: 'keramat', gut: 36, sanity: 26, note: 'Mewah banget buat akhir bulan' },
      { req: ['mie', 'telur', 'bayam'], name: 'Mie Dok-Dok Komplit', rarity: 'keramat', gut: 28, sanity: 18, note: 'Aman, gak dihitung mie polos' },
      { req: ['beras', 'kerupuk', 'kecap'], name: 'Nasi Kerupuk Kecap', rarity: 'kreatif', gut: 20, sanity: 18, note: 'Penyelamat tanggal 29 modal receh' },
      { req: ['mie', 'santan'], name: 'Mie Kuah Creamy Ramen KW', rarity: 'keramat', gut: 30, sanity: 26, note: 'Trik anak kos sulap mie & santan jadi ramen!' },
      { req: ['sarden', 'bawang_cabe'], name: 'Sarden Tumis Rawit Mercon', rarity: 'keramat', gut: 28, sanity: 24, note: 'Amis hilang, pedasnya bikin semangat lembur!' },
      { req: ['beras', 'sarden'], name: 'Nasi Sarden Gajian Dini', rarity: 'keramat', gut: 34, sanity: 28, note: 'Wanginya sampai kamar sebelah' },
      { req: ['mie', 'sarden'], name: 'Mie Sarden Kuah Kental', rarity: 'keramat', gut: 28, sanity: 24, note: 'Pakai lauk ikan, perut aman' },
      { req: ['beras', 'mie'], name: 'Nasi Goreng Bumbu Mie', rarity: 'keramat', gut: 22, sanity: 18, note: 'Karbo ketemu karbo favorit kos' },
      { req: ['telur', 'kerupuk'], name: 'Omelet Kerupuk Alot', rarity: 'keramat', gut: 18, sanity: 16, note: 'Kerupuk melempem jadi gurih lagi' },
      { req: ['beras', 'kornet'], name: 'Nasi Orak-Arik Kornet', rarity: 'kreatif', gut: 28, sanity: 20, note: 'Penyelamat klasik anak kos sepanjang masa' },
      { req: ['roti_tawar', 'telur'], name: 'Roti Telur Lipat Sarapan', rarity: 'kreatif', gut: 27, sanity: 20, note: 'Toast ala Korea dipanggang di dasar panci!' },
      { req: ['mie', 'telur'], name: 'Mie Telur Anak Sultan', rarity: 'kreatif', gut: 16, sanity: 14, note: 'Tambah telur biar perut gak perih' },
      { req: ['mie', 'bayam'], name: 'Mie Kuah Sayur Sehat', rarity: 'kreatif', gut: 20, sanity: 10, note: 'Ibu di kampung pasti lega' },
      { req: ['tempe', 'kecap'], name: 'Orek Tempe Kecap Pedas', rarity: 'kreatif', gut: 22, sanity: 14, note: 'Awet disimpan buat besok' },
      { req: ['beras', 'kecap'], name: 'Nasi Kecap Legendaris', rarity: 'biasa', gut: 14, sanity: 12, note: 'Modal irit pas dompet tipis' },
      { req: ['telur'], name: 'Telur Kukus Magic Com', rarity: 'biasa', gut: 16, sanity: 10, note: 'Tanpa kompor & minyak goreng' },
      { req: ['mie'], name: 'Mie Instan Polos', rarity: 'biasa', gut: 6, sanity: 4, note: 'Jangan 4 hari beruntun, awas maag!' },
    ];

let selectedIngs = ['mie', 'telur'];
let toyFanOn = true;
let potCookState = 'idle'; // 'idle' | 'cooked' | 'tripped'

const ingGrid = document.getElementById('toy-ing-grid');
const potSlots = document.getElementById('toy-pot-slots');
const potCanvas = document.getElementById('toy-pot-canvas');
const wattPill = document.getElementById('toy-watt-pill');
const toyNeedle = document.getElementById('toy-needle');
const toyFanBtn = document.getElementById('toy-fan-btn');
const toyResultBox = document.getElementById('toy-result-box');
const toyRecipeName = document.getElementById('toy-recipe-name');
const toyRecipeDesc = document.getElementById('toy-recipe-desc');
const toyPotPanel = document.getElementById('toy-pot-panel');

function computeToyWatt() {
  const base = 110 + (toyFanOn ? 65 : 0);
  const cookBase = selectedIngs.length > 0 ? 105 : 0;
  const ingSum = selectedIngs.reduce((sum, id) => {
    const item = TOY_INGREDIENTS.find((x) => x.id === id);
    return sum + (item ? item.watt : 0);
  }, 0);
  return base + cookBase + ingSum;
}

function matchToyRecipe(ids) {
  for (const r of TOY_RECIPES) {
    if (r.req.length === ids.length && r.req.every((x) => ids.includes(x))) return r;
  }
  for (const r of TOY_RECIPES) {
    if (r.req.every((x) => ids.includes(x))) return r;
  }
  return {
    name: IS_EN_PAGE ? 'Fridge-Scrap Stir Pot' : 'Tumis Campur Seadanya',
    rarity: 'biasa',
    gut: 12 + ids.length * 4,
    sanity: 8 + ids.length * 2,
    note: IS_EN_PAGE ? 'Whatever is left in the shared fridge' : 'Apa yang sisa di kulkas masuk panci',
  };
}

function formatRecipeStatsHtml(rec) {
  return `
    <span class="stat-inline gut"><span class="inline-ico">${GAME_ICONS.bowl}</span>+${rec.gut} ${IS_EN_PAGE ? 'Gut' : 'Lambung'}</span>
    <span class="stat-inline sanity"><span class="inline-ico">${GAME_ICONS.heart}</span>+${rec.sanity} ${IS_EN_PAGE ? 'Sanity' : 'Waras'}</span>
    <span>• ${rec.note}</span>
  `;
}

function drawMagicComPot() {
  if (!potCanvas) return;
  const ctx = potCanvas.getContext('2d');
  if (!ctx) return;

  const w = 132;
  const h = 112;
  ctx.save();
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const r = 43;

  ctx.translate(cx, cy);

  ctx.fillStyle = '#F27D42';
  roundRect(ctx, -r - 10, -8, (r + 10) * 2, 16, 5);
  ctx.fill();
  ctx.strokeStyle = SPRITE_INK;
  ctx.lineWidth = 2;
  ctx.stroke();

  const potGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, 4, 0, 0, r);
  if (potCookState === 'cooked') {
    potGrad.addColorStop(0, '#FFFBEB');
    potGrad.addColorStop(0.62, '#FCD34D');
    potGrad.addColorStop(1, '#D97706');
  } else if (potCookState === 'tripped') {
    potGrad.addColorStop(0, '#451A1E');
    potGrad.addColorStop(0.7, '#2A1215');
    potGrad.addColorStop(1, '#181625');
  } else {
    potGrad.addColorStop(0, '#F8FAFC');
    potGrad.addColorStop(0.75, '#CBD5E1');
    potGrad.addColorStop(1, '#94A3B8');
  }

  ctx.fillStyle = potGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = potCookState === 'tripped' ? '#E63946' : '#334155';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  if (potCookState === 'cooked') {
    [
      [-18, -18, 3.2],
      [20, -14, 2.6],
      [-22, 14, 2.5],
      [17, 19, 3.4],
      [0, -24, 2.4],
    ].forEach(([bx, by, br]) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (selectedIngs.length === 0) {
    ctx.fillStyle = '#475569';
    ctx.font = '900 9.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(IS_EN_PAGE ? 'EMPTY POT' : 'PANCI KOSONG', 0, -2);
    ctx.font = '700 8.5px system-ui, sans-serif';
    ctx.fillText(IS_EN_PAGE ? 'Tap 1–3 items' : 'Tap 1–3 bahan', 0, 10);
  } else {
    selectedIngs.forEach((id, idx) => {
      const ox =
        selectedIngs.length === 1 ? 0 : selectedIngs.length === 2 ? (idx === 0 ? -15 : 15) : (idx - 1) * 17;
      const oy = selectedIngs.length === 3 && idx === 1 ? -11 : 4;
      drawItemSprite(ctx, id, ox, oy, 26);
    });
  }

  ctx.restore();
}

function renderToy() {
  if (ingGrid) {
    const activeIngId =
      ingGrid.contains(document.activeElement)
        ? document.activeElement?.closest?.('[data-ing-id]')?.getAttribute('data-ing-id') || null
        : null;
    ingGrid.innerHTML = '';
    TOY_INGREDIENTS.forEach((item) => {
      const isSel = selectedIngs.includes(item.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `ing-btn${isSel ? ' selected' : ''}`;
      btn.setAttribute('data-ing-id', item.id);
      btn.setAttribute('aria-pressed', String(isSel));

      const swatch = document.createElement('span');
      swatch.className = 'ing-swatch';
      const cv = document.createElement('canvas');
      cv.width = 64;
      cv.height = 64;
      cv.className = 'ing-sprite-cv';
      cv.setAttribute('aria-hidden', 'true');
      const sctx = cv.getContext('2d');
      if (sctx) {
        sctx.scale(2, 2);
        drawItemSprite(sctx, item.id, 16, 16, 28);
      }
      swatch.appendChild(cv);

      const meta = document.createElement('span');
      meta.className = 'ing-meta';
      meta.innerHTML = `<strong>${item.name}</strong><small>${item.price} • +${item.watt}VA</small>`;

      btn.appendChild(swatch);
      btn.appendChild(meta);

      btn.addEventListener('click', () => {
        sfx.click(!isSel);
        if (isSel) {
          selectedIngs = selectedIngs.filter((x) => x !== item.id);
        } else if (selectedIngs.length < 3) {
          selectedIngs.push(item.id);
        } else {
          showKosToast(
            IS_EN_PAGE ? 'The Magic Com pot fits up to 3 ingredients!' : 'Panci Magic Com muat maksimal 3 bahan ya!',
            'kos'
          );
          return;
        }
        potCookState = 'idle';
        toyResultBox?.classList.remove('good', 'bad');
        renderToy();
      });
      ingGrid.appendChild(btn);
    });
    if (activeIngId) {
      ingGrid.querySelector(`[data-ing-id="${activeIngId}"]`)?.focus({ preventScroll: true });
    }
  }

  if (potSlots) {
    if (selectedIngs.length === 0) {
      potSlots.innerHTML = `<span class="pot-placeholder">${
        IS_EN_PAGE ? 'Tap 1–3 ingredients on the left...' : 'Tap 1–3 bahan di sebelah kiri...'
      }</span>`;
    } else {
      potSlots.innerHTML = selectedIngs
        .map((id) => {
          const item = TOY_INGREDIENTS.find((x) => x.id === id);
          return `<span class="pot-chip">${item ? item.name : id}</span>`;
        })
        .join('');
    }
  }

  const watt = computeToyWatt();
  if (wattPill) {
    wattPill.textContent = `${watt} / 450VA`;
    wattPill.className = `watt-pill${watt > 450 ? ' danger' : watt >= 385 ? ' warn' : ''}`;
  }

  if (toyNeedle) {
    const pct = Math.max(0, Math.min(1, watt / 500));
    const deg = -90 + pct * 180;
    toyNeedle.setAttribute('transform', `rotate(${deg.toFixed(1)} 110 98)`);
  }

  if (toyFanBtn) {
    toyFanBtn.classList.toggle('is-on', toyFanOn);
    toyFanBtn.setAttribute('aria-pressed', String(toyFanOn));
    toyFanBtn.textContent = IS_EN_PAGE
      ? toyFanOn
        ? 'FAN: ON'
        : 'FAN: OFF (-65VA)'
      : toyFanOn
        ? 'KIPAS: NYALA'
        : 'KIPAS: MATI (-65VA)';
  }

  drawMagicComPot();

  if (selectedIngs.length > 0 && toyRecipeName && toyRecipeDesc && potCookState === 'idle') {
    const preview = matchToyRecipe(selectedIngs);
    const rarityLabel = RARITY_BADGE_LABELS[preview.rarity] || preview.rarity.toUpperCase();
    toyRecipeName.innerHTML = `
      <span>${IS_EN_PAGE ? `Up Next: ${preview.name}` : `Calon Masakan: ${preview.name}`}</span>
      <span class="recipe-rarity-tag ${preview.rarity}">${rarityLabel}</span>
    `;
    toyRecipeDesc.innerHTML =
      watt > 450
        ? `<span class="inline-ico">${GAME_ICONS.bolt}</span><span>${
            IS_EN_PAGE
              ? `WARNING ${watt}VA! Turn off the Room Fan (-65VA) first so the breaker holds!`
              : `AWAS ${watt}VA! Matikan Kipas Angin (-65VA) dulu biar gak jeklek!`
          }</span>`
        : formatRecipeStatsHtml(preview);
  }
}

toyFanBtn?.addEventListener('click', () => {
  toyFanOn = !toyFanOn;
  sfx.click(toyFanOn);
  if (potCookState === 'tripped') potCookState = 'idle';
  toyResultBox?.classList.remove('bad');
  renderToy();
});

document.getElementById('toy-clear-btn')?.addEventListener('click', () => {
  selectedIngs = [];
  potCookState = 'idle';
  sfx.click(false);
  toyResultBox?.classList.remove('good', 'bad');
  if (toyRecipeName) toyRecipeName.textContent = IS_EN_PAGE ? 'Empty Pot' : 'Panci Kosong';
  if (toyRecipeDesc) {
    toyRecipeDesc.textContent = IS_EN_PAGE
      ? 'Pick 1–3 ingredients on the left to start cooking!'
      : 'Pilih 1–3 bahan di sebelah kiri buat mulai masak!';
  }
  renderToy();
});

document.getElementById('toy-cook-btn')?.addEventListener('click', () => {
  if (selectedIngs.length === 0) {
    sfx.click(false);
    showKosToast(
      IS_EN_PAGE ? 'Add at least 1 ingredient to the pot first!' : 'Masukkan minimal 1 bahan ke panci dulu!',
      'kos'
    );
    return;
  }
  const watt = computeToyWatt();
  if (watt > 450) {
    sfx.jeklek();
    potCookState = 'tripped';
    drawMagicComPot();
    toyResultBox?.classList.remove('good');
    toyResultBox?.classList.add('bad');
    if (toyRecipeName) {
      toyRecipeName.innerHTML = `<span class="inline-ico">${GAME_ICONS.bolt}</span><span>${
        IS_EN_PAGE ? `BREAKER TRIPPED! 450VA MCB DOWN (${watt}VA)` : `JEKLEK! MCB 450VA TURUN (${watt}VA)`
      }</span>`;
    }
    if (toyRecipeDesc) {
      toyRecipeDesc.textContent = IS_EN_PAGE
        ? 'Room blacked out! Turn off the Room Fan (-65VA) first, then hit Cook Now.'
        : 'Kamar gelap! Matikan Kipas Angin (-65VA) dulu terus tekan Masak lagi.';
    }
    toyPotPanel?.classList.remove('is-tripped');
    void toyPotPanel?.offsetWidth;
    toyPotPanel?.classList.add('is-tripped');
  } else {
    sfx.sizzle();
    potCookState = 'cooked';
    drawMagicComPot();
    const rec = matchToyRecipe(selectedIngs);
    const rarityLabel = RARITY_BADGE_LABELS[rec.rarity] || rec.rarity.toUpperCase();
    toyResultBox?.classList.remove('bad');
    toyResultBox?.classList.add('good');
    if (toyRecipeName) {
      toyRecipeName.innerHTML = `
        <span>★ ${IS_EN_PAGE ? 'SERVED' : 'MATANG'}: ${rec.name}!</span>
        <span class="recipe-rarity-tag ${rec.rarity}">${rarityLabel}</span>
      `;
    }
    if (toyRecipeDesc) {
      toyRecipeDesc.innerHTML = `${formatRecipeStatsHtml(rec)} <span>${
        IS_EN_PAGE ? '(36 total recipes in the full game!)' : '(Total ada 36 resep di game!)'
      }</span>`;
    }
  }
});

document.querySelectorAll('.asmr-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const kind = btn.dataset.sfx;
    if (kind === 'sizzle') {
      sfx.sizzle();
      showKosToast('Cesss~ Wangi telur sama bumbu mie langsung kecium satu lorong kos!', 'kos');
    } else if (kind === 'pln') {
      sfx.pln();
      showKosToast('TIT-TIT-TIT! Bunyi token sekarat paling bikin panik jam 2 pagi...', 'pln');
    } else if (kind === 'knock') {
      sfx.knock();
      showKosToast('TOK-TOK-TOK! "Dek, iuran sampah bulan ini belum ya?"', 'ibu_kos');
    } else if (kind === 'vn') {
      sfx.vn();
      showKosToast('VN Ibu: "Makasih ya Nak kirimannya udah masuk. Jangan telat makan!"', 'rmh');
    }
  });
});

renderToy();

// ============================================================================
// 7. INTERACTIVE MINI-TOY #3: LIVE THERMAL RECEIPT FLIPPER (Matches receiptRenderer.ts)
// ============================================================================
const receiptCanvas = document.getElementById('demo-receipt-canvas');

function drawDemoReceipt(mode) {
  if (!receiptCanvas) return;
  const ctx = receiptCanvas.getContext('2d');
  if (!ctx) return;

  const isWin = mode === 'win';
  const w = 360;
  const h = 416;
  ctx.save();
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const m = 8;
  const rw = w - m * 2;
  const rh = h - m * 2;

  ctx.fillStyle = '#FDFBF5';
  ctx.beginPath();
  ctx.moveTo(m, m + 7);
  const teeth = 26;
  const tw = rw / teeth;
  for (let i = 0; i < teeth; i++) {
    ctx.lineTo(m + i * tw + tw / 2, m);
    ctx.lineTo(m + (i + 1) * tw, m + 7);
  }
  ctx.lineTo(m + rw, m + rh - 7);
  for (let i = teeth - 1; i >= 0; i--) {
    ctx.lineTo(m + i * tw + tw / 2, m + rh);
    ctx.lineTo(m + i * tw, m + rh - 7);
  }
  ctx.closePath();
  ctx.fill();

  const crease = ctx.createLinearGradient(m, m + 40, m + rw, m + 170);
  crease.addColorStop(0, 'rgba(0,0,0,0)');
  crease.addColorStop(0.49, 'rgba(44,30,38,0.035)');
  crease.addColorStop(0.51, 'rgba(255,255,255,0.45)');
  crease.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = crease;
  ctx.fillRect(m, m + 7, rw, rh - 14);

  ctx.fillStyle = '#E63946';
  ctx.fillRect(m + 14, m + 12, rw - 28, 3);
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(m + 14, m + 15, rw - 28, 3);

  const cx = w / 2;
  let y = m + 35;
  ctx.fillStyle = '#18181B';
  ctx.textAlign = 'center';
  ctx.font = '900 17px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('KOSMART GANG KANCIL', cx, y);
  y += 14;
  ctx.fillStyle = '#52525B';
  ctx.font = '800 10px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(
    isWin ? 'STRUK BERTAHAN • BAYU • KASTA 2 • NORMAL' : 'STRUK BERTAHAN • RAKA • KASTA 1 • NORMAL',
    cx,
    y
  );
  y += 10;

  ctx.fillStyle = isWin ? '#DCFCE7' : '#FEE2E2';
  roundRect(ctx, m + 14, y, rw - 28, 22, 6);
  ctx.fill();
  ctx.fillStyle = isWin ? '#047857' : '#B91C1C';
  ctx.font = '900 12.5px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(isWin ? '★ SELAMAT SAMPAI TGL 1! ★' : '✕ TUMBANG DI TANGGAL 25', cx, y + 15);
  y += 28;

  const marks = isWin
    ? ['g', 'g', 'y', 'g', 'g', 'g', 'g', 'y', 'g', 'g', 'g']
    : ['g', 'g', 'g', 'g', 'y', 'r', '', '', '', '', ''];
  const sq = 20;
  const gap = 4;
  const stripW = 11 * sq + 10 * gap;
  marks.forEach((mk, i) => {
    const sx = cx - stripW / 2 + i * (sq + gap);
    ctx.fillStyle =
      mk === 'g' ? '#16A34A' : mk === 'y' ? '#EAB308' : mk === 'r' ? '#DC2626' : '#F4F4F5';
    roundRect(ctx, sx, y, sq, 15, 3);
    ctx.fill();
    if (!mk) {
      ctx.strokeStyle = '#D4D4D8';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.fillStyle = mk ? '#FFFFFF' : '#A1A1AA';
    ctx.font = '800 8.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(String(20 + i), sx + sq / 2, y + 10.5);
  });
  y += 22;

  const bx = m + 14;
  const bw = rw - 28;
  const bh = 70;
  ctx.fillStyle = '#F4EFE4';
  roundRect(ctx, bx, y, bw, bh, 8);
  ctx.fill();
  ctx.strokeStyle = '#D6CCBA';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + bw / 2, y + 6);
  ctx.lineTo(bx + bw / 2, y + bh - 6);
  ctx.moveTo(bx + 8, y + bh / 2);
  ctx.lineTo(bx + bw - 8, y + bh / 2);
  ctx.stroke();

  const kpis = isWin
    ? [
        ['SISA DOMPET', 'Rp42.500', '#047857'],
        ['SALDO TERENDAH', 'Rp14.000', '#18181B'],
        ['CUAN HUSTLE', 'Rp44.000', '#B45309'],
        ['RESEP KERAMAT', '12/36', '#0F766E'],
      ]
    : [
        ['SISA DOMPET', 'Rp6.000', '#B91C1C'],
        ['SALDO TERENDAH', 'Rp4.500', '#18181B'],
        ['CUAN HUSTLE', 'Rp20.500', '#B45309'],
        ['RESEP KERAMAT', '5/36', '#0F766E'],
      ];
  kpis.forEach(([lbl, val, col], idx) => {
    const kx = bx + (idx % 2) * (bw / 2) + bw / 4;
    const ky = y + Math.floor(idx / 2) * (bh / 2);
    ctx.fillStyle = '#71717A';
    ctx.font = '800 8.8px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(lbl, kx, ky + 13);
    ctx.fillStyle = col;
    ctx.font = '900 14px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(val, kx, ky + 29);
  });
  y += bh + 10;

  const rows = isWin
    ? [
        ['MASAK & MIE', '10 Porsi  •  2 Mie', '#18181B'],
        ['GOSEK & PINJOL', '4x Ngumpet • 3x Blokir', '#18181B'],
        ['STATUS PINJOL', '100% BEBAS!', '#059669'],
        ['MCB 450VA JEKLEK', '0x (AMAN)', '#059669'],
      ]
    : [
        ['MASAK & MIE', '5 Porsi  •  4 Mie', '#18181B'],
        ['GOSEK & PINJOL', '2x Ngumpet • 3x Blokir', '#18181B'],
        ['STATUS PINJOL', '100% BEBAS!', '#059669'],
        ['MCB 450VA JEKLEK', '3x JEKLEK', '#B45309'],
      ];
  rows.forEach(([l, v, col]) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#52525B';
    ctx.font = '800 11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(l, m + 16, y + 4);
    ctx.textAlign = 'right';
    ctx.fillStyle = col;
    ctx.font = '900 11.8px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(v, w - m - 16, y + 4);
    y += 18.5;
  });

  y += 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F766E';
  ctx.font = '900 9.4px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(
    isWin ? '[PAWANG LISTRIK 450VA]  •  [BAWANG IBU]' : '[SEKTE MIE GARIS KERAS]  •  [TERMOS ES]',
    cx,
    y + 2
  );
  y += 11;

  ctx.strokeStyle = '#A1A1AA';
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(m + 14, y);
  ctx.lineTo(w - m - 14, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 14;

  ctx.save();
  ctx.translate(cx, y + 22);
  ctx.rotate(-0.025);
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  ctx.fillRect(-138, -21, 276, 42);
  ctx.strokeStyle = isWin ? '#D97706' : '#E63946';
  ctx.lineWidth = 2.8;
  ctx.strokeRect(-138, -21, 276, 42);
  drawItemSprite(ctx, isWin ? 'kornet' : 'mie', -114, 0, 26);
  ctx.fillStyle = isWin ? '#D97706' : '#E63946';
  ctx.textAlign = 'center';
  ctx.font = '900 18px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(isWin ? 'RANK S+' : 'RANK F', 10, -2);
  ctx.font = '800 10.2px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(isWin ? 'SULTAN HEMAT LEGENDARIS' : 'CHECKOUT KHILAF 2 AM', 10, 14);
  ctx.restore();

  y += 55;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#52525B';
  ctx.font = '700 9.8px system-ui, sans-serif';
  ctx.fillText(
    isWin ? '"Bangga banget Bapak sama Ibu! Anak rantau panutan!"' : '"Flash sale jam 2 pagi memang ujian terberat..."',
    cx,
    y
  );
  y += 11;

  const barW = 216;
  const barX = cx - barW / 2;
  ctx.fillStyle = '#18181B';
  for (let i = 0; i < 52; i++) {
    const thick = (i * 7 + (isWin ? 3 : 5)) % 3 === 0 ? 2.8 : 1.4;
    if (i % 5 !== 0) ctx.fillRect(barX + i * 4.15, y, thick, 18);
  }
  y += 28;
  ctx.fillStyle = '#71717A';
  ctx.font = '800 9px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('#TanggalTua  •  tanggaltua.id', cx, y);
  ctx.restore();
}

document.querySelectorAll('.receipt-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.click(true);
    document.querySelectorAll('.receipt-toggle').forEach((b) => b.classList.toggle('active', b === btn));
    drawDemoReceipt(btn.dataset.receipt);
  });
});

drawDemoReceipt('win');

// ============================================================================
// 8. LEADS & PLAYTEST FEEDBACK FUNNEL (In-Page Submit + UTM + Deep Links)
// ============================================================================
const modal = document.getElementById('store-modal');
const modalKicker = document.getElementById('modal-kicker');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalSlot = document.getElementById('modal-action-slot');

const STORAGE_EMAIL_KEY = 'tt_tester_email_v1';

function getSavedEmail() {
  try {
    return localStorage.getItem(STORAGE_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

function saveTesterEmail(email) {
  if (!email) return;
  try {
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
  } catch {
    // ignore private browsing quota errors
  }
}

function detectDeviceOs() {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  return 'Desktop';
}

function getAttributionMeta() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get('utm_source') || '';
  const med = params.get('utm_medium') || '';
  const camp = params.get('utm_campaign') || '';
  const utm = [src, med, camp].filter(Boolean).join(' / ');
  return {
    utm: utm || 'direct',
    referrer: document.referrer || 'direct',
    deviceOs: detectDeviceOs(),
    submittedAt: new Date().toISOString(),
  };
}

function buildMailtoHref(subject, lines) {
  const target = SITE_CONFIG.leadsInboxEmail || SITE_CONFIG.contactEmail;
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(lines.join('\n'));
  return `mailto:${target}?subject=${s}&body=${b}`;
}

async function postToKasAdminHub(payload, plainSummaryLines) {
  const isIos = payload.jenis === 'testflight_ios';
  const isAndroid = payload.jenis === 'closed_beta_android';
  const fallbackSender = ['masukan', 'tanggaltua.id'].join('@');
  const rawEmail = isValidEmail(payload.email || '')
    ? payload.email
    : isValidEmail(payload.kontak_kredit || '')
      ? payload.kontak_kredit
      : fallbackSender;
  const displayName =
    payload.kontak_kredit && payload.kontak_kredit !== '-'
      ? payload.kontak_kredit
      : rawEmail.split('@')[0] || 'Pemain Tanggal Tua';

  const hubBody = {
    gameSlug: 'tanggal-tua',
    category: isIos || isAndroid ? 'demo_access' : 'support',
    platform: isIos
      ? 'ios_testflight'
      : isAndroid
        ? 'android_play'
        : String(payload.platform_main || '').includes('iPhone')
          ? 'ios_testflight'
          : 'android_play',
    fullName: displayName,
    workEmail: rawEmail,
    storeAccountEmail: isIos || isAndroid ? rawEmail : undefined,
    deviceNote: payload.perangkat_catatan || payload.platform_main || undefined,
    marketingOptIn: Boolean(payload.marketing_opt_in),
    privacyConsentVersion: 'uupdp-2026.11',
    utmSource: payload.sumber_utm || 'direct',
    message: plainSummaryLines.join('\n'),
  };

  for (const endpoint of KAS_ADMIN_HUB_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hubBody),
        signal: timeoutSignal(8000),
      });
      if (res.ok) return true;
    } catch {
      // try fallback KAS Admin endpoint
    }
  }
  return false;
}

async function deliverFunnelPayload(payload, subject, plainSummaryLines) {
  const delivered = await postToKasAdminHub(payload, plainSummaryLines);
  return {
    delivered,
    mailtoHref: buildMailtoHref(subject, plainSummaryLines),
  };
}

function renderSuccessSlot({ heading, body, nextHint, mailtoHref, plainText }) {
  if (!modalSlot) return;
  modalSlot.innerHTML = `
    <div class="modal-success-card">
      <strong>${heading}</strong>
      <p>${body}</p>
      ${nextHint ? `<p>${nextHint}</p>` : ''}
    </div>
    <button id="btn-done-modal" type="button" class="btn-primary btn-full">${IS_EN_PAGE ? 'Done, Close' : 'Siap, Tutup'}</button>
    <div class="modal-alt-links">
      <a href="${mailtoHref}">${IS_EN_PAGE ? 'Also send via Email app' : 'Kirim juga via aplikasi Email'}</a>
      <button type="button" id="btn-copy-summary">${IS_EN_PAGE ? 'Copy summary' : 'Salin catatan'}</button>
    </div>
  `;
  const doneBtn = document.getElementById('btn-done-modal');
  doneBtn?.addEventListener('click', closeModal);
  doneBtn?.focus({ preventScroll: true });
  document.getElementById('btn-copy-summary')?.addEventListener('click', async () => {
    const ok = await copyTextSafe(plainText);
    showKosToast(
      ok
        ? IS_EN_PAGE
          ? 'Summary copied to clipboard!'
          : 'Teks berhasil disalin!'
        : IS_EN_PAGE
          ? 'Unable to copy automatically — please use the Email link.'
          : 'Gagal menyalin otomatis — gunakan tautan Email ya.',
      'kos'
    );
  });
}

function renderFallbackSlot({ errorNote, mailtoHref, plainText }) {
  if (!modalSlot) return;
  modalSlot.innerHTML = `
    <div class="modal-info-card">
      <strong>${
        IS_EN_PAGE
          ? 'Your browser restricted automatic submission.'
          : 'Koneksi browser sedang membatasi pengiriman otomatis.'
      }</strong><br/>
      ${errorNote}
    </div>
    <a href="${mailtoHref}" class="btn-primary btn-full">${
      IS_EN_PAGE ? 'Send via Email App' : 'Kirim Lewat Aplikasi Email'
    }</a>
    <div class="modal-alt-links">
      <button type="button" id="btn-copy-fallback">${
        IS_EN_PAGE ? 'Or copy message &amp; DM us' : 'Atau salin pesan &amp; DM ke kami'
      }</button>
    </div>
  `;
  document.getElementById('btn-copy-fallback')?.addEventListener('click', async () => {
    const ok = await copyTextSafe(plainText);
    showKosToast(
      ok
        ? IS_EN_PAGE
          ? 'Message copied to clipboard!'
          : 'Pesan disalin ke clipboard!'
        : IS_EN_PAGE
          ? 'Unable to copy automatically — tap Send via Email App.'
          : 'Gagal menyalin otomatis — klik Kirim Lewat Aplikasi Email.',
      'kos'
    );
  });
}

let lastModalTrigger = null;

function getFocusableInModal() {
  if (!modal) return [];
  return Array.from(
    modal.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled):not(.hp-trap), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

function openModal({ kicker, title, desc, slotHtml }) {
  if (!modal) return;
  if (modal.classList.contains('hidden') && document.activeElement instanceof HTMLElement) {
    lastModalTrigger = document.activeElement;
  }
  if (modalKicker) modalKicker.textContent = kicker;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;
  if (modalSlot) modalSlot.innerHTML = slotHtml;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const preferred = modal.querySelector(
      'input:not(.hp-trap):not([type="checkbox"]), textarea, select, #btn-done-modal, #modal-close'
    );
    preferred?.focus({ preventScroll: true });
  });
}

function closeModal() {
  if (!modal || modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (['#testflight', '#ios', '#android', '#beta', '#masukan', '#feedback'].includes(window.location.hash)) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  const trigger = lastModalTrigger;
  lastModalTrigger = null;
  if (trigger && typeof trigger.focus === 'function') {
    requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
  }
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.key === 'Tab') {
    const focusables = getFocusableInModal();
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Sync custom badge subtitles from SITE_CONFIG
const iosSubEl = document.getElementById('ios-badge-sub');
const andSubEl = document.getElementById('android-badge-sub');
if (iosSubEl) iosSubEl.textContent = SITE_CONFIG.iosBadgeSub;
if (andSubEl) andSubEl.textContent = SITE_CONFIG.androidBadgeSub;
document.querySelectorAll('.ios-badge-sub-sync').forEach((el) => {
  el.textContent = SITE_CONFIG.iosBadgeSub;
});
document.querySelectorAll('.android-badge-sub-sync').forEach((el) => {
  el.textContent = SITE_CONFIG.androidBadgeSub;
});

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// --- FUNNEL 1: iOS RELEASE WAITLIST MODAL ---
function openIosLeadModal(forceEmailForm = false) {
  if (SITE_CONFIG.iosUrl && !forceEmailForm) {
    window.open(SITE_CONFIG.iosUrl, '_blank', 'noopener');
    return;
  }
  openModal({
    kicker: IS_EN_PAGE ? 'iOS RELEASE WAITLIST' : 'DAFTAR TUNGGU RILIS • iOS',
    title: IS_EN_PAGE ? 'Join the iPhone & iPad Waitlist' : 'Daftar Tunggu Rilis iPhone & iPad',
    desc: IS_EN_PAGE
      ? 'Leave your Apple ID or primary email and KAS Studio will notify you as soon as public App Store access opens.'
      : 'Tulis email kamu. Begitu rilis publik App Store dari KAS Studio dibuka kembali, kami langsung kirim kabarnya ke inbox-mu.',
    slotHtml: `
      <form id="ios-lead-form" class="funnel-form" novalidate>
        <input type="text" name="website_hp" class="hp-trap" tabindex="-1" autocomplete="off" />
        <div class="field-group">
          <label class="field-label" for="ios-email-input">${IS_EN_PAGE ? 'Email / Apple ID' : 'Email / Apple ID'}</label>
          <input id="ios-email-input" type="email" class="modal-input" placeholder="${IS_EN_PAGE ? 'you@example.com' : 'nama@icloud.com atau email aktif'}" value="${getSavedEmail()}" autocomplete="email" required />
        </div>
        <div class="field-group">
          <label class="field-label" for="ios-device-input">${IS_EN_PAGE ? 'iPhone / iPad model (optional)' : 'Seri iPhone / iPad (opsional)'}</label>
          <input id="ios-device-input" type="text" class="modal-input" placeholder="${IS_EN_PAGE ? 'e.g. iPhone 15, iPad Air' : 'Contoh: iPhone 13, iPad Air'}" />
        </div>
        <label style="display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.45;margin:6px 0;cursor:pointer;">
          <input id="ios-optin-input" type="checkbox" style="margin-top:2px;" />
          <span>${IS_EN_PAGE ? 'Also notify me about official releases & new games from KAS Studio (optional).' : 'Kabari saya soal rilis resmi &amp; pengumuman game baru dari KAS Studio (opsional).'}</span>
        </label>
        <p style="font-size:11.5px;line-height:1.45;opacity:0.82;margin:4px 0 10px;">${IS_EN_PAGE ? 'Managed centrally by <strong>KAS Studio</strong> under our <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy (UU PDP)</a>.' : 'Permintaan dikelola terpusat oleh <strong>KAS Studio</strong> sesuai <a href="/privacy.html" target="_blank" rel="noopener">Kebijakan Privasi (UU PDP)</a>.'}</p>
        <p id="ios-form-err" class="form-error-msg hidden"></p>
        <button id="ios-submit-btn" type="submit" class="btn-primary btn-full">${IS_EN_PAGE ? 'Notify Me on iOS Launch' : 'Kabari Saat Rilis iOS Dibuka'}</button>
      </form>
    `,
  });

  document.getElementById('ios-lead-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hp = e.target.querySelector('[name="website_hp"]')?.value;
    if (hp) return;

    const email = document.getElementById('ios-email-input')?.value?.trim() || '';
    const device = document.getElementById('ios-device-input')?.value?.trim() || '-';
    const marketingOptIn = Boolean(document.getElementById('ios-optin-input')?.checked);
    const errEl = document.getElementById('ios-form-err');
    const btn = document.getElementById('ios-submit-btn');

    if (!isValidEmail(email)) {
      if (errEl) {
        errEl.textContent = IS_EN_PAGE ? 'Please enter a valid email address.' : 'Masukkan alamat email yang benar dulu ya.';
        errEl.classList.remove('hidden');
      }
      return;
    }
    errEl?.classList.add('hidden');
    saveTesterEmail(email);

    if (btn) {
      btn.disabled = true;
      btn.textContent = IS_EN_PAGE ? 'Saving...' : 'Mencatat email...';
    }

    const meta = getAttributionMeta();
    const payload = {
      jenis: 'testflight_ios',
      email,
      perangkat_catatan: device,
      marketing_opt_in: marketingOptIn,
      os_pengunjung: meta.deviceOs,
      sumber_utm: meta.utm,
      perujuk: meta.referrer,
      waktu: meta.submittedAt,
    };
    const subject = `[TestFlight iOS] ${email} – Tanggal Tua`;
    const lines = IS_EN_PAGE
      ? [
          'Hello KAS Studio, please add my email to the Tanggal Tua iOS release waitlist:',
          `Apple ID / Email: ${email}`,
          `Device: ${device}`,
          `Source: ${meta.utm}`,
        ]
      : [
          'Halo KAS Studio, saya mau daftar tunggu rilis iOS Tanggal Tua:',
          `Email Apple ID: ${email}`,
          `Perangkat: ${device}`,
          `Sumber: ${meta.utm}`,
        ];

    const res = await deliverFunnelPayload(payload, subject, lines);
    const plainText = lines.join('\n');
    if (res.delivered) {
      sfx.vn();
      renderSuccessSlot({
        heading: IS_EN_PAGE ? 'You’re on the iOS Waitlist!' : 'Siap! Email Rilis iOS Kamu Tercatat',
        body: IS_EN_PAGE
          ? `We’ll email ${email} as soon as public iPhone & iPad store access opens under KAS Studio.`
          : `Kami akan kirim kabar rilis iOS ke ${email} begitu akses unduh iPhone & iPad dari KAS Studio dibuka.`,
        nextHint: IS_EN_PAGE
          ? 'Meanwhile, try the interactive 450VA Rice Cooker workbench right on this page!'
          : 'Sambil menunggu, coba dulu demo kompor Magic Com 450VA langsung di halaman ini ya!',
        mailtoHref: res.mailtoHref,
        plainText,
      });
    } else {
      renderFallbackSlot({
        errorNote: IS_EN_PAGE
          ? 'Tap below to send your iOS waitlist request via email:'
          : 'Klik tombol di bawah supaya pendaftaran rilis iOS-mu langsung terkirim lewat email:',
        mailtoHref: res.mailtoHref,
        plainText,
      });
    }
  });
}

// --- FUNNEL 2: ANDROID GOOGLE PLAY CLOSED BETA MODAL ---
function openAndroidLeadModal() {
  if (SITE_CONFIG.androidUrl) {
    window.open(SITE_CONFIG.androidUrl, '_blank', 'noopener');
    return;
  }
  if (SITE_CONFIG.androidWaitlistFormUrl) {
    window.open(SITE_CONFIG.androidWaitlistFormUrl, '_blank', 'noopener');
    return;
  }
  openModal({
    kicker: 'ANDROID • CLOSED BETA',
    title: IS_EN_PAGE ? 'Join the Google Play Closed Beta' : 'Daftar Closed Beta Google Play',
    desc: IS_EN_PAGE
      ? 'Enter the email signed into your Google Play Store app (usually @gmail.com) so KAS Studio can activate your closed-beta seat.'
      : 'Masukkan alamat email yang dipakai di aplikasi Google Play (biasanya @gmail.com) supaya akunmu bisa diizinkan mengunduh.',
    slotHtml: `
      <form id="and-lead-form" class="funnel-form" novalidate>
        <input type="text" name="website_hp" class="hp-trap" tabindex="-1" autocomplete="off" />
        <div class="field-group">
          <label class="field-label" for="and-email-input">${IS_EN_PAGE ? 'Google Play Account Email' : 'Email Akun Google Play'}</label>
          <input id="and-email-input" type="email" class="modal-input" placeholder="${IS_EN_PAGE ? 'you@gmail.com' : 'nama@gmail.com'}" value="${getSavedEmail()}" autocomplete="email" required />
        </div>
        <div class="field-group">
          <label class="field-label" for="and-device-input">${IS_EN_PAGE ? 'Android phone model (optional)' : 'Merek / Tipe HP Android (opsional)'}</label>
          <input id="and-device-input" type="text" class="modal-input" placeholder="${IS_EN_PAGE ? 'e.g. Samsung A54, Pixel 8, Redmi Note 13' : 'Contoh: Samsung A54, Redmi Note 13'}" />
        </div>
        <label style="display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.45;margin:6px 0;cursor:pointer;">
          <input id="and-optin-input" type="checkbox" style="margin-top:2px;" />
          <span>${IS_EN_PAGE ? 'Also notify me about official releases &amp; new games from KAS Studio (optional).' : 'Kabari saya soal rilis resmi &amp; pengumuman game baru dari KAS Studio (opsional).'}</span>
        </label>
        <p style="font-size:11.5px;line-height:1.45;opacity:0.82;margin:4px 0 10px;">${IS_EN_PAGE ? 'Managed centrally by <strong>KAS Studio</strong> under our <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy (UU PDP)</a>.' : 'Permintaan dikelola terpusat oleh <strong>KAS Studio</strong> sesuai <a href="/privacy.html" target="_blank" rel="noopener">Kebijakan Privasi (UU PDP)</a>.'}</p>
        <p id="and-form-err" class="form-error-msg hidden"></p>
        <button id="and-submit-btn" type="submit" class="btn-funnel-emerald btn-full">${IS_EN_PAGE ? 'Register My Google Play Email' : 'Daftarkan Gmail Saya'}</button>
      </form>
    `,
  });

  document.getElementById('and-lead-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hp = e.target.querySelector('[name="website_hp"]')?.value;
    if (hp) return;

    const email = document.getElementById('and-email-input')?.value?.trim() || '';
    const device = document.getElementById('and-device-input')?.value?.trim() || '-';
    const marketingOptIn = Boolean(document.getElementById('and-optin-input')?.checked);
    const errEl = document.getElementById('and-form-err');
    const btn = document.getElementById('and-submit-btn');

    if (!isValidEmail(email)) {
      if (errEl) {
        errEl.textContent = IS_EN_PAGE
          ? 'Please enter a valid Google Play email address.'
          : 'Masukkan alamat email Google Play yang benar dulu ya.';
        errEl.classList.remove('hidden');
      }
      return;
    }
    errEl?.classList.add('hidden');
    saveTesterEmail(email);

    if (btn) {
      btn.disabled = true;
      btn.textContent = IS_EN_PAGE ? 'Registering email...' : 'Mendaftarkan email...';
    }

    const meta = getAttributionMeta();
    const payload = {
      jenis: 'closed_beta_android',
      email,
      perangkat_catatan: device,
      marketing_opt_in: marketingOptIn,
      os_pengunjung: meta.deviceOs,
      sumber_utm: meta.utm,
      perujuk: meta.referrer,
      waktu: meta.submittedAt,
    };
    const subject = `[Beta Android] ${email} – Tanggal Tua`;
    const lines = IS_EN_PAGE
      ? [
          'Hello KAS Studio, please add my Google Play account to the Tanggal Tua Closed Beta:',
          `Google Play Email: ${email}`,
          `Android Device: ${device}`,
          `Source: ${meta.utm}`,
        ]
      : [
          'Halo KAS Studio, tolong daftarkan akun Google Play saya ke Closed Beta Tanggal Tua:',
          `Email Google Play: ${email}`,
          `HP Android: ${device}`,
          `Sumber: ${meta.utm}`,
        ];

    const res = await deliverFunnelPayload(payload, subject, lines);
    const plainText = lines.join('\n');
    if (res.delivered) {
      sfx.vn();
      renderSuccessSlot({
        heading: IS_EN_PAGE
          ? 'You’re in the Google Play Beta Queue!'
          : 'Mantap! Gmail Google Play Kamu Terdaftar',
        body: IS_EN_PAGE
          ? `We’ve logged ${email} for our named Google Play Closed Beta cohort.`
          : `Kami sudah mencatat ${email} ke antrean penguji Google Play Closed Beta.`,
        nextHint: IS_EN_PAGE
          ? 'As soon as your seat is activated by KAS Studio, we’ll email your invite link!'
          : 'Begitu akses unduh dibuka untuk emailmu, kami kabari lewat email. Setelah coba main, kirim masukanmu di tanggaltua.id/#masukan!',
        mailtoHref: res.mailtoHref,
        plainText,
      });
    } else {
      renderFallbackSlot({
        errorNote: IS_EN_PAGE
          ? 'Tap below to send your Google Play Closed Beta request via email:'
          : 'Klik tombol di bawah supaya email Google Play-mu langsung terkirim:',
        mailtoHref: res.mailtoHref,
        plainText,
      });
    }
  });
}

// --- FUNNEL 3: 4-TRACK COMMUNITY CO-CREATION BUILDER, LIVE UPVOTE BOARD & HYBRID BAILOUT ---
const CLIENT_HASH_KEY = 'tt_client_hash_v1';
const LOCAL_HANDLE_KEY = 'tt_player_handle_v1';

function getClientHash() {
  try {
    let existing = localStorage.getItem(CLIENT_HASH_KEY);
    if (existing && existing.length >= 12) return existing;
    const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    existing = `web_${Date.now().toString(36)}_${rand}`;
    localStorage.setItem(CLIENT_HASH_KEY, existing);
    return existing;
  } catch {
    return `ephemeral_${Math.random().toString(36).slice(2, 14)}`;
  }
}

function getSavedHandle() {
  try {
    return localStorage.getItem(LOCAL_HANDLE_KEY) || '';
  } catch {
    return '';
  }
}

function savePlayerHandle(raw) {
  if (!raw || raw === '-') return;
  try {
    localStorage.setItem(LOCAL_HANDLE_KEY, raw.trim().slice(0, 32));
  } catch {
    // ignore storage errors
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildThreadsIntentUrl(text) {
  return `https://www.threads.com/intent/post?text=${encodeURIComponent(text)}`;
}

// Sync official Threads links across DOM from SITE_CONFIG
document.querySelectorAll('[data-threads-game-link]').forEach((el) => {
  el.setAttribute(
    'href',
    `https://www.threads.com/@${SITE_CONFIG.threadsGameHandle}?utm_source=tanggaltua_web&utm_medium=referral`
  );
});
document.querySelectorAll('[data-threads-studio-link]').forEach((el) => {
  el.setAttribute(
    'href',
    `https://www.threads.com/@${SITE_CONFIG.threadsStudioHandle}?utm_source=tanggaltua_web&utm_medium=referral`
  );
});

async function callSupabaseRpc(fnName, bodyObj) {
  if (!SITE_CONFIG.supabaseUrl || !SITE_CONFIG.supabasePublishableKey) return null;
  try {
    const res = await fetch(`${SITE_CONFIG.supabaseUrl}/rest/v1/rpc/${fnName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SITE_CONFIG.supabasePublishableKey,
        Authorization: `Bearer ${SITE_CONFIG.supabasePublishableKey}`,
      },
      body: JSON.stringify(bodyObj || {}),
      signal: timeoutSignal(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const FALLBACK_COMMUNITY_IDEAS = [
  {
    id: 'seed-1',
    track: 'minigame',
    title: 'Joki Print & Jilid Skripsi Tengah Malam',
    summary: 'Minigame 30 detik hari Minggu malam: tepuk printer kosan yang macet kertas & urutkan halaman Bab 1-5 sebelum fotokopi tutup!',
    meta: { mechanic: 'Tap & Urut Cepat', payout: 'Rp15.000 - Rp28.000' },
    authorHandle: 'Tim KAS Studio',
    status: 'in_progress',
    votes: 9,
    votedByMe: false,
  },
  {
    id: 'seed-2',
    track: 'pasar',
    title: 'Kopi Sachet Renceng Warung (+Waras, -Lambung)',
    summary: 'Ukuran 1x1 kotak kecil Rp2.000! Bikin melek & tambah +14 Kewarasan instan, tapi kalau perut kosong potong -8 Lambung.',
    meta: { gridShape: '1x1', price: 'Rp2.000' },
    authorHandle: 'Tim KAS Studio',
    status: 'in_progress',
    votes: 5,
    votedByMe: false,
  },
  {
    id: 'seed-3',
    track: 'resep',
    title: 'Tumis Bawang Rawit Goreng Garing',
    summary: 'Minyak dikit, tumis bamer baput dan cabe rawit, tambahin garam dikit — tunggu sampai bawang merahnya wangi, makan pakai nasi hangat!',
    meta: { ingredients: ['beras', 'bawang_cabe'] },
    authorHandle: '@warga_kos',
    status: 'voting',
    votes: 1,
    votedByMe: false,
  },
  {
    id: 'seed-4',
    track: 'resep',
    title: 'Mie Kuah Sop Kobis',
    summary: 'Mie instan dimasak bareng potongan kol/kobis hangat karena harganya sangat terjangkau di akhir bulan.',
    meta: { ingredients: ['mie', 'kol'] },
    authorHandle: '@anak_kos_jkt',
    status: 'voting',
    votes: 1,
    votedByMe: false,
  },
];

const TRACK_LABELS = {
  minigame: 'Minigame Hustle',
  pasar: 'Belanja Pasar',
  resep: 'Resep Magic Com',
  survive: 'Cara Bertahan & Drama',
};

const STATUS_LABELS = {
  in_progress: 'LAGI DIMASAK DEV',
  voting: 'VOTING WARGA',
  shipped: 'SUDAH MASUK GAME',
  pending: 'MENUNGGU KURASI',
};

let communityIdeasState = [...FALLBACK_COMMUNITY_IDEAS];
let activeCommunityFilter = 'all';

function renderCommunityBoard() {
  const grid = document.getElementById('community-ideas-grid');
  if (!grid) return;
  const activeVoteId =
    grid.contains(document.activeElement)
      ? document.activeElement?.closest?.('[data-vote-id]')?.getAttribute('data-vote-id') || null
      : null;

  const filtered =
    activeCommunityFilter === 'all'
      ? communityIdeasState
      : communityIdeasState.filter((item) => item.track === activeCommunityFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <article class="idea-card">
        <div>
          <h3>Belum ada ide di kategori ini</h3>
          <p>Jadi penghuni pertama yang mengusulkan ide baru buat kategori ini dan amankan namamu di kredit game!</p>
        </div>
        <div class="idea-card-foot">
          <span class="idea-author-credit">Kosan Gang Kancil</span>
          <button type="button" class="idea-vote-btn" id="btn-empty-propose">+ Usulkan Sekarang</button>
        </div>
      </article>
    `;
    document.getElementById('btn-empty-propose')?.addEventListener('click', () =>
      openFeedbackModal({ track: activeCommunityFilter === 'all' ? 'resep' : activeCommunityFilter })
    );
    return;
  }

  grid.innerHTML = filtered
    .slice(0, 12)
    .map((item) => {
      const metaChips = [];
      if (item.meta?.mechanic) metaChips.push(escapeHtml(item.meta.mechanic));
      if (item.meta?.gridShape) metaChips.push(`Kulkas: ${escapeHtml(item.meta.gridShape)}`);
      if (item.meta?.price) metaChips.push(escapeHtml(item.meta.price));
      if (Array.isArray(item.meta?.ingredients) && item.meta.ingredients.length > 0) {
        metaChips.push(`Bahan: ${item.meta.ingredients.map((x) => escapeHtml(x)).join(' + ')}`);
      }
      if (item.meta?.subkind === 'tips_hemat') metaChips.push('Tips Bertahan Asli');
      if (item.meta?.subkind === 'drama_malam') metaChips.push('Event Drama Malam');

      const statusKey = STATUS_LABELS[item.status] ? item.status : 'voting';
      const rawAuthor = item.authorHandle || '@warga_kos';
      const creditLabel =
        rawAuthor === 'Tim KAS Studio'
          ? `Ide Awal: ${escapeHtml(rawAuthor)}`
          : `Ide Warga: ${escapeHtml(rawAuthor)}`;
      return `
        <article class="idea-card" data-idea-id="${escapeHtml(item.id)}">
          <div>
            <div class="idea-card-top">
              <span class="idea-track-pill">${escapeHtml(TRACK_LABELS[item.track] || 'Ide Warga')}</span>
              <span class="idea-status-tag ${statusKey}">${STATUS_LABELS[statusKey]}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            ${
              metaChips.length > 0
                ? `<div class="idea-meta-chips">${metaChips
                    .map((c) => `<span class="idea-meta-chip">${c}</span>`)
                    .join('')}</div>`
                : ''
            }
          </div>
          <div class="idea-card-foot">
            <span class="idea-author-credit">${creditLabel}</span>
            <button
              type="button"
              class="idea-vote-btn${item.votedByMe ? ' voted' : ''}"
              data-vote-id="${escapeHtml(item.id)}"
              aria-pressed="${String(Boolean(item.votedByMe))}"
            >
              <span>▲</span>
              <span>${Number(item.votes || 0)} Suara</span>
            </button>
          </div>
        </article>
      `;
    })
    .join('');

  if (activeVoteId) {
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(activeVoteId) : activeVoteId;
    grid.querySelector(`[data-vote-id="${escaped}"]`)?.focus({ preventScroll: true });
  }

  grid.querySelectorAll('[data-vote-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-vote-id');
      const target = communityIdeasState.find((x) => String(x.id) === String(id));
      if (!target) return;
      sfx.click(!target.votedByMe);
      const prevVoted = Boolean(target.votedByMe);
      const prevVotes = Number(target.votes || 0);
      target.votedByMe = !prevVoted;
      target.votes = Math.max(0, prevVotes + (target.votedByMe ? 1 : -1));
      renderCommunityBoard();

      if (!String(id).startsWith('seed-')) {
        const rpcRes = await callSupabaseRpc('tt_toggle_idea_vote', {
          p_idea_id: id,
          p_client_hash: getClientHash(),
          p_weight: 1,
        });
        if (rpcRes && rpcRes.ok) {
          target.votedByMe = Boolean(rpcRes.voted);
          target.votes = Number(rpcRes.votes ?? target.votes);
          renderCommunityBoard();
        }
      }
      if (target.votedByMe) {
        showKosToast(`Suara masuk buat "${target.title}"!`, 'kos');
      }
    });
  });
}

async function loadCommunityIdeas() {
  if (!document.getElementById('community-ideas-grid')) return;
  renderCommunityBoard();
  const live = await callSupabaseRpc('tt_list_public_ideas', {
    p_client_hash: getClientHash(),
  });
  if (Array.isArray(live) && live.length > 0) {
    communityIdeasState = live;
    renderCommunityBoard();
  }
}

document.querySelectorAll('#community-filter-bar .comm-filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    sfx.click(true);
    activeCommunityFilter = chip.dataset.track || 'all';
    document.querySelectorAll('#community-filter-bar .comm-filter-chip').forEach((c) => {
      c.classList.toggle('active', c === chip);
    });
    renderCommunityBoard();
  });
});

document.getElementById('btn-open-idea-builder')?.addEventListener('click', () => {
  sfx.click(true);
  openFeedbackModal({ track: activeCommunityFilter === 'all' ? 'minigame' : activeCommunityFilter });
});

void loadCommunityIdeas();

function openFeedbackModal(preset = {}) {
  if (SITE_CONFIG.feedbackFormUrl) {
    window.open(SITE_CONFIG.feedbackFormUrl, '_blank', 'noopener');
    return;
  }
  const defaultPlat =
    detectDeviceOs() === 'iOS'
      ? 'iPhone / iPad (App Store)'
      : detectDeviceOs() === 'Android'
        ? 'Android (Beta)'
        : 'Baru Coba di Web';
  let currentTrack = ['minigame', 'pasar', 'resep', 'survive'].includes(preset.track)
    ? preset.track
    : 'resep';
  const presetIngredients = Array.isArray(preset.ingredients) ? preset.ingredients.join(' + ') : '';

  openModal({
    kicker: IS_EN_PAGE ? 'KOSAN CO-CREATION • COMMUNITY IDEAS' : 'MUSYAWARAH KOS • CO-CREATION',
    title: IS_EN_PAGE ? 'Suggest an Idea for Tanggal Tua' : 'Usulkan Ide Masuk Game Tanggal Tua',
    desc: IS_EN_PAGE
      ? 'Pick a track below! Selected community ideas ship in bi-weekly updates with your @handle credited in-game.'
      : 'Pilih jalur ide di bawah! Ide terpilih bakal dimasak ke update dua mingguan lengkap dengan @username kamu di kartu game + hadiah Rp50.000 Tabungan Kos.',
    slotHtml: `
      <form id="fb-funnel-form" class="funnel-form" novalidate>
        <input type="text" name="website_hp" class="hp-trap" tabindex="-1" autocomplete="off" />

        <div class="field-group">
          <span class="field-label">${IS_EN_PAGE ? '1. Which part of the game?' : '1. Mau sumbang ide buat bagian mana?'}</span>
          <div class="track-picker-grid" id="idea-track-picker">
            <button type="button" class="track-pick-btn${currentTrack === 'minigame' ? ' active' : ''}" data-pick-track="minigame">
              ${IS_EN_PAGE ? 'Weekend Hustle<small>Sat/Sun 30s side-gig</small>' : 'Minigame Hustle<small>Kerja sampingan Sabtu/Minggu</small>'}
            </button>
            <button type="button" class="track-pick-btn${currentTrack === 'pasar' ? ' active' : ''}" data-pick-track="pasar">
              ${IS_EN_PAGE ? 'Alley Market<small>Groceries, 5×4 shapes &amp; deals</small>' : 'Belanja Pasar<small>Jajanan, ukuran kulkas &amp; diskon</small>'}
            </button>
            <button type="button" class="track-pick-btn${currentTrack === 'resep' ? ' active' : ''}" data-pick-track="resep">
              ${IS_EN_PAGE ? '450VA Recipe<small>2–3 rice-cooker ingredients</small>' : 'Resep Magic Com<small>Kreasi 2–3 bahan panci kos</small>'}
            </button>
            <button type="button" class="track-pick-btn${currentTrack === 'survive' ? ' active' : ''}" data-pick-track="survive">
              ${IS_EN_PAGE ? 'Survival / Bug<small>Tips, midnight drama &amp; bugs</small>' : 'Trik Hidup / Bug<small>Tips hemat, drama malam &amp; bug</small>'}
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" id="idea-title-label" for="fb-idea-title">${IS_EN_PAGE ? 'Idea / Recipe Title' : 'Judul Ide / Nama Resep'}</label>
          <input id="fb-idea-title" type="text" class="modal-input" maxlength="95" placeholder="${IS_EN_PAGE ? 'e.g. Garlic Butter Rice-Cooker Egg' : 'Contoh: Nasi Telur Mentega Bawang Putih'}" value="${escapeHtml(preset.title || '')}" required />
        </div>

        <div id="idea-dynamic-slot" class="field-row-2"></div>

        <div class="field-group">
          <label class="field-label" id="idea-body-label" for="fb-body">${IS_EN_PAGE ? 'How it works / short story' : 'Cara kerja / cerita singkatnya'}</label>
          <textarea id="fb-body" class="modal-textarea" placeholder="${IS_EN_PAGE ? 'Tell us briefly how this fits kosan survival...' : 'Ceritakan singkat kenapa ini khas anak kos banget...'}" required>${escapeHtml(preset.summary || '')}</textarea>
        </div>

        <div class="field-row-2">
          <div class="field-group">
            <label class="field-label" for="fb-handle">${IS_EN_PAGE ? 'Threads / IG Handle (In-Game Credit)' : 'Username Threads / IG (Kredit Game)'}</label>
            <input id="fb-handle" type="text" class="modal-input" placeholder="@anak_kos_jkt" value="${escapeHtml(getSavedHandle())}" />
          </div>
          <div class="field-group">
            <label class="field-label" for="fb-platform">${IS_EN_PAGE ? 'Playing on?' : 'Main di mana?'}</label>
            <select id="fb-platform" class="modal-select">
              <option value="Baru Coba di Web" ${defaultPlat === 'Baru Coba di Web' ? 'selected' : ''}>${IS_EN_PAGE ? 'Web Preview' : 'Baru Coba di Web'}</option>
              <option value="Android (Beta)" ${defaultPlat === 'Android (Beta)' ? 'selected' : ''}>Android (Beta)</option>
              <option value="iPhone / iPad (App Store)" ${defaultPlat === 'iPhone / iPad (App Store)' ? 'selected' : ''}>iPhone / iPad</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="fb-email">${IS_EN_PAGE ? 'Email for reward / follow-up (optional)' : 'Email buat klaim hadiah Rp25rb–Rp50rb Tabungan kalau terpilih (opsional)'}</label>
          <input id="fb-email" type="email" class="modal-input" placeholder="${IS_EN_PAGE ? 'you@gmail.com' : 'nama@gmail.com'}" value="${escapeHtml(getSavedEmail())}" autocomplete="email" />
        </div>

        <label style="display:flex;align-items:flex-start;gap:8px;font-size:11.5px;line-height:1.45;margin:2px 0;cursor:pointer;">
          <input id="fb-optin" type="checkbox" style="margin-top:2px;" />
          <span>${
            IS_EN_PAGE
              ? 'Also notify me about official releases &amp; updates from KAS Studio (optional, <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy / UU PDP</a>).'
              : 'Kabari saya soal pengumuman pembaruan &amp; rilis resmi dari KAS Studio (opsional, <a href="/privacy.html" target="_blank" rel="noopener">Kebijakan Privasi / UU PDP</a>).'
          }</span>
        </label>

        <p id="fb-form-err" class="form-error-msg hidden"></p>
        <button id="fb-submit-btn" type="submit" class="btn-funnel-gold btn-full">${IS_EN_PAGE ? 'Submit Idea to KAS Studio' : 'Kirim Ide ke Rapat Kosan'}</button>
      </form>
    `,
  });

  const dynamicSlot = document.getElementById('idea-dynamic-slot');
  const titleLabel = document.getElementById('idea-title-label');
  const titleInput = document.getElementById('fb-idea-title');
  const bodyInput = document.getElementById('fb-body');

  function syncTrackFields() {
    if (!dynamicSlot) return;
    if (currentTrack === 'minigame') {
      if (titleLabel) titleLabel.textContent = IS_EN_PAGE ? 'Side-Hustle / Minigame Name' : 'Nama Kerja Sampingan / Minigame';
      if (titleInput && !titleInput.value) {
        titleInput.placeholder = IS_EN_PAGE
          ? 'e.g. Concert Queue Runner / Rainy Scooter Wash'
          : 'Contoh: Joki Antre Konser / Cuci Motor Hujan';
      }
      if (bodyInput) {
        bodyInput.placeholder = IS_EN_PAGE
          ? 'How does it play in 30 seconds, and what funny mishap happens if you miss?'
          : 'Gimana cara mainnya dalam 30 detik, dan apa kejadian kocaknya kalau meleset?';
      }
      dynamicSlot.innerHTML = `
        <div class="field-group">
          <label class="field-label" for="fb-meta-1">${IS_EN_PAGE ? 'Play Style' : 'Gaya Main'}</label>
          <select id="fb-meta-1" class="modal-select">
            <option value="Tap Cepat">${IS_EN_PAGE ? 'Fast Tap / Reflex' : 'Tap Cepat / Refleks'}</option>
            <option value="Adu Timing">${IS_EN_PAGE ? 'Timing / Rhythm' : 'Adu Timing / Irama'}</option>
            <option value="Sortir & Geser">${IS_EN_PAGE ? 'Sort &amp; Drag Items' : 'Sortir &amp; Geser Barang'}</option>
            <option value="Tawar Harga">${IS_EN_PAGE ? 'Customer Haggling' : 'Tawar-Menawar Pelanggan'}</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="fb-meta-2">${IS_EN_PAGE ? 'Target Payout' : 'Perkiraan Cuan'}</label>
          <select id="fb-meta-2" class="modal-select">
            <option value="Rp10.000 - Rp25.000">Rp10k – Rp25k</option>
            <option value="Rp15.000 - Rp35.000">${IS_EN_PAGE ? 'Rp15k – Rp35k (High Risk)' : 'Rp15rb – Rp35rb (Berisiko)'}</option>
          </select>
        </div>
      `;
    } else if (currentTrack === 'pasar') {
      if (titleLabel) titleLabel.textContent = IS_EN_PAGE ? 'Market Item / Shopping Event' : 'Nama Barang Pasar / Ide Event Belanja';
      if (titleInput && !titleInput.value) {
        titleInput.placeholder = IS_EN_PAGE ? 'e.g. Corned Beef Sachet / Rp500 Fried Tofu' : 'Contoh: Kornet Sachet / Tahu Bulat 500-an';
      }
      if (bodyInput) {
        bodyInput.placeholder = IS_EN_PAGE
          ? 'How does it affect Gut, Sanity, or the 450VA power limit?'
          : 'Efeknya ke Lambung, Kewarasan, atau daya listrik 450VA gimana?';
      }
      dynamicSlot.innerHTML = `
        <div class="field-group">
          <label class="field-label" for="fb-meta-1">${IS_EN_PAGE ? '5×4 Fridge Size' : 'Ukuran di Kulkas 5×4'}</label>
          <select id="fb-meta-1" class="modal-select">
            <option value="1x1">${IS_EN_PAGE ? '1×1 Small Tile' : '1×1 Kotak Kecil'}</option>
            <option value="2x1">${IS_EN_PAGE ? '2×1 Medium' : '2×1 Sedang'}</option>
            <option value="L-Shape (3 kotak)">${IS_EN_PAGE ? 'L-Shape (3 Tiles)' : 'L-Shape (3 Kotak)'}</option>
            <option value="Event Pasar">${IS_EN_PAGE ? 'Market Event (Non-Item)' : 'Bukan Barang (Event Pasar)'}</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="fb-meta-2">${IS_EN_PAGE ? 'Street Price' : 'Harga Anak Kos'}</label>
          <input id="fb-meta-2" type="text" class="modal-input" placeholder="${IS_EN_PAGE ? 'e.g. Rp2,500' : 'Misal: Rp2.500'}" />
        </div>
      `;
    } else if (currentTrack === 'resep') {
      if (titleLabel) titleLabel.textContent = IS_EN_PAGE ? '450VA Rice-Cooker Dish Name' : 'Nama Masakan Magic Com';
      if (titleInput && !titleInput.value) {
        titleInput.placeholder = IS_EN_PAGE ? 'e.g. Day-28 Creamy Cheese Ramen' : 'Contoh: Mie Kuah Susu Keju Tanggal 28';
      }
      if (bodyInput) {
        bodyInput.placeholder = IS_EN_PAGE
          ? 'Why does this combo belong in the Sacred Kosan Recipe Book?'
          : 'Ceritain kenapa kombinasi ini wajib masuk Buku Resep Keramat!';
      }
      dynamicSlot.innerHTML = `
        <div class="field-group">
          <label class="field-label" for="fb-meta-1">${IS_EN_PAGE ? '2–3 Ingredient Combo' : 'Kombinasi 2–3 Bahan'}</label>
          <input id="fb-meta-1" type="text" class="modal-input" placeholder="${IS_EN_PAGE ? 'e.g. Noodles + Milk + Egg' : 'Misal: Mie + Susu + Telur'}" value="${escapeHtml(presetIngredients)}" />
        </div>
        <div class="field-group">
          <label class="field-label" for="fb-meta-2">${IS_EN_PAGE ? 'Recipe Tier' : 'Kasta Resep'}</label>
          <select id="fb-meta-2" class="modal-select">
            <option value="keramat">${IS_EN_PAGE ? 'Sacred (Feast)' : 'Resep Keramat (Mewah)'}</option>
            <option value="kreatif">${IS_EN_PAGE ? 'Clever (Lifesaver)' : 'Kreatif (Penyelamat)'}</option>
            <option value="biasa">${IS_EN_PAGE ? 'Spare-Change Basic' : 'Darurat Receh'}</option>
          </select>
        </div>
      `;
    } else {
      if (titleLabel) titleLabel.textContent = IS_EN_PAGE ? 'Survival Tip / Drama / Bug Title' : 'Judul Tips Bertahan / Drama / Laporan';
      if (titleInput && !titleInput.value) {
        titleInput.placeholder = IS_EN_PAGE ? 'e.g. 5:45 PM Veggie Discount Trick or UI Bug' : 'Contoh: Trik Beli Sayur Jam 17:45 atau Bug Layar';
      }
      if (bodyInput) {
        bodyInput.placeholder = IS_EN_PAGE
          ? 'Share your end-of-month saving trick, midnight Ibu Kos text idea, or bug details...'
          : 'Tulis trik hemat akhir bulanmu, ide chat drama malam Ibu Kos, atau detail bug...';
      }
      dynamicSlot.innerHTML = `
        <div class="field-group">
          <label class="field-label" for="fb-meta-1">${IS_EN_PAGE ? 'Note Type' : 'Jenis Catatan'}</label>
          <select id="fb-meta-1" class="modal-select">
            <option value="tips_hemat">${IS_EN_PAGE ? 'Survival Saving Tip' : 'Tips Bertahan Tanggal Tua'}</option>
            <option value="drama_malam">${IS_EN_PAGE ? 'Midnight Kosan Text Idea' : 'Ide Chat Drama Malam Kos'}</option>
            <option value="bug_ui">${IS_EN_PAGE ? 'Bug / Balance Report' : 'Lapor Bug / Kesulitan Game'}</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="fb-meta-2">${IS_EN_PAGE ? 'Impression So Far' : 'Kesan Main Sejauh Ini'}</label>
          <select id="fb-meta-2" class="modal-select">
            <option value="Nagih & seru!">${IS_EN_PAGE ? 'Addictive &amp; fun!' : 'Nagih &amp; seru!'}</option>
            <option value="Pas susahnya">${IS_EN_PAGE ? 'Balanced challenge' : 'Pas susahnya'}</option>
            <option value="Terlalu susah">${IS_EN_PAGE ? 'A bit tough' : 'Agak susah / boncos'}</option>
          </select>
        </div>
      `;
    }
  }

  syncTrackFields();

  document.querySelectorAll('#idea-track-picker .track-pick-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.click(true);
      currentTrack = btn.getAttribute('data-pick-track') || 'resep';
      document.querySelectorAll('#idea-track-picker .track-pick-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      syncTrackFields();
    });
  });

  document.getElementById('fb-funnel-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hp = e.target.querySelector('[name="website_hp"]')?.value;
    if (hp) return;

    const title = document.getElementById('fb-idea-title')?.value?.trim() || '';
    const message = document.getElementById('fb-body')?.value?.trim() || '';
    const meta1 = document.getElementById('fb-meta-1')?.value?.trim() || '';
    const meta2 = document.getElementById('fb-meta-2')?.value?.trim() || '';
    const handleRaw = document.getElementById('fb-handle')?.value?.trim() || '@warga_kos';
    const emailRaw = document.getElementById('fb-email')?.value?.trim() || '';
    const marketingOptIn = Boolean(document.getElementById('fb-optin')?.checked);
    const platform = document.getElementById('fb-platform')?.value || '-';
    const errEl = document.getElementById('fb-form-err');
    const btn = document.getElementById('fb-submit-btn');

    if (title.length < 3 || message.length < 6) {
      if (errEl) {
        errEl.textContent = IS_EN_PAGE
          ? 'Please enter a short title (min. 3 chars) and brief description.'
          : 'Isi judul singkat (min. 3 huruf) dan penjelasan singkat dulu ya.';
        errEl.classList.remove('hidden');
      }
      return;
    }
    errEl?.classList.add('hidden');
    savePlayerHandle(handleRaw);
    if (isValidEmail(emailRaw)) saveTesterEmail(emailRaw);

    if (btn) {
      btn.disabled = true;
      btn.textContent = IS_EN_PAGE ? 'Submitting idea...' : 'Mencatat ke Papan Kosan...';
    }

    const structuredMeta =
      currentTrack === 'minigame'
        ? { mechanic: meta1, payout: meta2 }
        : currentTrack === 'pasar'
          ? { gridShape: meta1, price: meta2 }
          : currentTrack === 'resep'
            ? { ingredients: meta1.split(/[+,]/).map((s) => s.trim()).filter(Boolean), rarity: meta2 }
            : { subkind: meta1, vibe: meta2 };

    const attr = getAttributionMeta();
    const platKey = platform.includes('iPhone') ? 'ios' : platform.includes('Android') ? 'android' : 'web';

    const rpcPromise = callSupabaseRpc('tt_submit_community_idea', {
      p_track: currentTrack,
      p_title: title,
      p_summary: message,
      p_meta: structuredMeta,
      p_author_handle: handleRaw,
      p_author_email: isValidEmail(emailRaw) ? emailRaw : null,
      p_marketing_opt_in: marketingOptIn,
      p_client_hash: getClientHash(),
      p_platform: platKey,
      p_utm_source: attr.utm,
    });

    const summaryLines = [
      'Sumber Form: Papan Musyawarah Kos (tanggaltua.id/#komunitas — Web)',
      `Jalur Ide: ${TRACK_LABELS[currentTrack] || currentTrack}`,
      `Judul: ${title}`,
      `Detail: ${meta1} | ${meta2}`,
      `Kredit Handle: ${handleRaw}`,
      `Email: ${emailRaw || '-'}`,
      `Platform Pilihan: ${platform} (OS Browser: ${attr.deviceOs})`,
      '',
      message,
    ];

    const hubPayload = {
      jenis: 'playtest_feedback',
      kesan_cepat: meta2 || TRACK_LABELS[currentTrack],
      kategori: `Co-Creation: ${TRACK_LABELS[currentTrack]}`,
      platform_main: platform,
      pesan: `${title} — ${message} (${meta1})`,
      email: isValidEmail(emailRaw) ? emailRaw : undefined,
      kontak_kredit: handleRaw,
      marketing_opt_in: marketingOptIn,
      os_pengunjung: attr.deviceOs,
      sumber_utm: attr.utm,
      waktu: attr.submittedAt,
    };

    const [rpcRes, hubRes] = await Promise.all([
      rpcPromise,
      deliverFunnelPayload(hubPayload, `[Ide ${TRACK_LABELS[currentTrack]}] ${title} – Tanggal Tua`, summaryLines),
    ]);

    void loadCommunityIdeas();

    const threadsText = IS_EN_PAGE
      ? `Just pitched "${title}" (${TRACK_LABELS[currentTrack]}) for @${SITE_CONFIG.threadsGameHandle} by @${SITE_CONFIG.threadsStudioHandle}! Help vote it in at https://tanggaltua.id/en#komunitas #TanggalTua`
      : `Gue baru aja usul ide "${title}" (${TRACK_LABELS[currentTrack]}) buat masuk ke game @${SITE_CONFIG.threadsGameHandle} karya @${SITE_CONFIG.threadsStudioHandle}! Bantu vote di https://tanggaltua.id/#komunitas #TanggalTua`;
    const threadsHref = buildThreadsIntentUrl(threadsText);

    if ((rpcRes && rpcRes.ok) || hubRes.delivered) {
      sfx.vn();
      if (modalSlot) {
        const authorLabel = escapeHtml(rpcRes?.authorHandle || handleRaw);
        const safeTitle = escapeHtml(title);
        modalSlot.innerHTML = IS_EN_PAGE
          ? `
          <div class="modal-success-card">
            <strong>Idea Submitted: "${safeTitle}"!</strong>
            <p>Your idea is credited to <strong>${authorLabel}</strong> and appears on your device’s board right away while awaiting open community voting curation.</p>
            <p>Share it on Threads so fellow kosan residents can rally votes for the next update!</p>
          </div>
          <a href="${threadsHref}" target="_blank" rel="noopener" class="mini-action-btn threads btn-full" style="min-height:46px;font-size:14px">
            <span>Share Your Idea on Threads (@${SITE_CONFIG.threadsGameHandle})</span>
          </a>
          <button id="btn-done-modal" type="button" class="btn-primary btn-full">Done, View Community Board</button>
        `
          : `
          <div class="modal-success-card">
            <strong>Mantap! Ide "${safeTitle}" Sudah Masuk</strong>
            <p>Usulanmu sudah tercatat atas nama <strong>${authorLabel}</strong> dan langsung tampil di papan perangkatmu sambil menunggu kurasi voting terbuka.</p>
            <p>Ajak warga lain ikut dukung di Threads biar makin cepat dimasak developer!</p>
          </div>
          <a href="${threadsHref}" target="_blank" rel="noopener" class="mini-action-btn threads btn-full" style="min-height:46px;font-size:14px">
            <span>Pamerkan Usulanmu di Threads (@${SITE_CONFIG.threadsGameHandle})</span>
          </a>
          <button id="btn-done-modal" type="button" class="btn-primary btn-full">Siap, Lihat Papan Komunitas</button>
        `;
        document.getElementById('btn-done-modal')?.addEventListener('click', () => {
          closeModal();
          document.getElementById('komunitas')?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    } else {
      renderFallbackSlot({
        errorNote: IS_EN_PAGE
          ? 'Tap below to send your community idea via your email app:'
          : 'Klik tombol di bawah untuk mengirim usulanmu lewat aplikasi email:',
        mailtoHref: hubRes.mailtoHref,
        plainText: summaryLines.join('\n'),
      });
    }
  });
}

// --- FUNNEL 4: HYBRID OPTION A+B "MINTA TALANGIN TEMAN" (SLIP KASBON KOSMART) ---
const TALANGIN_GIFTS = [
  {
    id: 'telur_dana',
    title: '2 Telur Retak + Rp15.000',
    sub: 'Penyelamat protein Tanggal 27 biar gak kena maag mie polos',
    badge: 'FAVORIT',
  },
  {
    id: 'mie_sarden',
    title: 'Mie Instan + Sarden Kaleng + Rp10.000',
    sub: 'Makan malam rasa gajian dini di Kamar 04',
    badge: '+WARAS',
  },
  {
    id: 'token_dana',
    title: 'Token Listrik 35% + Rp10.000',
    sub: 'Biar meteran 450VA berhenti bunyi TIT-TIT jam 2 pagi!',
    badge: 'ANTI JEKLEK',
  },
];

function generateBailoutCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `KANCIL-${suffix}`;
}

async function openTalanginBailoutModal(opts = {}) {
  const rawCode = String(opts.code || '').trim().toUpperCase();
  const isIncomingHelp = Boolean(rawCode && rawCode.length >= 6);
  const code = isIncomingHelp ? rawCode : generateBailoutCode();
  const senderName = String(opts.sender || 'Raka (Kamar 04)').slice(0, 32);
  const senderDay = Math.min(30, Math.max(20, Number(opts.day) || 27));
  const senderMoney = Math.max(0, Number(opts.money) || 1500);
  const formattedMoney = `Rp${senderMoney.toLocaleString('id-ID')}`;

  if (!isIncomingHelp) {
    // Mode A: Player/Visitor generates their own "Minta Talangin" link to drop in WA / Threads!
    const shareUrl = `https://tanggaltua.id/talangin/?k=${encodeURIComponent(code)}&dari=${encodeURIComponent(senderName)}&tgl=${senderDay}&sisa=${senderMoney}`;
    const copyMsg = `Bro/Sis tolongin 😭 Gue nyangkut di Tanggal ${senderDay} sisa ${formattedMoney} di Kamar 04 Kosan Gang Kancil, beras abis & Ibu Kos udah ngetok pintu. Klik buat kirimin gue telur retak / talangin Rp15rb (simulasi game gratis kok gak motong saldo asli wkwk): ${shareUrl}`;
    const threadsHref = buildThreadsIntentUrl(`${copyMsg} @${SITE_CONFIG.threadsGameHandle} #TanggalTua`);

    openModal({
      kicker: 'FITUR SOSIAL • MINTA TALANGIN KOS',
      title: 'Sebar Slip Kasbon ke Teman / Grup WA',
      desc: 'Cara kerja Hybrid: Sebar link ini buat dapat uang receh darurat instan, dan begitu temanmu klik pilih kiriman sembako, bahan + Rp15.000 langsung masuk ke Kamar 04-mu!',
      slotHtml: `
        <div class="talangin-slip-card">
          <div class="talangin-slip-head">
            <span>KOSMART GANG KANCIL • SIMULASI GAME</span>
            <span>#${escapeHtml(code)}</span>
          </div>
          <div><strong>PEMOHON:</strong> ${escapeHtml(senderName)}</div>
          <div><strong>POSISI:</strong> Tanggal ${senderDay} • Sisa Dompet <strong>${formattedMoney}</strong></div>
          <div style="margin-top:6px;color:#52525b;">Status: Menunggu teman baik kirim Telur Retak / Sarden / Token PLN!</div>
        </div>
        <button type="button" id="btn-copy-talangin" class="btn-funnel-gold btn-full">Salin Pesan "Minta Talangin" (WA / Grup)</button>
        <a href="${threadsHref}" target="_blank" rel="noopener" class="mini-action-btn threads btn-full" style="min-height:46px;font-size:13.5px">
          <span>Minta Talangin Warga Threads (@${SITE_CONFIG.threadsGameHandle})</span>
        </a>
        <button type="button" id="btn-preview-friend-view" class="mini-ghost-btn" style="text-align:center">
          Lihat tampilan waktu temanmu membuka link ini →
        </button>
      `,
    });

    document.getElementById('btn-copy-talangin')?.addEventListener('click', async () => {
      sfx.click(true);
      const ok = await copyTextSafe(copyMsg);
      showKosToast(
        ok
          ? 'Link Minta Talangin tersalin! Tempel di WA atau Story.'
          : 'Gagal menyalin otomatis — bagikan lewat tombol Threads ya.',
        'kos'
      );
    });
    document.getElementById('btn-preview-friend-view')?.addEventListener('click', () => {
      sfx.click(true);
      void openTalanginBailoutModal({ code, sender: senderName, day: senderDay, money: senderMoney });
    });
    return;
  }

  // Mode B: Friend clicked an incoming ?talangin=KANCIL-XXXX link -> Interactive 3-Gift Picker!
  openModal({
    kicker: `DARURAT ANAK KOS • #${code}`,
    title: `Talangin ${senderName} di Tanggal ${senderDay}!`,
    desc: `Saldo dompet game temanmu tinggal ${formattedMoney} menuju Tanggal 1. Pilih 1 bantuan gratis buat dikirim ke depan Kamar 04-nya (100% simulasi game, Rp0 uang asli):`,
    slotHtml: `
      <div class="talangin-slip-card">
        <div class="talangin-slip-head">
          <span>SLIP DARURAT KOSMART (GAME)</span>
          <span>SISA ${escapeHtml(formattedMoney)}</span>
        </div>
        <div>"${escapeHtml(senderName)} butuh talangan sembako biar gak tumbang sebelum gajian Tanggal 1!"</div>
      </div>

      <div class="field-group">
        <label class="field-label" for="talangin-helper-input">Nama panggilanmu (muncul di layar temanmu):</label>
        <input id="talangin-helper-input" type="text" class="modal-input" placeholder="Contoh: @budi_baik" value="${escapeHtml(getSavedHandle())}" />
      </div>

      <div class="talangin-gift-grid" id="talangin-gift-list">
        ${TALANGIN_GIFTS.map(
          (g) => `
          <button type="button" class="talangin-gift-btn" data-gift-id="${g.id}">
            <div>
              <strong>${escapeHtml(g.title)}</strong>
              <small>${escapeHtml(g.sub)}</small>
            </div>
            <span class="talangin-gift-tag">${escapeHtml(g.badge)}</span>
          </button>
        `
        ).join('')}
      </div>
    `,
  });

  document.querySelectorAll('#talangin-gift-list [data-gift-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      document.querySelectorAll('#talangin-gift-list [data-gift-id]').forEach((b) => {
        b.disabled = true;
      });
      const tagEl = btn.querySelector('.talangin-gift-tag');
      if (tagEl) tagEl.textContent = IS_EN_PAGE ? 'SENDING...' : 'MENGIRIM...';

      const giftId = btn.getAttribute('data-gift-id') || 'telur_dana';
      const helperRaw = document.getElementById('talangin-helper-input')?.value?.trim() || '@teman_kos';
      savePlayerHandle(helperRaw);
      sfx.vn();

      const giftObj = TALANGIN_GIFTS.find((x) => x.id === giftId) || TALANGIN_GIFTS[0];
      const rpcRes = await callSupabaseRpc('tt_send_bailout_gift', {
        p_code: code,
        p_gift: giftId,
        p_helper_handle: helperRaw,
        p_helper_hash: getClientHash(),
        p_sender_handle: senderName,
        p_sender_character: 'raka',
        p_sender_day: senderDay,
        p_sender_money: senderMoney,
      });

      const already = Boolean(rpcRes?.alreadyHelped);
      const schemeHref = `tanggaltua://klaim-orang-baik?dari=${encodeURIComponent(code)}&bonus=25000`;
      const threadsReplyHref = buildThreadsIntentUrl(
        `Barusan nalangin ${senderName} (${giftObj.title}) biar selamat sampai Tanggal 1 di @${SITE_CONFIG.threadsGameHandle}! Cobain gratis: https://tanggaltua.id #TanggalTua`
      );

      if (modalSlot) {
        modalSlot.innerHTML = `
          <div class="modal-success-card">
            <strong>${already ? 'Kamar 04 Sudah Ditalangin!' : `Pahala Anak Kos! ${escapeHtml(giftObj.title)} Terkirim`}</strong>
            <p>${
              already
                ? `Teman lain (${escapeHtml(rpcRes?.helperHandle || '@teman_baik')}) baru saja mendahului mengirim bantuan ke kode #${escapeHtml(code)}, tapi kamu tetap berhak klaim Bonus Orang Baik!`
                : `Begitu ${escapeHtml(senderName)} menyambung internet di aplikasi Tanggal Tua, kiriman darimu langsung mendarat di Kamar 04!`
            }</p>
            <p><strong>Hadiah Buatmu (Bonus Orang Baik):</strong> Klaim modal awal <strong>+Rp25.000 Tabungan Kos</strong> untuk main di HP-mu!</p>
          </div>
          <a href="${schemeHref}" class="btn-primary btn-full">Klaim Bonus +Rp25.000 di Aplikasi</a>
          <div class="modal-alt-links">
            <button type="button" id="btn-talangin-ios">Belum punya? Unduh Gratis di iOS</button>
            <button type="button" id="btn-talangin-and">Daftar Android (Google Play)</button>
            <a href="${threadsReplyHref}" target="_blank" rel="noopener">Pamer Pahala di Threads</a>
          </div>
        `;
        document.getElementById('btn-talangin-ios')?.addEventListener('click', () => openIosLeadModal(false));
        document.getElementById('btn-talangin-and')?.addEventListener('click', () => openAndroidLeadModal());
      }
    });
  });
}

// Wire Magic Com 450VA Toy -> Co-Creation & Threads buttons
document.getElementById('btn-propose-pot-recipe')?.addEventListener('click', () => {
  sfx.click(true);
  const names = selectedIngs.map((id) => TOY_INGREDIENTS.find((x) => x.id === id)?.name || id);
  openFeedbackModal({
    track: 'resep',
    ingredients: names,
  });
});

document.getElementById('btn-threads-pot')?.addEventListener('click', () => {
  sfx.click(true);
  const watt = computeToyWatt();
  const rec = matchToyRecipe(selectedIngs);
  const text = IS_EN_PAGE
    ? watt > 450
      ? `Just tried cooking 3 ingredients in the 450VA Rice Cooker of @${SITE_CONFIG.threadsGameHandle} and tripped the breaker at ${watt}VA because I forgot to turn off the room fan! Try it at https://tanggaltua.id/en#coba-masak #TanggalTua`
      : `Just cooked "${rec.name}" (${watt}/450VA — breaker held!) in @${SITE_CONFIG.threadsGameHandle}! Try the 450VA Rice Cooker workbench at https://tanggaltua.id/en#coba-masak #TanggalTua`
    : watt > 450
      ? `Baru coba masak 3 bahan di Magic Com 450VA @${SITE_CONFIG.threadsGameHandle} langsung JEKLEK ${watt}VA gara-gara lupa matiin kipas kosan 😭⚡ Cobain di https://tanggaltua.id/#coba-masak #TanggalTua`
      : `Malam ini berhasil masak "${rec.name}" (${watt}/450VA aman gak jeklek!) di panci kos @${SITE_CONFIG.threadsGameHandle} 🍲 Cobain racik resepmu di https://tanggaltua.id/#coba-masak #TanggalTua`;
  window.open(buildThreadsIntentUrl(text), '_blank', 'noopener');
});

// Wire Thermal Receipt Showcase -> Minta Talangin & Threads buttons
document.getElementById('btn-demo-talangin')?.addEventListener('click', () => {
  sfx.click(true);
  void openTalanginBailoutModal({});
});

document.getElementById('btn-threads-receipt')?.addEventListener('click', () => {
  sfx.click(true);
  const isWinActive = document.querySelector('.receipt-toggle.active')?.getAttribute('data-receipt') !== 'loss';
  const text = isWinActive
    ? `Target akhir bulan ini: lulus Tanggal 20–30 menyisakan Rp42.500 [BEBAS PINJOL] [ANTI JEKLEK] di @${SITE_CONFIG.threadsGameHandle} karya @${SITE_CONFIG.threadsStudioHandle}! Berani adu irit 11 hari tanpa pinjol? https://tanggaltua.id #TanggalTua`
    : `Tumbang di Tanggal 25 gara-gara Checkout Khilaf jam 2 pagi & MCB 450VA jeklek 3x 😭 Tolong talangin gue di @${SITE_CONFIG.threadsGameHandle}: https://tanggaltua.id #TanggalTua`;
  window.open(buildThreadsIntentUrl(text), '_blank', 'noopener');
});

// Wire store / beta triggers
document.querySelectorAll('[data-store]').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.click(true);
    if (btn.dataset.store === 'ios') openIosLeadModal(false);
    else openAndroidLeadModal();
  });
});

document.querySelectorAll('[data-ios-waitlist]').forEach((btn) => {
  btn.addEventListener('click', () => {
    sfx.click(true);
    openIosLeadModal(true);
  });
});

// Wire feedback triggers + footer contact link
document.querySelectorAll('[data-open-feedback]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    sfx.click(true);
    openFeedbackModal();
  });
});

document.getElementById('footer-contact-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  sfx.click(true);
  openFeedbackModal();
});

// Press & Creator Kit modal
document.getElementById('btn-open-press')?.addEventListener('click', () => {
  sfx.click(true);
  openModal({
    kicker: 'PRESS & CREATOR KIT',
    title: 'Aset Resmi untuk Konten #TanggalTua',
    desc: 'Bebas dipakai buat video TikTok, Reels, YouTube Shorts, live streaming, dan liputan media game Indonesia.',
    slotHtml: `
      <div class="modal-info-card">
        <strong>Info Singkat Game:</strong><br/>
        • Judul: Tanggal Tua – Simulator Anak Kos<br/>
        • Developer: KAS Studio (Jakarta, Indonesia)<br/>
        • Platform: iOS &amp; Android (Gratis, 100% Bisa Offline)<br/>
        • Tagar: <strong>#TanggalTua #TanggalTuaHarian</strong>
      </div>
      <a href="/og-image.png" download="tanggal-tua-keyart.png" class="btn-primary btn-full">
        Unduh Gambar Sampul (1200×630 PNG)
      </a>
      <a href="/assets/kas-studio-logo.svg" download="kas-studio-logo.svg" class="btn-funnel-gold btn-full">
        Unduh Logo KAS Studio (SVG)
      </a>
      <a href="/press.html" class="mini-ghost-btn" style="display:block;text-align:center;margin-top:8px">
        Buka Halaman Press Kit Lengkap (/press.html) →
      </a>
    `,
  });
});

// Deep-Link Hash & Query Router:
// Supports sharing direct links in TestFlight / Play Console / Social Bio:
//   https://tanggaltua.id/#testflight  -> Opens iOS TestFlight invite form
//   https://tanggaltua.id/#android     -> Opens Android Closed Beta Gmail form
//   https://tanggaltua.id/#masukan     -> Opens Structured Playtest Feedback form
function openRivalChallengeModal(tthRaw, scoreRaw, rankRaw, kastaRaw) {
  const cleanTth = String(tthRaw || '').replace(/^#?TTH-/i, '').trim();
  const isDaily = /^\d{6}$/.test(cleanTth);
  const score = Math.max(0, Math.round(Number(scoreRaw) || 0));
  const safeRank = /^[A-Z0-9+]{1,3}$/i.test(String(rankRaw || '')) ? String(rankRaw).toUpperCase() : 'B+';
  const kasta = Math.max(1, Math.min(8, Math.round(Number(kastaRaw) || 1)));
  const schemePrefix = ['tanggaltua', '://'].join('');
  const deepLinkHref = isDaily
    ? `${schemePrefix}harian?tth=${encodeURIComponent(cleanTth)}&skor=${score}&rank=${encodeURIComponent(safeRank)}`
    : `${schemePrefix}tantang?tantang=${encodeURIComponent(safeRank)}&kasta=${kasta}`;

  openModal({
    kicker: isDaily ? `TANTANGAN HARIAN • #TTH-${cleanTth}` : `TANTANGAN BERTAHAN • KASTA ${kasta}`,
    title: isDaily && score > 0 ? `Kalahkan Skor Teman: ${score.toLocaleString('id-ID')}` : `Sanggup Tembus Rank ${safeRank}?`,
    desc: isDaily
      ? 'Harga pasar, isi kulkas, dan kejadian malam di Tanggal Tua Harian hari ini 100% sama. Buka langsung di aplikasi atau unduh gratis di HP-mu!'
      : 'Temanmu baru saja mencetak Struk Kosmart Gang Kancil tanpa pinjol. Berani adu irit 11 hari menuju gajian?',
    slotHtml: `
      <div class="modal-info-card">
        <strong>Target Tantangan:</strong><br/>
        ${isDaily ? `• Kode Harian: <strong>#TTH-${cleanTth}</strong><br/>• Skor Teman: <strong>${score.toLocaleString('id-ID')}</strong> (Rank ${safeRank})` : `• Kasta Kos: <strong>Kasta ${kasta}</strong><br/>• Predikat Teman: <strong>Rank ${safeRank}</strong>`}
      </div>
      <a href="${deepLinkHref}" class="btn-primary btn-full">Buka Tantangan di Aplikasi</a>
      <div class="modal-alt-links">
        <button type="button" id="btn-rival-ios">Belum punya? Daftar Rilis iOS (iPhone &amp; iPad)</button>
        <button type="button" id="btn-rival-and">Daftar Android (Google Play)</button>
      </div>
    `,
  });
  document.getElementById('btn-rival-ios')?.addEventListener('click', () => openIosLeadModal(false));
  document.getElementById('btn-rival-and')?.addEventListener('click', () => openAndroidLeadModal());
}

function handleFunnelDeepLink() {
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (path.startsWith('/talangin') || params.get('talangin') || params.get('k') || hash === '#talangin') {
    void openTalanginBailoutModal({
      code: params.get('talangin') || params.get('k') || '',
      sender: params.get('dari') || params.get('nama') || 'Raka (Kamar 04)',
      day: params.get('tgl') || 27,
      money: params.get('sisa') || 1500,
    });
  } else if (params.get('tth') || params.get('harian') || params.get('tantang')) {
    openRivalChallengeModal(
      params.get('tth') || params.get('harian'),
      params.get('skor') || params.get('score'),
      params.get('rank') || params.get('tantang'),
      params.get('kasta')
    );
  } else if (path.startsWith('/komunitas')) {
    document.getElementById('komunitas')?.scrollIntoView({ behavior: 'smooth' });
  } else if (hash === '#testflight' || hash === '#ios' || params.get('beta') === 'ios') {
    openIosLeadModal();
  } else if (hash === '#android' || hash === '#beta' || params.get('beta') === 'android') {
    openAndroidLeadModal();
  } else if (hash === '#masukan' || hash === '#feedback' || hash === '#ide' || params.get('feedback') === '1') {
    openFeedbackModal({ track: params.get('track') || 'resep' });
  }
}

window.addEventListener('hashchange', handleFunnelDeepLink);
handleFunnelDeepLink();
