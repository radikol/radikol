// Lightbox
const certs = document.querySelectorAll('.cert-img-wrap');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// currentGallery holds the list of images being viewed (single image for certs,
// the full set of project images for carousels) so arrow keys/buttons can step through them
let currentGallery = null; // { images: [...], captions: [...], index: 0 }

function renderGalleryImage() {
    const g = currentGallery;
    lightboxImg.src = g.images[g.index];
    lightboxCaption.textContent = g.captions[g.index] || '';
    const showArrows = g.images.length > 1;
    lightboxPrev.classList.toggle('hidden', !showArrows);
    lightboxNext.classList.toggle('hidden', !showArrows);
}

function showPrevImage() {
    if (!currentGallery || currentGallery.images.length < 2) return;
    currentGallery.index = (currentGallery.index - 1 + currentGallery.images.length) % currentGallery.images.length;
    renderGalleryImage();
}

function showNextImage() {
    if (!currentGallery || currentGallery.images.length < 2) return;
    currentGallery.index = (currentGallery.index + 1) % currentGallery.images.length;
    renderGalleryImage();
}

function openLightbox(images, captions, startIndex) {
    currentGallery = {
        images: Array.isArray(images) ? images : [images],
        captions: Array.isArray(captions) ? captions : [captions],
        index: startIndex || 0
    };
    renderGalleryImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

certs.forEach(wrap => {
    wrap.addEventListener('click', () => {
        const src = wrap.querySelector('img').src;
        const captionEl = wrap.closest('.cert-card').querySelector('.cert-caption');
        openLightbox(src, captionEl ? captionEl.textContent : '', 0);
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    currentGallery = null;
}

// Vertical project carousels
document.querySelectorAll('.project-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot');
    const images = track.querySelectorAll('.carousel-img');
    if (!images.length) return;

    const projectTitle = carousel.closest('.project-card').querySelector('.project-title').textContent;
    const imageSrcs = Array.from(images).map(img => img.src);
    const imageCaptions = imageSrcs.map((_, i) => `${projectTitle} — image ${i + 1} of ${imageSrcs.length}`);
    const imgHeight = () => images[0].getBoundingClientRect().height;

    // Click a dot to jump to that image
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            track.scrollTo({ top: i * imgHeight(), behavior: 'smooth' });
        });
    });

    // Keep the active dot in sync while the user scrolls (inner vertical scroll only, no autoplay)
    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const index = Math.round(track.scrollTop / imgHeight());
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        }, 80);
    });

    // Click an image to open the full gallery in the lightbox, starting at that image;
    // left/right arrows (or on-screen buttons) then step through the rest of this project's images
    images.forEach((img, i) => {
        img.addEventListener('click', () => {
            openLightbox(imageSrcs, imageCaptions, i);
        });

        // Hide any image that fails to load so the placeholder gradient shows instead
        img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
    });
});

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


document.querySelectorAll('.project-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    const maxDots = 5;

    // Create dots
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');

        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

        dot.addEventListener('click', () => {
            track.scrollTo({
                top: slide.offsetTop,
                behavior: 'smooth'
            });
        });

        dotsContainer.appendChild(dot);
    });

    const allDots = Array.from(
        dotsContainer.querySelectorAll('.dot')
    );

    function updateDots() {
        const currentIndex = Math.round(
            track.scrollTop / track.clientHeight
        );

        let startIndex = 0;

        if (slides.length > maxDots) {
            startIndex = currentIndex - Math.floor(maxDots / 2);

            if (startIndex < 0) {
                startIndex = 0;
            }

            if (startIndex + maxDots > slides.length) {
                startIndex = slides.length - maxDots;
            }
        }

        allDots.forEach((dot, index) => {
            const isVisible =
                index >= startIndex &&
                index < startIndex + maxDots;

            dot.style.display = isVisible ? 'block' : 'none';

            dot.classList.toggle(
                'active',
                index === currentIndex
            );
        });
    }

    track.addEventListener('scroll', updateDots);

    // Initial state
    updateDots();
});