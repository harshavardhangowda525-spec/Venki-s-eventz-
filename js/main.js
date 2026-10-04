/* ==========================================================================
   VENKI'S EVENTZ — INTERACTIONS & MOTION
   Content lives in js/config.js. This file renders it and runs animation.
   ========================================================================== */
(() => {
  'use strict';

  const SITE = window.SITE || {};
  const B = SITE.business || {};
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const canAnimate = !!(gsap && ScrollTrigger) && !reducedMotion;

  if (!canAnimate) root.classList.add('no-motion');

  /* ------------------------------------------------------------------
     LINKS & BUSINESS INFO
     ------------------------------------------------------------------ */
  const links = {
    tel: `tel:${B.phoneIntl || '+919538334455'}`,
    whatsapp: waLink(B.whatsappMessage || ''),
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(B.mapQuery || '')}`
  };

  function waLink(message) {
    return `https://wa.me/${B.whatsapp || '919538334455'}?text=${encodeURIComponent(message)}`;
  }

  $$('[data-biz]').forEach(el => {
    const value = B[el.dataset.biz];
    if (value) el.textContent = value;
  });
  $$('[data-biz-href]').forEach(el => {
    const href = links[el.dataset.bizHref];
    if (href) el.setAttribute('href', href);
  });
  $$('[data-social]').forEach(el => {
    const url = (B.social || {})[el.dataset.social];
    if (url) { el.href = url; el.hidden = false; }
  });
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     IMAGES (from config) + graceful fallback
     ------------------------------------------------------------------ */
  const markFailed = img => img.parentElement && img.parentElement.classList.add('img-fallback');
  document.addEventListener('error', e => {
    if (e.target && e.target.tagName === 'IMG') markFailed(e.target);
  }, true);

  const images = SITE.images || {};
  $$('img[data-img]').forEach(img => {
    const src = images[img.dataset.img];
    if (src && img.getAttribute('src') !== src) img.src = src;
    if (img.complete && img.getAttribute('src') && img.naturalWidth === 0) markFailed(img);
  });

  /* ------------------------------------------------------------------
     RENDER: STATS
     ------------------------------------------------------------------ */
  const statsGrid = $('#statsGrid');
  if (statsGrid) {
    const stats = (SITE.stats || []).filter(s => typeof s.value === 'number');
    statsGrid.innerHTML = stats.map(s => `
      <div class="stat reveal">
        <div class="stat__value"><span class="stat__num" data-count="${s.value}">${s.value}</span>${s.suffix ? `<sup>${escapeHTML(s.suffix)}</sup>` : ''}</div>
        <div class="stat__label">${escapeHTML(s.label)}</div>
      </div>`).join('');
    if (!stats.length) statsGrid.closest('.stats').hidden = true;
  }

  /* ------------------------------------------------------------------
     RENDER: GALLERY
     ------------------------------------------------------------------ */
  const gallery = SITE.gallery || [];
  const galleryGrid = $('#galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = gallery.map((g, i) => `
      <button type="button" class="gallery__item${g.tall ? ' is-tall' : ''}" data-index="${i}" data-cursor="view"
              aria-label="View image: ${escapeHTML(g.caption || g.alt || '')}">
        <img src="${escapeHTML(g.src)}" alt="${escapeHTML(g.alt || '')}" loading="lazy" decoding="async">
        <span class="gallery__overlay"><small>${escapeHTML(g.category || '')}</small><strong>${escapeHTML(g.caption || '')}</strong></span>
      </button>`).join('');
  }

  /* ------------------------------------------------------------------
     RENDER: TESTIMONIALS
     ------------------------------------------------------------------ */
  const testimonials = SITE.testimonials || [];
  const tTrack = $('#testimonialTrack');
  const tDots = $('#tDots');
  if (tTrack) {
    tTrack.innerHTML = testimonials.map((t, i) => `
      <figure class="testimonial glass${i === 0 ? ' is-active' : ''}" id="testimonial-${i}" role="tabpanel" aria-hidden="${i !== 0}">
        <span class="testimonial__mark" aria-hidden="true">“</span>
        <blockquote>${escapeHTML(t.quote)}</blockquote>
        <div class="testimonial__stars" aria-hidden="true">★★★★★</div>
        <figcaption>
          <cite>${escapeHTML(t.name)}</cite>
          <span class="testimonial__event">${escapeHTML(t.event || '')}</span>
          ${t.placeholder ? '<span class="testimonial__tag">Sample review — to be replaced</span>' : ''}
        </figcaption>
      </figure>`).join('');
    tDots.innerHTML = testimonials.map((_, i) => `
      <button type="button" role="tab" aria-label="Testimonial ${i + 1}" aria-controls="testimonial-${i}" aria-selected="${i === 0}"></button>`).join('');
    if (testimonials.length < 2) $('.testimonials__controls').hidden = true;
  }

  function escapeHTML(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ------------------------------------------------------------------
     SPLIT HEADINGS INTO WORDS (keeps <em> styling)
     ------------------------------------------------------------------ */
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span');
        w.className = 'word';
        const inner = document.createElement('span');
        inner.textContent = part;
        w.appendChild(inner);
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  $$('.split-reveal').forEach(splitWords);

  /* ------------------------------------------------------------------
     SMOOTH SCROLL (Lenis)
     ------------------------------------------------------------------ */
  let lenis = null;
  if (canAnimate && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (canAnimate) gsap.registerPlugin(ScrollTrigger);

  const lockScroll = lock => {
    document.body.classList.toggle('is-locked', lock);
    if (lenis) lock ? lenis.stop() : lenis.start();
  };

  /* ------------------------------------------------------------------
     HEADER, MENU, ACTIVE NAV
     ------------------------------------------------------------------ */
  const header = $('#header');
  const menuToggle = $('#menuToggle');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    const menuOpen = root.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > 700 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    lockScroll(open);
  }
  menuToggle.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });

  const navLinks = $$('.nav__link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id === 'location' || entry.target.id === 'cta' ? 'contact'
               : entry.target.id === 'why' ? 'gallery'
               : entry.target.id === 'testimonials' ? 'process' : entry.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach(s => sectionObserver.observe(s));

  /* ------------------------------------------------------------------
     SECTION NAVIGATION + CINEMATIC VEIL TRANSITION
     ------------------------------------------------------------------ */
  const veil = $('#veil');
  let navigating = false;

  function scrollToTarget(target) {
    const offset = target.id === 'home' ? 0 : -60;
    const targetY = target.getBoundingClientRect().top + window.scrollY + offset;
    const distance = Math.abs(targetY - window.scrollY);

    if (!canAnimate) {
      window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }
    // Long jumps: quick blur-veil cut instead of a long scroll
    if (distance > window.innerHeight * 2.2 && !navigating) {
      navigating = true;
      gsap.timeline({ onComplete: () => { navigating = false; } })
        .set(veil, { visibility: 'visible' })
        .to(veil, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .fromTo('.veil__line', { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .add(() => {
          if (lenis) lenis.scrollTo(targetY, { immediate: true, force: true });
          else window.scrollTo(0, targetY);
          ScrollTrigger.update();
        })
        .to('main, .footer', { scale: 1.015, duration: 0.01 })
        .to('main, .footer', { scale: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform' })
        .to(veil, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, '<')
        .to('.veil__line', { scaleX: 0, transformOrigin: 'right', duration: 0.4, ease: 'power2.in' }, '<')
        .set(veil, { visibility: 'hidden' })
        .set('.veil__line', { transformOrigin: '50% 50%' });
    } else if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.2, easing: t => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    // Pre-select a service in the enquiry form
    if (a.dataset.service) {
      const select = $('#f-type');
      const opt = Array.from(select.options).find(o => o.text === a.dataset.service);
      if (opt) select.value = opt.value;
    }
    if (root.classList.contains('menu-open')) setMenu(false);
    closeFab();
    scrollToTarget(target);
    history.replaceState(null, '', id === '#home' ? location.pathname : id);
    if (id === '#contact') setTimeout(() => $('#f-name').focus({ preventScroll: true }), 1300);
  });

  /* ------------------------------------------------------------------
     FLOATING CONTACT
     ------------------------------------------------------------------ */
  const fab = $('#fab');
  const fabToggle = $('#fabToggle');
  function closeFab() { fab.classList.remove('is-open'); fabToggle.setAttribute('aria-expanded', 'false'); }
  fabToggle.addEventListener('click', () => {
    const open = !fab.classList.contains('is-open');
    fab.classList.toggle('is-open', open);
    fabToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!fab.contains(e.target)) closeFab(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFab(); });

  /* ------------------------------------------------------------------
     LIGHTBOX
     ------------------------------------------------------------------ */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCaption = $('#lbCaption');
  const lbCount = $('#lbCount');
  let lbIndex = 0;
  let lbReturnFocus = null;

  function lbShow(i, animate) {
    lbIndex = (i + gallery.length) % gallery.length;
    const g = gallery[lbIndex];
    const apply = () => {
      lbImg.src = g.src;
      lbImg.alt = g.alt || '';
      lbCaption.textContent = g.caption || '';
      lbCount.textContent = `${String(lbIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
      lbImg.classList.remove('is-swapping');
    };
    if (animate && !reducedMotion) { lbImg.classList.add('is-swapping'); setTimeout(apply, 260); }
    else apply();
  }
  function lbOpen(i) {
    lbReturnFocus = document.activeElement;
    lbShow(i, false);
    lb.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('is-open')));
    lockScroll(true);
    $('#lbClose').focus();
  }
  function lbClose() {
    lb.classList.remove('is-open');
    lockScroll(false);
    setTimeout(() => { lb.hidden = true; }, reducedMotion ? 0 : 500);
    if (lbReturnFocus) lbReturnFocus.focus({ preventScroll: true });
  }
  if (galleryGrid) {
    galleryGrid.addEventListener('click', e => {
      const item = e.target.closest('.gallery__item');
      if (item) lbOpen(+item.dataset.index);
    });
  }
  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1, true));
  $('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1, true));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1, true);
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1, true);
    if (e.key === 'Tab') { // keep focus inside
      const f = $$('button', lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addSwipe(lb, dir => lbShow(lbIndex + dir, true));

  function addSwipe(el, cb) {
    let x0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) cb(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ------------------------------------------------------------------
     TESTIMONIAL SLIDER
     ------------------------------------------------------------------ */
  if (tTrack && testimonials.length > 1) {
    const slides = $$('.testimonial', tTrack);
    const dots = $$('button', tDots);
    let current = 0;
    let timer = null;
    const go = i => {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === current); s.setAttribute('aria-hidden', String(k !== current)); });
      dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === current)));
    };
    const play = () => { if (!reducedMotion) { stop(); timer = setInterval(() => go(current + 1), 7000); } };
    const stop = () => clearInterval(timer);
    $('#tPrev').addEventListener('click', () => { go(current - 1); play(); });
    $('#tNext').addEventListener('click', () => { go(current + 1); play(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { go(k); play(); }));
    const slider = $('.testimonials__slider');
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', play);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', play);
    addSwipe(tTrack, dir => { go(current + dir); play(); });
    play();
  }

  /* ------------------------------------------------------------------
     ENQUIRY FORM
     ------------------------------------------------------------------ */
  const form = $('#enquiryForm');
  const note = $('#formNote');
  const dateInput = $('#f-date');
  dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
  if (SITE.formEndpoint) note.textContent = "We'll get back to you shortly. You can also reach us on WhatsApp.";

  form.addEventListener('input', e => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('is-invalid');
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const invalid = [];
    if (!data.name || data.name.trim().length < 2) invalid.push('f-name');
    if (!data.phone || data.phone.replace(/\D/g, '').length < 10) invalid.push('f-phone');
    if (!data.eventType) invalid.push('f-type');
    $$('.field', form).forEach(f => f.classList.remove('is-invalid'));
    if (invalid.length) {
      invalid.forEach(id => document.getElementById(id).closest('.field').classList.add('is-invalid'));
      note.className = 'form__note is-error';
      note.textContent = 'Please add your name, a valid phone number and the event type.';
      document.getElementById(invalid[0]).focus();
      return;
    }

    const lines = [
      `Hi ${B.name || "Venki's Eventz"}, I'd like to enquire about an event.`,
      '',
      `Name: ${data.name.trim()}`,
      `Phone: ${data.phone.trim()}`,
      `Event Type: ${data.eventType}`,
      data.eventDate ? `Event Date: ${new Date(data.eventDate + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : '',
      data.guests ? `Guests: ${data.guests}` : '',
      data.message ? `Message: ${data.message.trim()}` : ''
    ].filter((l, i) => l || i === 1);
    const message = lines.join('\n');
    const btnLabel = $('.btn__label', form);

    if (SITE.formEndpoint) {
      btnLabel.textContent = 'Sending…';
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: `New enquiry — ${data.eventType}` })
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        note.className = 'form__note is-success';
        note.textContent = "Thank you! Your enquiry has been sent — we'll call you shortly.";
      } catch (err) {
        note.className = 'form__note is-error';
        note.innerHTML = `We couldn't send that just now. <a href="${waLink(message)}" target="_blank" rel="noopener"><u>Send via WhatsApp</u></a> or call ${escapeHTML(B.phoneDisplay)}.`;
      }
      btnLabel.textContent = 'Send Enquiry';
      return;
    }

    const url = waLink(message);
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    note.className = 'form__note is-success';
    note.innerHTML = `Thank you! WhatsApp has opened with your details — just tap send. <a href="${url}" target="_blank" rel="noopener"><u>Open again</u></a>`;
  });

  /* ------------------------------------------------------------------
     LAZY GOOGLE MAP
     ------------------------------------------------------------------ */
  const mapWrap = $('#mapWrap');
  if (mapWrap) {
    const loadMap = () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(B.mapQuery || '')}&z=16&output=embed`;
      iframe.title = `Map showing ${B.name || "Venki's Eventz"} location`;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      iframe.addEventListener('load', () => { const ph = $('.location__map-placeholder', mapWrap); if (ph) ph.remove(); });
      mapWrap.appendChild(iframe);
    };
    const mo = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { loadMap(); mo.disconnect(); }
    }, { rootMargin: '600px 0px' });
    mo.observe(mapWrap);
  }

  /* ------------------------------------------------------------------
     HERO SLIDESHOW
     ------------------------------------------------------------------ */
  const slides = $$('.hero__slide');
  if (slides.length > 1 && !reducedMotion) {
    let s = 0;
    setInterval(() => {
      if (document.hidden) return;
      slides[s].classList.remove('is-active');
      s = (s + 1) % slides.length;
      slides[s].classList.add('is-active');
    }, 7000);
  }

  /* ------------------------------------------------------------------
     GOLD DUST / BOKEH PARTICLES (canvas)
     ------------------------------------------------------------------ */
  function makeSprite(size, color) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `rgba(${color},1)`);
    grad.addColorStop(0.35, `rgba(${color},.45)`);
    grad.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  }

  class Dust {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.density = opts.density || 1;
      this.running = false;
      this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this.sprites = [makeSprite(64, '232,213,176'), makeSprite(64, '255,240,214'), makeSprite(64, '212,165,155')];
      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      this.resize();
      window.addEventListener('resize', this.resize);
      if (opts.mouse && finePointer) {
        window.addEventListener('mousemove', e => {
          this.mouse.tx = (e.clientX / window.innerWidth - 0.5) * 30;
          this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * 30;
        }, { passive: true });
      }
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.w = w; this.h = h;
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 16000) * this.density);
      this.particles = Array.from({ length: count }, () => this.spawn(true));
    }
    spawn(initial) {
      const big = Math.random() < 0.12;
      return {
        x: Math.random() * this.w,
        y: initial ? Math.random() * this.h : this.h + 20,
        r: big ? 10 + Math.random() * 22 : 1 + Math.random() * 3.2,
        vy: -(0.08 + Math.random() * 0.35) * (big ? 0.4 : 1),
        vx: (Math.random() - 0.5) * 0.15,
        a: big ? 0.08 + Math.random() * 0.12 : 0.35 + Math.random() * 0.6,
        tw: Math.random() * Math.PI * 2,
        tws: 0.01 + Math.random() * 0.03,
        depth: big ? 1.6 : 0.4 + Math.random(),
        sprite: this.sprites[big ? 2 * (Math.random() < 0.4) : (Math.random() < 0.5 ? 0 : 1)]
      };
    }
    tick() {
      if (!this.running) return;
      const { ctx, w, h, mouse } = this;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx; p.y += p.vy; p.tw += p.tws;
        if (p.y < -40 || p.x < -40 || p.x > w + 40) { this.particles[i] = this.spawn(false); continue; }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        const size = p.r * 4;
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.sprite, p.x + mouse.x * p.depth - size / 2, p.y + mouse.y * p.depth - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      this.raf = requestAnimationFrame(this.tick);
    }
    start() { if (!this.running) { this.running = true; this.raf = requestAnimationFrame(this.tick); } }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
    destroy() { this.stop(); window.removeEventListener('resize', this.resize); }
  }

  let heroDust = null;
  const heroCanvas = $('#heroParticles');
  if (heroCanvas && !reducedMotion) {
    heroDust = new Dust(heroCanvas, { density: window.innerWidth < 760 ? 0.6 : 1, mouse: true });
    const hero = $('.hero');
    let heroVisible = true;
    new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
      heroVisible && !document.hidden ? heroDust.start() : heroDust.stop();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => {
      document.hidden || !heroVisible ? heroDust.stop() : heroDust.start();
    });
  }

  /* ------------------------------------------------------------------
     CUSTOM CURSOR (desktop)
     ------------------------------------------------------------------ */
  if (finePointer && !reducedMotion) {
    root.classList.add('has-cursor');
    const cursor = $('#cursor');
    const dot = $('#cursorDot');
    const label = $('.cursor__label', cursor);
    let mx = -100, my = -100, cx = -100, cy = -100, moving = false;

    const loop = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) requestAnimationFrame(loop);
      else moving = false;
    };
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cursor.classList.remove('is-hidden'); dot.classList.remove('is-hidden');
      if (!moving) { moving = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    window.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

    const setState = (cls, text) => {
      cursor.classList.remove('is-button', 'is-expand', 'is-label');
      if (cls) cursor.classList.add(cls);
      label.textContent = text || '';
    };
    document.addEventListener('mouseover', e => {
      const t = e.target;
      const tagged = t.closest('[data-cursor]');
      if (tagged) {
        const type = tagged.dataset.cursor;
        if (type === 'view') return setState('is-label', 'VIEW');
        if (type === 'enquire') return setState('is-label', 'ENQUIRE');
        if (type === 'expand') return setState('is-expand');
      }
      if (t.closest('a, button, select, label')) return setState('is-button');
      if (t.tagName === 'IMG') return setState('is-expand');
      setState(null);
    });
  }

  /* ------------------------------------------------------------------
     MOTION (GSAP + ScrollTrigger)
     ------------------------------------------------------------------ */
  const preloader = $('#preloader');

  if (!canAnimate) {
    preloader.classList.add('is-skipped');
    return;
  }

  // ---------- Preloader → hero intro ----------
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem('ve-intro') === '1'; sessionStorage.setItem('ve-intro', '1'); } catch (e) { /* storage blocked */ }

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero__media', { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .fromTo('.hero__brand', { opacity: 0, y: 20, letterSpacing: '.4em' }, { opacity: 1, y: 0, letterSpacing: '.08em', duration: 1.4 }, 0.3)
      .fromTo('.hero__brand-line', { scaleX: 0 }, { scaleX: (i) => (i ? -1 : 1), duration: 1.2 }, 0.5)
      .set('.hero__title', { opacity: 1 }, 0.8)
      .to('.hero__title .line > span', { y: 0, duration: 1.3, stagger: 0.16, ease: 'expo.out' }, 0.9)
      .fromTo('.hero__sub', { opacity: 0, y: 16, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }, 1.6)
      .fromTo('.hero__actions', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1.9)
      .fromTo('.hero__meta', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.2)
      .fromTo('.hero__ornament path', { strokeDasharray: 900, strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 3, ease: 'power2.inOut' }, 0.6)
      .fromTo('.header', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, clearProps: 'transform,opacity' }, 1.2)
      .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, 2.4);
    if (heroDust) heroDust.start();
  }

  if (seenIntro) {
    preloader.classList.add('is-skipped');
    heroIntro();
  } else {
    lockScroll(true);
    const dust = new Dust($('#preloaderDust'), { density: 0.5 });
    dust.start();
    const done = () => {
      dust.destroy();
      preloader.classList.add('is-skipped');
      lockScroll(false);
    };
    const pt = gsap.timeline({ onComplete: done });
    pt.to('.preloader__ring circle', { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0.1)
      .to('.preloader__logo', { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.35)
      .to('.preloader__logo', { filter: 'drop-shadow(0 0 18px rgba(220,192,138,.75))', duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.6)
      .fromTo('.preloader__name', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
      .fromTo('.preloader__sub', { opacity: 0, letterSpacing: '.8em' }, { opacity: 1, letterSpacing: '.5em', duration: 0.8, ease: 'power3.out' }, 1)
      .add(heroIntro, 1.9)
      .to('.preloader__mark, .preloader__name, .preloader__sub', { opacity: 0, y: -14, filter: 'blur(6px)', duration: 0.6, stagger: 0.05, ease: 'power2.in' }, 1.8)
      .to(preloader, { opacity: 0, scale: 1.04, duration: 0.8, ease: 'power2.inOut' }, 2);
    setTimeout(() => { if (pt.progress() < 1) pt.progress(1); }, 5000); // safety net
  }

  // ---------- Hero scroll parallax ----------
  gsap.to('[data-parallax-hero]', {
    yPercent: 14, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero__content', {
    y: -80, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true }
  });
  $$('.hero__ornament').forEach(el => {
    gsap.to(el, { yPercent: -40 * parseFloat(el.dataset.speed || 0.2) * 3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });

  // ---------- Generic reveals ----------
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: (i, el) => parseFloat(el.dataset.delay || 0) })
  });
  ScrollTrigger.batch('.reveal-card', {
    start: 'top 90%', once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' })
  });
  $$('.split-reveal').forEach(el => {
    gsap.to($$('.word > span', el), {
      y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  $$('.mask-reveal').forEach(el => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.inOut' })
      .to($('img', el), { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2);
  });
  $$('.gold-rule').forEach(el => gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

  // Self-drawing decorative lines
  $$('.draw').forEach(el => {
    if (el.getAttribute('stroke-dasharray')) {
      gsap.fromTo(el, { opacity: 0, rotate: -30, transformOrigin: '50% 50%' }, { opacity: 1, rotate: 0, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      return;
    }
    let len;
    try { len = el.getTotalLength(); } catch (e) { return; } // hidden SVGs (e.g. on mobile)
    if (!len) return;
    gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Subtle image parallax
  $$('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: 0 }, {
      yPercent: parseFloat(img.dataset.parallax), ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // ---------- Stats counters ----------
  $$('.stat__num').forEach(el => {
    const end = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  // ---------- Gallery: mask reveal + parallax ----------
  $$('.gallery__item').forEach((item, i) => {
    const img = $('img', item);
    gsap.fromTo(item, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', delay: (i % 3) * 0.12,
      scrollTrigger: { trigger: item, start: 'top 92%', once: true }
    });
    gsap.fromTo(img, { yPercent: -12 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // ---------- Why choose us: features float into orbit ----------
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1101px)', () => {
    const stage = $('.why__stage');
    const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 70%', once: true } });
    tl.fromTo('.why__center', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' });
    $$('.why__feature').forEach((f, i) => {
      const sb = stage.getBoundingClientRect();
      const fb = f.getBoundingClientRect();
      const dx = sb.left + sb.width / 2 - (fb.left + fb.width / 2);
      const dy = sb.top + sb.height / 2 - (fb.top + fb.height / 2);
      tl.fromTo(f, { x: dx * 0.8, y: dy * 0.8, scale: 0.4, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0.4 + i * 0.12);
    });
    // gentle continuous float once settled
    tl.add(() => {
      $$('.why__feature').forEach((f, i) => {
        gsap.to(f, { y: i % 2 ? 8 : -8, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    });
    gsap.to('.why__orbit', { rotate: 40, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  mm.add('(max-width: 1100px)', () => {
    gsap.fromTo('.why__center', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.why__center', start: 'top 85%', once: true } });
    gsap.set('.why__feature', { opacity: 0, y: 30 });
    ScrollTrigger.batch('.why__feature', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })
    });
  });

  // ---------- Timeline: line draws, steps illuminate ----------
  const timeline = $('#timeline');
  if (timeline) {
    const spark = $('.timeline__spark', timeline);
    gsap.to('.timeline__fill', {
      scaleY: 1, ease: 'none',
      scrollTrigger: {
        trigger: timeline, start: 'top 65%', end: 'bottom 65%', scrub: 0.6,
        onUpdate: self => { spark.style.top = `${self.progress * 100}%`; }
      }
    });
    $$('.timeline__step', timeline).forEach(step => {
      const num = $('.timeline__num', step);
      ScrollTrigger.create({
        trigger: step, start: 'top 65%',
        onEnter: () => {
          step.classList.add('is-lit');
          gsap.fromTo(num, { scale: 0.7, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(2)' });
        },
        onLeaveBack: () => step.classList.remove('is-lit')
      });
    });
  }

  // ---------- Cinematic CTA ----------
  const ctaTl = gsap.timeline({ scrollTrigger: { trigger: '.cta', start: 'top 60%', once: true } });
  ctaTl.fromTo('.cta .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .fromTo('.cta__title', { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0.15)
    .fromTo('.cta__line path:first-child', { strokeDasharray: 400, strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.5)
    .fromTo('.cta__line path:last-child', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.8, ease: 'back.out(2)' }, 1)
    .fromTo('.cta__actions .btn', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'expo.out', clearProps: 'transform' }, 0.9);
  gsap.fromTo('.cta__media img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.cta__overlay', { opacity: 0.4 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true } });

  // Recalculate positions once fonts & images settle
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
