/* ======================================================================
   TITAN FITNESS — SCRIPT.JS
   Vanilla ES6+ · Modular handlers
   ====================================================================== */

(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ===================================================================
     1. LOADER
     =================================================================== */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('done'), 600);
  });

  /* ===================================================================
     2. CURRENT YEAR
     =================================================================== */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===================================================================
     3. NAVBAR — scroll state, active link, mobile menu
     =================================================================== */
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  const navAnchors = $$('#navLinks a');

  // scroll style
  const onScrollNav = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  on(window, 'scroll', onScrollNav, { passive: true });
  onScrollNav();

  // mobile toggle
  on(hamburger, 'click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // close on link tap
  navAnchors.forEach(a => on(a, 'click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  }));

  // active section highlight
  const sections = $$('section[id]');
  const setActive = () => {
    const y = window.scrollY + 120;
    let current = '';
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  };
  on(window, 'scroll', setActive, { passive: true });

  /* ===================================================================
     4. SCROLL PROGRESS BAR
     =================================================================== */
  const progress = $('#scrollProgress');
  on(window, 'scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  }, { passive: true });

  /* ===================================================================
     5. CUSTOM CURSOR + HOVER STATES
     =================================================================== */
  const cursor   = $('#cursor');
  const cursorF  = $('#cursorFollow');

  if (cursor && cursorF && matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0, followX = 0, followY = 0;
    on(window, 'mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    const animateCursor = () => {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      followX += (mouseX - followX) * 0.18;
      followY += (mouseY - followY) * 0.18;
      cursorF.style.transform = `translate(${followX}px, ${followY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // hover states on interactive elements
    const hoverables = 'a, button, .program-card, .blog-card, .trainer-card, .masonry-item, input, select, textarea';
    $$(hoverables).forEach(el => {
      on(el, 'mouseenter', () => { cursor.classList.add('hover'); cursorF.classList.add('hover'); });
      on(el, 'mouseleave', () => { cursor.classList.remove('hover'); cursorF.classList.remove('hover'); });
    });
  }

  /* ===================================================================
     6. SMOOTH SCROLL (extra control beyond CSS)
     =================================================================== */
  $$('a[href^="#"]').forEach(link => {
    on(link, 'click', e => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ===================================================================
     7. SCROLL REVEAL (Intersection Observer)
     =================================================================== */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ===================================================================
     8. ANIMATED COUNTERS
     =================================================================== */
  const counters = $$('.counter');
  const startCounter = (el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { startCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(startCounter);
  }

  /* ===================================================================
     9. TYPING EFFECT (hero second line)
     =================================================================== */
  const typing = $('#typing');
  if (typing) {
    const phrases = ['Transform Your Life.', 'Forge Your Strength.', 'Outwork Yesterday.'];
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        typing.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
      } else {
        typing.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 40 : 75);
    };
    tick();
  }

  /* ===================================================================
     10. BUTTON RIPPLE EFFECT
     =================================================================== */
  $$('.btn-ripple').forEach(btn => {
    on(btn, 'click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ===================================================================
     11. THEME TOGGLE (Dark <-> Light)
     =================================================================== */
  const themeBtn = $('#themeToggle');
  const stored = localStorage.getItem('titan-theme');
  if (stored === 'light') document.body.classList.add('light');
  on(themeBtn, 'click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('titan-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });

  /* ===================================================================
     12. BMI CALCULATOR
     =================================================================== */
  const bmiBtn   = $('#bmiCalc');
  const bmiH     = $('#bmiHeight');
  const bmiW     = $('#bmiWeight');
  const bmiRes   = $('#bmiResult');
  const bmiVal   = $('#bmiValue');
  const bmiCat   = $('#bmiCategory');
  const bmiMark  = $('#bmiMarker');
  const bmiTip   = $('#bmiTip');

  on(bmiBtn, 'click', () => {
    const h = parseFloat(bmiH.value), w = parseFloat(bmiW.value);
    if (!h || !w || h < 50 || w < 20) {
      alert('Enter a valid height (≥50cm) and weight (≥20kg).');
      return;
    }
    const bmi = (w / ((h / 100) ** 2));
    bmiVal.textContent = bmi.toFixed(1);

    let cat, tip;
    if (bmi < 18.5)      { cat = 'Underweight';     tip = 'Focus on calorie surplus and resistance training.'; }
    else if (bmi < 25)   { cat = 'Healthy Weight';  tip = 'Maintain with mixed training and 1.6g/kg protein.'; }
    else if (bmi < 30)   { cat = 'Overweight';      tip = 'A 500 kcal deficit + 3x strength per week.'; }
    else if (bmi < 35)   { cat = 'Obese I';         tip = 'Start with low-impact cardio, mobility, nutrition coaching.'; }
    else                 { cat = 'Obese II+';       tip = 'We recommend consulting a physician before starting.'; }
    bmiCat.textContent = cat;
    bmiTip.textContent = tip;

    // marker position on 15–40 scale
    const pct = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
    bmiMark.style.left = pct + '%';

    bmiRes.hidden = false;
  });

  /* ===================================================================
     13. CALORIE CALCULATOR (Mifflin–St Jeor)
     =================================================================== */
  const calBtn = $('#calCalc');
  on(calBtn, 'click', () => {
    const age = parseFloat($('#calAge').value);
    const w   = parseFloat($('#calWeight').value);
    const h   = parseFloat($('#calHeight').value);
    const g   = $('#calGender').value;
    const act = parseFloat($('#calActivity').value);

    if (!age || !w || !h) { alert('Enter age, weight, and height.'); return; }

    // BMR
    const bmr = g === 'male'
      ? (10 * w) + (6.25 * h) - (5 * age) + 5
      : (10 * w) + (6.25 * h) - (5 * age) - 161;
    const tdee = bmr * act;

    $('#calMaint').textContent = Math.round(tdee).toLocaleString() + ' kcal';
    $('#calLose').textContent  = Math.round(tdee - 500).toLocaleString() + ' kcal';
    $('#calGain').textContent  = Math.round(tdee + 500).toLocaleString() + ' kcal';
    $('#calResult').hidden = false;
  });

  /* ===================================================================
     14. MEMBERSHIP BILLING TOGGLE
     =================================================================== */
  const billingBtns = $$('.billing-toggle button');
  billingBtns.forEach(btn => {
    on(btn, 'click', () => {
      billingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cycle = btn.dataset.cycle;
      $$('.price .amount').forEach(a => {
        const val = cycle === 'yearly' ? a.dataset.yearly : a.dataset.monthly;
        a.textContent = val;
      });
      $$('.price .period').forEach(p => p.textContent = cycle === 'yearly' ? '/yr' : '/mo');
    });
  });

  /* ===================================================================
     15. GALLERY FILTER + LIGHTBOX
     =================================================================== */
  const filterBtns = $$('.filter-bar button');
  const items = $$('.masonry-item');

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item => {
        const show = (f === 'all' || item.dataset.cat === f);
        item.classList.toggle('hide', !show);
      });
    });
  });

  // Lightbox
  const lightbox  = $('#lightbox');
  const lbImg     = $('#lightboxImg');
  const lbClose   = $('#lightboxClose');
  const lbPrev    = $('#lightboxPrev');
  const lbNext    = $('#lightboxNext');
  let lbIndex = 0;
  let lbList = [];

  const openLb = (idx) => {
    lbList = items.filter(i => !i.classList.contains('hide'));
    lbIndex = idx;
    lbImg.src = lbList[lbIndex].querySelector('img').src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  };
  const closeLb = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); };
  const stepLb = (dir) => {
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].querySelector('img').src;
  };

  items.forEach((item, i) => on(item, 'click', () => openLb(items.indexOf(item))));
  on(lbClose, 'click', closeLb);
  on(lbPrev,  'click', () => stepLb(-1));
  on(lbNext,  'click', () => stepLb(1));
  on(lightbox, 'click', (e) => { if (e.target === lightbox) closeLb(); });
  on(document, 'keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') stepLb(1);
    if (e.key === 'ArrowLeft')  stepLb(-1);
  });

  /* ===================================================================
     16. TESTIMONIALS SLIDER (auto-play, pause on hover, dots, swipe)
     =================================================================== */
  const slider  = $('#slider');
  const slides  = $('#slides');
  const slideEls = $$('.slide', slides);
  const dotsEl  = $('#dots');
  let sIndex = 0, autoTimer = null;

  // build dots
  slideEls.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    on(dot, 'click', () => goSlide(i));
    dotsEl.appendChild(dot);
  });
  const dots = $$('button', dotsEl);

  const goSlide = (i) => {
    sIndex = (i + slideEls.length) % slideEls.length;
    slides.style.transform = `translateX(-${sIndex * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === sIndex));
  };
  const startAuto = () => { stopAuto(); autoTimer = setInterval(() => goSlide(sIndex + 1), 5500); };
  const stopAuto  = () => { if (autoTimer) clearInterval(autoTimer); };

  on($('#prevSlide'), 'click', () => { goSlide(sIndex - 1); startAuto(); });
  on($('#nextSlide'), 'click', () => { goSlide(sIndex + 1); startAuto(); });
  on(slider, 'mouseenter', stopAuto);
  on(slider, 'mouseleave', startAuto);

  // touch swipe
  let touchStartX = 0;
  on(slider, 'touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  on(slider, 'touchend',   e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) goSlide(sIndex + (diff < 0 ? 1 : -1));
  });

  startAuto();

  /* ===================================================================
     17. FAQ ACCORDION
     =================================================================== */
  $$('.acc-item').forEach(item => {
    const head = $('.acc-head', item);
    const body = $('.acc-body', item);
    on(head, 'click', () => {
      const isOpen = item.classList.contains('open');
      // close others
      $$('.acc-item.open').forEach(o => {
        o.classList.remove('open');
        $('.acc-body', o).style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ===================================================================
     18. CONTACT FORM VALIDATION
     =================================================================== */
  const cf = $('#contactForm');
  const status = $('#formStatus');

  const validators = {
    cfName:  v => v.trim().length >= 2          || 'Please enter at least 2 characters.',
    cfEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email.',
    cfMsg:   v => v.trim().length >= 10         || 'Message should be at least 10 characters.',
  };

  on(cf, 'submit', (e) => {
    e.preventDefault();
    let ok = true;
    Object.entries(validators).forEach(([id, fn]) => {
      const input = $('#' + id);
      const field = input.closest('.field');
      const errSpan = $('.err', field);
      const result = fn(input.value);
      if (result === true) {
        field.classList.remove('invalid');
        if (errSpan) errSpan.textContent = '';
      } else {
        field.classList.add('invalid');
        if (errSpan) errSpan.textContent = result;
        ok = false;
      }
    });

    if (!ok) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.remove('ok');
      return;
    }

    // simulate send
    status.textContent = 'Sending…';
    status.classList.remove('ok');
    setTimeout(() => {
      status.textContent = '✓ Message sent. We\'ll reply within one business day.';
      status.classList.add('ok');
      cf.reset();
    }, 900);
  });

  /* ===================================================================
     19. NEWSLETTER (footer)
     =================================================================== */
  const nl = $('#newsletter');
  on(nl, 'submit', e => {
    e.preventDefault();
    const msg = $('#newsletterMsg');
    msg.textContent = '✓ Subscribed. Watch your inbox.';
    nl.reset();
    setTimeout(() => msg.textContent = '', 4000);
  });

  /* ===================================================================
     20. BACK TO TOP
     =================================================================== */
  const backTop = $('#backTop');
  on(window, 'scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  on(backTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===================================================================
     21. NEWSLETTER POPUP (delayed, dismissible, remembers choice)
     =================================================================== */
  const popup      = $('#popup');
  const popupClose = $('#popupClose');
  const popupForm  = $('#popupForm');

  if (!sessionStorage.getItem('titan-popup-seen')) {
    setTimeout(() => popup.classList.add('open'), 12000);
  }
  const closePopup = () => {
    popup.classList.remove('open');
    sessionStorage.setItem('titan-popup-seen', '1');
  };
  on(popupClose, 'click', closePopup);
  on(popup, 'click', e => { if (e.target === popup) closePopup(); });
  on(popupForm, 'submit', e => {
    e.preventDefault();
    popupForm.innerHTML = '<p style="color:#22c55e;padding:18px 0;">✓ Code sent. Check your email.</p>';
    setTimeout(closePopup, 2200);
  });

  /* ===================================================================
     22. PARALLAX (subtle) on hero
     =================================================================== */
  const heroMedia = $('.hero-media img');
  if (heroMedia && matchMedia('(min-width: 760px)').matches) {
    on(window, 'scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroMedia.style.transform = `translateY(${y * 0.25}px) scale(${1.05 + y * 0.0002})`;
    }, { passive: true });
  }

})();
