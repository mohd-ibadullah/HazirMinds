/* ============================================================
   HAZIRMINDS — motion + interactions
   Lenis (lerp .1) · GSAP + ScrollTrigger · transform/opacity only
   motion runs for every visitor — no reduced-motion branch, no site switch
   ============================================================ */
(function () {
  'use strict';
  var docEl = document.documentElement;
  docEl.classList.add('js');

  /* Motion runs for every visitor on every device. The site deliberately does not read the
     operating system's reduce-motion signal and carries no site-level switch, so REDUCE is a
     hard false: the animation code below still consults it, and every branch it guards is
     simply live. Content visibility stays guaranteed by the self-heal fail-safe further down,
     not by turning motion off. */
  var REDUCE = false;

  /* Self-heal / reveal insurance (§0.5). Anything the reader has already reached —
     including groups skipped by a fast flick or a stalled engine — is force-shown.
     Reads first, writes after, so a sweep never causes layout thrash. */
  var healList = null; /* pending reveal targets, shrinks as the reader advances */
  function forceShowAll() {
    try {
      if (!healList) healList = Array.prototype.slice.call(
        document.querySelectorAll('[data-reveal], [data-reveal="children"] > *,'
          + ' [data-reveal] img, [data-reveal] svg, [data-reveal] picture,'
          + ' [data-reveal] video, [data-reveal] figure'));
      if (!healList.length) return 0;
      var line = window.innerHeight * 0.5;
      var open = [], pending = [];
      for (var i = 0; i < healList.length; i++) {
        var el = healList[i];
        var r = el.getBoundingClientRect();
        if (r.top > line) { open.push(el); continue; }  /* still ahead of the reader */
        if (parseFloat(getComputedStyle(el).opacity) !== 0) continue;
        pending.push(el);                                 /* reached but never revealed */
      }
      healList = open;
      for (var j = 0; j < pending.length; j++) pending[j].classList.add('reveal-force');
      return healList.length;
    } catch (e) { return 0; }
  }
  function startSelfHeal() {
    /* Backstop for engine skips, fast flicks and pinned-section transfers: any group
       the reader has reached is force-shown. The list only holds not-yet-resolved
       targets, so this stays cheap for the whole session — nothing can stay hidden. */
    setInterval(forceShowAll, 1200);
    /* catch scroll movement promptly — rAF-throttled, passive, cheap when idle */
    var queued = false, lastY = -1;
    window.addEventListener('scroll', function () {
      if (queued || window.scrollY === lastY) return;
      lastY = window.scrollY;
      queued = true;
      requestAnimationFrame(function () { queued = false; forceShowAll(); });
    }, { passive: true });
    window.addEventListener('scrollend', function () { forceShowAll(); });
    window.addEventListener('resize', function () { healList = null; forceShowAll(); });
    window.addEventListener('load', function () { forceShowAll(); });
  }
  var IS_TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (IS_TOUCH) docEl.classList.add('is-touch');

  /* ---------------- analytics (consent-gated) ----------------
     Nothing leaves the page until the visitor opts in. "Essential only" keeps
     analytics off entirely — the default position before a choice is made. */
  var CONSENT = null;
  try { CONSENT = localStorage.getItem('hazirminds_consent'); } catch (e) { }
  var A = {
    send: function (name, data) {
      if (CONSENT !== 'all') return;
      data = data || {};
      data.ts = Date.now();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data));
    }
  };

  /* ---------------- toasts (§4 overlays) ---------------- */
  function toast(msg, ms) {
    try {
      var host = document.getElementById('toast-host');
      if (!host) return;
      var el = document.createElement('div');
      el.className = 'toast';
      el.textContent = msg;
      host.appendChild(el);
      var kill = function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 220); };
      setTimeout(kill, ms || 4200);
      el.addEventListener('click', kill);
    } catch (e) { }
  }

  /* ---------------- reduced-motion shortcut ---------------- */
  function initStatic() {
    docEl.classList.add('motion-done');
    // counters land on exact values instantly (GSAP never runs on this path)
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      if (!isNaN(end)) el.textContent = (el.dataset.pre || '') + end.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suf || '');
    });
    // transcript still runs (content, not decorative) but instantly
    Transcript.init(true);
  }

  /* ---------------- Lenis smooth scroll ---------------- */
  var lenis = null;
  function initLenis() {
    if (REDUCE || !window.Lenis) return;
    /* Windows wheel + Lenis smoothing feels sticky (stops/starts); keep native wheel there */
    var isWin = false;
    try { isWin = /Win/i.test(navigator.platform || navigator.userAgent || ''); } catch (e) {}
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: !isWin });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
    // anchor links
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------------- scroll progress hairline ---------------- */
  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var upd = function () {
      var h = docEl.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    };
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------------- nav ---------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    // desktop mega menus
    document.querySelectorAll('.nav-item').forEach(function (item) {
      var btn = item.querySelector('.nav-link');
      if (!btn || !item.querySelector('.mega')) return;
      var t;
      item.addEventListener('mouseenter', function () {
        if (docEl.classList.contains('is-touch')) return;
        clearTimeout(t); item.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', function () {
        if (docEl.classList.contains('is-touch')) return;
        t = setTimeout(function () { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 120);
      });
      btn.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { item.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
      });
    });
    // close menus on outside click
    document.addEventListener('click', function (e) {
      document.querySelectorAll('.nav-item.open').forEach(function (item) {
        if (!item.contains(e.target)) item.classList.remove('open');
      });
    });
    // burger
    var burger = document.querySelector('.nav-burger');
    var mobile = document.querySelector('.nav-mobile');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        var open = mobile.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
      mobile.addEventListener('click', function (e) {
        if (e.target.closest('a')) mobile.classList.remove('open');
      });
    }
  }

  /* ---------------- GSAP reveals ---------------- */
  function initReveals() {
    if (REDUCE || !window.gsap) return;
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    // generic section reveals: travel + 24px, children staggered 70ms, once.
    // Text is never faded (contrast stays measurable at every frame); media fades.
    document.querySelectorAll('[data-reveal]').forEach(function (group) {
      var kids = group.dataset.reveal === 'children'
        ? Array.from(group.children)
        : [group];
      var media = group.querySelectorAll('img,svg,picture,video,figure');
      gsap.set(kids, { y: 24 });
      if (media.length) gsap.set(media, { opacity: 0 });
      gsap.to(kids, {
        y: 0, duration: .8, ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
      if (media.length) gsap.to(media, {
        opacity: 1, duration: .5, ease: 'power2.out', delay: .12,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true }
      });
    });

    // hero line-mask reveal: 3 lines, 120ms stagger
    var lines = document.querySelectorAll('.hero h1 .line > span');
    if (lines.length) {
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.12, delay: .1,
        onComplete: function () { docEl.classList.add('motion-done'); }
      });
    }

    // counters easeOutExpo 1.6s
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.dec || '0', 10);
      var pre = el.dataset.pre || '';
      var suf = el.dataset.suf || '';
      var obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'expo.out',
        onUpdate: function () { el.textContent = pre + obj.v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // image parallax ±8% — DISABLED: scrub parallax caused visible judder on wheel scroll
    /*
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
    */

    // ONE pinned moment — Silence Tax stats (~60vh) — DISABLED: pinning reads as a frozen page
    /*
    var pin = document.querySelector('[data-pin]');
    if (pin && window.matchMedia('(min-width: 901px)').matches) {
      ST.create({
        trigger: pin, start: 'top 120px', end: '+=30%',
        pin: true, pinSpacing: true, anticipatePin: 1
      });
    }
    */
  }

  /* ---------------- marquee (2 rows, opposite, 40s/55s — pure CSS loop) ---------------- */
  function initMarquee() {
    document.querySelectorAll('.marquee').forEach(function (m) {
      var track = m.querySelector('.marquee-track');
      if (!track) return;
      if (track.dataset.dup) return; // boot runs once; never double-duplicate
      track.dataset.dup = '1';
      track.innerHTML += track.innerHTML; // duplicate for seamless -50% loop
      if (REDUCE) track.style.animation = 'none';
    });
  }

  /* ---------------- pinned story moments (§3c) ----------------
     Exactly three: home Hazir Loop, /masjids lifecycle, /chief-of-staff orchestration.
     Desktop only, never under reduced motion, and pinSpacing keeps layout stable. */
  function initPins() {
    /* DISABLED: pinned scroll sections read as a frozen/stuck page — keep native scroll */
    return;
    if (REDUCE || !window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth < 1024) return;
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var sections = document.querySelectorAll('[data-pin-story]');
    if (sections.length > 3) return; /* guard: the spec allows exactly one per page */
    sections.forEach(function (sec) {
      var stage = sec.querySelector('.pin-stage') || sec.firstElementChild;
      if (!stage) return;
      ST.create({
        trigger: sec,
        start: 'top 22%',
        end: '+=24%',
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
      /* Subtle horizontal drift while pinned — transform only, no layout change.
         Drifts out and returns to 0 so the released element ends with no residual
         transform (content must never be left mid-animation). */
      gsap.fromTo(stage, { x: 0 }, {
        keyframes: [{ x: -10, ease: 'none' }, { x: 0, ease: 'none' }],
        scrollTrigger: { trigger: sec, start: 'top 22%', end: '+=24%', scrub: true, invalidateOnRefresh: true }
      });
      /* node highlight sweep on the pinned section */
      var nodes = stage.querySelectorAll('.invariant, .lc-step, .svc-card, .card');
      if (nodes.length) {
        gsap.fromTo(nodes, { borderColor: 'rgba(230,221,208,0)' }, {
          borderColor: 'rgba(185,138,46,.35)', stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top 35%', end: '+=24%', scrub: true }
        });
      }
    });
  }

  /* ---------------- magnetic CTAs ---------------- */
  function initMagnetic() {
    if (REDUCE || IS_TOUCH) return;
    document.querySelectorAll('.btn--primary, .btn--brass').forEach(function (btn) {
      var r = null;
      btn.addEventListener('mousemove', function (e) {
        r = r || btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = 'translate(' + (dx * 6).toFixed(1) + 'px,' + (dy * 6).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        r = null;
        btn.style.transform = '';
      });
    });
  }

  /* ---------------- cursor glow (desktop only, rAF only while active) ---------------- */
  function initCursorGlow() {
    if (REDUCE || IS_TOUCH) return;
    var glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    var x = -500, y = -500, cx = x, cy = y;
    var raf = null;
    function loop() {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      glow.style.transform = 'translate(' + (cx - 200) + 'px,' + (cy - 200) + 'px)';
      // stop the loop once the glow has caught up and the mouse is idle
      if (Math.abs(x - cx) < 0.5 && Math.abs(y - cy) < 0.5) { raf = null; return; }
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.body.addEventListener('mousemove', function once() {
      document.body.classList.add('has-cursor-glow');
      document.body.removeEventListener('mousemove', once);
    });
  }

  /* ---------------- accordions ---------------- */
  function initAccordions() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        // close siblings in same group
        var group = item.parentElement;
        group.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.height = '0px'; o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); }
        });
        if (open) {
          item.classList.remove('open');
          a.style.height = '0px';
          q.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          a.style.height = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
      window.addEventListener('resize', function () {
        if (item.classList.contains('open')) a.style.height = 'auto';
      });
    });
  }

  /* ---------------- tabs (cross-fade 250ms) ---------------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var tabs = Array.from(root.querySelectorAll('[role="tab"]'));
      var panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
      if (!tabs.length) return;
      function select(idx, focus) {
        tabs.forEach(function (t, i) {
          var on = i === idx;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          if (on && focus) t.focus();
        });
        panels.forEach(function (p, i) {
          if (i === idx) {
            p.hidden = false;
            /* the hidden attribute alone is not enough: .loop-panel is display:none and only
               .loop-panel.active is display:grid, so without this class the tab highlight
               moved but the panel content never switched. */
            p.classList.add('active');
            if (!REDUCE) {
              p.style.opacity = '0';
              requestAnimationFrame(function () {
                p.style.transition = 'opacity .25s ease';
                p.style.opacity = '1';
                setTimeout(function () { p.style.transition = ''; p.style.opacity = ''; }, 300);
              });
            }
          } else { p.hidden = true; p.classList.remove('active'); }
        });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i); A.send('tab_change', { tab: t.textContent.trim() }); });
        t.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') n = 0;
          if (e.key === 'End') n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); select(n, true); }
        });
      });
      select(0);
    });
  }

  /* ---------------- transcript demo ---------------- */
  var Transcript = {
    timers: [],
    init: function (instant) {
      var roots = document.querySelectorAll('[data-transcript]');
      if (!roots.length) return;
      roots.forEach(function (root) { Transcript.bind(root, instant); });
    },
    bind: function (root, instant) {
      var tabs = root.querySelectorAll('.demo-tab');
      var body = root.querySelector('.demo-body');
      var chipHost = root.querySelector('.demo-chips');
      var data = JSON.parse(root.dataset.transcript);
      var timers = Transcript.timers;
      var playToken = 0;

      function clearAll() { timers.forEach(clearTimeout); timers.length = 0; }
      function render(idx) {
        clearAll();
        var my = ++playToken;
        var script = data[idx].lines;
        body.innerHTML = '';
        chipHost.innerHTML = '';
        var seq = [];
        script.forEach(function (m, i) {
          var t0 = i === 0 ? 350 : 350 + i * 1250;
          seq.push(setTimeout(function () {
            if (my !== playToken) return;
            var b = document.createElement('div');
            b.className = 'bubble bubble--' + m.who + ' show';
            var who = m.who === 'ai' ? 'HazirMinds AI' : 'Caller';
            b.innerHTML = '<span class="who">' + who + '</span>' + m.text;
            body.appendChild(b);
            body.scrollTop = body.scrollHeight;
          }, instant ? 0 : t0));
          if (m.book) {
            seq.push(setTimeout(function () {
              if (my !== playToken) return;
              chipHost.innerHTML = m.book.map(function (c) {
                return '<span class="pill">' + ICON.check + c + '</span>';
              }).join('');
            }, instant ? 0 : t0 + 700));
          }
        });
        timers = timers.concat(seq);
      }
      /* APG tabs pattern: roving tabindex (only the selected tab is in the tab order) plus
         arrow/Home/End keys. Previously only click worked, so a keyboard user could focus
         the tabs but never change scene, and the panel had no role/label at all. */
      function select(idx, moveFocus, track) {
        tabs.forEach(function (x, j) {
          x.setAttribute('aria-selected', String(j === idx));
          x.setAttribute('tabindex', j === idx ? '0' : '-1');
        });
        if (body) {
          body.setAttribute('aria-labelledby', 'demo-tab-' + idx);
          body.setAttribute('tabindex', '0');
        }
        if (moveFocus) tabs[idx].focus();
        if (track) A.send('demo_play', { scene: data[idx].name });
        render(idx);
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false, true); });
        t.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          if (n === null) return;
          e.preventDefault();
          select(n, true, true);
        });
      });
      if (body) body.setAttribute('tabindex', '0');
      select(0, false, false);
    }
  };
  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  /* ---------------- sticky mobile CTA ---------------- */
  function initStickyCTA() {
    var bar = document.querySelector('.sticky-cta');
    if (!bar) return;
    var upd = function () {
      var show = window.scrollY > 600 && !docEl.classList.contains('modal-open');
      bar.classList.toggle('show', show);
      /* flag on <html> so the floating assistant / back-to-top can lift clear of the bar
         (the bubble sat flush on the sticky CTA's top edge with zero gap) */
      docEl.classList.toggle('sticky-cta-on', show);
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------------- floating chrome reveal ----------------
     At 390x844 the hero's primary CTA lands at y ~760-830, which is exactly the band a
     bottom-anchored 50px bubble lives in — the bubble sat on the button's corner AND won
     the hit test, so it stole taps from the most important control on the page. The hero
     has no min-height, so no amount of padding moves the CTA clear; instead the bubble
     stays out of the fold entirely and fades in once the hero is behind you. */
  function initFloatReveal() {
    var upd = function () { docEl.classList.toggle('float-ready', window.scrollY > 420); };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------------- exit intent (once/session) ---------------- */
  function initExitIntent() {
    var root = document.getElementById('exit-modal');
    if (!root) return;
    var KEY = 'hazirminds_exit_shown';
    var shown = false;
    try { shown = sessionStorage.getItem(KEY) === '1'; } catch (e) { }
    if (shown || REDUCE) return;
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { }
      openModal(root);
      A.send('exit_intent', {});
    }
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    });
    // mobile fallback: fast scroll-up after depth
    var lastY = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (lastY - y > 420 && y > 1400) fire();
      lastY = y;
    }, { passive: true });
  }

  /* ---------------- modal plumbing ---------------- */
  function openModal(root) {
    root.classList.add('open');
    docEl.classList.add('modal-open');
    if (lenis) lenis.stop();
    var f = root.querySelector('input,select,textarea,button:not(.close)');
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal(root) {
    root.classList.remove('open');
    docEl.classList.remove('modal-open');
    if (lenis) lenis.start();
  }
  document.addEventListener('click', function (e) {
    var open = document.querySelector('.modal-root.open');
    if (!open) return;
    if (e.target.closest('[data-modal-close]') || e.target.classList.contains('veil')) closeModal(open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var open = document.querySelector('.modal-root.open');
      if (open) closeModal(open);
    }
  });
  // openers
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (!opener) return;
    e.preventDefault();
    var root = document.getElementById(opener.getAttribute('data-modal-open'));
    if (root) { openModal(root); A.send('cta_click', { cta: opener.getAttribute('data-cta') || opener.id || 'modal-open' }); }
  });

  /* ---------------- CTA analytics ---------------- */
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (cta) A.send('cta_click', { cta: cta.getAttribute('data-cta') });
  });

  /* ---------------- forms (inline validation + success) ---------------- */
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {
      var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
      form.setAttribute('novalidate', '');
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        el.addEventListener('blur', function () { validate(el); });
        el.addEventListener('input', function () {
          var f = el.closest('.form-field');
          if (f && f.classList.contains('invalid')) validate(el);
        });
      });
      function validate(el) {
        var f = el.closest('.form-field');
        if (!f) return true;
        var bad = false;
        var v = (el.value || '').trim();
        if (el.required && !v) bad = true;
        if (!bad && el.type === 'email' && v && !emailOk(v)) bad = true;
        if (!bad && el.type === 'tel' && v && !/^[+\d][\d\s().-]{6,}$/.test(v)) bad = true;
        f.classList.toggle('invalid', bad);
        f.classList.toggle('valid', !bad && !!v);
        return !bad;
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var els = Array.from(form.querySelectorAll('input,select,textarea'));
        var allOk = els.map(validate).every(Boolean);
        if (!allOk) {
          var first = form.querySelector('.form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea');
          if (first) first.focus();
          return;
        }
        A.send('form_submit', { form: form.id || 'form' });

        var fields = form.querySelector('[data-fields]');
        var okPanel = form.querySelector('.form-success');
        var badPanel = form.querySelector('.form-error');
        var btn = form.querySelector('button[type=submit]');
        var payload = { form: form.id || 'form', page: location.pathname };
        els.forEach(function (el) { if (el.name) payload[el.name] = el.value; });

        /* The endpoint is the only thing that can confirm a lead was received, so the
           success panel is driven by its response — never shown optimistically. If the
           POST fails (no credentials configured, network, 5xx) we say so plainly and hand
           the visitor a prefilled mailto so the lead still has somewhere to go. */
        function showSuccess() {
          if (badPanel) badPanel.classList.remove('show');
          if (okPanel) okPanel.classList.add('show');
          if (fields) fields.style.display = 'none';
          form.reset();
        }
        function showFailure() {
          if (okPanel) okPanel.classList.remove('show');
          if (fields) fields.style.display = '';
          if (badPanel) {
            var mail = badPanel.querySelector('[data-mailto]');
            if (mail) {
              var subject = 'Demo request' + (payload.company ? ' — ' + payload.company : '');
              var body = Object.keys(payload)
                .filter(function (k) { return payload[k] && k !== 'form' && k !== 'page'; })
                .map(function (k) { return k + ': ' + payload[k]; }).join('\n');
              mail.href = 'mailto:' + mail.getAttribute('data-mailto') +
                '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            }
            badPanel.classList.add('show');
          }
        }
        function restoreBtn() {
          if (!btn) return;
          btn.disabled = false;
          var label = btn.getAttribute('data-label');
          if (label) btn.innerHTML = label;
        }

        if (btn) {
          if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.innerHTML);
          btn.disabled = true;
          btn.textContent = 'Sending…';
        }

        fetch(form.getAttribute('data-endpoint') || '/api/lead.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (d) {
            return !!(r.ok && d && d.ok);
          });
        }).then(function (sent) {
          restoreBtn();
          if (sent) showSuccess(); else showFailure();
        }).catch(function () {
          restoreBtn();
          showFailure();
        });
      });
    });
  }

  /* ---------------- trade picker + ?trade= ---------------- */
  function initTradePicker() {
    var root = document.querySelector('[data-trade-picker]');
    if (!root) return;
    var chips = root.querySelectorAll('.trade-chip');
    var line = root.querySelector('[data-trade-line]');
    var img = root.querySelector('[data-trade-img]');
    var cta = root.querySelector('[data-trade-cta]');
    var dataEl = document.getElementById('trade-data');
    var data = JSON.parse(dataEl.textContent);
    var byKey = {};
    data.forEach(function (d) { byKey[d.key] = d; });

    function select(key) {
      var d = byKey[key]; if (!d) return;
      chips.forEach(function (c) { if (c.tagName === 'BUTTON') c.setAttribute('aria-pressed', String(c.dataset.trade === key)); });
      if (line) {
        line.innerHTML = d.line;
        line.classList.remove('trade-swap'); void line.offsetWidth; line.classList.add('trade-swap');
      }
      if (img) {
        img.src = d.img; img.alt = d.alt;
        img.closest('.img').classList.remove('trade-swap'); void img.offsetWidth; img.closest('.img').classList.add('trade-swap');
      }
      if (cta) cta.href = d.href;
      try { history.replaceState(null, '', key === 'hvac' ? location.pathname : '?trade=' + key); } catch (e) { }
      A.send('calculator_use', { type: 'trade_picker', value: key });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { select(c.dataset.trade); }); });
    var params = new URLSearchParams(location.search);
    select(params.get('trade') || 'hvac');
  }

  /* ---------------- leak calculator ---------------- */
  function initCalculator() {
    var root = document.querySelector('[data-calc]');
    if (!root) return;
    var calls = root.querySelector('[data-calc-calls]');
    var value = root.querySelector('[data-calc-value]');
    var conv = root.querySelector('[data-calc-conv]');
    var out = root.querySelector('[data-calc-out]');
    var perYear = root.querySelector('[data-calc-year]');
    var outCalls = root.querySelector('[data-out-calls]');
    var outValue = root.querySelector('[data-out-value]');
    var outConv = root.querySelector('[data-out-conv]');
    var net = root.querySelector('[data-calc-net]');
    var net2 = root.querySelector('[data-calc-net2]');
    var rescued = root.querySelector('[data-calc-rescued]');
    var perYear2 = root.querySelector('[data-calc-year2]');
    if (!calls || !value || !out) return;
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var upd = function () {
      var missed = parseInt(calls.value, 10);
      var job = parseInt(value.value, 10);
      var rate = conv ? parseInt(conv.value, 10) / 100 : 1;
      var m = missed * job;
      out.textContent = fmt(m);
      if (perYear) perYear.textContent = fmt(m * 12);
      if (outCalls) outCalls.textContent = missed;
      if (outValue) outValue.textContent = fmt(job);
      if (outConv) outConv.textContent = conv.value + '%';
      if (net) {
        var r = m * rate;
        var plan = 997;
        var gain = r - plan;
        rescued.textContent = fmt(r);
        net.textContent = fmt(Math.max(gain, 0));
        if (net2) net2.textContent = fmt(gain);
        if (perYear2) perYear2.textContent = fmt(gain * 12);
      }
      A.send('calculator_use', { type: 'leak', missed: missed, job: job, monthly: m });
    };
    calls.addEventListener('input', upd);
    value.addEventListener('input', upd);
    if (conv) conv.addEventListener('input', upd);
    upd();
  }

  /* ---------------- pricing annual toggle ---------------- */
  function initPricingToggle() {
    var sw = document.querySelector('[data-annual]');
    if (!sw) return;
    function upd() {
      var annual = sw.getAttribute('aria-checked') === 'true';
      document.querySelectorAll('[data-price-m]').forEach(function (el) {
        var v = parseInt(el.dataset[annual ? 'annual' : 'monthly'], 10);
        el.textContent = isNaN(v) ? el.dataset[annual ? 'annual' : 'monthly'] : v.toLocaleString('en-US');
      });
      document.querySelectorAll('[data-show-annual]').forEach(function (el) { el.hidden = !annual; });
      document.querySelectorAll('[data-show-monthly]').forEach(function (el) { el.hidden = annual; });
    }
    sw.addEventListener('click', function () {
      sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      upd();
      A.send('calculator_use', { type: 'pricing_toggle' });
    });
    upd();
  }

  /* ---------------- service rail scrollspy ---------------- */
  function initScrollSpy() {
    var rail = document.querySelector('.svc-rail');
    if (!rail || !window.ScrollTrigger || REDUCE) { if (rail) simpleSpy(rail); return; }
    simpleSpy(rail);
  }
  function simpleSpy(rail) {
    var links = Array.from(rail.querySelectorAll('a'));
    var groups = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var idx = 0;
        groups.forEach(function (g, i) { if (g && g.getBoundingClientRect().top < 140) idx = i; });
        links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- governance: layers draw-in + horizons stamp ---------------- */
  function initGovernance() {
    var rows = document.querySelectorAll('[data-layers] .layer-row');
    if (rows.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var idx = Array.prototype.indexOf.call(rows, en.target);
          setTimeout(function () { en.target.style.setProperty('--draw', '1'); }, idx * 140);
          io.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      rows.forEach(function (r) { r.style.setProperty('--draw', '0'); io.observe(r); });
    } else {
      rows.forEach(function (r) { r.style.setProperty('--draw', '1'); });
    }
    // proof-horizons: mark 'done' up to the scrolled progress, stamp effect
    var hz = document.querySelector('[data-horizons]');
    if (hz) {
      var hs = hz.querySelectorAll('.horizon');
      var mark = function (n) {
        hs.forEach(function (h, i) { h.classList.toggle('done', i < n); });
      };
      if (REDUCE) { mark(hs.length); return; }
      var t = 0;
      var tick = setInterval(function () { t++; mark(t); if (t >= hs.length) clearInterval(tick); }, 450);
    }
  }

  /* ---------------- governance report card ---------------- */
  function initReportCard() {
    var root = document.querySelector('[data-report-card]');
    if (!root) return;
    var qs = root.querySelectorAll('.rc-q');
    function check() {
      var answered = 0, score = 0;
      qs.forEach(function (q) {
        var on = q.querySelector('.rc-opt[aria-pressed="true"]');
        if (on) { answered++; score += parseInt(on.dataset.w, 10); }
      });
      if (answered === qs.length) {
        var res = root.querySelector('.rc-result');
        res.hidden = false;
        var badge = score >= 13 ? 'Governed' : score >= 8 ? 'Emerging' : 'Exposed';
        root.querySelector('[data-rc-score]').textContent = score + '/16';
        root.querySelector('[data-rc-note]').textContent = badge + ' — ' + (score >= 13 ? 'your posture is strong; we can stress-test it.' : score >= 8 ? 'good bones, real gaps. The demo maps them.' : 'meaningful exposure. The demo is where we start.');
        A.send('report_card', { score: score });
        res.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
    root.addEventListener('click', function (e) {
      var opt = e.target.closest('.rc-opt');
      if (!opt) return;
      opt.parentElement.querySelectorAll('.rc-opt').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      opt.setAttribute('aria-pressed', 'true');
      check();
    });
  }

  /* ---------------- approval-gate demo (/chief-of-staff) ---------------- */
  function initApprovalDemo() {
    var root = document.querySelector('[data-approval-demo]');
    if (!root) return;
    var state = root.querySelector('[data-ad-state]');
    var RULES = {
      publish: { gated: true, msg: 'PUBLISH BLOG POST — approval gate: this is a consequential action (public content). The agent prepared the draft + source receipts and is waiting for your explicit approval. Nothing goes live without you.' },
      email: { gated: true, msg: 'EMAIL CLIENT — approval gate: external communication. Draft + citation trail ready; sends only when you approve.' },
      purchase: { gated: true, msg: 'PURCHASE SOFTWARE — approval gate: moving money. Cart prepared, budget rule checked, PO drafted — your approval required, always.' },
      summarize: { gated: false, msg: 'SUMMARIZE DOCUMENT — allowed: reading and summarizing is inside the default scope. The summary carries source links to the exact document and revision.' },
      delete: { gated: true, msg: 'DELETE OLD FILES — approval gate: destructive action, hard-blocked class. Even with approval, deletion moves to a recoverable archive first.' }
    };
    root.addEventListener('click', function (e) {
      var chip = e.target.closest('.trade-chip');
      if (!chip) return;
      root.querySelectorAll('button.trade-chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var rule = RULES[chip.dataset.action];
      if (!rule) return;
      state.className = 'ad-state ' + (rule.gated ? 'blocked' : 'allowed');
      state.innerHTML = rule.gated
        ? '<b style="color:var(--rust)">⛔ APPROVAL REQUIRED</b><br>' + rule.msg
        : '<b style="color:var(--ok)">✓ WITHIN SCOPE</b><br>' + rule.msg;
      A.send('approval_demo', { action: chip.dataset.action, gated: rule.gated });
    });
    var first = root.querySelector('.trade-chip[aria-pressed="true"]');
    if (first) first.click();
  }

  /* ---------------- consent banner (privacy-first default) ---------------- */
  function initConsent() {
    var box = document.getElementById('consent');
    if (!box) return;
    if (CONSENT !== 'all' && CONSENT !== 'essential') {
      setTimeout(function () { box.hidden = false; document.body.classList.add('consent-open'); }, REDUCE ? 400 : 900);
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      CONSENT = b.dataset.consent;
      try { localStorage.setItem('hazirminds_consent', CONSENT); } catch (err) { }
      box.hidden = true;
      document.body.classList.remove('consent-open');
      toast(CONSENT === 'all'
        ? 'Anonymous analytics on. Thank you — we only measure page and CTA counts.'
        : 'Essential only. No analytics will be sent from this device.');
    });
  }

  /* ---------------- back-to-top (§3m) ---------------- */
  function initBackToTop() {
    var b = document.getElementById('to-top');
    if (!b) return;
    var onScroll = function () {
      b.classList.toggle('show', window.scrollY > window.innerHeight * 2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    b.addEventListener('click', function () {
      if (lenis) lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' });
      var skip = document.querySelector('.skip-link');
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  /* ---------------- governed website assistant ---------------- */
  function initAssistant() {
    var btn = document.getElementById('asst-btn');
    var panel = document.getElementById('asst-panel');
    var kbEl = document.getElementById('asst-kb');
    if (!btn || !panel || !kbEl) return;
    var KB = [];
    try { KB = JSON.parse(kbEl.textContent || '[]'); } catch (e) { }
    var log = document.getElementById('asst-log');
    var busy = false;

    function open(on) {
      panel.classList.toggle('open', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) { var first = panel.querySelector('.asst-q'); if (first) first.focus(); }
    }
    btn.addEventListener('click', function () { open(!panel.classList.contains('open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('[data-asst-close]')) { open(false); btn.focus(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) { open(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || btn.contains(e.target)) return;
      open(false);
    });

    function answer(entry, escalated) {
      if (busy) return;
      busy = true;
      var wrap = document.createElement('div');
      wrap.innerHTML = '<div class="skel" style="width:82%"></div><div class="skel" style="width:64%"></div>';
      log.appendChild(wrap);
      setTimeout(function () {
        wrap.innerHTML = '<div class="asst-a">' + entry.a +
          '<span class="src">Source: <a href="' + entry.href + '">' + entry.label + '</a>' +
          (escalated ? ' · Escalated to a human' : '') + '</span></div>';
        busy = false;
        wrap.scrollIntoView({ block: 'nearest' });
      }, REDUCE ? 60 : 480);
      if (escalated) toast('Not in the approved knowledge base — no answer given, escalation path shown.');
    }

    log.addEventListener('click', function (e) {
      var q = e.target.closest('[data-asst-q]');
      if (!q) return;
      var entry = KB[parseInt(q.dataset.asstQ, 10)];
      if (entry) answer(entry, false);
    });

    var form = document.getElementById('asst-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('asst-input');
      var q = (input.value || '').toLowerCase().trim();
      if (!q) return;
      input.value = '';
      /* keyword match against the approved set; anything else is escalated, never invented */
      var hit = null;
      KB.forEach(function (k) {
        if (hit) return;
        var words = k.q.toLowerCase().replace(/[^a-z ]/g, ' ').split(' ').filter(function (w) { return w.length > 4; });
        if (words.some(function (w) { return q.indexOf(w) > -1; })) hit = k;
      });
      if (!hit && /price|cost|pricing|how much|plan/.test(q)) hit = KB[1];
      if (!hit && /masjid|mosque|islamic/.test(q)) hit = KB[4];
      if (!hit && /hallucin|made up|accurate|reliable|governance|audit/.test(q)) hit = KB[2];
      if (!hit && /compare|versus|vs|gohighlevel|smith/.test(q)) hit = KB[3];
      answer(hit || {
        a: 'That is not in our approved site knowledge, so I will not guess. A human from HazirMinds will answer it properly — reach us at hello@hazirminds.ai, or book a free demo and we will bring the answer with receipts.',
        href: '/demo', label: 'Book a free demo'
      }, !hit);
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initConsent();
    initBackToTop();
    initAssistant();
    initNav();
    initProgress();
    initAccordions();
    initTabs();
    initForms();
    initTradePicker();
    initCalculator();
    initPricingToggle();
    initStickyCTA();
    initFloatReveal();
    initExitIntent();
    initScrollSpy();
    initGovernance();
    initReportCard();
    initApprovalDemo();
    if (REDUCE) { initStatic(); startSelfHeal(); return; }
    /* FAIL-SAFE MOTION CONTRACT: hiding is gated on html.motion-ready, which is
       added only after the engines are verified. Any throw → class removed →
       the site renders fully visible and static. */
    try {
      if (!window.gsap || !window.ScrollTrigger) throw new Error('motion engines unavailable');
      window.gsap.registerPlugin(window.ScrollTrigger);
      docEl.classList.add('motion-ready');
      initLenis();
      initReveals();
      initPins();
      initMarquee();
      initMagnetic();
      initCursorGlow();
      Transcript.init(false);
      startSelfHeal();
    } catch (err) {
      docEl.classList.remove('motion-ready');
      docEl.classList.add('no-motion');
      forceShowAll();
      try { initStatic(); } catch (e) { }
      if (window.console && console.warn) console.warn('[hazirminds] motion off (fail-safe):', err && err.message);
    }
  }
  /* ---------------- View Transitions (progressive enhancement) ---------------- */
  if (!REDUCE && document.visibilityState && 'CSS' in window && window.cssMatches !== false) {
    try {
      if (!CSS.supports('view-transition-name: test')) {
        // no native support — skip; pages still cross-fade via reduced-motion-safe CSS below
      }
    } catch (e) { }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || REDUCE) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank' || href.indexOf('://') > -1) return;
    if (!document.startViewTransition) return;
    e.preventDefault();
    document.startViewTransition(function () { location.href = href; });
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
