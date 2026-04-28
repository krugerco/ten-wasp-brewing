/* =================================================================
   TEN WASP BREWING COMPANY — main.js
   Cross-device CMS: data.json is the source of truth.
   Admin saves push to GitHub → Cloudflare auto-redeploys.
   ================================================================= */

/* -----------------------------------------------------------------
   GITHUB CONFIG
   Visitors fetch /data.json from the CDN (fast, edge-served).
   Admin saves update data.json in the repo via GitHub API.
----------------------------------------------------------------- */
const GH_OWNER  = 'krugerco';
const GH_REPO   = 'ten-wasp-brewing';
const GH_BRANCH = 'main';
const GH_FILE   = 'data.json';

/* -----------------------------------------------------------------
   FALLBACK DEFAULTS  (used only if data.json can't be fetched)
----------------------------------------------------------------- */
const DEFAULT_BEERS = [
  { id: 1,  name: 'Synthwave Portal',       style: 'NEIPA',                abv: null, ibu: null, rating: 4.42, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'The highest-rated pour in the hive. Neon-soaked tropical haze. Riwaka, Citra, Nectaron.' },
  { id: 2,  name: "Wendy's a Lifeguard",    style: 'NEIPA',                abv: null, ibu: null, rating: null, price: null, category: 'hoppy',        award: "Iowa's Best Beer 2025", available: true,  desc: 'Lush mango, passionfruit, citrus bliss. Simcoe, Vic Secret, Mosaic, Citra.' },
  { id: 3,  name: 'Cake Eater',             style: 'Imperial Pastry Stout',abv: 14,   ibu: null, rating: null, price: null, category: 'dark-malty',   award: "Iowa's Best Beer 2025", available: true,  desc: 'Award-winning decadence. Pecans, coconut, cocoa nibs, vanilla beans.' },
  { id: 4,  name: 'Flying V',               style: 'Imperial Hazy IPA',   abv: 8.2,  ibu: null, rating: null, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'Big, bold, unapologetic. Full-throttle hazy for the adventurous.' },
  { id: 5,  name: "Look Ma, We're On Tap",  style: 'Double NEIPA',         abv: 8.3,  ibu: null, rating: 4.35, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'DDH Citra, Riwaka, Vic Secret — tropical citrus piled sky high.' },
  { id: 6,  name: 'Strata in the Whirlpool',style: 'NEIPA',               abv: 7.4,  ibu: 35,   rating: 4.32, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'Strata, Citra, Riwaka. Citrus with a whisper of raspberry.' },
  { id: 7,  name: 'Midlife Crisis',         style: 'Red IPA',              abv: 7.7,  ibu: null, rating: null, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'Bold ruby-red IPA with caramel backbone and assertive hop character.' },
  { id: 8,  name: "Droppin' Hops",          style: 'Hazy Pale Ale',        abv: 5.2,  ibu: null, rating: 4.14, price: null, category: 'hoppy',        award: null,                   available: true,  desc: 'Sessionable haze. Citra, Krush, Cashmere, Motueka.' },
  { id: 9,  name: 'Cassville',              style: 'Cream Ale',            abv: 4.8,  ibu: 10,   rating: 3.95, price: null, category: 'lil-crushers', award: null,                   available: true,  desc: 'Smooth, clean, crushable. The perfect pint for any occasion.' },
  { id: 10, name: "Norwegian A'Peel",       style: 'Witbier',              abv: 5.8,  ibu: 14,   rating: 3.95, price: null, category: 'lil-crushers', award: null,                   available: true,  desc: 'Belgian-style wit with orange peel, coriander, Norwegian kveik yeast.' },
  { id: 11, name: "Pub Thumpin'",           style: 'Dark Mild',            abv: 3.4,  ibu: null, rating: null, price: null, category: 'lil-crushers', award: null,                   available: true,  desc: 'Low ABV, big flavor. A proper session ale in the British tradition.' },
  { id: 12, name: "Peelin' Cute",           style: 'Pastry Stout',         abv: 12,   ibu: null, rating: null, price: null, category: 'dark-malty',   award: null,                   available: true,  desc: 'Rich, velvety, dangerously drinkable. A dessert in a glass.' },
  { id: 13, name: 'Guava the Nut',          style: 'Fruited Sour',         abv: 5.4,  ibu: null, rating: 4.35, price: null, category: 'sours',        award: null,                   available: true,  desc: 'Pink guava and coconut. Creamy, floral, and utterly tropical.' },
  { id: 14, name: 'Berry Boo v2',           style: 'Fruited Sour',         abv: 5.8,  ibu: null, rating: null, price: null, category: 'sours',        award: null,                   available: true,  desc: 'Blackberry and raspberry — bright, jammy, intensely berry.' },
  { id: 15, name: 'Electric Shonk',         style: 'Fruited Sour',         abv: 4.0,  ibu: 3,    rating: 3.99, price: null, category: 'sours',        award: null,                   available: true,  desc: 'Mango and pineapple — electric tropical sunshine in a glass.' },
  { id: 16, name: 'Surfer Girl',            style: 'Fruited Sour',         abv: 4.0,  ibu: null, rating: null, price: null, category: 'sours',        award: null,                   available: true,  desc: 'Ride the sour wave. Fruit-forward and easy to love.' },
  { id: 17, name: 'Root 93',               style: 'House Root Beer',       abv: 0,    ibu: null, rating: null, price: null, category: 'non-alc',      award: null,                   available: true,  desc: 'Homemade root beer — two varieties brewed in-house. "Definitely worth trying."' },
  { id: 18, name: 'Orange Cream Soda',      style: 'House Soda',           abv: 0,    ibu: null, rating: null, price: null, category: 'non-alc',      award: null,                   available: true,  desc: 'Smooth, creamy, dreamy. Made right here at Ten Wasp.' },
  { id: 19, name: 'Ginger Ale',             style: 'House Soda',           abv: 0,    ibu: null, rating: null, price: null, category: 'non-alc',      award: null,                   available: true,  desc: 'House-made ginger ale with real ginger character.' },
  { id: 20, name: 'Hop Water',              style: 'Hop Water',            abv: 0,    ibu: null, rating: null, price: null, category: 'non-alc',      award: null,                   available: true,  desc: "All the aroma of craft hops, zero alcohol. The designated driver's best friend." },
];
const DEFAULT_FOOD = [
  { id: 1, name: 'Homemade Pizza',    desc: 'Fresh-made rotating varieties. Gluten-free option available.',            badge: 'Fri & Sun Only', badgeType: 'coral', available: true, price: null, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Stinger Sticks',   desc: 'House-made bread sticks served as cheese bread or dessert bread.',         badge: 'Fan Favorite',   badgeType: 'gold',  available: true, price: null, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Bavarian Pretzels',desc: 'Warm, golden, house-made Bavarian pretzels with dipping sauce.',           badge: 'Pair with Beer',  badgeType: 'blue',  available: true, price: null, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Soda Floats',      desc: 'House-made sodas topped with premium ice cream. A Ten Wasp signature.',   badge: 'All Ages',       badgeType: 'blue',  available: true, price: null, img: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80' },
];
const DEFAULT_HOURS = [
  { day: 'Wednesday', hours: '3:00 – 9:00 PM',  open: true  },
  { day: 'Thursday',  hours: '3:00 – 9:00 PM',  open: true  },
  { day: 'Friday',    hours: '12:00 – 9:00 PM', open: true  },
  { day: 'Saturday',  hours: '12:00 – 9:00 PM', open: true  },
  { day: 'Sunday',    hours: '12:00 – 8:00 PM', open: true  },
  { day: 'Monday',    hours: 'Closed',           open: false },
  { day: 'Tuesday',   hours: 'Closed',           open: false },
];
const DEFAULT_ANNOUNCEMENT = { text: '', active: false };

