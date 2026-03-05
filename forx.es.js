function g(t, e = document) {
  return e.querySelector(t);
}
function m(t, e = document) {
  return e.querySelectorAll(t);
}
function v(t, e = {}) {
  const s = document.createElement(t);
  return e.className && (s.className = e.className), e.html && (s.innerHTML = e.html), e.text && (s.textContent = e.text), e.attrs && Object.entries(e.attrs).forEach(([n, a]) => s.setAttribute(n, a)), s;
}
function N(t, e, s) {
  return Math.min(Math.max(t, e), s);
}
const M = {
  init() {
    m(".tab").forEach((t) => {
      t.addEventListener("click", () => this._activate(t));
    });
  },
  _activate(t) {
    var n;
    const e = t.closest(".tabs");
    if (!e) return;
    m(".tab", e).forEach((a) => a.classList.remove("active")), t.classList.add("active"), m(".tab-panel").forEach((a) => a.classList.remove("active"));
    const s = t.dataset.tab;
    s && ((n = document.getElementById(s)) == null || n.classList.add("active"));
  },
  show(t) {
    const e = g(`.tab[data-tab="${t}"]`);
    e && this._activate(e);
  }
}, $ = {
  init() {
    m(".modal-backdrop").forEach((t) => {
      t.addEventListener("click", (e) => {
        e.target === t && this.close(t.id);
      });
    }), m("[data-close]").forEach((t) => {
      t.addEventListener("click", () => {
        const e = t.closest(".modal-backdrop");
        e && this.close(e.id);
      });
    }), m("[data-modal-open]").forEach((t) => {
      t.addEventListener("click", () => {
        this.open(t.dataset.modalOpen ?? "");
      });
    }), document.addEventListener("keydown", (t) => {
      if (t.key === "Escape") {
        const e = g(".modal-backdrop.open");
        e && this.close(e.id);
      }
    });
  },
  open(t) {
    const e = document.getElementById(t);
    e && (e.classList.add("open"), document.body.style.overflow = "hidden");
  },
  close(t) {
    const e = document.getElementById(t);
    e && (e.classList.remove("open"), document.body.style.overflow = "");
  },
  toggle(t) {
    const e = document.getElementById(t);
    e && (e.classList.contains("open") ? this.close(t) : this.open(t));
  }
}, S = {
  success: "✓",
  danger: "✕",
  warn: "⚠",
  info: "ℹ"
};
let p = null;
const H = "DD/MM HH:mm";
function k(t, e) {
  if (e === "relative") return B(t);
  const s = e === !0 ? H : e, n = {
    YYYY: String(t.getFullYear()),
    DD: String(t.getDate()).padStart(2, "0"),
    MM: String(t.getMonth() + 1).padStart(2, "0"),
    HH: String(t.getHours()).padStart(2, "0"),
    mm: String(t.getMinutes()).padStart(2, "0")
  };
  return s.replace(/YYYY|DD|MM|HH|mm/g, (a) => n[a] ?? a);
}
function B(t) {
  const e = Date.now() - t.getTime(), s = Math.floor(e / 6e4), n = Math.floor(s / 60), a = Math.floor(n / 24);
  return s < 1 ? "à l'instant" : s < 60 ? `il y a ${s} min` : n < 24 ? `il y a ${n} h` : `il y a ${a} j`;
}
function F(t, e) {
  return !e || t.length <= e ? t : t.slice(0, e).trimEnd() + "…";
}
function G(t, e, s) {
  return s === "type" ? `__type__${e}` : `${e}::${t}`;
}
function T(t, e, s, n, a, i = !1) {
  const l = n ? `<span class="toast-date">${k(a, n)}</span>` : "";
  return `
    <div class="toast-row">
      <span class="toast-icon">${t}</span>
      <span class="toast-msg">${F(e, i)}</span>
      ${l}
    </div>
    ${s ? '<button class="toast-close" aria-label="Fermer">✕</button>' : ""}
  `;
}
function E(t) {
  return t === 0;
}
const D = {
  _groups: /* @__PURE__ */ new Map(),
  // ── Init ──────────────────────────────────────────────────────────────────
  init() {
    document.getElementById("forx-toast-container") ? p = document.getElementById("forx-toast-container") : (p = v("div", { attrs: { id: "forx-toast-container" } }), document.body.appendChild(p));
  },
  // ── Public API ────────────────────────────────────────────────────────────
  show(t, e = {}) {
    const s = e.type ?? "success", n = e.duration ?? 3500, a = e.closable ?? !0, i = e.group ?? "exact", l = e.timestamp ?? !1, c = e.truncate ?? !1;
    if (i === !1) {
      this._createStandalone(t, s, n, a, l, c);
      return;
    }
    const u = G(t, s, i);
    this._groups.has(u) ? this._pushToGroup(u, t, n) : this._createGroup(u, t, s, n, a, l, c);
  },
  // ── Create a standalone (non-grouped) toast ───────────────────────────────
  _createStandalone(t, e, s, n, a, i = !1) {
    var u;
    const l = S[e] ?? "ℹ", c = v("div", {
      className: `toast toast-${e}`,
      html: T(l, t, n, a, /* @__PURE__ */ new Date(), i)
    });
    if (p == null || p.appendChild(c), n && ((u = c.querySelector(".toast-close")) == null || u.addEventListener("click", () => this._remove(c))), !E(s)) {
      const d = setTimeout(() => this._remove(c), s);
      c.addEventListener("mouseenter", () => clearTimeout(d)), c.addEventListener(
        "mouseleave",
        () => setTimeout(() => this._remove(c), 1e3)
      );
    }
  },
  // ── Create the first toast of a new group ─────────────────────────────────
  _createGroup(t, e, s, n, a, i, l = !1) {
    var r;
    const c = S[s] ?? "ℹ", u = /* @__PURE__ */ new Date(), d = { message: e, ts: u }, o = v("div", {
      className: `toast toast-${s} toast-grouped`,
      html: `
        ${T(c, e, a, i, u, l)}
        <span class="toast-badge" aria-hidden="true" style="display:none">1</span>
        <ul class="toast-stack" aria-live="polite"></ul>
      `
    });
    p == null || p.appendChild(o);
    const L = {
      element: o,
      entries: [d],
      timer: null,
      type: s,
      closable: a,
      duration: n,
      dateFmt: i,
      truncate: l
    };
    this._groups.set(t, L), E(n) || this._scheduleRemove(t, n), this._bindGroupEvents(t), a && ((r = o.querySelector(".toast-close")) == null || r.addEventListener("click", () => this._removeGroup(t)));
  },
  // ── Push a new message into an existing group ─────────────────────────────
  _pushToGroup(t, e, s) {
    const n = this._groups.get(t);
    if (!n) return;
    n.entries.push({ message: e, ts: /* @__PURE__ */ new Date() });
    const a = n.entries.length, i = n.element.querySelector(".toast-badge");
    i && (i.textContent = String(a), i.style.display = "flex", i.classList.remove("toast-badge--pop"), i.offsetWidth, i.classList.add("toast-badge--pop")), this._rebuildStack(n), E(n.duration) || this._scheduleRemove(t, Math.max(s, n.duration));
  },
  // ── Rebuild the hover-expandable message list ──────────────────────────────
  _rebuildStack(t) {
    const e = t.element.querySelector(".toast-stack");
    e && (e.innerHTML = t.entries.map(({ message: s, ts: n }) => `
        <li class="toast-stack-item">
          <span class="toast-stack-msg">${s}</span>
          ${t.dateFmt ? `<span class="toast-stack-date">${k(n, t.dateFmt)}</span>` : ""}
        </li>
      `).join(""));
  },
  // ── Bind hover expand / collapse on a grouped toast ───────────────────────
  _bindGroupEvents(t) {
    const e = this._groups.get(t);
    if (!e) return;
    const { element: s } = e;
    s.addEventListener("mouseenter", () => {
      e.timer !== null && (clearTimeout(e.timer), e.timer = null), e.entries.length > 1 && s.classList.add("toast-expanded");
    }), s.addEventListener("mouseleave", () => {
      s.classList.remove("toast-expanded"), E(e.duration) || this._scheduleRemove(t, 1200);
    });
  },
  // ── Schedule auto-removal ─────────────────────────────────────────────────
  _scheduleRemove(t, e) {
    const s = this._groups.get(t);
    s && (s.timer !== null && clearTimeout(s.timer), s.timer = setTimeout(() => this._removeGroup(t), e));
  },
  // ── Animate & destroy a group ─────────────────────────────────────────────
  _removeGroup(t) {
    const e = this._groups.get(t);
    e && (e.timer !== null && clearTimeout(e.timer), this._groups.delete(t), this._remove(e.element));
  },
  // ── Shared DOM removal with exit animation ────────────────────────────────
  _remove(t) {
    t.classList.add("removing"), setTimeout(() => t.remove(), 400);
  }
}, w = {
  init() {
    m(".carousel").forEach((t) => this._build(t));
  },
  _build(t) {
    const e = g(".carousel-track", t), s = [...m(".carousel-slide", t)];
    if (!s.length) return;
    const n = {
      current: 0,
      total: s.length,
      loop: t.dataset.loop !== "false",
      autoplay: parseInt(t.dataset.autoplay ?? "0", 10),
      fade: t.hasAttribute("data-fade"),
      dragging: !1,
      startX: 0,
      currentX: 0,
      timer: null
    };
    if (n.fade)
      t.classList.add("fade");
    else if (n.loop) {
      const r = s[0].cloneNode(!0), f = s[s.length - 1].cloneNode(!0);
      r.setAttribute("aria-hidden", "true"), f.setAttribute("aria-hidden", "true"), e.appendChild(r), e.insertBefore(f, s[0]), e.style.transition = "none", e.style.transform = "translateX(-100%)";
    }
    const a = this._createBtn("prev", "‹"), i = this._createBtn("next", "›"), l = this._createDots(n.total), c = this._createCounter(n.total);
    t.append(a, i, c), t.after(l);
    const u = () => {
      const r = e.style.transform.match(/translateX\(-(\d+(?:\.\d+)?)%\)/);
      return r ? parseFloat(r[1]) / 100 : 0;
    }, d = (r, f) => {
      e.style.transition = f ? "transform 350ms cubic-bezier(.4,0,.2,1)" : "none", e.style.transform = `translateX(-${r * 100}%)`;
    }, o = (r, f = !0) => {
      const { total: h, loop: _, fade: A } = n;
      if (A)
        r < 0 && (r = _ ? h - 1 : 0), r >= h && (r = _ ? 0 : h - 1), n.current = r, s.forEach((b, y) => b.classList.toggle("active", y === r));
      else if (_) {
        const b = u(), y = r - n.current, X = b + y;
        d(X, f), n.current = (r % h + h) % h;
      } else
        r = N(r, 0, h - 1), n.current = r, d(r + (_ ? 1 : 0), f);
      this._updateUI(t, L, c, n);
    }, L = l;
    e.addEventListener("transitionend", () => {
      if (!n.loop || n.fade) return;
      const r = u();
      r >= n.total + 1 && (d(1, !1), n.current = 0, this._updateUI(t, l, c, n)), r <= 0 && (d(n.total, !1), n.current = n.total - 1, this._updateUI(t, l, c, n));
    }), [...m(".carousel-dot", l)].forEach((r, f) => {
      r.addEventListener("click", () => o(f));
    }), a.addEventListener("click", () => o(n.current - 1)), i.addEventListener("click", () => o(n.current + 1)), this._bindDrag(t, e, n, o, u, d), n.autoplay > 0 && (this._startAutoplay(n, o), t.addEventListener("mouseenter", () => this._stopAutoplay(n)), t.addEventListener("mouseleave", () => this._startAutoplay(n, o))), o(0, !1);
  },
  _updateUI(t, e, s, n) {
    m(".carousel-dot", e).forEach(
      (a, i) => a.classList.toggle("active", i === n.current)
    ), s.textContent = `${n.current + 1} / ${n.total}`, n.loop || (g(".carousel-btn.prev", t).classList.toggle("disabled", n.current === 0), g(".carousel-btn.next", t).classList.toggle("disabled", n.current === n.total - 1));
  },
  _bindDrag(t, e, s, n, a, i) {
    const c = (o) => {
      s.dragging = !0, s.startX = s.currentX = o, e.classList.add("dragging");
    }, u = (o) => {
      s.dragging && (s.currentX = o);
    }, d = () => {
      if (!s.dragging) return;
      s.dragging = !1, e.classList.remove("dragging");
      const o = s.startX - s.currentX;
      Math.abs(o) > 50 && n(s.current + (o > 0 ? 1 : -1));
    };
    t.addEventListener("mousedown", (o) => c(o.clientX)), t.addEventListener("mousemove", (o) => u(o.clientX)), t.addEventListener("mouseup", d), t.addEventListener("mouseleave", d), t.addEventListener("touchstart", (o) => c(o.touches[0].clientX), { passive: !0 }), t.addEventListener("touchmove", (o) => u(o.touches[0].clientX), { passive: !0 }), t.addEventListener("touchend", d);
  },
  _startAutoplay(t, e) {
    this._stopAutoplay(t), t.timer = setInterval(() => e(t.current + 1), t.autoplay);
  },
  _stopAutoplay(t) {
    t.timer && clearInterval(t.timer), t.timer = null;
  },
  _createBtn(t, e) {
    return v("button", {
      className: `carousel-btn ${t}`,
      html: e,
      attrs: { "aria-label": t === "prev" ? "Précédent" : "Suivant" }
    });
  },
  _createDots(t) {
    const e = v("div", { className: "carousel-dots" });
    for (let s = 0; s < t; s++)
      e.appendChild(v("button", {
        className: "carousel-dot",
        attrs: { "aria-label": `Slide ${s + 1}` }
      }));
    return e;
  },
  _createCounter(t) {
    return v("div", {
      className: "carousel-counter",
      text: "1 / ?"
    });
  }
}, C = {
  Tabs: M,
  Modal: $,
  Toast: D,
  Carousel: w,
  init() {
    M.init(), $.init(), D.init(), w.init();
  }
};
document.addEventListener("DOMContentLoaded", () => C.init());
window.Forx = C;
export {
  g as $,
  m as $$,
  w as Carousel,
  C as Forx,
  $ as Modal,
  M as Tabs,
  D as Toast,
  N as clamp,
  v as el
};
