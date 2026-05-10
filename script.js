/* ═══════════════════════════════════════════════
   PORTFOLIO — NGUYỄN HOÀNG ANH (Ju)
   script.js — Optimized v2.1
   ═══════════════════════════════════════════════ */

'use strict';

/* ══ UTILS ═══════════════════════════════════════════════════ */
var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
var rIdle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 50); };

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

/* ══ 0. PERFORMANCE HINTS ════════════════════════════════════ */
(function () {
    var gpu = $$('.avatar-img, .code-snippet, .proj-card, .exp-card, .tl-body');
    gpu.forEach(function (el) {
        el.style.willChange = 'transform';
        el.addEventListener('transitionend', function () {
            el.style.willChange = 'auto';
        }, { once: true, passive: true });
        el.addEventListener('mouseenter', function () {
            el.style.willChange = 'transform, box-shadow';
        }, { passive: true });
        el.addEventListener('mouseleave', function () {
            setTimeout(function () { el.style.willChange = 'auto'; }, 300);
        }, { passive: true });
    });
})();

/* ══ 1. LOADING SCREEN ════════════════════════════════════════ */
(function () {
    var loader = $('#loader');
    var fill = $('#loaderFill');
    if (!loader) return;

    var progress = 0;
    var fillInterval = setInterval(function () {
        progress = Math.min(progress + Math.random() * 18, 90);
        if (fill) fill.style.width = progress + '%';
    }, 120);

    function hideLoader() {
        clearInterval(fillInterval);
        if (fill) fill.style.width = '100%';
        setTimeout(function () {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 400);
    } else {
        window.addEventListener('load', function () {
            setTimeout(hideLoader, 400);
        });
        setTimeout(hideLoader, 3500); // Safety
    }
})();

/* ══ 2. BACKGROUND CANVAS (Particle & Matrix Optimized) ════════ */
(function () {
    var canvas = $('#bgCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var W, H, cols, drops;
    var CHARS = '01アイウエカキクコサシスセソタチ';
    var particles = [];
    var PARTICLE_COUNT = window.innerWidth < 768 ? 15 : 30; // Giảm bớt số hạt trên mobile để chống lag
    var lastTime = 0;
    var MATRIX_FPS = window.innerWidth < 768 ? 8 : 12; // Matrix chậm hơn chút trên mobile
    var matrixInterval = 1000 / MATRIX_FPS;
    var matrixOpacity = 0.045;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols = Math.floor(W / 24); // Rộng hơn 1 chút cho đỡ tốn tài nguyên vẽ
        drops = new Array(cols).fill(0).map(function () {
            return Math.random() * (H / 18);
        });
        initParticles();
    }

    function initParticles() {
        particles = [];
        PARTICLE_COUNT = window.innerWidth < 768 ? 15 : 30;
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                alpha: Math.random() * 0.4 + 0.08
            });
        }
    }

    function drawMatrix(ts) {
        if (ts - lastTime < matrixInterval) return;
        lastTime = ts;
        ctx.fillStyle = 'rgba(8,11,18,' + matrixOpacity + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#00f5d4';
        ctx.font = '12px Consolas, monospace';
        for (var i = 0; i < cols; i++) {
            var char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, i * 24, drops[i] * 18);
            if (drops[i] * 18 > H && Math.random() > 0.978) drops[i] = 0;
            drops[i]++;
        }
    }

    function drawParticles() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,245,212,' + p.alpha + ')';
            ctx.fill();
        }

        var limit = particles.length;
        for (var i = 0; i < limit; i++) {
            for (var j = i + 1; j < limit; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = dx * dx + dy * dy;
                if (dist < 10000) { // 100^2, giảm khoảng cách để tính toán ít line hơn
                    var d = Math.sqrt(dist);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,245,212,' + (0.07 * (1 - d / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    var animating = true;
    function loop(ts) {
        if (!animating) return;
        raf(loop);
        if (!W || !H) return;
        drawMatrix(ts);
        drawParticles();
    }

    resize();
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 180);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
        animating = !document.hidden;
        if (animating) raf(loop);
    });

    raf(loop);
})();

/* ══ 3. SCROLL PROGRESS BAR ══════════════════════════════════ */
(function () {
    var bar = $('#scrollProgress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        raf(function () {
            var scrollTop = window.scrollY || window.pageYOffset;
            var docH = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
            ticking = false;
        });
    }, { passive: true });
})();

