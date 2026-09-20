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
  /* How far below the viewport top an anchor click parks its target, ON TOP of the target's own CSS
     `scroll-margin-top`. The rail scroll-spy must use the same number as its "passed" line, or every
     click highlights the previous item. */
  var ANCHOR_OFFSET = 90;
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
      if (lenis) lenis.scrollTo(el, { offset: -ANCHOR_OFFSET });
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
      var closeMobile = function () {
        mobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      };
      burger.addEventListener('click', function () {
        var open = mobile.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
      mobile.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMobile();
      });
      /* The panel used to close only from its own button or a link inside it, so tapping anywhere
         else left it covering the page. Close on outside click and on Escape, keeping aria-expanded
         in sync and returning focus to the burger. */
      document.addEventListener('click', function (e) {
        if (!mobile.classList.contains('open')) return;
        if (mobile.contains(e.target) || burger.contains(e.target)) return;
        closeMobile();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !mobile.classList.contains('open')) return;
        closeMobile();
        burger.focus();
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
      /* Do NOT clear the reveal's transform here. The pre-reveal offset is a CSS rule
         (html.motion-ready [data-reveal="children"] > * { transform: translateY(24px) }), not an
         inline value, so clearProps deletes GSAP's y:0 and the CSS offset snaps straight back —
         every revealed element lands 24px low. The hover jump was the magnetic handler, and that is
         fixed at its source with data-no-magnet. */
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
      /* data-no-magnet opts a button out. The per-event inline translate reads as a jump on a wide
         button the cursor crosses slowly, so those get colour-only hover feedback instead. */
      if (btn.hasAttribute('data-no-magnet') || btn.closest('[data-no-magnet]')) return;
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

  /* ---------------- custom dropdown ---------------- */
  /* A native <select>'s open list is drawn by the browser, so its hover row ignores the stylesheet
     entirely — that is the system grey the owner saw while every input showed the site's rust. This
     builds a themed listbox FROM the existing <select>: the options stay defined once in the markup,
     the form still submits through the select (which the form code already reads), and with JS off
     the native control is what the visitor gets. */
  function initDropdowns() {
    Array.prototype.forEach.call(document.querySelectorAll('select[data-dropdown]'), function (sel) {
      var field = sel.closest('.form-field');
      if (!field) return;
      var base = sel.id || ('dd-' + Math.random().toString(36).slice(2, 7));
      var dd = document.createElement('div'); dd.className = 'dd';
      var btn = document.createElement('button');
      btn.type = 'button'; btn.id = base + '-btn'; btn.className = 'dd-btn';
      btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
      var val = document.createElement('span'); val.className = 'dd-value placeholder';
      var chev = document.createElement('span'); chev.className = 'dd-chev'; chev.setAttribute('aria-hidden', 'true');
      chev.innerHTML = '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.5 6 6.5 11 1.5"/></svg>';
      btn.appendChild(val); btn.appendChild(chev);
      var list = document.createElement('div'); list.className = 'dd-list'; list.setAttribute('role', 'listbox');
      var opts = Array.prototype.map.call(sel.options, function (o, i) {
        var d = document.createElement('div');
        d.className = 'dd-opt'; d.id = base + '-opt-' + i;
        d.setAttribute('role', 'option'); d.setAttribute('data-value', o.value);
        d.setAttribute('aria-selected', 'false'); d.textContent = o.textContent;
        list.appendChild(d); return d;
      });
      dd.appendChild(btn); dd.appendChild(list);
      /* The field's <label for> now points at the button (the control a visitor can see and reach), which
         left the hidden <select> with no accessible name — a P1 "input without label" on every demo
         page. Name it from the same label text, here, so the two can never drift. */
      var lblEl = field.querySelector('label');
      if (lblEl) sel.setAttribute('aria-label', lblEl.textContent.trim().replace(/\s*\(optional\)\s*$/i, ''));
      /* the select stays in the form (it is what submits) but leaves the tab order */
      sel.classList.add('dd-native'); sel.setAttribute('tabindex', '-1');
      field.appendChild(dd);
      var lab = field.querySelector('label');
      if (lab) { if (!lab.id) lab.id = base + '-label'; lab.setAttribute('for', btn.id); btn.setAttribute('aria-labelledby', lab.id); }

      var active = -1;
      function sync() {
        var cur = opts.filter(function (d) { return d.getAttribute('data-value') === sel.value; })[0];
        val.textContent = cur ? cur.textContent : (opts[0] ? opts[0].textContent : '');
        val.classList.toggle('placeholder', !sel.value);
        opts.forEach(function (d) { d.setAttribute('aria-selected', d === cur ? 'true' : 'false'); });
      }
      function mark() {
        opts.forEach(function (d, i) { d.classList.toggle('active', i === active); });
        if (opts[active]) {
          var r = opts[active].getBoundingClientRect(), lr = list.getBoundingClientRect();
          if (r.top < lr.top) list.scrollTop -= (lr.top - r.top);
          else if (r.bottom > lr.bottom) list.scrollTop += (r.bottom - lr.bottom);
        }
      }
      function open(state) {
        dd.classList.toggle('open', state);
        btn.setAttribute('aria-expanded', state ? 'true' : 'false');
        if (state) {
          active = 0;
          opts.forEach(function (d, i) { if (d.getAttribute('data-value') === sel.value) active = i; });
          mark();
        } else { opts.forEach(function (d) { d.classList.remove('active'); }); }
      }
      function pick(d) {
        sel.value = d.getAttribute('data-value');
        sync();
        /* the form's own validation listens for these on the select */
        ['input', 'change', 'blur'].forEach(function (t) { sel.dispatchEvent(new Event(t, { bubbles: true })); });
        open(false); btn.focus();
      }
      btn.addEventListener('click', function () { open(!dd.classList.contains('open')); });
      btn.addEventListener('keydown', function (e) {
        var k = e.key, isOpen = dd.classList.contains('open');
        if (!isOpen && (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ')) { e.preventDefault(); open(true); return; }
        if (k === 'Escape' || k === 'Tab') { open(false); return; }
        if (k === 'ArrowDown') { e.preventDefault(); active = Math.min(opts.length - 1, active + 1); mark(); }
        else if (k === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); mark(); }
        else if (k === 'Home') { e.preventDefault(); active = 0; mark(); }
        else if (k === 'End') { e.preventDefault(); active = opts.length - 1; mark(); }
        else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (opts[active]) pick(opts[active]); }
      });
      opts.forEach(function (d, i) {
        d.addEventListener('click', function () { pick(d); });
        d.addEventListener('mouseenter', function () { active = i; mark(); });
      });
      document.addEventListener('click', function (e) { if (!dd.contains(e.target)) open(false); });
      if (sel.form) sel.form.addEventListener('reset', function () { setTimeout(sync, 0); });
      /* A programmatic value change — the demo page preselecting an industry from ?for= — has to reach
         the button label as well. The <select> is the value holder; the button is what the visitor reads. */
      sel.addEventListener('change', sync);
      sync();
    });
  }

  /* ---------------- demo page context ----------------
     A contextual CTA can only stay contextual if the click carries the context. ?for=<key> is resolved
     against the map on the demo page, and lands in three places: the hidden field the form submits,
     the industry preselection, and the line above the form. Without it the visitor re-explains what
     they were just reading. */
  function initDemoContext() {
    var el = document.getElementById('demo-context');
    if (!el) return;
    var map;
    try { map = JSON.parse(el.textContent); } catch (e) { return; }
    var key = '';
    try { key = new URLSearchParams(location.search).get('for') || ''; } catch (e) { }
    var ctx = map[key];
    /* A service card links with ?for=service-<slug> — a per-SERVICE context, not a per-page one. */
    if (!ctx && key.indexOf('service-') === 0) {
      var svcEl = document.getElementById('demo-services');
      var svc = {};
      try { svc = JSON.parse(svcEl.textContent); } catch (e) { }
      var nm = svc[key.slice(8)];
      if (nm) ctx = { about: 'the ' + nm + ' service', industry: '' };
    }
    if (!ctx) return;
    var form = document.getElementById('demo-form');
    if (!form) return;
    /* 1. the form submits what the visitor was asking about */
    var hid = form.querySelector('input[name="context"]');
    if (hid) hid.value = ctx.about + ' (' + key + ')';
    /* 2. preselect the industry, where the page maps to one */
    if (ctx.industry) {
      var sel = document.getElementById('d-industry');
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          /* Case-insensitive: the taxonomy writes "Healthcare & Dental", the context map may not. */
          if (sel.options[i].textContent.trim().toLowerCase() === ctx.industry.trim().toLowerCase()) {
            sel.value = sel.options[i].value || ctx.industry;
            break;
          }
        }
        if (sel.value) sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    /* 3. say it back, so the form does not read as a cold generic form */
    var line = document.querySelector('[data-demo-context-line]');
    var wrap = document.querySelector('[data-demo-context]');
    if (line) line.textContent = ctx.about;
    if (wrap) wrap.hidden = false;
  }

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
          if (first) {
            /* A dropdown's native <select> is hidden, so focusing it would do nothing — its button is
               what the visitor can actually see and reach. */
            var fld = first.closest('.form-field');
            var ddb = fld ? fld.querySelector('.dd-btn') : null;
            (ddb || first).focus();
          }
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
      if (cta) {
        cta.href = d.href;
        var lbl = cta.querySelector('[data-trade-cta-label]');
        if (lbl) lbl.textContent = 'See the ' + d.name + ' playbook';
      }
      try { history.replaceState(null, '', key === data[0].key ? location.pathname : '?trade=' + key); } catch (e) { }
      A.send('calculator_use', { type: 'trade_picker', value: key });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { select(c.dataset.trade); }); });
    var params = new URLSearchParams(location.search);
    /* The default must come from the taxonomy itself: 'hvac' was the old flat default and stopped
       existing the day the umbrella taxonomy landed, which left the preview panel permanently empty. */
    var want = params.get('trade');
    select(byKey[want] ? want : data[0].key);
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

    /* The "current" line must sit BELOW the point an anchor click parks its target at, which is that
       target's own CSS scroll-margin-top PLUS ANCHOR_OFFSET. It used to be a flat 140px while a
       click lands its target at ~200px, so the group just clicked was still under the line, the spy
       picked the PREVIOUS one, and the rail highlighted one item behind on EVERY click — most
       visible on the short D group, whose predecessor is the very tall C group. */
    var first = null;
    for (var gi = 0; gi < groups.length; gi++) { if (groups[gi]) { first = groups[gi]; break; } }
    var LINE = (first ? parseFloat(getComputedStyle(first).scrollMarginTop) || 0 : 0) + ANCHOR_OFFSET + 24;

    function update() {
      var idx = 0;
      groups.forEach(function (g, i) { if (g && g.getBoundingClientRect().top < LINE) idx = i; });
      links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
    }

    /* Service groups are <details>, so a rail link has to OPEN the group it points at — otherwise
       the target is a collapsed box and the anchor scrolls to nothing. Same for a cold deep link. */
    var openTarget = function (hash) {
      if (!hash || hash.length < 2) return;
      var t = document.getElementById(hash.slice(1));
      if (t && t.tagName === 'DETAILS') t.open = true;
    };
    /* Highlight the clicked item immediately and HOLD it while the smooth scroll runs, so the rail
       does not flick through every group on the way down. The hold releases when the scroll actually
       settles (three frames without movement, 2.5s cap), then the spy takes over from real geometry. */
    var lock = false;
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        openTarget(a.getAttribute('href'));
        var i = links.indexOf(a);
        links.forEach(function (x, n) { x.classList.toggle('active', n === i); });
        lock = true;
        var last = window.scrollY, still = 0, t0 = Date.now();
        (function settle() {
          var y = window.scrollY;
          still = Math.abs(y - last) < 0.5 ? still + 1 : 0;
          last = y;
          if (still < 3 && Date.now() - t0 < 2500) { requestAnimationFrame(settle); return; }
          lock = false;
          update();
        })();
      });
    });
    openTarget(location.hash);
    window.addEventListener('hashchange', function () { openTarget(location.hash); });
    /* Re-measure reveals after a toggle: cards inside a group that was collapsed when its trigger
       would have fired are still at the CSS pre-state until ScrollTrigger re-evaluates them. */
    Array.prototype.forEach.call(document.querySelectorAll('details.svc-group'), function (d) {
      d.addEventListener('toggle', function () {
        if (d.open && window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh();
      });
    });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking || lock) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    update();
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
        /* Ten questions, two points each. The thresholds are 80% and 50% of 20. */
        var badge = score >= 16 ? 'Governed' : score >= 10 ? 'Emerging' : 'Exposed';
        root.querySelector('[data-rc-score]').textContent = score + '/20';
        root.querySelector('[data-rc-note]').textContent = badge + ' — ' + (score >= 16 ? 'your posture is strong; we can stress-test it.' : score >= 10 ? 'good bones, real gaps. The demo maps them.' : 'meaningful exposure. The demo is where we start.');
        /* Carry the score into the form itself, so the lead arrives with it attached rather than as a
           number in an analytics event nobody reads. */
        var hs = root.querySelector('[data-rc-hidden-score]'), hb = root.querySelector('[data-rc-hidden-band]');
        if (hs) hs.value = score + '/20';
        if (hb) hb.value = badge;
        A.send('report_card', { score: score, band: badge });
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
        a: 'That is not in our approved site knowledge, so I will not guess. A human from HazirMinds will answer it properly — reach us at contact@hazirminds.ai, or book a free demo and we will bring the answer with receipts.',
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
    initDropdowns();
    initDemoContext();
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
