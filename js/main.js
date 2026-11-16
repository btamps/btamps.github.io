(function () {
  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.nav')) setMenu(false); });
    window.matchMedia('(min-width:700px)').addEventListener('change', function () { setMenu(false); });
  }

  /* Nav: static at top; slides in as a sticky bar when scrolling up mid-page */
  var slot = document.querySelector('.nav-slot');
  var bar = slot && slot.querySelector('.nav-wrap');
  if (bar) {
    var lastY = window.scrollY, ticking = false, fixed = false;
    function showBar() {
      if (fixed) return;
      fixed = true;
      slot.style.height = slot.offsetHeight + 'px';
      bar.classList.remove('is-leaving');
      bar.classList.add('is-fixed');
    }
    function hideBar(animate) {
      if (!fixed) return;
      fixed = false;
      if (animate) {
        bar.classList.add('is-leaving');
        setTimeout(function () {
          if (!fixed) { bar.classList.remove('is-fixed', 'is-leaving'); slot.style.height = ''; }
        }, 250);
      } else {
        bar.classList.remove('is-fixed', 'is-leaving');
        slot.style.height = '';
      }
    }
    function onScroll() {
      var y = window.scrollY, dy = y - lastY;
      var slotBottom = slot.offsetHeight + (fixed ? 0 : slot.offsetTop);
      if (y <= slotBottom) hideBar(false);
      else if (dy < -4) showBar();
      else if (dy > 4) {
        var open = burger && burger.getAttribute('aria-expanded') === 'true';
        if (!open) hideBar(true);
      }
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
  }

  /* Skills marquee: repeat each set so the loop is seamless at any screen width */
  var rows = document.querySelectorAll('.skill-row');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function build() {
    rows.forEach(function (row) {
      var original = row.__set || (row.__set = row.querySelector('.skill-set').cloneNode(true));
      var track = document.createElement('div');
      track.className = 'skill-track';
      track.setAttribute('aria-hidden', 'true');
      row.innerHTML = '';
      row.appendChild(track);
      var probe = original.cloneNode(true);
      track.appendChild(probe);
      var setWidth = probe.getBoundingClientRect().width || 1;
      var perHalf = Math.max(1, Math.ceil(window.innerWidth / setWidth) + 1);
      track.innerHTML = '';
      for (var i = 0; i < perHalf * 2; i++) track.appendChild(original.cloneNode(true));
      var halfWidth = setWidth * perHalf;
      track.style.setProperty('--dur', (halfWidth / 45).toFixed(1) + 's');
      if (reduce) track.style.animation = 'none';
    });
  }
  /* The accessible list is kept once, visually hidden, for screen readers */
  var skills = document.querySelector('.skills');
  if (skills && rows.length) {
    var names = [];
    rows.forEach(function (r) { r.querySelectorAll('.skill span').forEach(function (s) { names.push(s.textContent); }); });
    var sr = document.createElement('p');
    sr.className = 'sr-only';
    sr.textContent = 'Skills: ' + names.join(', ') + '.';
    skills.appendChild(sr);
  }

  /* Case study summary: sideways-scrolling cards on tablet/mobile, with dots that track and jump */
  var deck = document.getElementById('cs-cards');
  var dotsWrap = document.querySelector('.cs-dots');
  if (deck && dotsWrap) {
    var cards = deck.querySelectorAll('.cs-card');
    var dots = [];
    cards.forEach(function (card, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show ' + card.querySelector('h2').textContent);
      b.addEventListener('click', function () {
        deck.scrollTo({ left: card.offsetLeft - deck.offsetLeft - 20, behavior: reduce ? 'auto' : 'smooth' });
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    function syncDots() {
      var max = deck.scrollWidth - deck.clientWidth;
      var idx = max <= 0 ? 0 : Math.round((deck.scrollLeft / max) * (cards.length - 1));
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      dotsWrap.hidden = max <= 0;
    }
    deck.addEventListener('scroll', function () { requestAnimationFrame(syncDots); }, { passive: true });
    window.addEventListener('resize', syncDots);
    syncDots();
  }
  build();
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
})();
