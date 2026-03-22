(function() {
  const e = localStorage.getItem("mode"), t = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-mode", e ?? (t ? "dark" : "light"));
})();
document.addEventListener("DOMContentLoaded", () => {
  const e = document.getElementById("btn-mode"), t = document.getElementById("icon-sun"), n = document.getElementById("icon-moon");
  if (!e) return;
  function l(r) {
    document.documentElement.setAttribute("data-mode", r), localStorage.setItem("mode", r), t.style.display = r === "dark" ? "none" : "flex", n.style.display = r === "light" ? "none" : "flex";
  }
  l(localStorage.getItem("mode") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")), e.addEventListener("click", () => {
    l(document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const e = document.getElementById("nav-burger"), t = document.getElementById("nav-links");
  !e || !t || (e.addEventListener("click", () => {
    const n = t.classList.toggle("open");
    e.setAttribute("aria-expanded", String(n));
  }), t.querySelectorAll("a").forEach(
    (n) => n.addEventListener("click", () => {
      t.classList.remove("open"), e.setAttribute("aria-expanded", "false");
    })
  ));
});
document.addEventListener("DOMContentLoaded", () => {
  const e = document.getElementById("carousel-track");
  if (e) {
    let t = function() {
      c.innerHTML = "";
      for (let i = 0; i <= m(); i++) {
        const d = document.createElement("button");
        d.className = "carousel-dot" + (i === o ? " active" : ""), d.addEventListener("click", () => {
          n(i), clearInterval(a);
        }), c.appendChild(d);
      }
    }, n = function(i) {
      o = Math.max(0, Math.min(i, m()));
      const d = r[0].getBoundingClientRect().width + 16;
      e.style.transform = `translateX(-${o * d}px)`, c.querySelectorAll(".carousel-dot").forEach(
        (E, f) => E.classList.toggle("active", f === o)
      ), s.disabled = o === 0, u.disabled = o >= m();
    }, l = function() {
      clearInterval(a), a = setInterval(() => n(o >= m() ? 0 : o + 1), 4e3);
    };
    const r = e.querySelectorAll(".carousel-slide"), s = document.getElementById("carousel-prev"), u = document.getElementById("carousel-next"), c = document.querySelector(".carousel-dots");
    let o = 0, a, v;
    const h = () => window.innerWidth <= 600 ? 1 : 2, m = () => Math.max(0, r.length - h());
    s.addEventListener("click", () => {
      n(o - 1), clearInterval(a);
    }), u.addEventListener("click", () => {
      n(o + 1), clearInterval(a);
    });
    let g = 0;
    e.addEventListener("touchstart", (i) => {
      g = i.touches[0].clientX, clearInterval(a);
    }, { passive: !0 }), e.addEventListener("touchend", (i) => {
      const d = i.changedTouches[0].clientX - g;
      Math.abs(d) > 50 && n(d < 0 ? o + 1 : o - 1);
    }), window.addEventListener("resize", () => {
      e.style.transition = "none", clearTimeout(v), v = setTimeout(() => {
        t(), n(Math.min(o, m())), e.style.transition = "";
      }, 150);
    }), e.addEventListener("mouseenter", () => clearInterval(a)), e.addEventListener("mouseleave", l), t(), n(0), l();
  }
  document.querySelectorAll(".mini-carousel").forEach((t) => {
    const n = t.querySelector(".mini-carousel-track"), l = t.querySelectorAll(".mini-carousel-slide"), r = t.querySelector(".mini-carousel-btn.prev"), s = t.querySelector(".mini-carousel-btn.next"), u = l.length;
    let c = 0;
    if (u <= 1) {
      r && (r.style.display = "none"), s && (s.style.display = "none");
      return;
    }
    function o(a) {
      c = Math.max(0, Math.min(a, u - 1)), n.style.transform = `translateX(-${c * 100}%)`, r && (r.disabled = c === 0), s && (s.disabled = c === u - 1);
    }
    r == null || r.addEventListener("click", (a) => {
      a.stopPropagation(), o(c - 1);
    }), s == null || s.addEventListener("click", (a) => {
      a.stopPropagation(), o(c + 1);
    }), o(0);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  if ("IntersectionObserver" in window) {
    const e = new IntersectionObserver((t) => {
      t.forEach((n) => {
        n.isIntersecting && (n.target.classList.add("visible"), e.unobserve(n.target));
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".anim").forEach((t) => e.observe(t));
  } else
    document.querySelectorAll(".anim").forEach((e) => e.classList.add("visible"));
});
