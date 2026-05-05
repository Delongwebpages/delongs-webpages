import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotion() {
  if (prefersReducedMotion) {
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Generic reveal-on-scroll using IntersectionObserver (cheap, no GSAP required)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );
  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => io.observe(el));

  // Hero text reveal — split each .hero-line into spans for stagger
  const heroLines = document.querySelectorAll<HTMLElement>(".hero-line");
  if (heroLines.length) {
    heroLines.forEach((line) => {
      const words = (line.textContent || "").trim().split(/\s+/);
      line.textContent = "";
      words.forEach((word, i) => {
        const wrap = document.createElement("span");
        wrap.className = "inline-block overflow-hidden align-bottom";
        const inner = document.createElement("span");
        inner.className = "inline-block translate-y-full will-change-transform";
        inner.textContent = word + (i < words.length - 1 ? " " : "");
        wrap.appendChild(inner);
        line.appendChild(wrap);
      });
    });

    gsap.to(".hero-line .inline-block .inline-block", {
      yPercent: 0,
      duration: 1.0,
      ease: "expo.out",
      stagger: 0.04,
      delay: 0.15,
    });
  }

  // Hero subhead + CTAs fade in
  gsap.from(".hero-fade", {
    opacity: 0,
    y: 16,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.6,
  });

  // Nav blur-on-scroll
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (nav) {
    ScrollTrigger.create({
      start: "top -40",
      end: 99999,
      onUpdate: (self) => {
        nav.classList.toggle("nav-scrolled", self.scroll() > 40);
      },
    });
  }

  // Magnetic hover on .magnetic buttons
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });

  // Counter animation for stats
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count || "0");
    const decimals = parseInt(el.dataset.countDecimals || "0", 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      },
    });
  });

  // FAQ accordion
  document.querySelectorAll<HTMLElement>("[data-faq]").forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>("button");
    const panel = item.querySelector<HTMLElement>("[data-faq-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        panel.style.maxHeight = "0px";
      }
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const navMenu = document.querySelector<HTMLElement>("[data-nav-menu]");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("overflow-hidden", open);
    });
    navMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }

  // Contact form handling
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = form.querySelector<HTMLElement>("[data-form-status]");
      const submit = form.querySelector<HTMLButtonElement>("button[type=submit]");
      const data = Object.fromEntries(new FormData(form).entries());

      // Honeypot
      if (data.company) return;

      if (submit) submit.disabled = true;
      if (status) {
        status.textContent = "Sending…";
        status.dataset.state = "pending";
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        if (status) {
          status.textContent = "Got it — I'll be in touch within one business day.";
          status.dataset.state = "success";
        }
        form.reset();
      } catch (err) {
        console.error(err);
        if (status) {
          status.textContent = "Something went wrong. Email cdelong@majormetals.net directly?";
          status.dataset.state = "error";
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  // Refresh ScrollTrigger on resize
  window.addEventListener("resize", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion);
} else {
  initMotion();
}
