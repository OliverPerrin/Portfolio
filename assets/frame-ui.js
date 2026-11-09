// Small effects shared by the mono pages: decoding headings and a scroll-progress value.
(() => {
'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

// Scroll progress (0 to 1) as a CSS variable, for scrubbers and parallax.
let pending = false;
function progress() {
    pending = false;
    const max = Math.max(1, root.scrollHeight - innerHeight);
    root.style.setProperty('--scroll', (scrollY / max).toFixed(4));
}
addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(progress); } }, { passive: true });
addEventListener('resize', progress);
progress();

// Headings marked data-decode resolve from glyph noise into their text.
// Screen readers get the final text from a visually hidden copy throughout.
const glyphs = '▮▯/\\|_-+=<>#01';
function decode(el) {
    const text = el.textContent;
    if (!text.trim() || el.children.length) return;
    const hidden = document.createElement('span');
    hidden.className = 'sr-only';
    hidden.textContent = text;
    const noise = document.createElement('span');
    noise.setAttribute('aria-hidden', 'true');
    el.replaceChildren(hidden, noise);
    const settle = [...text].map((ch, i) => ch === ' ' ? 0 : 180 + i * 38 + Math.random() * 260);
    const start = performance.now();
    function frame(now) {
        const t = now - start;
        let done = true;
        noise.textContent = [...text].map((ch, i) => {
            if (t >= settle[i]) return ch;
            done = false;
            return glyphs[(Math.random() * glyphs.length) | 0];
        }).join('');
        if (done) el.replaceChildren(text);
        else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
const targets = [...document.querySelectorAll('[data-decode]')];
if (!reduced.matches && 'IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        decode(entry.target);
    }), { threshold: .4 });
    targets.forEach(el => io.observe(el));
}
})();
