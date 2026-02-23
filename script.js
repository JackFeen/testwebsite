/* ============================================
   JACK FEEN — PORTFOLIO SCRIPT
============================================ */

// ---- CANVAS BACKGROUND (slow aurora gradient orbs) ----
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Each orb: base position (0–1 fraction of screen), wander range, animation speed & phase per axis
const orbDefs = [
    { bx: 0.10, by: 0.15, wx: 0.18, wy: 0.14, sx: 0.00017, sy: 0.00012, px: 0.0, py: 1.2 }, // blue,   top-left
    { bx: 0.82, by: 0.50, wx: 0.16, wy: 0.20, sx: 0.00012, sy: 0.00019, px: 2.1, py: 3.8 }, // purple, right
    { bx: 0.45, by: 0.90, wx: 0.22, wy: 0.10, sx: 0.00020, sy: 0.00015, px: 4.5, py: 0.7 }, // green,  bottom
    { bx: 0.90, by: 0.12, wx: 0.10, wy: 0.16, sx: 0.00015, sy: 0.00022, px: 1.7, py: 5.2 }, // indigo, top-right
];

const DARK_COLORS  = ['#ef5f3b', '#bf5af2', '#30d158', '#e5843b'];
const LIGHT_COLORS = ['#d4511f', '#8944ab', '#1a7f37', '#c44a18'];

const t0 = performance.now();

function toHex(v) {
    return Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
}

function drawBg() {
    const t    = performance.now() - t0;
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    const colors = dark ? DARK_COLORS : LIGHT_COLORS;
    const alpha  = dark ? 0.22 : 0.18;

    ctx.clearRect(0, 0, w, h);

    orbDefs.forEach((o, i) => {
        const cx = (o.bx + Math.sin(t * o.sx + o.px) * o.wx) * w;
        const cy = (o.by + Math.cos(t * o.sy + o.py) * o.wy) * h;
        const r  = Math.max(w, h) * 0.62;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    colors[i] + toHex(alpha));
        g.addColorStop(0.40, colors[i] + toHex(alpha * 0.15));
        g.addColorStop(1,    colors[i] + '00');

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    });

    requestAnimationFrame(drawBg);
}
drawBg();

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- THEME TOGGLE ----
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
let isDarkMode = true;

function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeLabel.textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const saved = localStorage.getItem('theme');
if (saved === 'light') { isDarkMode = false; applyTheme(false); }

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
});

// ---- MOBILE MENU ----
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
});
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- CARD MOUSE TRACKING (radial highlight effect) ----
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width  * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100) + '%');
    });
});

// ---- ACTIVE NAV LINK (scroll-position based) ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-link');

function updateActiveNav() {
    const scrollY = window.scrollY + 100; // offset so highlight triggers just after nav
    let activeId = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop) activeId = section.id;
    });

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + activeId;
        link.style.color = isActive ? 'var(--text)' : '';
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ---- HERO REVEAL ON LOAD ----
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
    });
});