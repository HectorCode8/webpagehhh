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
}

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

  // We validate if the user previously chose a topic
  if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
  }

  // Activate / deactivate the theme manually with the button
  themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
  });
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
  });

  sr.reveal(`.profile__border`);
  sr.reveal(`.profile__name`, { delay: 500 });
  sr.reveal(`.profile__profession`, { delay: 600 });
  sr.reveal(`.profile__social`, { delay: 700 });
  sr.reveal(`.profile__info-group`, { interval: 100, delay: 700 });
  sr.reveal(`.profile__buttons`, { delay: 800 });
  sr.reveal(`.filters__content`, { delay: 900 });
  sr.reveal(`.filters`, { delay: 1000 });
}
