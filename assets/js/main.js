/*=============== FILTERS TABS (con ARIA y teclado) ===============*/
const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');
const tabContents = document.querySelectorAll('[data-content]');

function activateTab(tab) {
  const target = document.querySelector(tab.dataset.target);
  // Actualizar panels
  tabContents.forEach((panel) => {
    panel.classList.remove('filters__active');
    panel.setAttribute('hidden', '');
  });
  if (target) {
    target.classList.add('filters__active');
    target.removeAttribute('hidden');
    target.focus({ preventScroll: true });
    // Animar barras de habilidad si es el panel de skills
    const isSkills = target.id === 'skills';
    const meters = document.querySelectorAll('#skills .skill-meter');
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isSkills) {
      meters.forEach((m, idx) => {
        const apply = () => m.classList.add('skill-meter--active');
        if (!reduce) setTimeout(apply, 80 * idx); else apply();
      });
    } else {
      meters.forEach((m) => m.classList.remove('skill-meter--active'));
    }
  }
  // Actualizar tabs
  tabs.forEach((t) => {
    t.classList.remove('filter-tab-active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  tab.classList.add('filter-tab-active');
  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');
  tab.focus({ preventScroll: true });
  // Mover indicador deslizante del segmented control
  const parent = tab.parentElement;
  if (parent && parent.classList.contains('filters__content')) {
    const index = Array.from(parent.querySelectorAll('[role="tab"]')).indexOf(tab);
    const x = index * 100; // 0% para el primero, 100% para el segundo
    parent.style.setProperty('--seg-x', `${x}%`);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activateTab(tab));
});

if (tabList) {
  tabList.addEventListener('keydown', (e) => {
    const currentIndex = Array.from(tabs).findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let newIndex = currentIndex;
    switch (e.key) {
      case 'ArrowRight':
      case 'Right':
        newIndex = (currentIndex + 1) % tabs.length;
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'Left':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = tabs.length - 1;
        e.preventDefault();
        break;
      default:
        return;
    }
    activateTab(tabs[newIndex]);
  });
  // Inicializar posición del indicador al cargar
  const current = Array.from(tabs).find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
  if (current) activateTab(current);
}

// Al cambiar de tab fuera de teclado/click inicial, si salimos de skills, limpiar animaciones para re-animar cuando volvamos
document.addEventListener('click', (e) => {
  const isTab = e.target.closest && e.target.closest('[role="tab"]');
  if (isTab) {
    const targetSel = isTab.getAttribute('data-target');
    const isSkills = targetSel === '#skills';
    const skillsPanel = document.querySelector('#skills');
    if (skillsPanel && !isSkills) {
      skillsPanel.querySelectorAll('.skill-meter').forEach(m => m.classList.remove('skill-meter--active'));
    }
  }
});

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

if (themeButton) {
  // Previously selected topic (if user selected)
  const selectedTheme = localStorage.getItem('selected-theme');
  const selectedIcon = localStorage.getItem('selected-icon');

  // We obtain the current theme that the interface has by validating the dark-theme class
  const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? 'dark' : 'light');
  const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line');
  const setThemeAria = () => {
    const isDark = getCurrentTheme() === 'dark';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', isDark ? 'Desactivar tema oscuro' : 'Activar tema oscuro');
  };

  // We validate if the user previously chose a topic
  if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
    setThemeAria();
  } else {
    // Primera visita: respetar preferencia del sistema
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add(darkTheme);
      themeButton.classList.add(iconTheme);
      setThemeAria();
    }
  }

  // Activate / deactivate the theme manually with the button
  themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
    setThemeAria();
  });

  // Activación con teclado (Enter/Espacio)
  themeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeButton.click();
    }
  });
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
if (!prefersReducedMotion && !isSmallScreen && typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
  distance: '40px',
  duration: 1100,
    delay: 400,
  });

  sr.reveal(`.profile__border`);
  sr.reveal(`.profile__name`, { delay: 500 });
  sr.reveal(`.profile__profession`, { delay: 600 });
  sr.reveal(`.profile__social`, { delay: 700 });
  sr.reveal(`.profile__info-group`, { interval: 100, delay: 700 });
  sr.reveal(`.profile__buttons`, { delay: 800 });
  // Tabs y encabezados
  sr.reveal(`.filters__content`, { delay: 900 });
  sr.reveal(`.filters`, { delay: 1000 });
  sr.reveal(`.section__header`, { delay: 200 });
  // Proyectos y chips con stagger
  // Stagger sutil por grupos
  sr.reveal(`.projects__card`, { interval: 120, origin: 'bottom' });
  sr.reveal(`.projects__chips .chip`, { interval: 80, distance: '20px', origin: 'bottom' });
  // Grupos de skills
  sr.reveal(`.skills__group`, { interval: 120 });
  // Contact CTA
  sr.reveal(`.contact-cta__box`, { origin: 'bottom', distance: '30px', delay: 150 });
}