/* ══ 4. NAVBAR: SCROLL + ACTIVE LINKS ═══════════════════════ */
(function () {
    var navbar = $('#navbar');
    var links = $$('.nav-links a');
    var sections = $$('section[id]');
    var ticking = false;

    function update() {
        ticking = true;
        raf(function () {
            var scrollY = window.scrollY || window.pageYOffset;
            if (navbar) navbar.classList.toggle('solid', scrollY > 20);

            var active = '';
            sections.forEach(function (sec) {
                if (scrollY >= sec.offsetTop - 90) active = sec.id;
            });
            links.forEach(function (a) {
                var matches = a.getAttribute('href') === '#' + active;
                a.classList.toggle('active', matches);
            });
            ticking = false;
        });
    }

    window.addEventListener('scroll', function () {
        if (!ticking) update();
    }, { passive: true });
    update();
})();

/* ══ 5. HAMBURGER MOBILE MENU ════════════════════════════════ */
(function () {
    var burger = $('#burger');
    var mobileNav = $('#mobileNav');
    if (!burger || !mobileNav) return;

    function toggle(open) {
        burger.classList.toggle('open', open);
        mobileNav.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
        mobileNav.setAttribute('aria-hidden', String(!open));
    }

    burger.addEventListener('click', function () {
        toggle(!burger.classList.contains('open'));
    });

    $$('a', mobileNav).forEach(function (a) {
        a.addEventListener('click', function () { toggle(false); });
    });

    document.addEventListener('click', function (e) {
        if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
            toggle(false);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') toggle(false);
    });
})();

/* ══ 6. SWIPE GESTURES (Mobile) ══════════════════════════════ */
(function () {
    var mobileNav = $('#mobileNav');
    var burger = $('#burger');
    if (!mobileNav || !burger) return;

    var startX = 0, startY = 0;
    var SWIPE_THRESHOLD = 70;

    document.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) < Math.abs(dy)) return;
        if (dx > SWIPE_THRESHOLD && startX < 32 && !mobileNav.classList.contains('open')) {
            burger.classList.add('open');
            mobileNav.classList.add('open');
            burger.setAttribute('aria-expanded', 'true');
        }
        if (dx < -SWIPE_THRESHOLD && mobileNav.classList.contains('open')) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        }
    }, { passive: true });
})();

/* ══ 7. SMOOTH SCROLL ════════════════════════════════════════ */
(function () {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 62;

    $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = a.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.getElementById(href.slice(1));
            if (!target) return;
            e.preventDefault();
            var top = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navH;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    });
})();

/* ══ 8. INTERSECTION OBSERVER — REVEAL ON SCROLL ════════════ */
(function () {
    var els = $$('.reveal');
    if (!els.length) return;

    var supportsIO = 'IntersectionObserver' in window;
    if (!supportsIO) {
        els.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
})();

/* ══ 9. COUNTER ANIMATION ════════════════════════════════════ */
(function () {
    var nums = $$('.stat-n[data-to]');
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.dataset.to, 10);
            var suffix = target === 100 ? '%' : '+';
            var dur = 1500;
            var startTime = null;

            function animate(ts) {
                if (!startTime) startTime = ts;
                var elapsed = ts - startTime;
                var progress = Math.min(elapsed / dur, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target) + suffix;
                if (progress < 1) raf(animate);
            }
            raf(animate);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    nums.forEach(function (n) { io.observe(n); });
})();

/* ══ 10. SKILL BAR ANIMATION ═════════════════════════════════ */
(function () {
    var bars = $$('.bar-fill[data-w]');
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            setTimeout(function () {
                el.style.width = el.dataset.w + '%';
            }, 60);
            io.unobserve(el);
        });
    }, { threshold: 0.3 });

    bars.forEach(function (b) { io.observe(b); });
})();

/* ══ 11. TYPEWRITER EFFECT ════════════════════════════════════ */
(function () {
    var el = $('#typed');
    if (!el) return;

    var roles = [
        'Software Engineer',
        'Flutter Developer',
        'Android Enthusiast',
        'AI Integrator',
        'Web Developer'
    ];
    var ri = 0, ci = 0, deleting = false;
    var TYPE_MS = 82, DEL_MS = 40, PAUSE_MS = 2000;
    var timer;

    function tick() {
        var word = roles[ri];
        if (!deleting) {
            ci++;
            el.textContent = word.slice(0, ci);
            if (ci === word.length) {
                deleting = true;
                timer = setTimeout(tick, PAUSE_MS);
                return;
            }
            timer = setTimeout(tick, TYPE_MS);
        } else {
            ci--;
            el.textContent = word.slice(0, ci);
            if (ci === 0) {
                deleting = false;
                ri = (ri + 1) % roles.length;
            }
            timer = setTimeout(tick, DEL_MS);
        }
    }
    tick();

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearTimeout(timer);
        } else {
            tick();
        }
    });
})();

