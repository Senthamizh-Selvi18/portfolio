/* ================================================================
   PORTFOLIO — script.js
   Creative animations, interactions & utilities
   ================================================================ */

/* ────────────────────────────────────────────────────────────────
   1. HERO PARTICLE CANVAS
   Floating dots connected by purple lines when nearby.
   ──────────────────────────────────────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    // Disable particle animation on mobile devices
    if (window.innerWidth <= 768) {
      canvas.style.display = "none";
      return;
    }
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    
    const COUNT = 45;
    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        dx: (Math.random() - 0.5) * 0.45,
        dy: (Math.random() - 0.5) * 0.45,
        alpha: Math.random() * 0.55 + 0.2,
    }));

    let mouseX = -9999, mouseY = -9999;
    canvas.parentElement.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
        mouseX = -9999; mouseY = -9999;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p,i)=> {
            /* Mouse repulsion — subtle */
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.hypot(dx, dy);
            if (dist >0 && dist<100) {
                const force = (100 - dist) / 100 * 0.4;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
            }

            /* Draw dot */
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
            ctx.fill();

            /* Connect nearby particles */
            for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 115) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 115) * 0.18})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
        }
            /* Move */
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.dy *= -1;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();


/* ────────────────────────────────────────────────────────────────
   3. NAVBAR — frosted glass on scroll
   ──────────────────────────────────────────────────────────────── */
   

/* ────────────────────────────────────────────────────────────────
   4. MOBILE MENU TOGGLE
   ──────────────────────────────────────────────────────────────── */
(function initMobileMenu() {
    const btn   = document.getElementById('menu-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => links.classList.toggle('active'));

    /* Close menu when any nav link is clicked */
    links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => links.classList.remove('active'))
    );
})();


/* ────────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL for all anchor links
   ──────────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
})();


/* ────────────────────────────────────────────────────────────────
   6. BACK TO TOP
   Shows after 100 px of scroll (visible on virtually every page).
   ──────────────────────────────────────────────────────────────── */
   (function initScrollUI() {

    const navbar = document.getElementById('navbar');
    const btn = document.getElementById('back-to-top');

    if (!navbar && !btn) return;

    window.addEventListener('scroll', () => {

        const scrollY = window.scrollY;

        // Navbar
        if (navbar) {
            navbar.classList.toggle(
                'scrolled',
                scrollY > 50
            );
        }

        // Back To Top Button
        if (btn) {
            btn.style.display =
                scrollY > 100 ? 'flex' : 'none';
        }

    }, { passive: true });

    if (btn) {
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

})();





/* ────────────────────────────────────────────────────────────────
   7. DYNAMIC FOOTER YEAR
   ──────────────────────────────────────────────────────────────── */
(function initYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
})();


/* ────────────────────────────────────────────────────────────────
   8. SCROLL REVEAL with staggered children
   Uses IntersectionObserver — no threshold-based polling.
   ──────────────────────────────────────────────────────────────── */
(function initScrollReveal() {
    /* ── Section reveal ── */
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal-show');
            sectionObserver.unobserve(entry.target); /* fire once */
        });
    }, { threshold: 0.10 });

    document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

    /* ── Card stagger reveal ── */
    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const children = entry.target.querySelectorAll(
                '.about-card, .skill-item, .project-card, .highlight-card, .certification-card'
            );
           children.forEach((child, i) => {
              child.style.transitionDelay = `${i * 75}ms`;
              child.classList.add('child-show');
              if (child.classList.contains('skill-item')) {
                 child.classList.add('skill-show');
             }
           });

            cardObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    document.querySelectorAll(
        '#about, #skills, #projects, #highlights, #certifications'
    ).forEach(el => cardObserver.observe(el));
})();


/* ────────────────────────────────────────────────────────────────
   9. PROJECT CARD — 3-D TILT on mouse move
   ──────────────────────────────────────────────────────────────── */
   (function initCardTilt() {

    document.querySelectorAll('.project-card').forEach(card => {

        let rect;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', e => {

            const x =
                ((e.clientX - rect.left) / rect.width - 0.5) * 12;

            const y =
                ((e.clientY - rect.top) / rect.height - 0.5) * -12;

            card.style.transform =
                `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;

        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

    });

})();
/* ────────────────────────────────────────────────────────────────
   10. SKILL ITEMS — magnetic drift toward cursor
   ──────────────────────────────────────────────────────────────── */
(function initMagneticSkills() {

    // Don't enable magnetic effect on mobile/tablets
    if (window.innerWidth <= 768) return;

    document.querySelectorAll('.skill-item').forEach(item => {

        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();

            const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.22;

            item.style.transform =
                `translate(${x}px, ${y}px) scale(1.08)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });

    });

})();


/* ────────────────────────────────────────────────────────────────
   11. SECTION HEADING GLITCH DATA-TEXT attribute
   Set data-text on all section h2s so the CSS ::before/::after work.
   ──────────────────────────────────────────────────────────────── */
(function initGlitchHeadings() {
    document.querySelectorAll('section h2').forEach(h2 => {
        h2.setAttribute('data-text', h2.textContent.trim());
    });
})();

const name = document.querySelector('.glitch-name');
if(name){
const observer = new IntersectinObserver((entries) => {
    if (entries[0].isIntersecting) {
        let count=0;
        const interval=setInterval(()=>{

        name.classList.add('glitch-active');

        setTimeout(() => {
            name.classList.remove('glitch-active');
        }, 600);
        count++;
        if(count>=2){
            clearInterval(interval);
        }
    },900);

        observer.unobserve(name);
    }
}, { threshold: 0.5 });

observer.observe(name);

}

/* ────────────────────────────────────────────────────────────────
   13. CONTACT FORM — basic submit prevention + neon flash feedback
   ──────────────────────────────────────────────────────────────── */
(function initContactForm() {
    const form = document.querySelector('#contact-form form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');

        /* Flash confirmation */
        const orig = btn.textContent;
        btn.textContent = '✓ Sent!';
        btn.style.background = 'linear-gradient(135deg,#059669,#34d399)';
        btn.style.boxShadow  = '0 0 20px rgba(52,211,153,0.5)';

        setTimeout(() => {
            btn.textContent  = orig;
            btn.style.background = '';
            btn.style.boxShadow  = '';
            form.reset();
        }, 2400);
    });
})();


/* ────────────────────────────────────────────────────────────────
   14. HIGHLIGHT CARDS — entrance timing tweak
   Delay each highlight card based on data index for cascade effect.
   ──────────────────────────────────────────────────────────────── */
(function initHighlightCascade() {
    document.querySelectorAll('.highlight-card').forEach((card, i) => {
        /* Even-indexed come from left, odd from right */
        const dir = i % 2 === 0 ? '-40px' : '40px';
        card.style.setProperty('--slide-from', dir);
    });
})();

