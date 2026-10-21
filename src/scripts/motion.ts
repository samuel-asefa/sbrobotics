// One small motion system for the whole site.
// - [data-reveal]        fades/slides/masks in once when scrolled into view
// - [data-count]         counts up once to its real value
// - [data-parallax]      subtle image drift, only while on screen (desktop)
// - [data-marquee]       pauses when off screen
// - #scroll-progress     thin reading-progress bar
// Everything is skipped under prefers-reduced-motion, and the page is fully
// readable before (or without) this script.

declare global {
  interface Window { __sbMotion?: boolean }
}

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.__sbMotion = true;

/* ---------- Reveals ---------- */
function initReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  // A clipped element (mask reveal) can read as invisible to the observer,
  // so masks are observed through their parent instead.
  const targets = new Map<Element, HTMLElement[]>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          targets.get(e.target)?.forEach((el) => el.classList.add('is-in'));
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => {
    const t = el.dataset.reveal === 'mask' && el.parentElement ? el.parentElement : el;
    targets.set(t, [...(targets.get(t) ?? []), el]);
    io.observe(t);
  });
}

/* ---------- Counters ---------- */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

function runCounter(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const pad = Number(el.dataset.pad || 0);
  const fmt = (n: number) => String(Math.round(n)).padStart(pad, '0');
  if (!Number.isFinite(to)) return;
  if (reduce) {
    el.textContent = fmt(to);
    return;
  }
  const dur = 1400;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = fmt(to * easeOut(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length) return;
  if (reduce || !('IntersectionObserver' in window)) return; // final values already in HTML
  els.forEach((el) => {
    const pad = Number(el.dataset.pad || 0);
    el.textContent = '0'.padStart(pad || 1, '0');
  });
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          runCounter(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Parallax ---------- */
function initParallax() {
  if (reduce) return;
  const mq = window.matchMedia('(min-width: 768px)');
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length) return;
  const visible = new Set<HTMLElement>();
  let ticking = false;

  const update = () => {
    ticking = false;
    if (!mq.matches) {
      els.forEach((el) => (el.style.transform = ''));
      return;
    }
    const vh = window.innerHeight;
    visible.forEach((el) => {
      const host = el.parentElement ?? el;
      const r = host.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height); // -0.5..0.5
      const speed = Number(el.dataset.parallax || 0.12);
      el.style.transform = `translate3d(0, ${(-progress * speed * 100).toFixed(2)}%, 0) scale(${1 + speed})`;
    });
  };
  const onScroll = () => {
    if (!ticking && visible.size) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      if (e.isIntersecting) visible.add(el);
      else visible.delete(el);
    }
    onScroll();
  });
  els.forEach((el) => io.observe(el));
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ---------- Marquee visibility ---------- */
function initMarquees() {
  const els = document.querySelectorAll<HTMLElement>('[data-marquee], [data-loop]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) (e.target as HTMLElement).dataset.offscreen = String(!e.isIntersecting);
  });
  els.forEach((el) => {
    io.observe(el);
    const btn = el.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
    btn?.addEventListener('click', () => {
      const paused = el.dataset.userPaused === 'true';
      el.dataset.userPaused = String(!paused);
      btn.setAttribute('aria-pressed', String(!paused));
      btn.setAttribute('aria-label', !paused ? 'Play scrolling list' : 'Pause scrolling list');
    });
  });
}

/* ---------- Scroll progress + header state ---------- */
function initScrollState() {
  const bar = document.getElementById('scroll-progress');
  const header = document.querySelector<HTMLElement>('[data-header]');
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

initScrollState();
initReveals();
initCounters();
initParallax();
initMarquees();
root.classList.add('motion-ready');

export {};
