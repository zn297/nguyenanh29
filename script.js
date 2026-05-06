/* ═══════════════════════════════════════════════
   PORTFOLIO — NGUYỄN HOÀNG ANH (Ju)
   script.js — Complete, no external deps
   ═══════════════════════════════════════════════ */

'use strict';

/* ══ 1. MATRIX RAIN ══════════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const CHARS = '01アイウエオカキクケコサシスセソ';
    let cols, drops, W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cols = Math.floor(W / 18);
        drops = Array.from({ length: cols }, () => Math.random() * H / 18);
    }

    function draw() {
        ctx.fillStyle = 'rgba(8,11,18,0.06)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#00f5d4';
        ctx.font = '13px Consolas, monospace';
        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 18, drops[i] * 18);
            if (drops[i] * 18 > H && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    window.addEventListener('resize', resize);
    setInterval(draw, 60);
})();

/* ══ 2. CUSTOM CURSOR ════════════════════════════════════════ */
(function () {
    // Chỉ bật trên thiết bị có pointer chuột thật
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cur = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (!cur || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', function (e) {
        mx = e.clientX;
        my = e.clientY;
        cur.style.left = mx + 'px';
        cur.style.top  = my + 'px';
    });

    // Trail theo sau mượt
    (function loop() {
        tx += (mx - tx) * 0.13;
        ty += (my - ty) * 0.13;
        trail.style.left = tx + 'px';
        trail.style.top  = ty + 'px';
        requestAnimationFrame(loop);
    })();

    // Phóng to khi hover link/button
    document.querySelectorAll('a, button').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            cur.style.transform   = 'translate(-50%,-50%) scale(1.8)';
            cur.style.background  = '#ff2d78';
            trail.style.width     = '46px';
            trail.style.height    = '46px';
            trail.style.borderColor = 'rgba(255,45,120,0.4)';
        });
        el.addEventListener('mouseleave', function () {
            cur.style.transform   = 'translate(-50%,-50%) scale(1)';
            cur.style.background  = '#00f5d4';
            trail.style.width     = '30px';
            trail.style.height    = '30px';
            trail.style.borderColor = 'rgba(0,245,212,0.4)';
        });
    });
})();

/* ══ 3. NAVBAR SCROLL + ACTIVE LINK ═════════════════════════ */
(function () {
    var navbar  = document.getElementById('navbar');
    var links   = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('section[id]');

    function onScroll() {
        // Solid background
        if (navbar) {
            navbar.classList.toggle('solid', window.scrollY > 20);
        }

        // Active link theo section đang xem
        var scrollY = window.scrollY + 100;
        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var h   = sec.offsetHeight;
            var id  = sec.getAttribute('id');
            links.forEach(function (a) {
                if (a.getAttribute('href') === '#' + id) {
                    a.classList.toggle('active', scrollY >= top && scrollY < top + h);
                }
            });
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ══ 4. HAMBURGER MOBILE MENU ════════════════════════════════ */
(function () {
    var burger    = document.getElementById('burger');
    var mobileNav = document.getElementById('mobileNav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    // Đóng khi click link
    mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });

    // Đóng khi click ngoài
    document.addEventListener('click', function (e) {
        if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        }
    });
})();

/* ══ 5. SMOOTH SCROLL ════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 60;
        var top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
    });
});

/* ══ 6. REVEAL ON SCROLL ═════════════════════════════════════ */
(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                // Delay nhỏ theo thứ tự
                setTimeout(function () {
                    entry.target.classList.add('in');
                }, i * 80);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) { io.observe(el); });
})();

/* ══ 7. COUNTER ANIMATION ════════════════════════════════════ */
(function () {
    var nums = document.querySelectorAll('.stat-n[data-to]');
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el     = entry.target;
            var target = parseInt(el.dataset.to, 10);
            var suffix = target === 100 ? '%' : '+';
            var start  = 0;
            var dur    = 1400;
            var step   = Math.ceil(target / 60);
            var timer  = setInterval(function () {
                start = Math.min(start + step, target);
                el.textContent = start + suffix;
                if (start >= target) clearInterval(timer);
            }, dur / Math.ceil(target / step));
            io.unobserve(el);
        });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { io.observe(n); });
})();

/* ══ 8. SKILL BAR ANIMATION ══════════════════════════════════ */
(function () {
    var bars = document.querySelectorAll('.bar-fill[data-w]');
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.style.width = entry.target.dataset.w + '%';
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    bars.forEach(function (b) { io.observe(b); });
})();

/* ══ 9. TYPEWRITER EFFECT ════════════════════════════════════ */
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
                ri  = (ri + 1) % roles.length;
            }
            setTimeout(tick, SPEED_DEL);
        }
    }
    tick();
})();

/* ══ 10. GLITCH EFFECT TRÊN TÊN ═════════════════════════════ */
(function () {
    var name = document.getElementById('heroName');
    if (!name) return;
    setInterval(function () {
        name.classList.add('glitch');
        setTimeout(function () { name.classList.remove('glitch'); }, 200);
    }, 4500);
})();

/* ══ 11. PROFILE IMAGE FALLBACK ══════════════════════════════ */
(function () {
    var img = document.getElementById('profileImg');
    if (!img) return;

    // Thử load lại với cache-bust nếu lỗi lần đầu
    var retried = false;
    img.addEventListener('error', function () {
        if (!retried) {
            retried = true;
            // Thử thêm ./ phía trước để đảm bảo đường dẫn tương đối
            img.src = './profile.jpg?' + Date.now();
            return;
        }
        // Nếu vẫn lỗi sau retry → hiện chữ Ju
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

    // Đảm bảo ảnh hiển thị khi load xong
    img.addEventListener('load', function () {
        img.style.display = 'block';
        img.style.opacity = '1';
    });

    // Nếu ảnh đã cached và complete rồi thì hiện luôn
    if (img.complete && img.naturalWidth > 0) {
        img.style.display = 'block';
        img.style.opacity = '1';
    }
})();

/* ══ 12. BACK TO TOP ═════════════════════════════════════════ */
(function () {
    var btn = document.getElementById('backTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        btn.classList.toggle('show', window.scrollY > 380);
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ══ 13. TOAST ═══════════════════════════════════════════════ */
function showToast(msg, ms) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, ms || 3200);
}

/* ══ 14. CONTACT FORM ════════════════════════════════════════ */
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn  = form.querySelector('.btn-submit');
        var orig = btn.innerHTML;

        btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        btn.disabled   = true;

        setTimeout(function () {
            form.reset();
            btn.innerHTML = '<i class="fas fa-check"></i> Đã gửi!';
            showToast('✅ Cảm ơn! Mình sẽ phản hồi sớm nhất có thể.', 3500);
            setTimeout(function () {
                btn.innerHTML = orig;
                btn.disabled  = false;
            }, 2500);
        }, 1300);
    });
})();

/* ══ 15. CARD TILT (chỉ desktop) ════════════════════════════ */
(function () {
    if (window.innerWidth <= 768) return;

    var cards = document.querySelectorAll('.proj-card, .exp-card, .stat-box');
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r  = card.getBoundingClientRect();
            var x  = (e.clientX - r.left) / r.width  - 0.5;
            var y  = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = [
                'perspective(500px)',
                'rotateX(' + (-y * 5) + 'deg)',
                'rotateY(' + (x * 5)  + 'deg)',
                'translateY(-4px)'
            ].join(' ');
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
})();
