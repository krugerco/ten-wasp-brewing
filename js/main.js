/* =================================================================
   TEN WASP BREWING COMPANY — main.js
   Admin CMS + Page interactions
   ================================================================= */

/* -----------------------------------------------------------------
   DATA DEFAULTS
----------------------------------------------------------------- */
const DEFAULT_BEERS = [
  { id: 1, name: 'Synthwave Portal', style: 'NEIPA', abv: null, ibu: null, rating: 4.42, price: null, category: 'hoppy', award: null, available: true, desc: 'The highest-rated pour in the hive. Neon-soaked tropical haze. Riwaka, Citra, Nectaron.' },
  { id: 2, name: "Wendy's a Lifeguard", style: 'NEIPA', abv: null, ibu: null, rating: null, price: null, category: 'hoppy', award: "Iowa's Best Beer 2025", available: true, desc: 'Lush mango, passionfruit, citrus bliss. Simcoe, Vic Secret, Mosaic, Citra.' },
  { id: 3, name: 'Cake Eater', style: 'Imperial Pastry Stout', abv: 14, ibu: null, rating: null, price: null, category: 'dark-malty', award: "Iowa's Best Beer 2025", available: true, desc: 'Award-winning decadence. Pecans, coconut, cocoa nibs, vanilla beans.' },
  { id: 4, name: 'Flying V', style: 'Imperial Hazy IPA', abv: 8.2, ibu: null, rating: null, price: null, category: 'hoppy', award: null, available: true, desc: 'Big, bold, unapologetic. Full-throttle hazy for the adventurous.' },
  { id: 5, name: "Look Ma, We're On Tap", style: 'Double NEIPA', abv: 8.3, ibu: null, rating: 4.35, price: null, category: 'hoppy', award: null, available: true, desc: 'DDH Citra, Riwaka, Vic Secret — tropical citrus piled sky high.' },
  { id: 6, name: 'Strata in the Whirlpool', style: 'NEIPA', abv: 7.4, ibu: 35, rating: 4.32, price: null, category: 'hoppy', award: null, available: true, desc: 'Strata, Citra, Riwaka. Citrus with a whisper of raspberry.' },
  { id: 7, name: 'Midlife Crisis', style: 'Red IPA', abv: 7.7, ibu: null, rating: null, price: null, category: 'hoppy', award: null, available: true, desc: 'Bold ruby-red IPA with caramel backbone and assertive hop character.' },
  { id: 8, name: "Droppin' Hops", style: 'Hazy Pale Ale', abv: 5.2, ibu: null, rating: 4.14, price: null, category: 'hoppy', award: null, available: true, desc: 'Sessionable haze. Citra, Krush, Cashmere, Motueka.' },
  { id: 9, name: 'Cassville', style: 'Cream Ale', abv: 4.8, ibu: 10, rating: 3.95, price: null, category: 'lil-crushers', award: null, available: true, desc: 'Smooth, clean, crushable. The perfect pint for any occasion.' },
  { id: 10, name: "Norwegian A'Peel", style: 'Witbier', abv: 5.8, ibu: 14, rating: 3.95, price: null, category: 'lil-crushers', award: null, available: true, desc: 'Belgian-style wit with orange peel, coriander, Norwegian kveik yeast.' },
  { id: 11, name: "Pub Thumpin'", style: 'Dark Mild', abv: 3.4, ibu: null, rating: null, price: null, category: 'lil-crushers', award: null, available: true, desc: 'Low ABV, big flavor. A proper session ale in the British tradition.' },
  { id: 12, name: "Peelin' Cute", style: 'Pastry Stout', abv: 12, ibu: null, rating: null, price: null, category: 'dark-malty', award: null, available: true, desc: 'Rich, velvety, dangerously drinkable. A dessert in a glass.' },
  { id: 13, name: 'Guava the Nut', style: 'Fruited Sour', abv: 5.4, ibu: null, rating: 4.35, price: null, category: 'sours', award: null, available: true, desc: 'Pink guava and coconut. Creamy, floral, and utterly tropical.' },
  { id: 14, name: 'Berry Boo v2', style: 'Fruited Sour', abv: 5.8, ibu: null, rating: null, price: null, category: 'sours', award: null, available: true, desc: 'Blackberry and raspberry — bright, jammy, intensely berry.' },
  { id: 15, name: 'Electric Shonk', style: 'Fruited Sour', abv: 4.0, ibu: 3, rating: 3.99, price: null, category: 'sours', award: null, available: true, desc: 'Mango and pineapple — electric tropical sunshine in a glass.' },
  { id: 16, name: 'Surfer Girl', style: 'Fruited Sour', abv: 4.0, ibu: null, rating: null, price: null, category: 'sours', award: null, available: true, desc: 'Ride the sour wave. Fruit-forward and easy to love.' },
  { id: 17, name: 'Root 93', style: 'House Root Beer', abv: 0, ibu: null, rating: null, price: null, category: 'non-alc', award: null, available: true, desc: 'Homemade root beer — two varieties brewed in-house. "Definitely worth trying."' },
  { id: 18, name: 'Orange Cream Soda', style: 'House Soda', abv: 0, ibu: null, rating: null, price: null, category: 'non-alc', award: null, available: true, desc: 'Smooth, creamy, dreamy. Made right here at Ten Wasp.' },
  { id: 19, name: 'Ginger Ale', style: 'House Soda', abv: 0, ibu: null, rating: null, price: null, category: 'non-alc', award: null, available: true, desc: 'House-made ginger ale with real ginger character.' },
  { id: 20, name: 'Hop Water', style: 'Hop Water', abv: 0, ibu: null, rating: null, price: null, category: 'non-alc', award: null, available: true, desc: "All the aroma of craft hops, zero alcohol. The designated driver's best friend." },
];