const ADMIN_PASSWORD = 'wasp2024';
const CACHE_KEY      = 'tenwasp_cache';      // localStorage cache of remote data
const GH_TOKEN_KEY   = 'tenwasp_gh_token';   // localStorage GitHub PAT (admin device only)

/* -----------------------------------------------------------------
   DATA LAYER
----------------------------------------------------------------- */

/** Synchronously returns cached data or defaults (never null). */
function getCachedData() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        beers:        d.beers        ?? DEFAULT_BEERS,
        food:         d.food         ?? DEFAULT_FOOD,
        hours:        d.hours        ?? DEFAULT_HOURS,
        announcement: d.announcement ?? DEFAULT_ANNOUNCEMENT,
      };
    }
  } catch {}
  return { beers: DEFAULT_BEERS, food: DEFAULT_FOOD, hours: DEFAULT_HOURS, announcement: DEFAULT_ANNOUNCEMENT };
}

/** Saves data to localStorage cache. */
function setCachedData(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

/**
 * Fetches data.json from the CDN (same origin).
 * On Cloudflare Pages this is served from the edge — fast & cross-device.
 * Falls back to localhost path for dev mode.
 */
async function fetchRemoteData() {
  try {
    const url = './data.json?t=' + Date.now();
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

/**
 * Pushes updated data.json to GitHub via the Contents API.
 * Cloudflare Pages detects the commit and redeploys (~30s).
 * Requires a GitHub Personal Access Token stored in admin's localStorage.
 */
async function pushToGitHub(data) {
  const token = localStorage.getItem(GH_TOKEN_KEY);
  if (!token) {
    return { ok: false, msg: 'No GitHub token set. Go to Admin → ⚙ Sync and add your token.' };
  }

  try {
    const apiBase = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' };

    // Get current file SHA (required for update)
    const metaRes = await fetch(apiBase, { headers });
    if (!metaRes.ok) {
      const e = await metaRes.json().catch(() => ({}));
      return { ok: false, msg: `GitHub error: ${e.message || metaRes.status}. Check your token has Contents: Write permission.` };
    }
    const { sha } = await metaRes.json();

    // Base64-encode the JSON content
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    // Commit the update
    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Update site content — ${new Date().toLocaleString()}`,
        content,
        sha,
        branch: GH_BRANCH,
      }),
    });

    if (putRes.ok) {
      return { ok: true, msg: '✓ Saved to GitHub! Site updates for all visitors in ~30 seconds.' };
    }
    const err = await putRes.json().catch(() => ({}));
    return { ok: false, msg: `Save failed: ${err.message || putRes.status}` };

  } catch (e) {
    return { ok: false, msg: `Network error: ${e.message}` };
  }
}

/* -----------------------------------------------------------------
   PAGE INIT
----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {

  // ── Step 1: Render immediately from cache so page feels instant ──
  let appData = getCachedData();
  renderAll(appData);

  initNav();
  initCanvas();
  initStats();
  initScrollReveal();
  initCommunityGoal();

  // ── Step 2: Fetch fresh data from CDN in background ──
  const fresh = await fetchRemoteData();
  if (fresh) {
    setCachedData(fresh);
    // Re-render only if data actually changed
    if (JSON.stringify(fresh) !== JSON.stringify(appData)) {
      appData = fresh;
      renderAll(appData);
    }
  }

  // ── Step 3: Boot admin panel with current data ──
  initAdmin(appData);

  // ── Step 4: Open admin if URL hash is #admin ──
  if (window.location.hash === '#admin') {
    document.getElementById('admin-overlay')?.removeAttribute('hidden');
  }
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') {
      document.getElementById('admin-overlay')?.removeAttribute('hidden');
    }
  });
});

/** Re-renders all dynamic page sections. */
function renderAll(data) {
  renderBeers(data.beers, document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  renderFood(data.food);
  renderHours(data.hours);
  renderAnnouncement(data.announcement);
  highlightToday(data.hours);
}

/* -----------------------------------------------------------------
   NAV
----------------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('main-nav');
  const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.querySelector('.nav__hamburger');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('nav__links--open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        links.classList.remove('nav__links--open');
      })
    );
  }

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(s =>
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          document.querySelectorAll('.nav__links a[href^="#"]').forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === `#${s.id}`)
          );
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }).observe(s)
  );
}

