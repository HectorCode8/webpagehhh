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
