/* Shared site behaviour: toast, theme, menu, scroll reveal, brush hero */
{
  /* ---------- Toast + "coming soon" links ---------- */
  const toast = document.getElementById('toast'); let tt;
  window.btToast = msg => { if (!toast) return; toast.textContent = msg; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 2200); };
  document.addEventListener('click', e => { const c = e.target.closest('[data-soon]'); if (c) { e.preventDefault(); btToast('Case study coming soon'); } });

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  document.getElementById('theme')?.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t; try { localStorage.setItem('bt-theme', t); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  const menu = document.getElementById('menu'), links = document.getElementById('links');
  menu?.addEventListener('click', () => { const o = links.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });
  links?.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });
}

/* ---------- Scroll reveal for project cards ---------- */
{
  const grid = document.getElementById('grid');
  if (grid) {
  /* Scroll reveal: cards fade up and unmask as they enter; a row's 2nd card follows the 1st */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal');
    const cards = [...grid.querySelectorAll('.card')];
    const revealer = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target, cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        el.style.setProperty('--d', (cards.indexOf(el) % cols) * 0.14 + 's');
        el.classList.add('in'); revealer.unobserve(el);
        // drop the delay after it lands so hover stays snappy
        setTimeout(() => el.style.removeProperty('--d'), 1600);
      }
    }, {threshold: 0.02, rootMargin: '0px 0px 40px 0px'});
    cards.forEach(c => revealer.observe(c));
  }
  }
}

/* ---------- Brush hero (any page with <canvas id="brush">) ---------- */
(() => {
  if (!document.getElementById('brush')) return;
  /* ---------- Brush hero ----------
     A soft brush head glides after the pointer (eased), laying down a continuous,
     fading trail behind the name. Colour blends to the next project colour on each new stroke.
     With no pointer (touch, or idle), the brush wanders on its own. */
  const cvs = document.getElementById('brush'), ctx = cvs.getContext('2d');
  const stage = document.getElementById('stage'), hero = document.getElementById('top');
  const COLORS = ['#F2602F', '#5B5CF0', '#8FD16A', '#00A394', '#FFB23E', '#F58C62'].map(h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16)));
  const LIFE = 1600;            // ms a dab lives
  const FOLLOW = 5.5;           // higher = brush catches the cursor faster
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dabs = [], W = 0, H = 0, dpr = 1, raf = 0;
  let target = null, head = null, prevHead = null, lastPointer = 0, idle = true, t0 = performance.now(), prevT = 0;
  let ci = 0, col = COLORS[0].slice(), autoSeg = -1, size = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cvs.getBoundingClientRect(); W = r.width; H = r.height;
    cvs.width = W * dpr; cvs.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ro = new ResizeObserver(resize); ro.observe(cvs);
  const baseR = () => Math.max(56, Math.min(W, 1600) * 0.085);
  const nextColor = () => { ci = (ci + 1) % COLORS.length; };
  const ease = a => a * a * (3 - 2 * a);      // smoothstep fade

  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = cvs.getBoundingClientRect(), now = performance.now();
    if (e.clientY < r.top || e.clientY > r.bottom) return;      // only inside the hero band
    if (idle || now - lastPointer > 600) nextColor();   // new stroke → next colour
    idle = false; lastPointer = now;
    target = {x: e.clientX - r.left, y: e.clientY - r.top};
  });
  hero.addEventListener('pointerleave', () => { lastPointer = performance.now(); });

  const frame = now => {
    if (!W) { raf = requestAnimationFrame(frame); return; }   // wait for first layout
    const dt = Math.min(0.05, (now - (prevT || now)) / 1000); prevT = now;
    if (!idle && now - lastPointer > 3000) { idle = true; }
    if (idle) {                                  // gentle autonomous path
      const k = (now - t0) / 1000;
      // wander around the big title (the .stage), so it never drifts under body text
      const cr = cvs.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const sy = sr.top - cr.top + sr.height * 0.55, amp = sr.height * 0.22;
      target = {x: W * (0.5 + 0.3 * Math.sin(k * 0.45) + 0.05 * Math.sin(k * 1.3)), y: sy + amp * Math.sin(k * 0.7 + 1)};
      const seg = Math.floor(k / 5); if (seg !== autoSeg) { autoSeg = seg; nextColor(); }
    }
    if (target) {
      if (!head) { head = {...target}; prevHead = {...target}; }
      const f = 1 - Math.exp(-FOLLOW * dt);      // frame-rate independent easing
      head.x += (target.x - head.x) * f; head.y += (target.y - head.y) * f;
      // colour glides toward the stroke colour
      const cf = 1 - Math.exp(-3 * dt), tc = COLORS[ci];
      for (let i = 0; i < 3; i++) col[i] += (tc[i] - col[i]) * cf;
      // brush swells slightly with speed, then settles
      const speed = Math.hypot(head.x - prevHead.x, head.y - prevHead.y) / Math.max(dt, 1e-3);
      const want = baseR() * (0.85 + Math.min(speed / 1800, 0.35));
      size += (want - size) * (1 - Math.exp(-6 * dt));
      // fill the gap between last and current head so the trail is continuous
      const d = Math.hypot(head.x - prevHead.x, head.y - prevHead.y), n = Math.max(1, Math.ceil(d / 6));
      const c = `rgb(${col.map(Math.round).join(',')})`;
      if (d > 0.3 || !idle) for (let i = 1; i <= n; i++) dabs.push({x: prevHead.x + (head.x - prevHead.x) * i / n, y: prevHead.y + (head.y - prevHead.y) * i / n, t: now - (n - i) * dt * 1000 / n, r: size, c});
      prevHead = {...head};
    }
    ctx.clearRect(0, 0, W, H);
    dabs = dabs.filter(d => now - d.t < LIFE);
    for (const d of dabs) {
      const a = ease(1 - (now - d.t) / LIFE);
      ctx.globalAlpha = a;
      ctx.fillStyle = d.c;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r * (0.4 + 0.6 * a), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };

  if (reduce) {                                  // one still blob, no animation
    requestAnimationFrame(() => { resize(); ctx.fillStyle = '#F2602F'; ctx.globalAlpha = .9;
      ctx.beginPath(); ctx.ellipse(W * .62, H * .62, W * .2, H * .2, -.2, 0, Math.PI * 2); ctx.fill(); });
  } else {
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (!raf) { prevT = 0; raf = requestAnimationFrame(frame); } }
      else { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(stage);
  }
})();
