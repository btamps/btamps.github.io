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
  /* Meraki hero: pause the train, clouds and bubbles while the hero is scrolled out of view */
  var mkHero = document.querySelector('.mk-hero');
  if (mkHero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mkHero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(mkHero);
  }
  /* Chariot hero: the van waits just past the right edge of the screen, then drives in to its stop
     once that spot is fully on screen. --from is the distance from its stop to the screen's right edge */
  var van = document.querySelector('.ch-van');
  var vanStop = document.querySelector('.ch-stop');
  if (van && vanStop && !reduce && 'IntersectionObserver' in window) {
    var chHero = van.closest('.ch-hero');
    var parkVan = function () {
      van.style.setProperty('--from', Math.ceil(window.innerWidth - vanStop.getBoundingClientRect().left + 24) + 'px');
    };
    parkVan();
    chHero.classList.add('ch-parked');
    window.addEventListener('resize', function () { if (!chHero.classList.contains('ch-go')) parkVan(); });
    var vio2 = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      vio2.disconnect();
      chHero.classList.add('ch-go');
    }, { threshold: 0.9 });
    vio2.observe(vanStop);
  }

  /* Stat count-ups: each number counts up from 0 once its group is ~40% on screen.
     Markup keeps the final value (data-count, optional data-prefix/data-suffix), so it reads correctly without JS */
  var countGroups = document.querySelectorAll('.ss-stats-card, .ss-shop-stats');
  if (countGroups.length && !reduce && 'IntersectionObserver' in window) {
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var counter = function (el) {
      var raw = el.getAttribute('data-count');
      var decimals = (raw.split('.')[1] || '').length;
      var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
      return {
        target: parseFloat(raw),
        fmt: function (v) { return pre + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suf; }
      };
    };
    /* Start every number at 0, with its width locked to the final value so nothing shifts while digits are added */
    countGroups.forEach(function (g) {
      g.querySelectorAll('[data-count]').forEach(function (el) {
        el.style.display = 'inline-block';
        el.style.minWidth = Math.ceil(el.getBoundingClientRect().width) + 'px';
        el.textContent = counter(el).fmt(0);
      });
    });
    var runCount = function (el, delay) {
      var c = counter(el), target = c.target, fmt = c.fmt;
      var start = null, dur = 1600;
      setTimeout(function () {
        requestAnimationFrame(function step(now) {
          if (start === null) start = now;
          var p = Math.min(1, (now - start) / dur);
          el.textContent = fmt(target * ease(p));
          if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
        });
      }, delay);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        entry.target.querySelectorAll('[data-count]').forEach(function (el, i) { runCount(el, i * 120); });
      });
    }, { threshold: 0.4 });
    countGroups.forEach(function (g) { io.observe(g); });
  }

  /* Looping clips: play only while on screen, and stay on the poster frame for reduced motion */
  var clips = document.querySelectorAll('video[data-autoplay]');
  if (clips.length && !reduce) {
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (v.preload === 'none') v.preload = 'auto';
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { rootMargin: '200px 0px' });
      clips.forEach(function (v) { vio.observe(v); });
    } else {
      clips.forEach(function (v) { v.autoplay = true; v.play(); });
    }
  }

  build();
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
})();
