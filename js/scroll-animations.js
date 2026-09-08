/* ============================================
   SCROLL ANIMATIONS - IntersectionObserver
   ============================================ */

const ScrollAnimations = (() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (prefersReducedMotion) {
      // Show all elements immediately
      document.querySelectorAll('.anim-fade-up, .anim-stagger').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    observeFadeUp();
    observeStagger();
    observeProcessSteps();
    observePathList();
  }

  function observeFadeUp() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Skip hero elements - they use the 'loaded' class instead
    document.querySelectorAll('.anim-fade-up:not(.hero .anim-fade-up)').forEach(el => {
      observer.observe(el);
    });
  }

  function observeStagger() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.anim-stagger').forEach(el => {
      observer.observe(el);
    });
  }

  function observeProcessSteps() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.think-process').forEach(el => {
      observer.observe(el);
    });
  }

  function observePathList() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.path-list').forEach(el => {
      observer.observe(el);
    });
  }

  return { init };
})();
