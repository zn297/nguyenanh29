/* ═══════════════════════════════════════════════
   PORTFOLIO — NGUYỄN HOÀNG ANH (Ju)
   script.js — Improved & Optimized
   ═══════════════════════════════════════════════ */

'use strict';

/* ══ 0. LOADING SCREEN ════════════════════════════════════════ */
(function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    window.addEventListener('load', function () {
        setTimeout(function () {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 600);
    });
    // Fallback: hide after 3s even if load event is slow
    setTimeout(function () {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 3000);
})();

/* ══ 1. MATRIX RAIN (requestAnimationFrame) ══════════════════ */
(function () {
    var canvas = document.getElementById('matrix');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var CHARS = '01アイウエオカキクケコサシスセソ';
    var cols, drops, W, H;
    var lastTime = 0;
    var interval = 1000 / 16; // ~16fps for matrix rain (subtle background)

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols = Math.floor(W / 18);
        drops = Array.from({ length: cols }, function () { return Math.random() * H / 18; });
    }

    function draw(timestamp) {
        requestAnimationFrame(draw);
        if (timestamp - lastTime < interval) return;
        lastTime = timestamp;

        ctx.fillStyle = 'rgba(8,11,18,0.06)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#00f5d4';
        ctx.font = '13px Consolas, monospace';
        for (var i = 0; i < drops.length; i++) {
            ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 18, drops[i] * 18);
            if (drops[i] * 18 > H && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
})();

/* ══ 2. FLOATING PARTICLES ════════════════════════════════════ */
(function () {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 40;
    var W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }

    function init() {
        particles = [];
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,245,212,' + p.opacity + ')';
            ctx.fill();
        }

        // Draw connections
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0,245,212,' + (0.08 * (1 - dist / 120)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    resize();
    window.addEventListener('resize', resize);
    init();
    requestAnimationFrame(draw);
})();

/* ══ 3. CUSTOM CURSOR + GLOW ═════════════════════════════════ */
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var cur = document.getElementById('cursor');
    var trail = document.getElementById('cursorTrail');
    if (!cur || !trail) return;

    // Create glow element
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    var mx = 0, my = 0, tx = 0, ty = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
    });

    // Smooth follow loop
    function loop() {
        tx += (mx - tx) * 0.13;
        ty += (my - ty) * 0.13;
        gx += (mx - gx) * 0.06;
        gy += (my - gy) * 0.06;
        trail.style.left = tx + 'px';
        trail.style.top = ty + 'px';
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Hover effects on links/buttons
    document.querySelectorAll('a, button').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            cur.style.transform = 'translate(-50%,-50%) scale(1.8)';
            cur.style.background = '#ff2d78';
            trail.style.width = '46px';
            trail.style.height = '46px';
            trail.style.borderColor = 'rgba(255,45,120,0.4)';
        });
        el.addEventListener('mouseleave', function () {
            cur.style.transform = 'translate(-50%,-50%) scale(1)';
            cur.style.background = '#00f5d4';
            trail.style.width = '30px';
            trail.style.height = '30px';
            trail.style.borderColor = 'rgba(0,245,212,0.4)';
        });
    });
})();