const DEFAULT_FOOD = [
  { id: 1, name: 'Homemade Pizza', desc: 'Fresh-made rotating varieties. Gluten-free option available.', badge: 'Fri & Sun Only', badgeType: 'coral', available: true, price: null, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Stinger Sticks', desc: 'House-made bread sticks served as cheese bread or dessert bread.', badge: 'Fan Favorite', badgeType: 'gold', available: true, price: null, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Bavarian Pretzels', desc: 'Warm, golden, house-made Bavarian pretzels with dipping sauce.', badge: 'Pair with Beer', badgeType: 'blue', available: true, price: null, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Soda Floats', desc: 'House-made sodas topped with premium ice cream. A Ten Wasp signature.', badge: 'All Ages', badgeType: 'blue', available: true, price: null, img: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80' },
];

const DEFAULT_HOURS = [
  { day: 'Wednesday', hours: '3:00 – 9:00 PM', open: true },
  { day: 'Thursday',  hours: '3:00 – 9:00 PM', open: true },
  { day: 'Friday',    hours: '12:00 – 9:00 PM', open: true },
  { day: 'Saturday',  hours: '12:00 – 9:00 PM', open: true },
  { day: 'Sunday',    hours: '12:00 – 8:00 PM', open: true },
  { day: 'Monday',    hours: 'Closed', open: false },
  { day: 'Tuesday',   hours: 'Closed', open: false },
];

const DEFAULT_ANNOUNCEMENT = { text: '', active: false };

/* -----------------------------------------------------------------
   STORAGE
----------------------------------------------------------------- */
const STORAGE_KEY = 'tenwasp_data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getData() {
  const saved = loadData();
  return {
    beers:        saved?.beers        ?? DEFAULT_BEERS,
    food:         saved?.food         ?? DEFAULT_FOOD,
    hours:        saved?.hours        ?? DEFAULT_HOURS,
    announcement: saved?.announcement ?? DEFAULT_ANNOUNCEMENT,
  };
}

