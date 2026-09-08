/* ============================================
   INTERACTIONS - Card effects, cursor tracking
   ============================================ */

const Interactions = (() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (prefersReducedMotion) return;

    initDarkCardGlow();
    initMagneticButtons();
    initParallaxSubtle();
  }

  function initDarkCardGlow() {
    const cards = document.querySelectorAll('.dark-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }

  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn--primary, .nav__cta');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function initParallaxSubtle() {
    const diagram = document.querySelector('.hero__diagram');
    if (!diagram) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const offset = scrollY * 0.08;
          diagram.style.transform = `translateY(${-offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  return { init };
})();
