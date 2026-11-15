(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Theme toggle ---------- */
  var themeBtn = $('themeToggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  themeBtn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

  /* ---------- Mobile nav ---------- */
  var navToggle = $('navToggle'), navLinks = $('navLinks'), backdrop = $('navBackdrop');
  function closeNav() {
    navLinks.classList.remove('open'); backdrop.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    backdrop.classList.toggle('show', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  backdrop.addEventListener('click', closeNav);
  navLinks.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeNav(); });

  /* ---------- Scroll progress + active link ---------- */
  var bar = $('progress');
  var links = [].slice.call(navLinks.querySelectorAll('a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    var cur = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Typing effect ---------- */
  var typed = $('typed');
  var words = ['Elixir & Phoenix', 'full-stack web apps', 'clean, reliable code'];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { typed.textContent = words[0]; }
  else {
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      typed.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  }

  /* ---------- Toast + copy email ---------- */
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  $('copyEmail').addEventListener('click', function () {
    var mail = 'jaywashie5735@gmail.com';
    if (navigator.clipboard) navigator.clipboard.writeText(mail).then(function () { toast('Email copied'); }, function () { toast(mail); });
    else toast(mail);
  });

  /* ---------- WhatsApp chat (sends to 0700016380 → +254700016380) ---------- */
  var WA_NUMBER = '254700016380';
  var fab = $('waFab'), panel = $('waPanel');
  function waToggle(open) {
    panel.hidden = !open; fab.setAttribute('aria-expanded', String(open));
    if (open) $('waName').focus();
  }
  fab.addEventListener('click', function () { waToggle(panel.hidden); });
  $('waClose').addEventListener('click', function () { waToggle(false); fab.focus(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) waToggle(false); });
  $('waForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('waName').value.trim(), msg = $('waMsg').value.trim();
    if (!name || !msg) return;
    var text = 'Hi Joshua, I\'m ' + name + '.\n\n' + msg + '\n\n(Sent from your portfolio)';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    $('waMsg').value = ''; waToggle(false);
  });

  /* ---------- Animated background: drifting network ---------- */
  var cv = $('bg'), ctx = cv.getContext('2d'), pts = [], W, H, mouse = { x: -999, y: -999 };
  function rgb(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
  function resize() {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, (W * H) / 16000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + 1 });
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  function frame(animate) {
    ctx.clearRect(0, 0, W, H);
    var dot = rgb('--canvas-dot'), ln = rgb('--canvas-line'), D = 140;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (animate) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'rgba(' + dot + ',.55)'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          ctx.strokeStyle = 'rgba(' + ln + ',' + ((1 - d / D) * .28) + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
      if (md < 160) {
        ctx.strokeStyle = 'rgba(' + dot + ',' + ((1 - md / 160) * .5) + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    if (animate) requestAnimationFrame(function () { frame(true); });
  }
  frame(!reduce);
  if (reduce) themeBtn.addEventListener('click', function () { setTimeout(function () { frame(false); }, 50); });
})();