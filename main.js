// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function openNav() {
  navLinks.classList.add('is-open');
  navBackdrop.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}

function closeNav() {
  navLinks.classList.remove('is-open');
  navBackdrop.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function toggleNav() {
  const isOpen = navLinks.classList.contains('is-open');
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
}

navToggle.addEventListener('click', toggleNav);

// Close when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close when tapping the dimmed backdrop
navBackdrop.addEventListener('click', closeNav);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
    closeNav();
    navToggle.focus();
  }
});

// If the viewport is resized past the mobile breakpoint while open, reset state
window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && navLinks.classList.contains('is-open')) {
    closeNav();
  }
});

// Scroll reveal for sections
const revealTargets = document.querySelectorAll('.section');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));