/* -----------------------------------------------------------------
   CANVAS HEX PARTICLES
----------------------------------------------------------------- */
function initCanvas() {
  const canvas = document.getElementById('hex-particles');
  if (!canvas || window.innerWidth < 768 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const pts = Array.from({ length: 25 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 4 + Math.random() * 10,
    spd: 0.18 + Math.random() * 0.3,
    drift: (Math.random() - 0.5) * 0.18,
    a: 0.04 + Math.random() * 0.07,
    rot: Math.random() * Math.PI * 2,
    rotS: (Math.random() - 0.5) * 0.012,
    fill: Math.random() > 0.5,
  }));

  function hex(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
        : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
  }

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.y -= p.spd; p.x += p.drift; p.rot += p.rotS;
      if (p.y < -40) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -40) p.x = W + 10;
      if (p.x > W + 40) p.x = -10;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      hex(0, 0, p.r);
      ctx.strokeStyle = `rgba(240,192,32,${p.a})`; ctx.lineWidth = 1; ctx.stroke();
      if (p.fill) { hex(0, 0, p.r); ctx.fillStyle = `rgba(240,192,32,${p.a * 0.22})`; ctx.fill(); }
      ctx.restore();
    });
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });
}

/* -----------------------------------------------------------------
   STATS COUNTERS
----------------------------------------------------------------- */
function initStats() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target   = parseFloat(el.dataset.value);
      const start    = parseFloat(el.dataset.start ?? '0');
      const decimals = parseInt(el.dataset.decimals ?? '0', 10);
      const suffix   = el.dataset.suffix ?? '';
      const numEl    = el.querySelector('.stat__number');
      const t0 = performance.now();
      const dur = 2000;
      (function frame(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        numEl.textContent = (start + (target - start) * e).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat[data-value]').forEach(el => obs.observe(el));
}

/* -----------------------------------------------------------------
   BEER RENDERING
----------------------------------------------------------------- */
function buildBeerCard(beer, delay) {
  const card = document.createElement('article');
  card.className = 'beer-card' + (beer.available === false ? ' beer-card--unavailable' : '');
  card.dataset.category = beer.category;
  card.style.animationDelay = `${delay}ms`;
  card.setAttribute('role', 'listitem');

  let stats = '';
  if (beer.abv !== null && beer.abv !== undefined)
    stats += `<span><strong>${beer.abv === 0 ? 'Non-Alc' : `${beer.abv}% ABV`}</strong></span>`;
  if (beer.ibu)    stats += `<span>${beer.ibu} IBU</span>`;
  if (beer.rating) stats += `<span>★ <strong>${beer.rating}</strong> Untappd</span>`;
  if (beer.price)  stats += `<span class="beer-price"><strong>$${beer.price}</strong></span>`;

  card.innerHTML = `
    ${beer.award ? `<div class="beer-card__award">★ ${beer.award}</div>` : ''}
    <div class="beer-card__body">
      <h3 class="beer-card__name">${beer.name}</h3>
      <p class="beer-card__style">${beer.style}</p>
      ${stats ? `<div class="beer-card__stats">${stats}</div>` : ''}
      ${beer.desc ? `<p class="beer-card__desc">${beer.desc}</p>` : ''}
    </div>`;
  return card;
}

function renderBeers(beers, filter) {
  const grid = document.getElementById('beer-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = filter === 'all' ? beers : beers.filter(b => b.category === filter);
  list.forEach((b, i) => grid.appendChild(buildBeerCard(b, i * 35)));
}

function initBeerFilters(beers) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBeers(beers, btn.dataset.filter);
    });
  });
}

