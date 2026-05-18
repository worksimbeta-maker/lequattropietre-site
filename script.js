/* ════════════════════════════════════════════════════════════
   LE QUATTRO PIETRE — SCRIPT.JS v3 (premium edition)
   Stack: GSAP + ScrollTrigger + Lenis (CDN da index.html)
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ─── LENIS smooth scroll ─── */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ─── GRADIENT MESH che segue il mouse ─── */
  if (hasHover && !prefersReducedMotion) {
    const mesh = document.createElement('div');
    mesh.className = 'gradient-mesh';
    document.body.appendChild(mesh);
    setTimeout(() => mesh.classList.add('on'), 1500);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      mesh.style.setProperty('--mx', mx + 'px');
      mesh.style.setProperty('--my', my + 'px');
    }, { passive: true });
  }

  /* ─── PRELOADER con counter (più veloce: ~1s totale) ─── */
  const pl = $('#preloader');
  const plCount = $('#plCount');
  let plProgress = 0;
  const plDuration = 900; // era 1800
  const plStart = performance.now();
  const plLoop = (t) => {
    plProgress = Math.min(100, Math.round(((t - plStart) / plDuration) * 100));
    if (plCount) plCount.textContent = plProgress;
    if (plProgress < 100) requestAnimationFrame(plLoop);
  };
  requestAnimationFrame(plLoop);

  // se il documento è già caricato, parte subito
  const startPreloaderExit = () => {
    setTimeout(() => {
      if (pl) {
        pl.classList.add('done');
        setTimeout(() => {
          pl.classList.add('gone');
          startHeroIntro();
        }, 550); // era 1100
      }
    }, Math.max(0, plDuration - (performance.now() - plStart) + 80));
  };
  if (document.readyState === 'complete') {
    startPreloaderExit();
  } else {
    window.addEventListener('load', startPreloaderExit, { once: true });
  }
  // fallback hard: dopo 2.5s comunque sblocchiamo
  setTimeout(() => {
    if (pl && !pl.classList.contains('gone')) {
      pl.classList.add('done');
      setTimeout(() => { pl.classList.add('gone'); startHeroIntro(); }, 400);
    }
  }, 2500);

  /* ─── Anno footer ─── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── NAVBAR scroll state + progress ─── */
  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 50) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');

    const sp = $('.scroll-progress');
    if (sp) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      sp.style.width = progress + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE DRAWER ─── */
  const toggle = $('.nav-toggle');
  const drawer = $('#mobileDrawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    $$('.mobile-drawer a').forEach(a => a.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }));
  }

  /* ─── SMOOTH SCROLL ANCHORS (Lenis aware) ─── */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      if (lenis) {
        lenis.scrollTo(target, { offset: -navH + 1, duration: 1.4 });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - navH + 1;
        window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ════════════════════════════════════════════════════
     SPLIT TEXT (lettera per lettera)
     ════════════════════════════════════════════════════ */
  function splitLineChars(line) {
    if (line.dataset.splitted) return;
    line.dataset.splitted = '1';

    const wrap = document.createElement('span');
    wrap.style.display = 'inline-block';
    wrap.style.overflow = 'hidden';
    const html = line.innerHTML;
    line.innerHTML = '';
    line.appendChild(wrap);

    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const out = document.createDocumentFragment();

    const walk = (node, parentStyle = null) => {
      node.childNodes.forEach(child => {
        if (child.nodeType === 3) {
          const text = child.nodeValue;
          for (const ch of text) {
            if (ch === ' ') {
              const space = document.createTextNode(' ');
              if (parentStyle) {
                const span = document.createElement('span');
                span.className = parentStyle;
                span.appendChild(space);
                out.appendChild(span);
              } else out.appendChild(space);
            } else {
              const span = document.createElement('span');
              span.className = 'char' + (parentStyle ? ' ' + parentStyle : '');
              span.style.display = 'inline-block';
              span.textContent = ch;
              out.appendChild(span);
            }
          }
        } else if (child.nodeType === 1) {
          if (child.tagName === 'BR') out.appendChild(document.createElement('br'));
          else {
            const cls = child.tagName === 'EM' ? 'em-char' : (child.className || '');
            walk(child, cls);
          }
        }
      });
    };
    walk(tmp);
    wrap.appendChild(out);
  }
  function splitChars(el) {
    if (el.dataset.splitted) return;
    el.dataset.splitted = '1';
    const lines = el.querySelectorAll(':scope > .line');
    if (lines.length) lines.forEach(line => splitLineChars(line));
    else splitLineChars(el);
  }

  /* ─── HERO intro animation (snappier) ─── */
  let heroStarted = false;
  function startHeroIntro() {
    if (heroStarted) return;
    heroStarted = true;
    if (!window.gsap) return;
    const eyebrow = $('.hero-eyebrow');
    const titleLines = $$('.hero-title .line');
    const sub = $('.hero-sub');
    const ctas = $('.hero-ctas');
    const trust = $('.hero-trust');

    titleLines.forEach(line => splitLineChars(line));

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.4 })
      .from('.hero-title .char', {
        yPercent: 110,
        rotate: 3,
        duration: 0.7,
        stagger: 0.012,
        ease: 'power4.out'
      }, '-=0.25')
      .to(sub, { opacity: 1, y: 0, duration: 0.55 }, '-=0.45')
      .to(ctas, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .to(trust, { opacity: 1, y: 0, duration: 0.45 }, '-=0.35');

    startHeroSlideshow();
  }

  /* ─── Hero slideshow ─── */
  function startHeroSlideshow() {
    const slides = $$('.hero-slide');
    if (slides.length < 2) return;
    let i = 0;
    const idxEl = $('#slideIndex');
    const barEl = $('#slideBar');
    const total = slides.length;
    const dur = 5200;

    const tick = () => {
      slides[i].classList.remove('active');
      i = (i + 1) % total;
      slides[i].classList.add('active');
      if (idxEl) idxEl.textContent = String(i + 1).padStart(2, '0');
      if (barEl) {
        barEl.style.transition = 'none';
        barEl.style.width = '0';
        void barEl.offsetWidth;
        barEl.style.transition = `width ${dur}ms linear`;
        barEl.style.width = '100%';
      }
    };
    if (barEl) {
      barEl.style.transition = `width ${dur}ms linear`;
      barEl.style.width = '100%';
    }
    setInterval(tick, dur);
  }

  /* ════════════════════════════════════════════════════
     SCROLL ANIMATIONS (ScrollTrigger)
     ════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    $$('[data-split]').forEach(el => {
      if (el.classList.contains('hero-title')) return;
      splitChars(el);
      gsap.from(el.querySelectorAll('.char'), {
        yPercent: 110,
        rotate: 4,
        duration: 0.95,
        stagger: 0.012,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    $$('[data-fade]').forEach(el => {
      if (el.closest('.hero-content')) return;
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );
    });

    $$('.reveal-img').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('in')
      });
    });

    // COUNTERS
    $$('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count) || 0;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val); }
          });
        }
      });
    });

    // PARALLAX
    const eventiBg = $('.eventi-bg img');
    if (eventiBg) {
      gsap.to(eventiBg, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '.eventi',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    initHorizontalScroll();
    initNavTracking();
  }

  /* ─── HORIZONTAL PINNED SCROLL ─── */
  function initHorizontalScroll() {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const wrap = $('.esperienze-h');
    const track = $('.exp-h-track', wrap);
    if (!wrap || !track) return;

    const panels = $$('.exp-h-panel', track);
    const total = panels.length;
    const scrollLen = (total - 1) * window.innerWidth;

    gsap.to(track, {
      x: () => -((total - 1) * window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollLen}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });
  }

  /* ─── NAV ACTIVE link ─── */
  function initNavTracking() {
    const sections = ['hero', 'esperienze', 'ristorante', 'camere', 'eventi', 'storia', 'contatti']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 30%',
        end: 'bottom 30%',
        onToggle: (self) => {
          if (self.isActive) {
            $$('.nav-links a[data-nav-link]').forEach(a => {
              const isActive = a.getAttribute('href') === '#' + sec.id;
              a.classList.toggle('active', isActive);
            });
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250);
  });

  /* ════════════════════════════════════════════════════
     CUSTOM CURSOR + MAGNETIC
     ════════════════════════════════════════════════════ */
  if (hasHover && !prefersReducedMotion) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    if (dot && ring) {
      document.body.classList.add('cursor-ready');
      let x = window.innerWidth / 2, y = window.innerHeight / 2;
      let rx = x, ry = y;
      window.addEventListener('mousemove', (e) => {
        x = e.clientX; y = e.clientY;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      });
      const loop = () => {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      loop();
      $$('a, button, .exp-card, .cam-tile, .test-card, input, textarea, select, .choice').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
      });
    }

    // Magnetic buttons
    $$('.magnetic').forEach(el => {
      const strength = el.classList.contains('nav-cta') ? 0.22 : 0.32;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ════════════════════════════════════════════════════
     LIGHTBOX
     ════════════════════════════════════════════════════ */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImage');
  const lbClose = $('.lb-close');
  const lbPrev = $('.lb-prev');
  const lbNext = $('.lb-next');
  const lbLinks = $$('.lightbox-link');
  let lbIndex = 0;

  const openLB = (i) => {
    if (!lbLinks[i]) return;
    lbIndex = i;
    lbImg.src = lbLinks[i].href;
    lbImg.alt = lbLinks[i].querySelector('img')?.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };
  const closeLB = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };
  const navLB = (delta) => {
    let next = lbIndex + delta;
    if (next < 0) next = lbLinks.length - 1;
    if (next >= lbLinks.length) next = 0;
    openLB(next);
  };

  lbLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => { e.preventDefault(); openLB(i); });
  });
  lbClose?.addEventListener('click', closeLB);
  lbPrev?.addEventListener('click', () => navLB(-1));
  lbNext?.addEventListener('click', () => navLB(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') navLB(-1);
    if (e.key === 'ArrowRight') navLB(1);
  });

  /* ════════════════════════════════════════════════════
     FORM PRENOTA — campi dinamici + validazione condizionale
     ════════════════════════════════════════════════════ */
  const form = $('#prenotaForm');
  const formSuccess = $('#formSuccess');
  let formSubmitting = false;

  // imposta classe iniziale e gestisce switch tipo
  const setFormType = (tipo) => {
    if (!form) return;
    form.classList.remove('tipo-ristorante', 'tipo-camere', 'tipo-evento', 'tipo-info');
    form.classList.add('tipo-' + tipo);

    // Aggiorna label del bottone submit in base al tipo
    const subLabel = $('#submit-label');
    if (subLabel) {
      const labels = {
        ristorante: 'Prenota tavolo · risposta entro 24h',
        camere: 'Verifica disponibilità camere',
        evento: 'Richiedi sopralluogo gratuito',
        info: 'Invia richiesta info',
      };
      subLabel.textContent = labels[tipo] || 'Invia richiesta';
    }

    // Aggiorna label "Note" in base al tipo
    const noteLabel = $('#note-label');
    if (noteLabel) {
      const noteLabels = {
        ristorante: 'Note (allergie, occasione, richieste tavolo)',
        camere: 'Note (occasione, esigenze speciali, animali domestici)',
        evento: 'Note (idee, stile, vincoli particolari)',
        info: 'La tua domanda',
      };
      noteLabel.textContent = noteLabels[tipo] || 'Note';
    }

    // Aggiorna placeholder del textarea
    const noteTA = $('#note');
    if (noteTA) {
      const placeholders = {
        ristorante: 'Es. anniversario, allergia al glutine, tavolo all\'esterno...',
        camere: 'Es. animale domestico, esigenze alimentari, arrivo tardo serale...',
        evento: 'Es. stile rustico-elegante, fiori di campo, banda dal vivo, ho una sposa che adora le ortensie...',
        info: 'Scrivici qui la tua domanda...',
      };
      noteTA.placeholder = placeholders[tipo] || '';
    }

    // Refresh ScrollTrigger dopo cambio layout
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 500);
    }
  };

  // Validatori per ogni campo (gestiti dinamicamente in base al tipo)
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const telRe = /^[\d\s+()\-./]{6,20}$/;

  const validators = {
    nome:     (v) => v.trim().length >= 2 ? null : 'Inserisci nome e cognome (almeno 2 caratteri).',
    email:    (v) => emailRe.test(v.trim()) ? null : 'Email non valida (es. nome@dominio.it).',
    tel:      (v) => !v.trim() ? null : (telRe.test(v.trim()) ? null : 'Telefono non valido.'),
    ospiti:   (v) => !v ? null : (parseInt(v,10) >= 1 && parseInt(v,10) <= 40 ? null : 'Numero coperti tra 1 e 40.'),
    data:     (v) => !v ? null : (new Date(v) >= new Date(new Date().setHours(0,0,0,0)) ? null : 'La data deve essere oggi o successiva.'),
    ora:      (v) => v ? null : 'Scegli un orario.',
    checkin:  (v) => !v ? null : (new Date(v) >= new Date(new Date().setHours(0,0,0,0)) ? null : 'Check-in oggi o successivo.'),
    checkout: (v) => {
      if (!v) return null;
      const checkin = $('#checkin')?.value;
      if (checkin && new Date(v) <= new Date(checkin)) return 'Il check-out deve essere dopo il check-in.';
      return null;
    },
    tipo_evento: (v) => v ? null : 'Scegli il tipo di evento.',
  };

  // Campi obbligatori per ciascun tipo
  const requiredByType = {
    ristorante: ['nome', 'email', 'ospiti', 'data', 'ora'],
    camere:     ['nome', 'email', 'checkin', 'checkout'],
    evento:     ['nome', 'email', 'tipo_evento'],
    info:       ['nome', 'email'],
  };

  const getCurrentTipo = () => {
    return form?.querySelector('input[name="tipo"]:checked')?.value || 'ristorante';
  };

  const setError = (fieldName, msg) => {
    const input = form?.querySelector(`[name="${fieldName}"]`);
    if (!input) return;
    const wrapper = input.closest('.field') || input.parentElement;
    let err = wrapper?.querySelector('.field-error');
    if (msg) {
      input.classList.add('invalid');
      if (!err && wrapper) {
        err = document.createElement('span');
        err.className = 'field-error';
        wrapper.appendChild(err);
      }
      if (err) err.textContent = msg;
    } else {
      input.classList.remove('invalid');
      err?.remove();
    }
  };

  const validateForm = () => {
    let ok = true;
    const tipo = getCurrentTipo();
    const required = requiredByType[tipo] || [];

    // pulisci errori vecchi
    form?.querySelectorAll('.field-error').forEach(e => e.remove());
    form?.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));

    required.forEach(name => {
      const inputs = form.querySelectorAll(`[name="${name}"]`);
      // gestisce sia singolo input che radio group
      let val = '';
      if (inputs.length > 1) {
        // radio group
        const checked = Array.from(inputs).find(i => i.checked);
        val = checked?.value || '';
      } else if (inputs[0]) {
        val = inputs[0].value || '';
      }
      // required-check di base
      if (!val.trim()) {
        ok = false;
        const msg = name === 'ora' ? 'Scegli un orario.' :
                    name === 'tipo_evento' ? 'Scegli il tipo di evento.' :
                    'Campo obbligatorio.';
        setError(name, msg);
      } else {
        // validatore custom se esiste
        const fn = validators[name];
        if (fn) {
          const err = fn(val);
          if (err) { ok = false; setError(name, err); }
        }
      }
    });

    // validatori opzionali non required
    ['tel', 'checkout'].forEach(name => {
      const input = form?.querySelector(`[name="${name}"]`);
      if (!input) return;
      const fn = validators[name];
      if (fn) {
        const err = fn(input.value || '');
        if (err) { ok = false; setError(name, err); }
      }
    });

    return ok;
  };

  if (form) {
    // imposta min date su tutti i campi date
    const today = new Date().toISOString().split('T')[0];
    ['data-rist', 'checkin', 'checkout', 'data-evento'].forEach(id => {
      const el = $('#' + id, form);
      if (el) el.min = today;
    });

    // Cambio tipo
    form.querySelectorAll('input[name="tipo"]').forEach(radio => {
      radio.addEventListener('change', () => setFormType(radio.value));
    });
    setFormType(getCurrentTipo());

    // Auto-sync checkout dopo check-in
    const checkinEl = $('#checkin', form);
    const checkoutEl = $('#checkout', form);
    checkinEl?.addEventListener('change', () => {
      if (checkinEl.value) {
        const d = new Date(checkinEl.value);
        d.setDate(d.getDate() + 1);
        checkoutEl.min = d.toISOString().split('T')[0];
        if (checkoutEl.value && new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
          checkoutEl.value = checkoutEl.min;
        }
      }
    });

    // Validazione realtime
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => {
        const name = input.name;
        if (!name) return;
        const fn = validators[name];
        if (fn) {
          const val = input.type === 'radio' ?
            (form.querySelector(`[name="${name}"]:checked`)?.value || '') :
            (input.value || '');
          if (val || requiredByType[getCurrentTipo()].includes(name)) {
            const err = fn(val) || (requiredByType[getCurrentTipo()].includes(name) && !val ? 'Campo obbligatorio.' : null);
            setError(name, err);
          }
        }
      });
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) setError(input.name, null);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formSubmitting) return;
      if (!validateForm()) {
        const first = form.querySelector('.invalid');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first?.focus();
        return;
      }

      formSubmitting = true;
      const submitBtn = form.querySelector('button[type="submit"]');
      const submitLabel = submitBtn.querySelector('.btn-label');
      const origLabel = submitLabel?.textContent;
      if (submitLabel) submitLabel.textContent = 'Invio in corso...';
      submitBtn.disabled = true;

      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      data.ts = new Date().toISOString();
      data.source = 'lequattropietre.it';
      data.userAgent = navigator.userAgent;

      /* ════════════════════════════════════════════
         WEBHOOK ENDPOINT — sostituisci con n8n/Make:
         const endpoint = 'https://n8n.tuo-dominio.com/webhook/lequattropietre';
         try {
           const res = await fetch(endpoint, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(data)
           });
           if (!res.ok) throw new Error('Network error');
         } catch (err) {
           formSubmitting = false;
           submitBtn.disabled = false;
           if (submitBtn.querySelector('.btn-label')) submitBtn.querySelector('.btn-label').textContent = origLabel;
           alert("Errore di invio. Riprova o scrivici su WhatsApp al 333 8144853.");
           return;
         }
         ════════════════════════════════════════════ */

      console.log('[LeQuattroPietre · Prenota]', data);

      // simula latenza per UX (rimuovi quando colleghi webhook reale)
      await new Promise(r => setTimeout(r, 600));

      formSuccess.hidden = false;
      form.querySelectorAll('input, textarea, select, button').forEach(el => el.disabled = true);
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ════════════════════════════════════════════════════
     CHATBOT "PIETRA"
     ════════════════════════════════════════════════════ */
  const chatFab = $('#chatFab');
  const chatPanel = $('#chatPanel');
  const chatClose = $('#chatClose');
  const chatForm = $('#chatForm');
  const chatText = $('#chatText');
  const chatBody = $('#chatBody');

  const openChat = () => {
    chatPanel.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    setTimeout(() => chatText?.focus(), 200);
  };
  const closeChat = () => {
    chatPanel.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
  };

  chatFab?.addEventListener('click', () => {
    chatPanel.classList.contains('open') ? closeChat() : openChat();
  });
  chatClose?.addEventListener('click', closeChat);

  const botReplies = [
    { match: /tavolo|prenot|riserv/i, reply: "Perfetto! Per prenotare un tavolo: indica <strong>data</strong>, <strong>numero di persone</strong> e <strong>orario</strong>. Oppure scorri al modulo \"Prenota\" sopra ↑" },
    { match: /camer|dormir|alloggi|soggior|notte|hotel/i, reply: "Abbiamo <strong>7 camere</strong> d'epoca: Terra, Oliva, Oro, Pietra, Grano, Salvia, Fuoco. Per disponibilità in date specifiche scrivici qui o chiama 0575 47588." },
    { match: /matrimon|sposi|wedding|nozze/i, reply: "Organizziamo matrimoni da <strong>oltre trent'anni</strong>. Un solo matrimonio per weekend, la villa è tutta tua. Indicami una data e numero invitati: ti facciamo un preventivo personalizzato." },
    { match: /comunion|cresim|battesim|cerimo/i, reply: "Cerimonie religiose, comunioni e cresime: salone fino a 80 coperti, menù dedicati. Scrivici data e numero ospiti." },
    { match: /aziendal|business|company|evento/i, reply: "Per eventi aziendali (team building, cene di gala, presentazioni) abbiamo spazi flessibili. Raccontaci di cosa avete bisogno." },
    { match: /menu|piatti|cucin|cosa.*mangi|spec/i, reply: "Il menu cambia con le stagioni. I nostri classici: <em>pappardelle al cinghiale, ribollita, scottiglia, bistecca di Chianina alla brace, cantucci con Vin Santo</em>. <a href='pages/menu.html' target='_blank'>Sfoglia il menu →</a>" },
    { match: /orari|aperti|chiusi|quando/i, reply: "<strong>Mer–Dom · 12:30–14:30 e 19:30–22:00</strong>. Lunedì e martedì chiusi. Su prenotazione apriamo anche in giorni di chiusura per eventi privati." },
    { match: /dove|indirizz|come.*arriv|mappa|raggiun/i, reply: "<strong>Via Provinciale dei Sette Ponti 8, Castiglion Fibocchi (AR)</strong> — 15 min da Arezzo, 45 da Firenze. Parcheggio gratuito. <a href='https://www.google.com/maps/dir/?api=1&destination=Le+Quattro+Pietre+Castiglion+Fibocchi' target='_blank'>Indicazioni →</a>" },
    { match: /prezz|costo|listin|quanto/i, reply: "Ristorante alla carta (10–25€ a piatto), camere su preventivo in base alla stagione, eventi su misura. Lasciaci i tuoi contatti e ti rispondiamo entro 24 ore." },
    { match: /vegan|vegeta|glutin|allerg/i, reply: "Cucina adattabile: <strong>vegetariano, vegano, senza glutine, intolleranze</strong>. Indica le esigenze in fase di prenotazione." },
    { match: /piscin|giardin|esterno/i, reply: "<strong>Ampia piscina</strong>, giardino con ulivi secolari, vasi di terracotta. Utilizzabile dagli ospiti dell'agriturismo e durante gli eventi estivi." },
    { match: /vino|cantin|bere/i, reply: "Cantina propria di Colli Aretini: <em>Chianti DOC, Vernaccia di San Gimignano, Rosato della fattoria, Vin Santo</em>. Calice e bottiglia." },
    { match: /grazie|ciao|salve|buongiorno|buonasera/i, reply: "A presto! Per qualsiasi altra cosa siamo qui — o scrivici su WhatsApp al 333 8144853." },
  ];
  const defaultReply = "Grazie! Per una risposta precisa preferisci che ti facciamo richiamare? Lascia <strong>nome e numero</strong> qui o nel modulo Prenota ↑, oppure scrivici su <a href='https://wa.me/393338144853' target='_blank'>WhatsApp</a>.";

  const appendMsg = (text, type) => {
    const div = document.createElement('div');
    div.className = `chat-msg chat-${type}`;
    div.innerHTML = text;
    $('.chat-quick', chatBody)?.remove();
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  };
  const botRespond = (userText) => {
    setTimeout(() => {
      const hit = botReplies.find(r => r.match.test(userText));
      appendMsg(hit ? hit.reply : defaultReply, 'bot');
    }, 600);
  };

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatText.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    chatText.value = '';
    botRespond(text);
  });
  $$('.chat-quick button').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q || btn.textContent;
      appendMsg(q, 'user');
      botRespond(q);
    });
  });

  /* ─── ESC chiude tutto ─── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (chatPanel?.classList.contains('open')) closeChat();
      if (drawer?.classList.contains('open')) {
        drawer.classList.remove('open');
        toggle?.classList.remove('open');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    }
  });

  /* ════════════════════════════════════════════════════
     GOOGLE MAPS — click-to-activate overlay
     (evita scroll bloccato sopra l'iframe)
     ════════════════════════════════════════════════════ */
  const mapWrap = $('#contattiMap');
  const mapOverlay = $('#mapOverlay');
  if (mapWrap && mapOverlay) {
    mapOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      mapWrap.classList.add('active');
      // focus all'iframe per accessibilità
      const iframe = mapWrap.querySelector('iframe');
      if (iframe) {
        iframe.tabIndex = 0;
        iframe.focus();
      }
    });
    // se il mouse esce dalla mappa, disattiva
    mapWrap.addEventListener('mouseleave', () => {
      if (mapWrap.classList.contains('active')) {
        mapWrap.classList.remove('active');
        const iframe = mapWrap.querySelector('iframe');
        if (iframe) iframe.tabIndex = -1;
      }
    });
  }

})();
