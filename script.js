// Lightbox
const certs = document.querySelectorAll('.cert-img-wrap');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

certs.forEach(wrap => {
    wrap.addEventListener('click', () => {
        const src = wrap.querySelector('img').src;
        const captionEl = wrap.closest('.cert-card').querySelector('.cert-caption');
        lightboxImg.src = src;
        lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .qual-item, .soft-skill, .cert-card, .contact-card, .stat, .project-card').forEach(el => {
    observer.observe(el);
});

// Animate skill bars on scroll
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.qual-fill').forEach(bar => {
                bar.style.width = bar.style.width; // trigger reflow
                bar.classList.add('animate');
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.qual-column').forEach(col => barObserver.observe(col));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

document.getElementById('year').textContent = new Date().getFullYear();