/* -----------------------------------------------------------------
   PAGE INIT
----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const appData = getData();

  initNav();
  initCanvas();
  initStats();
  renderBeers(appData.beers, 'all');
  renderFood(appData.food);
  renderHours(appData.hours);
  renderAnnouncement(appData.announcement);
  initBeerFilters(appData.beers);
  initScrollReveal();
  initCommunityGoal();
  initAdmin(appData);
  highlightToday(appData.hours);
});

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
  const sections  = document.querySelectorAll('section[id]');
  const navAs     = document.querySelectorAll('.nav__links a[href^="#"]');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }).observe
    ? sections.forEach(s =>
        new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting)
              navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${s.id}`));
          });
        }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }).observe(s)
      )
    : null;
}

/* -----------------------------------------------------------------
   CANVAS HEX PARTICLES
----------------------------------------------------------------- */
function initCanvas() {
  const canvas = document.getElementById('hex-particles');
  if (!canvas || window.innerWidth < 768 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth / 2;
  let H = canvas.height = window.innerHeight;

  const pts = Array.from({ length: 22 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 5 + Math.random() * 10, spd: 0.2 + Math.random() * 0.35,
    drift: (Math.random() - 0.5) * 0.2,
    a: 0.04 + Math.random() * 0.08,
    rot: Math.random() * Math.PI * 2, rotS: (Math.random() - 0.5) * 0.015,
    fill: Math.random() > 0.45,
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

  function tick() {
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
      if (p.fill) { hex(0, 0, p.r); ctx.fillStyle = `rgba(240,192,32,${p.a * 0.25})`; ctx.fill(); }
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth / 2; H = canvas.height = window.innerHeight; }, { passive: true });
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
      function frame(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        numEl.textContent = (start + (target - start) * e).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
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

  let awardHtml = beer.award ? `<div class="beer-card__award">★ ${beer.award}</div>` : '';

  let stats = '';
  if (beer.abv !== null && beer.abv !== undefined) {
    stats += `<span><strong>${beer.abv === 0 ? 'Non-Alc' : `${beer.abv}% ABV`}</strong></span>`;
  }
  if (beer.ibu) stats += `<span>${beer.ibu} IBU</span>`;
  if (beer.rating) stats += `<span>★ <strong>${beer.rating}</strong> Untappd</span>`;
  if (beer.price) stats += `<span class="beer-price"><strong>$${beer.price}</strong></span>`;

  card.innerHTML = `
    <div class="beer-card__accent"></div>
    ${awardHtml}
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
          ${item.badge ? `<span class="kitchen-item__badge badge--${item.badgeType || 'blue'}">${item.badge}</span>` : ''}
          ${item.price ? `<span class="kitchen-item__badge badge--gold">$${item.price}</span>` : ''}
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
  if (!table) return;
  table.innerHTML = '';
  hours.forEach(h => {
    const tr = document.createElement('tr');
    tr.dataset.day = h.day;
    if (!h.open) tr.classList.add('closed');
    tr.innerHTML = `<td>${h.day}</td><td>${h.hours}</td>`;
    table.appendChild(tr);
  });
  // Footer hours
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
  const row = document.querySelector(`tr[data-day="${today}"]`);
  if (row) row.classList.add('today');
}

/* -----------------------------------------------------------------
   ANNOUNCEMENT BANNER
----------------------------------------------------------------- */
function renderAnnouncement(ann) {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  if (ann.active && ann.text) {
    bar.textContent = ann.text;
    // Re-add close button
    const btn = document.createElement('button');
    btn.className = 'announcement-bar__close';
    btn.innerHTML = '×';
    btn.setAttribute('aria-label', 'Close announcement');
    btn.addEventListener('click', () => bar.classList.add('hidden'));
    bar.appendChild(btn);
    bar.classList.remove('hidden');
    document.documentElement.style.setProperty('--nav-offset', '0px');
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
      if (e.isIntersecting) { fill.style.width = fill.dataset.progress || '65%'; }
    });
  }, { threshold: 0.5 }).observe(fill);
}

/* =================================================================
   ADMIN PANEL
   ================================================================= */
const ADMIN_PASSWORD = 'wasp2024';

function initAdmin(appData) {
  const trigger = document.getElementById('admin-trigger');
  const overlay = document.getElementById('admin-overlay');
  if (!trigger || !overlay) return;

  let data = { ...appData };  // working copy
  let authenticated = false;

  // Open/close
  trigger.addEventListener('click', () => {
    overlay.removeAttribute('hidden');
    if (!authenticated) showLoginView();
    else showAdminView();
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeAdmin();
  });
  document.getElementById('admin-close')?.addEventListener('click', closeAdmin);

  function closeAdmin() { overlay.setAttribute('hidden', ''); }

  // ----- Login -----
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
  }

  const loginForm = document.getElementById('admin-login-form');
  loginForm?.addEventListener('submit', e => {
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

  // ----- Tabs -----
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`admin-panel-${tab.dataset.tab}`)?.classList.add('active');
    });
  });

  /* -- BEERS -- */
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

      // Toggle
      row.querySelector('.admin-beer-row').addEventListener('click', () => {
        const form = row.querySelector('.admin-beer-edit-form');
        const isOpen = form.classList.contains('open');
        list.querySelectorAll('.admin-beer-edit-form.open, .admin-beer-row.open')
            .forEach(el => el.classList.remove('open'));
        if (!isOpen) { form.classList.add('open'); row.querySelector('.admin-beer-row').classList.add('open'); }
      });

      // Save
      row.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const idx2 = parseInt(e.target.dataset.beerIdx, 10);
        data.beers[idx2] = {
          ...data.beers[idx2],
          name:      fd.get('name'),
          style:     fd.get('style'),
          abv:       fd.get('abv') !== '' ? parseFloat(fd.get('abv')) : null,
          price:     fd.get('price') !== '' ? parseFloat(fd.get('price')) : null,
          desc:      fd.get('desc'),
          available: fd.has('available'),
        };
        saveData(data);
        renderBeers(data.beers, document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
        row.querySelector('.admin-beer-edit-form').classList.remove('open');
        row.querySelector('.admin-beer-row').classList.remove('open');
        renderAdminBeers();
        showToast('Beer updated!');
      });

      // Delete
      row.querySelector('.admin-btn--danger')?.addEventListener('click', () => {
        if (confirm(`Remove "${beer.name}" from the menu?`)) {
          data.beers.splice(idx, 1);
          saveData(data);
          renderBeers(data.beers, document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
          renderAdminBeers();
          showToast('Beer removed.');
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

  // Add beer
  document.getElementById('admin-add-beer')?.addEventListener('click', () => {
    const newBeer = {
      id: Date.now(), name: 'New Beer', style: '', abv: null, ibu: null,
      rating: null, price: null, category: 'hoppy', award: null,
      available: true, desc: '',
    };
    data.beers.push(newBeer);
    saveData(data);
    renderAdminBeers();
    renderBeers(data.beers, 'all');
    // Scroll to last row and open it
    const rows = document.querySelectorAll('.admin-beer-row');
    rows[rows.length - 1]?.click();
    rows[rows.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* -- FOOD -- */
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
      row.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const idx2 = parseInt(e.target.dataset.foodIdx, 10);
        data.food[idx2] = { ...data.food[idx2], name: fd.get('name'), price: fd.get('price') || null, desc: fd.get('desc'), badge: fd.get('badge'), img: fd.get('img'), available: fd.has('available') };
        saveData(data);
        renderFood(data.food);
        row.querySelector('.admin-beer-edit-form').classList.remove('open');
        row.querySelector('.admin-beer-row').classList.remove('open');
        renderAdminFood();
        showToast('Food item updated!');
      });
    });
  }

  /* -- HOURS -- */
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
    document.getElementById('admin-save-hours')?.addEventListener('click', () => {
      container.querySelectorAll('.admin-hours-input').forEach(input => {
        const i = parseInt(input.dataset.idx, 10);
        data.hours[i].hours = input.value;
      });
      container.querySelectorAll('.admin-hours-open').forEach(cb => {
        const i = parseInt(cb.dataset.idx, 10);
        data.hours[i].open = cb.checked;
      });
      saveData(data);
      renderHours(data.hours);
      highlightToday(data.hours);
      showToast('Hours saved!');
    }, { once: true });
    // Re-attach after re-render (simple approach: just call again)
  }

  /* -- ANNOUNCEMENT -- */
  function renderAdminAnnouncement() {
    const textarea = document.getElementById('admin-announce-text');
    const checkbox = document.getElementById('admin-announce-active');
    if (textarea) textarea.value = data.announcement.text || '';
    if (checkbox) checkbox.checked = data.announcement.active;
    document.getElementById('admin-save-announce')?.addEventListener('click', () => {
      data.announcement = { text: textarea.value, active: checkbox.checked };
      saveData(data);
      renderAnnouncement(data.announcement);
      showToast('Announcement saved!');
    }, { once: true });
  }

  // Re-bind hours + announce save buttons after each open
  document.getElementById('admin-trigger').addEventListener('click', () => {
    if (authenticated) {
      setTimeout(() => {
        renderAdminHours();
        renderAdminAnnouncement();
      }, 50);
    }
  });
}

/* -----------------------------------------------------------------
   TOAST NOTIFICATION
----------------------------------------------------------------- */
function showToast(msg) {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:5rem; right:2rem; z-index:99999;
    background:var(--blue); color:var(--white);
    font-family:var(--font-display); font-size:0.75rem; letter-spacing:0.1em;
    padding:0.75rem 1.5rem; border-radius:4px;
    border-left:4px solid var(--gold);
    box-shadow:0 8px 24px rgba(0,0,0,0.25);
    animation: fade-up 0.3s ease both;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 350); }, 2500);
}

/* -----------------------------------------------------------------
   UTILITY
----------------------------------------------------------------- */
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