/* -----------------------------------------------------------------
   FOOD RENDERING
----------------------------------------------------------------- */
function renderFood(food) {
  const grid = document.getElementById('kitchen-grid');
  if (!grid) return;
  grid.innerHTML = '';
  food.filter(f => f.available !== false).forEach(item => {
    const el = document.createElement('div');
    el.className = 'kitchen-item';
    el.innerHTML = `
      <div class="kitchen-item__image">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="kitchen-item__body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          ${item.badge  ? `<span class="kitchen-item__badge badge--${item.badgeType || 'blue'}">${item.badge}</span>` : ''}
          ${item.price  ? `<span class="kitchen-item__badge badge--gold">$${item.price}</span>` : ''}
        </div>
      </div>`;
    grid.appendChild(el);
  });
}

/* -----------------------------------------------------------------
   HOURS RENDERING
----------------------------------------------------------------- */
function renderHours(hours) {
  const table = document.getElementById('hours-table');
  if (table) {
    table.innerHTML = '';
    hours.forEach(h => {
      const tr = document.createElement('tr');
      tr.dataset.day = h.day;
      if (!h.open) tr.classList.add('closed');
      tr.innerHTML = `<td>${h.day}</td><td>${h.hours}</td>`;
      table.appendChild(tr);
    });
  }
  const footerHours = document.getElementById('footer-hours');
  if (footerHours) {
    footerHours.innerHTML = hours.map(h =>
      `<p><strong>${h.day}:</strong> ${h.hours}</p>`
    ).join('');
  }
}

