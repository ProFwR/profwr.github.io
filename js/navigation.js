/* ============================================
   NAVIGATION - Mobile menu + scroll behavior
   ============================================ */

const Navigation = (() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');
  let lastScroll = 0;
  let scrollTimeout;

  function init() {
    if (!nav || !navToggle || !navMobile) return;

    navToggle.addEventListener('click', toggleMobile);
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', smoothScroll);
    });

    updateActiveLink();
  }

  function toggleMobile() {
    const isOpen = navMobile.classList.contains('active');
    if (isOpen) {
      closeMobile();
    } else {
      openMobile();
    }
  }

  function openMobile() {
    navMobile.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    navMobile.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function onScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class
    if (scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Update active link
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 50);

    lastScroll = scrollY;
  }

  function onResize() {
    if (window.innerWidth > 768 && navMobile.classList.contains('active')) {
      closeMobile();
    }
  }

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      const href = link.getAttribute('href');
      if (href && href.includes('#') && href.includes(currentSection)) {
        link.classList.add('nav__link--active');
      }
    });
  }

  function smoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const offsetTop = target.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  return { init, closeMobile };
})();
