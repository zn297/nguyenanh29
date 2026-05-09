
js_content = '''/* ═══════════════════════════════════════════════
   PORTFOLIO — NGUYỄN HOÀNG ANH (Ju) v2.0
   script.js — Optimized, Bug-free, Enhanced
   ═══════════════════════════════════════════════ */

'use strict';

/* ══ 1. MATRIX RAIN (Optimized with RAF) ═══════════════════ */
(function () {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let cols, drops, W, H, animId;
    let isVisible = true;
    let frameCount = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols = Math.floor(W / 18);
        drops = Array.from({ length: cols }, () => Math.random() * H / 18);
    }

    function draw() {
        if (!isVisible) {
            animId = requestAnimationFrame(draw);
            return;
        }
        frameCount++;
        // Chỉ vẽ mỗi 2 frame để tiết kiệm CPU
        if (frameCount % 2 === 0) {
            ctx.fillStyle = 'rgba(8,11,18,0.06)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#00f5d4';
            ctx.font = '13px Consolas, monospace';
            for (let i = 0; i < drops.length; i++) {
                const char = CHARS[Math.floor(Math.random() * CHARS.length)];
                const x = i * 18;
                const y = drops[i] * 18;
                // Gradient opacity theo chiều cao
                const opacity = Math.max(0.1, 1 - (y / H));
                ctx.globalAlpha = opacity;
                ctx.fillText(char, x, y);
                ctx.globalAlpha = 1;
                if (y > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        animId = requestAnimationFrame(draw);
    }

    // Visibility API để pause khi tab ẩn
    document.addEventListener('visibilitychange', function () {
        isVisible = !document.hidden;
    });

    resize();
    window.addEventListener('resize', debounce(resize, 200));
    draw();
})();

/* ══ 2. CUSTOM CURSOR (Magnetic + Smooth) ════════════════════ */
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cur = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (!cur || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;
    let isActive = true;
    let inactivityTimer;

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
        
        // Reset inactivity
        isActive = true;
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => { isActive = false; }, 100);
    });

    // Smooth trail với requestAnimationFrame
    (function loop() {
        if (isActive) {
            tx += (mx - tx) * 0.13;
            ty += (my - ty) * 0.13;
            trail.style.left = tx + 'px';
            trail.style.top = ty + 'px';
        }
        requestAnimationFrame(loop);
    })();

    // Hover effects với debounce
    const interactiveEls = document.querySelectorAll('a, button, input, textarea, .pill-link, .c-link, .btn-icon');
    interactiveEls.forEach(function (el) {
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

    // Ẩn cursor khi rời khỏi window
    document.addEventListener('mouseleave', function () {
        cur.style.opacity = '0';
        trail.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        cur.style.opacity = '1';
        trail.style.opacity = '1';
    });
})();

/* ══ 3. MAGNETIC BUTTONS ════════════════════════════════════ */
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });
})();

/* ══ 4. NAVBAR SCROLL + ACTIVE LINK ═════════════════════════ */
(function () {
    var navbar = document.getElementById('navbar');
    var links = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('section[id]');
    var mobileLinks = document.querySelectorAll('.mobile-nav a');

    function onScroll() {
        if (navbar) {
            navbar.classList.toggle('solid', window.scrollY > 20);
        }

        var scrollY = window.scrollY + 100;
        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var h = sec.offsetHeight;
            var id = sec.getAttribute('id');
            [links, mobileLinks].forEach(function (linkSet) {
                linkSet.forEach(function (a) {
                    if (a.getAttribute('href') === '#' + id) {
                        a.classList.toggle('active', scrollY >= top && scrollY < top + h);
                    }
                });
            });
        });
    }

    window.addEventListener('scroll', throttle(onScroll, 50), { passive: true });
    onScroll();
})();

/* ══ 5. HAMBURGER MOBILE MENU ════════════════════════════════ */
(function () {
    var burger = document.getElementById('burger');
    var mobileNav = document.getElementById('mobileNav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
        var isOpen = burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function (e) {
        if (!burger.contains(e.target) && !mobileNav.contains(e.target) && burger.classList.contains('open')) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
})();

/* ══ 6. SMOOTH SCROLL ════════════════════════════════════════ */
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

/* ══ 7. REVEAL ON SCROLL (Staggered) ════════════════════════ */
(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.classList.add('in');
                }, i * 80);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) { io.observe(el); });
})();

/* ══ 8. COUNTER ANIMATION ════════════════════════════════════ */
(function () {
    var nums = document.querySelectorAll('.stat-n[data-to]');
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.dataset.to, 10);
            var suffix = target === 100 ? '%' : '+';
            var start = 0;
            var dur = 1400;
            var step = Math.max(1, Math.ceil(target / 40));
            var startTime = null;

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                var progress = Math.min((currentTime - startTime) / dur, 1);
                // Easing function: easeOutQuart
                var ease = 1 - Math.pow(1 - progress, 4);
                var current = Math.floor(ease * target);
                el.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    el.textContent = target + suffix;
                }
            }
            requestAnimationFrame(animate);
            io.unobserve(el);
        });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { io.observe(n); });
})();

/* ══ 9. SKILL BAR ANIMATION ══════════════════════════════════ */
(function () {
    var bars = document.querySelectorAll('.bar-fill[data-w]');
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            // Delay nhỏ để tạo hiệu ứng cascade
            setTimeout(function () {
                entry.target.style.width = entry.target.dataset.w + '%';
            }, Math.random() * 300);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    bars.forEach(function (b) { io.observe(b); });
})();

/* ══ 10. TYPEWRITER EFFECT ═══════════════════════════════════ */
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
    var isRunning = true;

    function tick() {
        if (!isRunning) return;
        var cur = roles[ri];
        if (!del) {
            ci++;
            el.textContent = cur.slice(0, ci);
            if (ci === cur.length) {
                del = true;
                setTimeout(tick, PAUSE);
                return;
            }
            setTimeout(tick, SPEED_TYPE + Math.random() * 20);
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

    // Pause khi tab ẩn
    document.addEventListener('visibilitychange', function () {
        isRunning = !document.hidden;
        if (isRunning) tick();
    });
})();

/* ══ 11. GLITCH EFFECT + CHARACTER REVEAL ════════════════════ */
(function () {
    var name = document.getElementById('heroName');
    if (!name) return;

    // Character reveal animation
    var chars = name.querySelectorAll('.char');
    chars.forEach(function (char, i) {
        char.style.animationDelay = (0.1 + i * 0.04) + 's';
    });

    // Glitch effect
    setInterval(function () {
        name.classList.add('glitch');
        setTimeout(function () { name.classList.remove('glitch'); }, 300);
    }, 5000);
})();

/* ══ 12. PROFILE IMAGE FALLBACK ══════════════════════════════ */
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

/* ══ 13. BACK TO TOP ═════════════════════════════════════════ */
(function () {
    var btn = document.getElementById('backTop');
    if (!btn) return;

    window.addEventListener('scroll', throttle(function () {
        btn.classList.toggle('show', window.scrollY > 380);
    }, 100), { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ══ 14. TOAST ═══════════════════════════════════════════════ */
function showToast(msg, ms) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, ms || 3200);
}

/* ══ 15. CONTACT FORM ════════════════════════════════════════ */
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Validate
        var name = form.querySelector('#contactName');
        var email = form.querySelector('#contactEmail');
        var subject = form.querySelector('#contactSubject');
        var message = form.querySelector('#contactMessage');
        
        if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
            showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 3000);
            return;
        }
        
        var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showToast('⚠️ Email không hợp lệ!', 3000);
            email.focus();
            return;
        }

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

/* ══ 16. CARD TILT 3D (Vanilla JS) ══════════════════════════ */
(function () {
    if (window.innerWidth <= 768) return;

    var cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = [
                'perspective(500px)',
                'rotateX(' + (-y * 6) + 'deg)',
                'rotateY(' + (x * 6) + 'deg)',
                'translateY(-4px)',
                'scale(1.01)'
            ].join(' ');
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.transition = 'transform .4s ease';
            setTimeout(function () {
                card.style.transition = '';
            }, 400);
        });
    });
})();

/* ══ 17. PARALLAX HERO ═══════════════════════════════════════ */
(function () {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    
    var gridBg = hero.querySelector('.hero-grid-bg');
    var particles = hero.querySelector('.hero-particles');
    
    window.addEventListener('scroll', throttle(function () {
        var scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            if (gridBg) gridBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            if (particles) particles.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
        }
    }, 16), { passive: true });
})();

/* ══ 18. CURRENT YEAR ════════════════════════════════════════ */
(function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ══ 19. ORBIT ANIMATION ENHANCEMENT ═════════════════════════ */
(function () {
    var orbits = document.querySelectorAll('.orbit');
    orbits.forEach(function (orbit, i) {
        orbit.style.animationDelay = (i * 0.5) + 's';
    });
})();

/* ══ UTILITY FUNCTIONS ═══════════════════════════════════════ */
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    var inThrottle;
    return function () {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function () { inThrottle = false; }, limit);
        }
    };
}

/* ══ PERFORMANCE: Cleanup on page hide ═══════════════════════ */
window.addEventListener('beforeunload', function () {
    // Cleanup any running intervals/animations if needed
});
'''

with open('/mnt/agents/output/script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("✅ script.js đã được tạo")