/* ══ 12. TEXT SCRAMBLE ON SECTION HEADINGS ═══════════════════ */
(function () {
    var headings = $$('.scramble-text');
    if (!headings.length) return;

    var CHARS = '!<>-_\/[]{}—=+*^?#@$';

    function scramble(el) {
        var original = el.textContent;
        var len = original.length;
        var iterations = 0;
        var maxIter = len * 3;

        var iv = setInterval(function () {
            el.textContent = original.split('').map(function (char, idx) {
                if (char === ' ') return ' ';
                if (idx < Math.floor(iterations / 3)) return original[idx];
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');
            iterations++;
            if (iterations > maxIter) {
                clearInterval(iv);
                el.textContent = original;
            }
        }, 28);
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            scramble(entry.target);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    headings.forEach(function (h) { io.observe(h); });
})();

/* ══ 13. GLITCH EFFECT ON HERO NAME ═════════════════════════ */
(function () {
    var name = $('#heroName');
    if (!name) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var glitchInterval = setInterval(function () {
        if (document.hidden) return;
        name.classList.add('glitch');
        setTimeout(function () { name.classList.remove('glitch'); }, 220);
    }, 5000);

    var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) {
            clearInterval(glitchInterval);
        }
    }, { threshold: 0 });
    io.observe(name);
})();

/* ══ 14. PARALLAX — HERO GRID ════════════════════════════════ */
(function () {
    var grid = $('#heroGrid');
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; 

    var ticking = false;
    var maxH = window.innerHeight * 1.5;

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        raf(function () {
            var scrolled = window.scrollY || window.pageYOffset;
            if (scrolled < maxH) {
                grid.style.transform = 'translate3d(0,' + (scrolled * 0.12) + 'px,0)';
            }
            ticking = false;
        });
    }, { passive: true });
})();

/* ══ 15. CARD 3D TILT (Desktop only) ════════════════════════ */
(function () {
    if (window.innerWidth <= 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    var cards = $$('.proj-card, .exp-card, .stat-box, .tl-body');
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = [
                'perspective(600px)',
                'rotateX(' + (-y * 4) + 'deg)',
                'rotateY(' + (x * 4) + 'deg)',
                'translateY(-5px)'
            ].join(' ');
        }, { passive: true });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        }, { passive: true });
    });
})();

/* ══ 16. MAGNETIC BUTTONS (Desktop only) ════════════════════ */
(function () {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    $$('.btn-solid, .btn-ghost, .btn-submit').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var r = btn.getBoundingClientRect();
            var x = (e.clientX - r.left - r.width / 2) * 0.12;
            var y = (e.clientY - r.top - r.height / 2) * 0.12;
            btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        }, { passive: true });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        }, { passive: true });
    });
})();

/* ══ 17. PROFILE IMAGE FALLBACK ══════════════════════════════ */
(function () {
    var img = $('#profileImg');
    if (!img) return;

    var retried = false;

    img.addEventListener('error', function () {
        if (!retried) {
            retried = true;
            img.src = './profile.jpg?v=' + Date.now();
            return;
        }
        var wrap = img.parentElement;
        img.style.display = 'none';
        var fb = document.createElement('div');
        Object.assign(fb.style, {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontSize: '3.2rem',
            fontWeight: '700',
            color: '#00f5d4',
            background: '#141920',
            borderRadius: '50%',
            letterSpacing: '-0.05em'
        });
        fb.textContent = 'Ju';
        wrap.appendChild(fb);
    });

    img.addEventListener('load', function () {
        img.style.opacity = '1';
    });

    if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = '1';
    }
})();

/* ══ 18. BACK TO TOP BUTTON ══════════════════════════════════ */
(function () {
    var btn = $('#backTop');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        raf(function () {
            btn.classList.toggle('show', (window.scrollY || window.pageYOffset) > 400);
            ticking = false;
        });
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ══ 19. FLOATING ACTION BUTTON ══════════════════════════════ */
(function () {
    var fab = $('#fab');
    var toggle = $('#fabToggle');
    var menu = $('#fabMenu');
    if (!fab || !toggle) return;

    function setOpen(open) {
        fab.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        if (menu) menu.setAttribute('aria-hidden', String(!open));
    }

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(!fab.classList.contains('open'));
    });

    $$('.fab-item', fab).forEach(function (item) {
        item.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('click', function (e) {
        if (!fab.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });
})();

/* ══ 20. THEME TOGGLE ════════════════════════════════════════ */
(function () {
    var btn = $('#themeToggle');
    if (!btn) return;
    var icon = btn.querySelector('i');

    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fa-solid fa-sun';
    }

    btn.addEventListener('click', function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            if (icon) icon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (icon) icon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        }
    });
})();

/* ══ 21. TOAST NOTIFICATION ══════════════════════════════════ */
function showToast(msg, duration) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, duration || 3500);
}

