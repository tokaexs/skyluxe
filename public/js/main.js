/**
 * SKYLUXE — main.js
 * Shared JS utilities loaded across all pages.
 */

// ── GLOBAL: nav scroll-state ──
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
    // Check on load
    if (window.scrollY > 60) nav.classList.add('scrolled');
  }
});

// ── AUTH STATE ──
window.SkyLuxe = window.SkyLuxe || {};

window.SkyLuxe.auth = {
  getToken: () => localStorage.getItem('skyluxe_token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('skyluxe_user')); } catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('skyluxe_token'),
  logout: () => {
    localStorage.removeItem('skyluxe_token');
    localStorage.removeItem('skyluxe_user');
    window.location.href = '/';
  }
};

// ── UPDATE NAV FOR LOGGED-IN STATE ──
(function updateNavForAuth() {
  const user = window.SkyLuxe.auth.getUser();
  const isLoggedIn = window.SkyLuxe.auth.isLoggedIn();
  if (!isLoggedIn) return;

  const signInBtn = document.getElementById('navSignIn');
  const registerBtn = document.getElementById('navRegister');

  if (signInBtn && user) {
    signInBtn.href = '/dashboard';
    const name = user.name || user.firstName || 'Member';
    signInBtn.textContent = name.split(' ')[0];
  }

  if (registerBtn && user) {
    registerBtn.href = '/dashboard';
    registerBtn.innerHTML = `<i class="fas fa-crown" style="font-size:0.75rem;"></i>&nbsp; Dashboard`;
  }
})();

// ── GLOBAL API HELPER ──
window.SkyLuxe.api = {
  base: 'http://localhost:5001',

  async post(endpoint, body) {
    const token = window.SkyLuxe.auth.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(this.base + endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async get(endpoint) {
    const token = window.SkyLuxe.auth.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(this.base + endpoint, { headers });
    return res.json();
  }
};

// ── SKELETON CARD STYLES ──
const skeletonStyle = document.createElement('style');
skeletonStyle.textContent = `
  .skeleton-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    animation: skeletonPulse 1.5s ease-in-out infinite;
  }

  .skel-line {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
    background-size: 200% 100%;
    border-radius: 6px;
    animation: skeletonShimmer 1.5s ease-in-out infinite;
  }

  @keyframes skeletonPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes skeletonShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(skeletonStyle);