function highlightToday(hours) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];
  document.querySelector(`tr[data-day="${today}"]`)?.classList.add('today');
}

/* -----------------------------------------------------------------
   ANNOUNCEMENT BANNER
----------------------------------------------------------------- */
function renderAnnouncement(ann) {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  if (ann.active && ann.text) {
    // Build bar safely
    bar.textContent = ann.text;
    const btn = document.createElement('button');
    btn.className = 'announcement-bar__close';
    btn.innerHTML = '×';
    btn.setAttribute('aria-label', 'Close announcement');
    btn.addEventListener('click', () => bar.classList.add('hidden'));
    bar.appendChild(btn);
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}

/* -----------------------------------------------------------------
   SCROLL REVEAL
----------------------------------------------------------------- */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseInt(e.target.dataset.revealDelay || '0', 10);
      setTimeout(() => e.target.classList.add('is-visible'), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* -----------------------------------------------------------------
   COMMUNITY GOAL BAR
----------------------------------------------------------------- */
function initCommunityGoal() {
  const fill = document.querySelector('.goal-fill');
  if (!fill) return;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) fill.style.width = fill.dataset.progress || '65%';
    });
  }, { threshold: 0.5 }).observe(fill);
}

/* =================================================================
   ADMIN PANEL
   ================================================================= */