/* ══ 4. SCROLL PROGRESS BAR ══════════════════════════════════ */
(function () {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                var scrollTop = window.scrollY;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ══ 5. NAVBAR SCROLL + ACTIVE LINK ═════════════════════════ */
(function () {
    var navbar = document.getElementById('navbar');
    var links = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('section[id]');
    var ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            if (navbar) {
                navbar.classList.toggle('solid', window.scrollY > 20);
            }

            var scrollY = window.scrollY + 100;
            sections.forEach(function (sec) {
                var top = sec.offsetTop;
                var h = sec.offsetHeight;
                var id = sec.getAttribute('id');
                links.forEach(function (a) {
                    if (a.getAttribute('href') === '#' + id) {
                        a.classList.toggle('active', scrollY >= top && scrollY < top + h);
                    }
                });
            });
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ══ 6. HAMBURGER MOBILE MENU ════════════════════════════════ */
(function () {
    var burger = document.getElementById('burger');
    var mobileNav = document.getElementById('mobileNav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    });

    // Swipe to close on mobile
    var startY = 0;
    mobileNav.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
    }, { passive: true });
    mobileNav.addEventListener('touchmove', function (e) {
        if (e.touches[0].clientY - startY < -30) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    }, { passive: true });
})();

/* ══ 7. SMOOTH SCROLL ════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 60;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
    });
});

/* ══ 8. REVEAL ON SCROLL + STAGGER ══════════════════════════ */
(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) { observer.observe(el); });
})();

/* ══ 9. COUNTER ANIMATION ════════════════════════════════════ */
(function () {
    var nums = document.querySelectorAll('.stat-n[data-to]');
    if (!nums.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.dataset.to, 10);
            var suffix = el.dataset.suffix || (target === 100 ? '%' : '+');
            var start = 0;
            var dur = 1400;
            var step = Math.max(1, Math.ceil(target / 60));
            var startTime = null;

            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / dur, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.round(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
            observer.unobserve(el);
        });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { observer.observe(n); });
})();

/* ══ 10. SKILL BAR ANIMATION ═════════════════════════════════ */
(function () {
    var bars = document.querySelectorAll('.bar-fill[data-w]');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.w + '%';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    bars.forEach(function (b) { observer.observe(b); });
})();

/* ══ 11. TYPEWRITER EFFECT ════════════════════════════════════ */
(function () {
    var el = document.getElementById('typed');
    if (!el) return;

    var roles = [
        'Software Engineer',
        'Flutter Developer',
        'Android Hacker',
        'AI Enthusiast',
        'Web Developer'
    ];
    var ri = 0, ci = 0, del = false;
    var SPEED_TYPE = 80, SPEED_DEL = 42, PAUSE = 1800;

    function tick() {
        var cur = roles[ri];
        if (!del) {
            ci++;
            el.textContent = cur.slice(0, ci);
            if (ci === cur.length) {
                del = true;
                setTimeout(tick, PAUSE);
                return;
            }
            setTimeout(tick, SPEED_TYPE);
        } else {
            ci--;
            el.textContent = cur.slice(0, ci);
            if (ci === 0) {
                del = false;
                ri = (ri + 1) % roles.length;
            }
            setTimeout(tick, SPEED_DEL);
        }
    }
    tick();
})();

