/* ============================================================
   MAIN.JS — Portfolio Nguyễn Hoàng Anh (Ju)
   ============================================================ */

'use strict';

// ── Custom Cursor ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
}

// ── Matrix Rain Canvas ─────────────────────────────────────
(function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cols, drops;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols = Math.floor(W / 20);
        drops = Array(cols).fill(1);
    }

    function draw() {
        ctx.fillStyle = 'rgba(8,11,18,0.05)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#00f5d4';
        ctx.font = '14px JetBrains Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * 20, drops[i] * 20);
            if (drops[i] * 20 > H && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 55);
})();

// ── Typewriter Effect ──────────────────────────────────────
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const roles = [
        'Software Engineer',
        'Flutter Developer',
        'Android Hacker',
        'AI Enthusiast',
        'Web Developer'
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;
    const TYPING_SPEED = 85, DELETE_SPEED = 45, PAUSE = 1800;

    function type() {
        const current = roles[roleIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, PAUSE);
                return;
            }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
            }
        }
        setTimeout(type, deleting ? DELETE_SPEED : TYPING_SPEED);
    }
    type();
})();

// ── Navbar Scroll ──────────────────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 30);
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ── Mobile Menu ────────────────────────────────────────────
(function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });
})();

// ── Smooth Scroll ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ── Reveal on Scroll ───────────────────────────────────────
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = (i * 0.08) + 's';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
})();

// ── Animated Counters ──────────────────────────────────────
(function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || (target === 100 ? '%' : '+');
            let start = 0;
            const duration = 1600;
            const step = Math.max(1, Math.floor(target / 60));
            const timer = setInterval(() => {
                start = Math.min(start + step, target);
                el.textContent = start + suffix;
                if (start >= target) clearInterval(timer);
            }, duration / (target / step));
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ── Skill Bars ─────────────────────────────────────────────
(function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.width + '%';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
})();

// ── Back to Top ────────────────────────────────────────────
(function initBackToTop() {
    const btn = document.getElementById('backTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ── Toast Notification ─────────────────────────────────────
function showToast(msg, duration = 3200) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Contact Form ───────────────────────────────────────────
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Đang gửi...</span>';
        btn.disabled = true;

        setTimeout(() => {
            form.reset();
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Đã gửi!</span>';
            showToast('✅ Cảm ơn! Mình sẽ phản hồi sớm nhất có thể.');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2500);
        }, 1400);
    });
})();

// ── Active Nav Link on Scroll ──────────────────────────────
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;
    const navH = 64;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === '#' + id ? 'var(--primary)' : '';
                });
            }
        });
    }, { rootMargin: `-${navH}px 0px -60% 0px`, threshold: 0 });

    sections.forEach(s => observer.observe(s));
})();

// ── Profile Image Fallback ─────────────────────────────────
(function initImageFallback() {
    const img = document.getElementById('profileImg');
    if (!img) return;
    img.addEventListener('error', () => {
        img.style.display = 'none';
        const wrap = img.parentElement;
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width:100%; height:100%; background:var(--bg3);
            display:flex; align-items:center; justify-content:center;
            font-family:var(--font-mono); font-size:3.5rem; color:var(--primary);
            font-weight:700; letter-spacing:0.08em;
        `;
        placeholder.textContent = 'Ju';
        wrap.appendChild(placeholder);
    });
})();

// ── Card Tilt Effect (desktop only) ───────────────────────
(function initTilt() {
    if (window.innerWidth <= 768) return;
    const cards = document.querySelectorAll('.proj-card, .exp-card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

// ── Particle Glow on Click ─────────────────────────────────
(function initClickParticles() {
    if (window.innerWidth <= 768) return;
    document.addEventListener('click', (e) => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position:fixed; left:${e.clientX}px; top:${e.clientY}px;
            width:6px; height:6px; border-radius:50%;
            background:var(--primary); pointer-events:none; z-index:9999;
            transform:translate(-50%,-50%);
            animation: particle-fade 0.6s ease-out forwards;
        `;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 620);
    });

    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particle-fade {
                0% { transform: translate(-50%,-50%) scale(1); opacity:1; }
                100% { transform: translate(-50%,-50%) scale(3.5); opacity:0; }
            }
        `;
        document.head.appendChild(style);
    }
})();

// ── Page Load Animation ────────────────────────────────────
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
