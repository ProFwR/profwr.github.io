/**
 * PORTFOLIO MAIN JAVASCRIPT
 * Plain vanilla JavaScript — modular, performant, clean.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavIsland();
  initMobileMenu();
  initSmoothScrollLinks();
  initMagneticButtons();
  initActiveIslandLinks();
  initMagnifier();
});

/* ==========================================
   SCROLL REVEAL
   ========================================== */
function initScrollReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  });

  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => observer.observe(el));
}

/* ==========================================
   NAV ISLAND — morph on scroll
   ========================================== */
function initNavIsland() {
  const island = document.getElementById('nav-island');
  if (!island) return;

  const SCROLL_THRESHOLD = 16;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > SCROLL_THRESHOLD) {
          island.classList.add('is-scrolled');
        } else {
          island.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  // Initialize on load to reflect current scroll position
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================
   MOBILE MENU (hamburger toggle)
   ========================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const panel  = document.getElementById('mobile-nav-panel');
  if (!toggle || !panel) return;

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      toggle.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
    }
  });

  // Close panel when a link inside it is clicked
  panel.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close panel on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !panel.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ==========================================
   SMOOTH SCROLL — with navbar offset
   ========================================== */
function initSmoothScrollLinks() {
  const OFFSET = 80; // px — accounts for the fixed header area

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - OFFSET;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetTop });
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================
   ACTIVE ISLAND LINK — highlight current section
   ========================================== */
function initActiveIslandLinks() {
  const sections = document.querySelectorAll('section[id]');
  const islandLinks = document.querySelectorAll('.island-link');
  if (!sections.length || !islandLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        islandLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================
   MAGNETIC BUTTON — primary CTA only
   ========================================== */
function initMagneticButtons() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0,0,0) scale(1)';
    });
  });
}

/* ==========================================
   MAGNIFIER LENS — product screenshot zoom
   ==========================================
   Math overview:
   • The lens is a circular window into the image magnified ZOOM×.
   • background-size  = imgDisplayWidth × ZOOM  ×  imgDisplayHeight × ZOOM
   • To center the zoomed view on the cursor, the background's top-left
     must land at:
       bgX = (LENS_SIZE / 2) - (cursorX_within_image × ZOOM)
       bgY = (LENS_SIZE / 2) - (cursorY_within_image × ZOOM)
   • Clamp bgX ∈ [LENS_SIZE − bgWidth, 0], bgY ∈ [LENS_SIZE − bgHeight, 0]
     so we never reveal blank space outside the image edges.
   • lens CSS has transform: translate(-50%,-50%), so setting left/top to
     the raw clientX/Y centers the circle perfectly on the cursor.
*/
function initMagnifier() {
  // Skip on touch / coarse-pointer devices (phones, tablets)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (prefersReducedMotion) return;

  const imageArea = document.querySelector('.window-content');
  if (!imageArea) return;

  const img = imageArea.querySelector('img');
  if (!img) return;

  // ── Create the lens element once ─────────────────────────────────────
  const lens = document.createElement('div');
  lens.className = 'magnifier-lens';
  lens.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lens);

  const ZOOM      = 2.5;   // magnification factor
  const LENS_SIZE = 148;   // must match CSS width / height

  let clientX = 0;
  let clientY = 0;
  let rafId   = null;

  // ── Render callback (rAF-batched — no layout thrashing) ──────────────
  function renderLens() {
    rafId = null;

    const rect = imageArea.getBoundingClientRect();

    // Cursor position relative to the image area (px)
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    // Zoomed background dimensions
    const bgW = rect.width  * ZOOM;
    const bgH = rect.height * ZOOM;

    // Ideal top-left offset to center the cursor point inside the lens
    let bgX = LENS_SIZE / 2 - cx * ZOOM;
    let bgY = LENS_SIZE / 2 - cy * ZOOM;

    // Clamp — never slide beyond image edges (would show blank/repeat)
    bgX = Math.min(0, Math.max(LENS_SIZE - bgW, bgX));
    bgY = Math.min(0, Math.max(LENS_SIZE - bgH, bgY));

    // Position lens (translate(-50%,-50%) in CSS centers it on cursor)
    lens.style.left = clientX + 'px';
    lens.style.top  = clientY + 'px';

    // Paint the zoomed slice of the image
    lens.style.backgroundImage    = `url('${img.currentSrc || img.src}')`;
    lens.style.backgroundSize     = `${bgW}px ${bgH}px`;
    lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }

  // ── Lifecycle event listeners ─────────────────────────────────────────
  imageArea.addEventListener('mouseenter', () => {
    lens.style.display = 'block';
    requestAnimationFrame(() => lens.classList.add('is-visible'));
    imageArea.classList.add('lens-active');   // cursor: none via CSS
  });

  imageArea.addEventListener('mousemove', e => {
    clientX = e.clientX;
    clientY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(renderLens);
  });

  imageArea.addEventListener('mouseleave', () => {
    lens.classList.remove('is-visible');
    imageArea.classList.remove('lens-active');
    // Hide element after the 120ms CSS opacity transition finishes
    setTimeout(() => { lens.style.display = 'none'; }, 130);
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  });
}
