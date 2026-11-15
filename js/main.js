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
  build();
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
})();
