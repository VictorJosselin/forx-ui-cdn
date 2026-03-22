/* forx-ui | JS bundle | 2026-03-22 */

/* -- theme.js -- */
(function() {
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', function() {
  var themeBtn = document.getElementById('btn-theme');
  var iconSun  = document.getElementById('icon-sun');
  var iconMoon = document.getElementById('icon-moon');

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    iconSun.style.display  = (t === 'dark')  ? 'none'  : 'block';
    iconMoon.style.display = (t === 'light') ? 'none'  : 'block';
  }
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', function() {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* -- nav.js -- */
document.addEventListener('DOMContentLoaded', function() {
  var burger   = document.getElementById('nav-burger');
  var navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;
  burger.addEventListener('click', function() { navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { navLinks.classList.remove('open'); });
  });
});

/* -- profile.js -- */
document.addEventListener('DOMContentLoaded', function() {
  var profileInput = document.getElementById('profile-input');
  var profileImg   = document.getElementById('profile-img');
  var profileIcon  = document.getElementById('profile-icon');
  if (!profileInput) return;

  var savedPhoto = localStorage.getItem('profile-photo');
  if (savedPhoto) {
    profileImg.src = savedPhoto;
    profileImg.style.display = 'block';
    profileIcon.style.display = 'none';
  }
  profileInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      profileImg.src = ev.target.result;
      profileImg.style.display = 'block';
      profileIcon.style.display = 'none';
      try { localStorage.setItem('profile-photo', ev.target.result); } catch(err) {}
    };
    reader.readAsDataURL(file);
  });
});

/* -- carousel.js -- */
document.addEventListener('DOMContentLoaded', function() {
  var track   = document.getElementById('carousel-track');
  if (!track) return;
  var slides  = track.querySelectorAll('.carousel-slide');
  var btnPrev = document.getElementById('carousel-prev');
  var btnNext = document.getElementById('carousel-next');
  var dotsContainer = document.querySelector('.carousel-dots');
  var current = 0;
  var autoTimer;
  var resizeTimer;

  function perView() { return window.innerWidth <= 600 ? 1 : 2; }
  function maxIdx()  { return Math.max(0, slides.length - perView()); }

  function buildDots() {
    dotsContainer.innerHTML = '';
    var count = maxIdx() + 1;
    for (var i = 0; i < count; i++) {
      var d = document.createElement('button');
      d.className = 'carousel-dot' + (i === current ? ' active' : '');
      d.dataset.idx = i;
      d.addEventListener('click', (function(idx) {
        return function() { goTo(idx); clearInterval(autoTimer); };
      })(i));
      dotsContainer.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    var slideW = slides[0].getBoundingClientRect().width + 16;
    track.style.transform = 'translateX(-' + (current * slideW) + 'px)';
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxIdx();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current >= maxIdx() ? 0 : current + 1); }, 4000);
  }

  btnPrev.addEventListener('click', function() { goTo(current - 1); clearInterval(autoTimer); });
  btnNext.addEventListener('click', function() { goTo(current + 1); clearInterval(autoTimer); });

  var touchX = 0;
  track.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; clearInterval(autoTimer); }, {passive:true});
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });
  window.addEventListener('resize', function() {
    track.style.transition = 'none';
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      buildDots();
      goTo(Math.min(current, maxIdx()));
      track.style.transition = '';
    }, 150);
  });
  track.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
  track.addEventListener('mouseleave', startAuto);
  buildDots();
  goTo(0);
  startAuto();
});

/* -- mini-carousel.js -- */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.mini-carousel').forEach(function(mc) {
    var mtrack  = mc.querySelector('.mini-carousel-track');
    var mslides = mc.querySelectorAll('.mini-carousel-slide');
    var prev    = mc.querySelector('.mini-carousel-btn.prev');
    var next    = mc.querySelector('.mini-carousel-btn.next');
    var cur     = 0;
    var total   = mslides.length;

    if (total <= 1) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      return;
    }

    function miniGoTo(idx) {
      cur = Math.max(0, Math.min(idx, total - 1));
      mtrack.style.transform = 'translateX(-' + (cur * 100) + '%)';
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === total - 1;
    }

    if (prev) prev.addEventListener('click', function(e) { e.stopPropagation(); miniGoTo(cur - 1); });
    if (next) next.addEventListener('click', function(e) { e.stopPropagation(); miniGoTo(cur + 1); });
    miniGoTo(0);
  });
});

/* -- animations.js -- */
document.addEventListener('DOMContentLoaded', function() {
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.anim').forEach(function(el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.anim').forEach(function(el) { el.classList.add('visible'); });
  }
});
