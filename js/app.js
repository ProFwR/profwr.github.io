/* ============================================
   APP - Main entry point
   ============================================ */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    Navigation.init();
    ScrollAnimations.init();
    Interactions.init();

    requestAnimationFrame(() => {
      setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('loaded');
      }, 100);
    });
  }
})();
