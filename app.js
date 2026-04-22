// Default to dark theme unless user previously chose light
document.body.classList.remove('light-theme');

// ---------- Smooth scrolling ----------
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (target && target.length > 1) {
            e.preventDefault();
            lenis.scrollTo(target);
        }
    });
});

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function renderThemeIcon(isDark) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('svg');
    if (!icon) return;
    if (isDark) {
        icon.innerHTML = `
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="12" y1="2" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
        `;
    } else {
        icon.innerHTML = `<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path>`;
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    renderThemeIcon(false);
} else {
    renderThemeIcon(true);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        renderThemeIcon(!isLight);
    });
}

// ---------- Active nav link ----------
(function markActiveNavLink() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (href === path || (path === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });
})();

// ---------- Fade-ins ----------
gsap.utils.toArray('.fade-in, .fade-in-up').forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: 16 },
        {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        }
    );
});

// ---------- Contact form (optional / mailto fallback) ----------
function sendEmail(event) {
    event.preventDefault();
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const subject = document.getElementById('subject')?.value || '';
    const message = document.getElementById('message')?.value || '';
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:oliver.t.perrin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const form = document.getElementById('contactForm');
    if (form) form.reset();
}
window.sendEmail = sendEmail;