function initAdmin(appData) {
  const overlay = document.getElementById('admin-overlay');
  if (!overlay) return;

  let data = JSON.parse(JSON.stringify(appData)); // deep clone
  let authenticated = false;

  /* ── Open/close ── */
  // Footer staff link
  document.querySelectorAll('[data-admin-open]').forEach(el =>
    el.addEventListener('click', e => {
      e.preventDefault();
      overlay.removeAttribute('hidden');
      authenticated ? showAdminView() : showLoginView();
    })
  );
  overlay.addEventListener('click', e => { if (e.target === overlay) closeAdmin(); });
  document.getElementById('admin-close')?.addEventListener('click', closeAdmin);

  function closeAdmin() {
    overlay.setAttribute('hidden', '');
    // Clear #admin from URL without page reload
    history.replaceState(null, '', window.location.pathname);
  }

  /* ── Views ── */
  function showLoginView() {
    const panel = document.querySelector('.admin-panel');
    panel.classList.add('admin-panel--login');
    document.querySelector('.admin-login').style.display = 'flex';
    document.querySelector('.admin-content').style.display = 'none';
    document.querySelector('.admin-tabs').style.display = 'none';
  }
  function showAdminView() {
    const panel = document.querySelector('.admin-panel');
    panel.classList.remove('admin-panel--login');
    document.querySelector('.admin-login').style.display = 'none';
    document.querySelector('.admin-content').style.display = 'block';
    document.querySelector('.admin-tabs').style.display = 'flex';
    renderAdminBeers();
    renderAdminFood();
    renderAdminHours();
    renderAdminAnnouncement();
    renderAdminSettings();
  }

  /* ── Login ── */
  document.getElementById('admin-login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('admin-password-input').value;
    const err = document.querySelector('.admin-login__error');
    if (pw === ADMIN_PASSWORD) {
      authenticated = true;
      err.classList.remove('show');
      showAdminView();
    } else {
      err.classList.add('show');
      document.getElementById('admin-password-input').value = '';
    }
  });

  /* ── Tabs ── */
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      document.getElementById(`admin-panel-${tab.dataset.tab}`)?.classList.add('active');
    });
  });

  /* ---------------------------------------------------------------
     HELPER: save data to GitHub + update local cache
  --------------------------------------------------------------- */
  async function save(msg) {
    showToast('Saving…', 'info');
    setCachedData(data);
    const result = await pushToGitHub(data);
    if (result.ok) {
      renderAll(data); // update visible page immediately
      initBeerFilters(data.beers);
      showToast(result.msg, 'success');
    } else {
      showToast(result.msg, 'error');
    }
  }

  /* ---------------------------------------------------------------
     BEERS TAB
  --------------------------------------------------------------- */
  function renderAdminBeers() {
    const list = document.getElementById('admin-beer-list');
    if (!list) return;
    list.innerHTML = '';
    data.beers.forEach((beer, idx) => {
      const row = document.createElement('div');
      row.innerHTML = `
        <div class="admin-beer-row" data-idx="${idx}">
          <div class="admin-beer-row__info">
            <div class="admin-beer-row__name">${beer.name}</div>
            <div class="admin-beer-row__style">${beer.style}${beer.abv != null ? ` · ${beer.abv === 0 ? 'Non-Alc' : beer.abv + '% ABV'}` : ''}${beer.price ? ` · $${beer.price}` : ''}</div>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            ${!beer.available ? '<span style="font-family:var(--font-mono);font-size:0.6rem;color:#C02020;background:#FEE2E2;padding:0.2rem 0.5rem;border-radius:10px;">Off Tap</span>' : ''}
            <div class="admin-beer-row__toggle">▼</div>
          </div>
        </div>
        <div class="admin-beer-edit-form" data-form-idx="${idx}">
          ${beerFormHtml(beer, idx)}
        </div>`;
      list.appendChild(row);

      row.querySelector('.admin-beer-row').addEventListener('click', () => {
        const form = row.querySelector('.admin-beer-edit-form');
        const isOpen = form.classList.contains('open');
        list.querySelectorAll('.admin-beer-edit-form.open, .admin-beer-row.open')
            .forEach(el => el.classList.remove('open'));
        if (!isOpen) {
          form.classList.add('open');
          row.querySelector('.admin-beer-row').classList.add('open');
        }
      });

      row.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const i  = parseInt(e.target.dataset.beerIdx, 10);
        data.beers[i] = {
          ...data.beers[i],
          name:      fd.get('name'),
          style:     fd.get('style'),
          abv:       fd.get('abv')   !== '' ? parseFloat(fd.get('abv'))   : null,
          price:     fd.get('price') !== '' ? parseFloat(fd.get('price')) : null,
          desc:      fd.get('desc'),
          available: fd.has('available'),
        };
        await save();
        row.querySelector('.admin-beer-edit-form').classList.remove('open');
        row.querySelector('.admin-beer-row').classList.remove('open');
        renderAdminBeers();
      });

      row.querySelector('.admin-btn--danger')?.addEventListener('click', async () => {
        if (confirm(`Remove "${beer.name}" from the menu?`)) {
          data.beers.splice(idx, 1);
          await save();
          renderAdminBeers();
        }
      });
    });
  }

  function beerFormHtml(beer, idx) {
    return `
      <form data-beer-idx="${idx}">
        <div class="admin-form-grid">
          <div class="admin-form-group">
            <label>Beer Name</label>
            <input type="text" name="name" value="${esc(beer.name)}" required>
          </div>
          <div class="admin-form-group">
            <label>Style</label>
            <input type="text" name="style" value="${esc(beer.style)}">
          </div>
          <div class="admin-form-group">
            <label>ABV %</label>
            <input type="number" name="abv" step="0.1" min="0" max="20" value="${beer.abv ?? ''}">
          </div>
          <div class="admin-form-group">
            <label>Price ($)</label>
            <input type="number" name="price" step="0.25" min="0" value="${beer.price ?? ''}">
          </div>
          <div class="admin-form-group full">
            <label>Description</label>
            <textarea name="desc">${esc(beer.desc || '')}</textarea>
          </div>
        </div>
        <div class="admin-form-actions">
          <div class="admin-avail-toggle">
            <input type="checkbox" name="available" id="avail-${idx}" ${beer.available !== false ? 'checked' : ''}>
            <label for="avail-${idx}">Available on tap</label>
          </div>
          <div class="admin-form-actions-right">
            <button type="button" class="admin-btn admin-btn--danger">Remove</button>
            <button type="submit" class="admin-btn admin-btn--primary">Save Changes</button>
          </div>
        </div>
      </form>`;
  }

  document.getElementById('admin-add-beer')?.addEventListener('click', async () => {
    const newBeer = { id: Date.now(), name: 'New Beer', style: '', abv: null, ibu: null,
      rating: null, price: null, category: 'hoppy', award: null, available: true, desc: '' };
    data.beers.push(newBeer);
    await save();
    renderAdminBeers();
    const rows = document.querySelectorAll('.admin-beer-row');
    rows[rows.length - 1]?.click();
    rows[rows.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ---------------------------------------------------------------
     FOOD TAB
  --------------------------------------------------------------- */
  function renderAdminFood() {
    const list = document.getElementById('admin-food-list');
    if (!list) return;
    list.innerHTML = '';
    data.food.forEach((item, idx) => {
      const row = document.createElement('div');
      row.innerHTML = `
        <div class="admin-beer-row" data-idx="${idx}">
          <div class="admin-beer-row__info">
            <div class="admin-beer-row__name">${item.name}</div>
            <div class="admin-beer-row__style">${item.badge || ''}${item.price ? ` · $${item.price}` : ''}</div>
          </div>
          <div class="admin-beer-row__toggle">▼</div>
        </div>
        <div class="admin-beer-edit-form" data-form-idx="${idx}">
          <form data-food-idx="${idx}">
            <div class="admin-form-grid">
              <div class="admin-form-group"><label>Name</label><input type="text" name="name" value="${esc(item.name)}" required></div>
              <div class="admin-form-group"><label>Price ($)</label><input type="number" name="price" step="0.25" min="0" value="${item.price ?? ''}"></div>
              <div class="admin-form-group full"><label>Description</label><textarea name="desc">${esc(item.desc || '')}</textarea></div>
              <div class="admin-form-group"><label>Badge Text</label><input type="text" name="badge" value="${esc(item.badge || '')}"></div>
              <div class="admin-form-group"><label>Image URL</label><input type="url" name="img" value="${esc(item.img || '')}"></div>
            </div>
            <div class="admin-form-actions">
              <div class="admin-avail-toggle">
                <input type="checkbox" name="available" id="food-avail-${idx}" ${item.available !== false ? 'checked' : ''}>
                <label for="food-avail-${idx}">Show on menu</label>
              </div>
              <div class="admin-form-actions-right">
                <button type="submit" class="admin-btn admin-btn--primary">Save</button>
              </div>
            </div>
          </form>
        </div>`;
      list.appendChild(row);
      row.querySelector('.admin-beer-row').addEventListener('click', () => {
        const form = row.querySelector('.admin-beer-edit-form');
        const open = form.classList.contains('open');
        list.querySelectorAll('.admin-beer-edit-form.open,.admin-beer-row.open').forEach(el => el.classList.remove('open'));
        if (!open) { form.classList.add('open'); row.querySelector('.admin-beer-row').classList.add('open'); }
      });
      row.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault();
        const fd   = new FormData(e.target);
        const idx2 = parseInt(e.target.dataset.foodIdx, 10);
        data.food[idx2] = { ...data.food[idx2],
          name: fd.get('name'), price: fd.get('price') || null,
          desc: fd.get('desc'), badge: fd.get('badge'),
          img: fd.get('img'), available: fd.has('available') };
        await save();
        row.querySelector('.admin-beer-edit-form').classList.remove('open');
        row.querySelector('.admin-beer-row').classList.remove('open');
        renderAdminFood();
      });
    });
  }

  /* ---------------------------------------------------------------
     HOURS TAB
  --------------------------------------------------------------- */
  function renderAdminHours() {
    const container = document.getElementById('admin-hours-list');
    if (!container) return;
    container.innerHTML = '';
    data.hours.forEach((h, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-hours-row';
      row.innerHTML = `
        <label>${h.day}</label>
        <input type="text" class="admin-hours-input" data-idx="${idx}" value="${esc(h.hours)}" placeholder="e.g. 3:00 – 9:00 PM">
        <div class="admin-avail-toggle">
          <input type="checkbox" class="admin-hours-open" data-idx="${idx}" id="hours-open-${idx}" ${h.open ? 'checked' : ''}>
          <label for="hours-open-${idx}">Open</label>
        </div>`;
      container.appendChild(row);
    });

    // Replace save button listener each render
    const saveBtn = document.getElementById('admin-save-hours');
    const newBtn  = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newBtn, saveBtn);
    newBtn.addEventListener('click', async () => {
      container.querySelectorAll('.admin-hours-input').forEach(input => {
        data.hours[parseInt(input.dataset.idx, 10)].hours = input.value;
      });
      container.querySelectorAll('.admin-hours-open').forEach(cb => {
        data.hours[parseInt(cb.dataset.idx, 10)].open = cb.checked;
      });
      await save();
    });
  }

  /* ---------------------------------------------------------------
     ANNOUNCEMENT TAB
  --------------------------------------------------------------- */
  function renderAdminAnnouncement() {
    const textarea = document.getElementById('admin-announce-text');
    const checkbox = document.getElementById('admin-announce-active');
    if (textarea) textarea.value = data.announcement.text || '';
    if (checkbox) checkbox.checked = data.announcement.active;

    const saveBtn = document.getElementById('admin-save-announce');
    const newBtn  = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newBtn, saveBtn);
    newBtn.addEventListener('click', async () => {
      data.announcement = { text: textarea.value, active: checkbox.checked };
      await save();
    });
  }

  /* ---------------------------------------------------------------
     SYNC / SETTINGS TAB
  --------------------------------------------------------------- */
  function renderAdminSettings() {
    const input   = document.getElementById('admin-gh-token-input');
    const saveBtn = document.getElementById('admin-save-token');
    const testBtn = document.getElementById('admin-test-sync');
    if (!input) return;

    // Pre-fill with stored token (masked)
    const stored = localStorage.getItem(GH_TOKEN_KEY) || '';
    input.value  = stored ? stored : '';

    const saveH = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(saveH, saveBtn);
    saveH.addEventListener('click', () => {
      const val = input.value.trim();
      if (val) {
        localStorage.setItem(GH_TOKEN_KEY, val);
        showToast('Token saved on this device.', 'success');
      } else {
        localStorage.removeItem(GH_TOKEN_KEY);
        showToast('Token removed.', 'info');
      }
    });

    const testH = testBtn.cloneNode(true);
    testBtn.parentNode.replaceChild(testH, testBtn);
    testH.addEventListener('click', async () => {
      showToast('Testing connection…', 'info');
      const token = localStorage.getItem(GH_TOKEN_KEY);
      if (!token) { showToast('No token saved yet.', 'error'); return; }
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) showToast('✓ Connection works! GitHub is ready.', 'success');
        else        showToast(`Connection failed (${res.status}). Check your token.`, 'error');
      } catch {
        showToast('Network error. Check your internet connection.', 'error');
      }
    });
  }
}

/* -----------------------------------------------------------------
   TOAST NOTIFICATION
----------------------------------------------------------------- */
function showToast(msg, type = 'success') {
  document.querySelector('.admin-toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'admin-toast admin-toast--' + type;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.35s';
    setTimeout(() => toast.remove(), 380);
  }, type === 'error' ? 5000 : 3000);
}

/* -----------------------------------------------------------------
   UTILITY
----------------------------------------------------------------- */
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