/* ══ 12. TEXT SCRAMBLE EFFECT ON HEADINGS ═════════════════════ */
(function () {
    var headings = document.querySelectorAll('.scramble-text');
    if (!headings.length) return;

    var chars = '!<>-_\\/[]{}—=+*^?#________';

    function scramble(el) {
        var original = el.textContent;
        var iterations = 0;
        var maxIterations = original.length * 3;

        var interval = setInterval(function () {
            el.textContent = original.split('').map(function (char, index) {
                if (index < iterations / 3) return original[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            iterations++;
            if (iterations > maxIterations) {
                clearInterval(interval);
                el.textContent = original;
            }
        }, 30);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            scramble(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    headings.forEach(function (h) { observer.observe(h); });
})();

/* ══ 13. GLITCH EFFECT ON NAME ═══════════════════════════════ */
(function () {
    var name = document.getElementById('heroName');
    if (!name) return;
    setInterval(function () {
        name.classList.add('glitch');
        setTimeout(function () { name.classList.remove('glitch'); }, 200);
    }, 4500);
})();

/* ══ 14. PARALLAX ON HERO GRID ══════════════════════════════ */
(function () {
    var grid = document.getElementById('heroGrid');
    if (!grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                var scrolled = window.scrollY;
                if (scrolled < window.innerHeight * 1.5) {
                    grid.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ══ 15. MAGNETIC BUTTONS ════════════════════════════════════ */
(function () {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });
})();

/* ══ 16. CARD TILT (desktop only) ════════════════════════════ */
(function () {
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cards = document.querySelectorAll('.proj-card, .exp-card, .stat-box');
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = [
                'perspective(500px)',
                'rotateX(' + (-y * 5) + 'deg)',
                'rotateY(' + (x * 5) + 'deg)',
                'translateY(-4px)'
            ].join(' ');
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
})();

/* ══ 17. PROFILE IMAGE FALLBACK ══════════════════════════════ */
(function () {
    var img = document.getElementById('profileImg');
    if (!img) return;

    var retried = false;
    img.addEventListener('error', function () {
        if (!retried) {
            retried = true;
            img.src = './profile.jpg?' + Date.now();
            return;
        }
        var wrap = img.parentElement;
        img.style.display = 'none';
        var fb = document.createElement('div');
        fb.style.cssText = [
            'width:100%', 'height:100%',
            'display:flex', 'align-items:center', 'justify-content:center',
            'font-family:Consolas,monospace', 'font-size:3.5rem',
            'font-weight:700', 'color:#00f5d4',
            'background:#141920', 'border-radius:50%'
        ].join(';');
        fb.textContent = 'Ju';
        wrap.appendChild(fb);
    });

    img.addEventListener('load', function () {
        img.style.display = 'block';
        img.style.opacity = '1';
    });

    if (img.complete && img.naturalWidth > 0) {
        img.style.display = 'block';
        img.style.opacity = '1';
    }
})();

/* ══ 18. BACK TO TOP ═════════════════════════════════════════ */
(function () {
    var btn = document.getElementById('backTop');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                btn.classList.toggle('show', window.scrollY > 380);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ══ 19. FLOATING ACTION BUTTON ══════════════════════════════ */
(function () {
    var fab = document.getElementById('fab');
    var toggle = document.getElementById('fabToggle');
    if (!fab || !toggle) return;

    toggle.addEventListener('click', function () {
        fab.classList.toggle('open');
    });

    // Close when clicking a fab item
    fab.querySelectorAll('.fab-item').forEach(function (item) {
        item.addEventListener('click', function () {
            fab.classList.remove('open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (!fab.contains(e.target)) {
            fab.classList.remove('open');
        }
    });
})();

/* ══ 20. THEME TOGGLE ════════════════════════════════════════ */
(function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var icon = btn.querySelector('i');
    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
    }

    btn.addEventListener('click', function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        }
    });
})();

/* ══ 21. TOAST ═══════════════════════════════════════════════ */
function showToast(msg, ms) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, ms || 3200);
}

/* ══ 22. CONTACT FORM ════════════════════════════════════════ */
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('.btn-submit');
        var orig = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled = true;

        setTimeout(function () {
            form.reset();
            btn.innerHTML = '<i class="fas fa-check"></i> Đã gửi!';
            showToast('✅ Cảm ơn! Mình sẽ phản hồi sớm nhất có thể.', 3500);
            setTimeout(function () {
                btn.innerHTML = orig;
                btn.disabled = false;
            }, 2500);
        }, 1300);
    });
})();

/* ══ 23. MOBILE MENU SWIPE GESTURE ═══════════════════════════ */
(function () {
    var mobileNav = document.getElementById('mobileNav');
    var burger = document.getElementById('burger');
    if (!mobileNav || !burger) return;

    var startX = 0;
    document.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var endX = e.changedTouches[0].clientX;
        var diff = endX - startX;
        // Swipe right to open
        if (diff > 80 && startX < 30 && !mobileNav.classList.contains('open')) {
            burger.classList.add('open');
            mobileNav.classList.add('open');
        }
        // Swipe left to close
        if (diff < -80 && mobileNav.classList.contains('open')) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    }, { passive: true });
})();