/* ══ 22. CONTACT FORM ════════════════════════════════════════ */
(function () {
    var form = $('#contactForm');
    if (!form) return;

    $$('input, textarea', form).forEach(function (field) {
        field.addEventListener('blur', function () {
            if (field.required && !field.value.trim()) {
                field.style.borderColor = 'rgba(255,45,120,0.5)';
            } else if (field.type === 'email' && field.value && !field.value.includes('@')) {
                field.style.borderColor = 'rgba(255,45,120,0.5)';
            } else {
                field.style.borderColor = '';
            }
        });
        field.addEventListener('input', function () {
            if (field.style.borderColor) field.style.borderColor = '';
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var btn = form.querySelector('.btn-submit');
        var textEl = btn.querySelector('.btn-submit-text');
        if (!btn || btn.disabled) return;

        var valid = true;
        $$('input, textarea', form).forEach(function (f) {
            if (f.required && !f.value.trim()) {
                f.style.borderColor = 'rgba(255,45,120,0.5)';
                valid = false;
            }
        });
        if (!valid) {
            showToast('⚠️ Vui lòng điền đầy đủ thông tin.', 2500);
            return;
        }

        var orig = textEl ? textEl.innerHTML : btn.innerHTML;
        if (textEl) textEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
        else btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled = true;

        setTimeout(function () {
            form.reset();
            if (textEl) textEl.innerHTML = '<i class="fa-solid fa-check"></i> Đã gửi!';
            else btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã gửi!';
            showToast('✅ Cảm ơn! Mình sẽ phản hồi sớm nhất có thể.', 4000);

            setTimeout(function () {
                if (textEl) textEl.innerHTML = orig;
                else btn.innerHTML = orig;
                btn.disabled = false;
            }, 2800);
        }, 1400);
    });
})();

/* ══ 23. PERFORMANCE: CONTENT-VISIBILITY ════════════════════ */
(function () {
    if (!CSS.supports('content-visibility', 'auto')) return;
    var sections = $$('#education, #experience, #skills, #projects, #contact');
    sections.forEach(function (sec) {
        sec.style.contentVisibility = 'auto';
        sec.style.containIntrinsicSize = '0 600px';
    });
})();

/* ══ 24. HERO ORBIT ANIMATION PAUSE ON HOVER ════════════════ */
(function () {
    var avatarWrap = $('.avatar-wrap');
    if (!avatarWrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rings = $$('.avatar-ring', avatarWrap);
    avatarWrap.addEventListener('mouseenter', function () {
        rings.forEach(function (r) { r.style.animationPlayState = 'paused'; });
    }, { passive: true });
    avatarWrap.addEventListener('mouseleave', function () {
        rings.forEach(function (r) { r.style.animationPlayState = 'running'; });
    }, { passive: true });
})();

/* ══ 25. KEYBOARD NAVIGATION IMPROVEMENTS ════════════════════ */
(function () {
    $$('.proj-card, .exp-card').forEach(function (card) {
        var link = card.querySelector('a');
        if (!link) return;
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
})();

/* ══ 26. PASSIVE TOUCH SCROLL SMOOTHING ════════════════════ */
(function () {
    var style = document.createElement('style');
    style.textContent = [
        'body { -webkit-overflow-scrolling: touch; }',
        '.mobile-nav { -webkit-overflow-scrolling: touch; }',
        '.contact-form { -webkit-overflow-scrolling: touch; }'
    ].join('\n');
    document.head.appendChild(style);
})();

/* ══ 27. RESIZE OBSERVER FOR DYNAMIC LAYOUT ═════════════════ */
(function () {
    if (!window.ResizeObserver) return;
    var hero = $('.hero-content');
    if (!hero) return;

    var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
            var w = entry.contentRect.width;
            if (w < 640) {
                document.documentElement.classList.add('narrow');
            } else {
                document.documentElement.classList.remove('narrow');
            }
        });
    });
    ro.observe(hero);
})();

/* ══ 28. IMAGE LAZY LOADING POLYFILL ════════════════════════ */
(function () {
    if ('loading' in HTMLImageElement.prototype) return;
    var lazyImages = $$('img[loading="lazy"]');
    if (!lazyImages.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                io.unobserve(img);
            }
        });
    });
    lazyImages.forEach(function (img) { io.observe(img); });
})();

/* ══ INIT COMPLETE ═══════════════════════════════════════════ */
rIdle(function () {
    var links = [
        '#about', '#education', '#experience', '#skills', '#projects', '#contact'
    ];
    console.log('%c<Ju/> Portfolio v2.1 loaded - Ready for action!', 'color:#00f5d4;font-family:monospace;font-weight:700');
});
