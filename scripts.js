// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animate score bars when visible
const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue('--score') || '0%';
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.score-fill').forEach(el => {
  const score = el.style.getPropertyValue('--score');
  el.style.setProperty('--score', score);
  scoreObserver.observe(el);
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    if (!email) return;
    const note = document.getElementById('newsletterNote');
    note.textContent = '🎉 Merci ! Vous êtes bien inscrit(e).';
    note.style.color = 'var(--green)';
    this.style.opacity = '0.5';
    this.style.pointerEvents = 'none';
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('veloelite-theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('veloelite-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

// Search
const searchInput = document.getElementById('navSearchInput');
const searchResults = document.getElementById('searchResults');

const searchData = [
  { icon: '📖', title: 'Choisir son vélo électrique en 2026', url: 'article1.html' },
  { icon: '🏆', title: 'Top 3 VAE urbains à moins de 2 500 €', url: 'article2.html' },
  { icon: '🔋', title: 'Batteries et moteurs Bosch / Shimano', url: 'article3.html' },
  { icon: '💶', title: 'Payer son vélo 1 000 € moins cher', url: 'article4.html' },
  { icon: '🚴', title: 'Avis Decathlon Elops LD 920 E', url: 'article5.html' },
  { icon: '⚡', title: 'VanMoof S5 — Sélection', url: 'index.html#selection' },
  { icon: '🏔️', title: 'Specialized Turbo Levo — Sélection', url: 'index.html#selection' },
  { icon: '📊', title: 'Comparatif complet', url: 'index.html#comparatif' },
  { icon: '⚖️', title: 'Duel VanMoof vs Cowboy', url: 'index.html#duel' },
  { icon: '📬', title: 'Contact', url: 'contact.html' },
  { icon: 'ℹ️', title: 'À propos de VeloElite', url: 'a-propos.html' },
];

if (searchInput && searchResults) {
  searchInput.addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (!q) { searchResults.classList.remove('active'); return; }
    const matches = searchData.filter(item => item.title.toLowerCase().includes(q));
    if (matches.length === 0) {
      searchResults.innerHTML = '<p class="search-empty">Aucun résultat trouvé.</p>';
    } else {
      searchResults.innerHTML = matches.map(item =>
        `<a class="search-result-item" href="${item.url}">
          <span class="search-result-icon">${item.icon}</span>
          ${item.title}
        </a>`
      ).join('');
    }
    searchResults.classList.add('active');
  });

  document.addEventListener('click', function(e) {
    if (!document.getElementById('navSearch').contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });
}

// Filtres sélection
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.bike-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Système de notation étoiles
const stars = document.querySelectorAll('.star');
const ratingFeedback = document.getElementById('ratingFeedback');
const messages = ['', 'Merci pour votre retour !', 'Merci !', 'Super, merci !', 'Excellent, merci !', '⭐ Parfait, merci beaucoup !'];

if (stars.length) {
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.dataset.val);
      stars.forEach(s => {
        s.classList.toggle('hovered', parseInt(s.dataset.val) <= val);
      });
    });
    star.addEventListener('mouseout', function() {
      stars.forEach(s => s.classList.remove('hovered'));
    });
    star.addEventListener('click', function() {
      const val = parseInt(this.dataset.val);
      stars.forEach(s => {
        s.classList.toggle('selected', parseInt(s.dataset.val) <= val);
      });
      if (ratingFeedback) ratingFeedback.textContent = messages[val];
      stars.forEach(s => { s.style.pointerEvents = 'none'; });
    });
  });
}

// Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
