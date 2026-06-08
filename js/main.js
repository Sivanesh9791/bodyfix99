'use strict';

const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

(function initMobileNav() {
  const hamburger = qs('.hamburger');
  const mobileNav = qs('.mobile-nav');
  const overlay   = qs('.mobile-nav__overlay');
  if (!hamburger || !mobileNav) return;
  function openNav() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeNav() : openNav();
  });
  if (overlay) overlay.addEventListener('click', closeNav);
  qsa('a', mobileNav).forEach(link => { link.addEventListener('click', closeNav); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  
  const closeBtn = document.getElementById('mobileNavClose');
  if(closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }
})();

(function initNavbarScroll() {
  const navbar = qs('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });
})();

(function initScrollEffectsAndObserver() {
  // Intersection Observer for fade-ins and headings
  const targets = qsa('.fade-in, h1, h2, h3');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  targets.forEach(el => observer.observe(el));

  // Trigger on load for elements already in upper viewport
  document.addEventListener('DOMContentLoaded', () => {
    const immediateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          immediateObserver.unobserve(entry.target);
        }
      });
    });
    targets.forEach(el => immediateObserver.observe(el));
    
    // Smooth hero text entrance
    const heroTitle = qs('.hero__title');
    if(heroTitle) heroTitle.classList.add('visible');
  });
})();

(function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.navbar__links a, .mobile-nav a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if(linkHref) {
       const linkFile = linkHref.split('/').pop();
       if (linkFile === currentPath) link.classList.add('active');
    }
  });
})();

(function initFinalTouches() {
  // 1. Progress Bar
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  document.body.appendChild(progressBar);
  
  // 2. Scroll to top
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scroll-top';
  scrollTopBtn.innerHTML = '&#x2191;';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopBtn);
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll Event Listener
  window.addEventListener('scroll', () => {
    // ProgressBar Update
    const scrollPos = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.transform = `scaleX(${scrollPos / docHeight})`;
    }
    
    // Scroll To Top Visibility
    if (scrollPos > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }, { passive: true });

  // 3. Floating Phone Button (mobile only)
  const floatingBook = document.createElement('a');
  floatingBook.id = 'floating-book';
  floatingBook.href = "http://ramizosteopath.setmore.com/r";
  floatingBook.target = "_blank";
  floatingBook.innerHTML = '📞 Book Now';
  document.body.appendChild(floatingBook);
})();
