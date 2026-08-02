(() => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const year = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const megaItems = document.querySelectorAll(".mega-item");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeAllMega = () => {
    megaItems.forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".mega-trigger")?.setAttribute("aria-expanded", "false");
    });
    header?.classList.remove("is-mega-open");
  };

  megaItems.forEach((item) => {
    const trigger = item.querySelector(".mega-trigger");
    const panel = item.querySelector(".mega-panel");
    if (!trigger || !panel) return;

    item.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        closeAllMega();
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        header?.classList.add("is-mega-open");
      }
    });

    trigger.addEventListener("focus", () => {
      closeAllMega();
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      header?.classList.add("is-mega-open");
    });
  });

  document.querySelector(".mega-nav")?.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      closeAllMega();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".mega-nav")) closeAllMega();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllMega();
  });

  document.querySelectorAll(".mega-panel a").forEach((link) => {
    link.addEventListener("click", closeAllMega);
  });

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    if (mobileNav) mobileNav.hidden = open;
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      if (mobileNav) mobileNav.hidden = true;
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("is-visible"), 120 + i * 100);
  });

  const stats = document.querySelectorAll("[data-count]");
  const countIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count") || 0);
        const duration = 900;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  stats.forEach((el) => countIo.observe(el));

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (formStatus) {
      formStatus.textContent = `Obrigado, ${name}. Recebemos sua mensagem. Em breve entramos em contato.`;
    }
    form.reset();
  });

  const orbs = document.querySelectorAll(".hero-orb");
  window.addEventListener(
    "pointermove",
    (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      orbs.forEach((orb, i) => {
        const f = i === 0 ? 1 : -0.6;
        orb.style.translate = `${x * f}px ${y * f}px`;
      });
    },
    { passive: true }
  );
})();