/*=============== PROJECT CARDS CLICKABLE + KEYBOARD ===============*/
document.querySelectorAll('.projects__card[data-href]').forEach((card) => {
  const url = card.getAttribute('data-href');
  const open = () => window.open(url, '_blank', 'noopener');
  card.addEventListener('click', (e) => {
    // Evitar doble apertura si se hace click en el botón interno
    if ((e.target.closest && e.target.closest('a')) || e.defaultPrevented) return;
    open();
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

/*=============== BACK TO TOP BUTTON ===============*/
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  const toggleBtn = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    backToTop.classList.toggle('show', y > 400);
  };
  toggleBtn();
  window.addEventListener('scroll', toggleBtn, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/*=============== PARALLAX PARTICLES (CANVAS) ===============*/
(function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height; let particles = []; let animId;
  const maxParticles = 70; // ligero
  const linkDist = 110; // distancia máxima para conectar
  const hoverRadius = 56; // radio de interacción del imán (px) — ampliado
  const magnetStrength = 0.12 * 1.15; // +15% intensidad del imán
  const magnetMaxImpulse = 0.06; // tope por frame a la aceleración del imán
  const magnetMaxSpeed = 0.38;   // velocidad máxima permitida bajo influencia del imán

  function themeColor() {
    const dark = document.body.classList.contains('dark-theme');
    return dark ? 'rgba(255,255,255,0.14)' : 'rgba(2, 20, 40, 0.22)';
  }

  function resize() {
    // Tomar tamaño del viewport si el canvas aún no reporta medidas
    const cw = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
    const ch = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
    width = cw; height = ch;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = Array.from({ length: maxParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
  // +15% más rápidos respecto al ajuste previo
  vx: (Math.random() - 0.5) * 0.299,
  vy: (Math.random() - 0.5) * 0.299,
      z: Math.random() * 1.5 + 0.5, // profundidad para parallax
    }));
  }

  // Parallax autónomo (sin mouse): cámara virtual que se desplaza suavemente con el tiempo
  let timeMs = 0;
  let lastTs = 0;
  // Puntero para interacción local (imán)
  const pointer = { x: 0, y: 0, active: false };
  const onPointerMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; };
  const onPointerLeave = () => { pointer.active = false; };
  // Usar listeners globales porque el canvas tiene pointer-events: none
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('mouseleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);

  function step(ts) {
    // Delta de tiempo para movimiento suave entre frames
    if (typeof ts === 'number') {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(64, Math.max(10, ts - lastTs)); // acotar dt 10..64ms
      lastTs = ts;
      timeMs += dt;
    } else {
      timeMs += 16;
    }

    ctx.clearRect(0, 0, width, height);
    const fillCol = themeColor();
    ctx.fillStyle = fillCol;
    const dark = document.body.classList.contains('dark-theme');
    const lineColor = dark ? '#FFFFFF' : '#021428';

    // Cámara virtual que produce un offset suave dependiente de la profundidad (parallax)
  // Parallax +15% en amplitud y velocidad
  const camX = Math.sin(timeMs * 0.000575) * 32.2; // px
  const camY = Math.cos(timeMs * 0.00046) * 25.3; // px
    for (const p of particles) {
      // Posición base aleatoria + drift propio
      p.x += p.vx; p.y += p.vy;
      // Interacción local: si el puntero está cerca (en coordenadas de dibujo), aplicar atracción
      if (pointer.active) {
        const dxp = pointer.x - (p.x + camX * p.z);
        const dyp = pointer.y - (p.y + camY * p.z);
        const d2p = dxp * dxp + dyp * dyp;
        const r2 = hoverRadius * hoverRadius;
        if (d2p > 0 && d2p < r2) {
          const d = Math.sqrt(d2p);
          const t = 1 - d / hoverRadius; // cercanía 0..1
          const f = (magnetStrength * t) / (p.z + 0.2); // ajustar por profundidad para sensación natural
          const nx = dxp / d; const ny = dyp / d; // normalizada hacia el puntero
          // Impulso limitado por frame
          let ivx = nx * f;
          let ivy = ny * f;
          const im = Math.hypot(ivx, ivy);
          if (im > magnetMaxImpulse) {
            ivx = (ivx / im) * magnetMaxImpulse;
            ivy = (ivy / im) * magnetMaxImpulse;
          }
          p.vx += ivx;
          p.vy += ivy;
          // Limitar velocidad total bajo influencia del imán
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > magnetMaxSpeed) {
            p.vx = (p.vx / sp) * magnetMaxSpeed;
            p.vy = (p.vy / sp) * magnetMaxSpeed;
          }
          // Amortiguación un poco más fuerte para suavizar
          p.vx *= 0.992;
          p.vy *= 0.992;
        }
      }
      if (p.x < -10) p.x = width + 10; if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10; if (p.y > height + 10) p.y = -10;

      const drawX = p.x + camX * p.z;
      const drawY = p.y + camY * p.z;
      ctx.beginPath(); ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2); ctx.fill();
    }
    // Conexiones entre partículas cercanas (doble bucle optimizado)
    ctx.lineWidth = 0.8;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const ax = a.x + camX * a.z; const ay = a.y + camY * a.z;
        const bx = b.x + camX * b.z; const by = b.y + camY * b.z;
        const dx = bx - ax; const dy = by - ay;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist * linkDist) {
          const d = Math.sqrt(d2);
          const t = 1 - d / linkDist; // 0..1
          const baseAlpha = dark ? 0.14 : 0.18; // muy sutil
          const alpha = baseAlpha * t * t; // desvanecimiento rápido
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = lineColor;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    animId = requestAnimationFrame(step);
  }

  function start() {
    resize();
    // Reiniciar tiempo de cámara para continuidad
    lastTs = 0;
    createParticles();
    cancelAnimationFrame(animId);
    step();
  }
  // Esperar a que el layout esté listo antes de arrancar
  const run = () => requestAnimationFrame(start);
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  // Redimensionar sin reiniciar partículas (evita "reinicios" al hacer scroll en móvil)
  let resizeTick = 0;
  function handleResize() {
    resizeTick = 0;
    const newDpr = Math.min(window.devicePixelRatio || 1, 2);
    // Solo ajustar si cambió dpr o dimensiones efectivas
    const cw = canvas.clientWidth || canvas.offsetWidth || window.innerWidth;
    const ch = canvas.clientHeight || canvas.offsetHeight || window.innerHeight;
    if (newDpr !== dpr || cw !== width || ch !== height) {
      dpr = newDpr;
      resize();
      // No recreamos partículas ni cancelamos el loop: continuidad suave
    }
  }
  window.addEventListener('resize', () => {
    if (resizeTick) cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(handleResize);
  });
  // Al cambiar tema no es necesario recrear partículas, solo se repintan con el nuevo color en cada frame
  const obs = new MutationObserver(() => {/* noop: color se toma por frame */});
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
