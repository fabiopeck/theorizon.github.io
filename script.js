(() => {
  const SUPPORT_EMAIL = "contato@theorizon.com.br";
  // Número WhatsApp em E.164 sem + (ex.: 5511999999999). Deixe vazio se ainda não tiver.
  const WHATSAPP_NUMBER = "";

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const year = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const megaItems = document.querySelectorAll(".mega-item");

  if (year) year.textContent = String(new Date().getFullYear());

  const sendEmailNotify = (name, email, message, source = "Site The Orizon") => {
    const subject = encodeURIComponent(`${source} — ${name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}\n\n— Enviado pelo ${source}`
    );
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    const payload = {
      name,
      email,
      message,
      _subject: `${source} — ${name}`,
      _template: "table",
      _captcha: "false",
      _replyto: email,
    };

    return fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      const msg = String(data.message || "");
      if (String(data.success) === "false" || /activation/i.test(msg)) {
        const err = new Error(msg || "formsubmit_failed");
        err.code = /activation/i.test(msg) ? "NEEDS_ACTIVATION" : "FORMSUBMIT_FAILED";
        throw err;
      }
      if (!res.ok) {
        const err = new Error("formsubmit_failed");
        err.code = "FORMSUBMIT_FAILED";
        throw err;
      }
      return data;
    }).catch((err) => {
      if (err?.code === "NEEDS_ACTIVATION") throw err;
      // Fallback: abre o cliente de e-mail do visitante
      window.location.href = mailto;
      return { fallback: "mailto" };
    });
  };

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
    if (e.key === "Escape") {
      if (document.body.classList.contains("cookie-locked")) return;
      closeAllMega();
      document.getElementById("helpDock")?.classList.remove("is-open");
      document.getElementById("helpFab")?.setAttribute("aria-expanded", "false");
      document.getElementById("cookieDock")?.classList.remove("is-open");
      document.getElementById("cookieFab")?.setAttribute("aria-expanded", "false");
    }
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

  /* Glass sections slide-in */
  const glassSections = document.querySelectorAll(".section.glass-slide");
  if ("IntersectionObserver" in window) {
    const glassIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            glassIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    glassSections.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.05, 0.25)}s`;
      glassIo.observe(el);
    });
  } else {
    glassSections.forEach((el) => el.classList.add("is-in"));
  }

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

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
    }
    if (formStatus) formStatus.textContent = "Enviando sua mensagem…";

    try {
      await sendEmailNotify(name, email, message, "Contato site");
      if (formStatus) {
        formStatus.textContent = `Obrigado, ${name}. Recebemos sua mensagem. Em breve entramos em contato.`;
      }
      form.reset();
    } catch (err) {
      if (err?.code === "NEEDS_ACTIVATION") {
        if (formStatus) {
          formStatus.textContent =
            "Quase lá: abra o e-mail contato@theorizon.com.br e clique em Activate Form (FormSubmit). Depois tente de novo.";
        }
      } else if (formStatus) {
        formStatus.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensagem";
      }
    }
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

  /* ——— Cookies ——— */
  const COOKIE_KEY = "orizon_cookie_prefs";
  const cookieDock = document.getElementById("cookieDock");
  const cookieFab = document.getElementById("cookieFab");
  const cookiePanel = document.getElementById("cookiePanel");
  const cookieConfig = document.getElementById("cookieConfig");
  const cookieLock = document.getElementById("cookieLock");
  const cookieSavedToast = document.getElementById("cookieSavedToast");

  const readCookiePrefs = () => {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY) || "null");
    } catch {
      return null;
    }
  };

  const saveCookiePrefs = (prefs) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, at: Date.now() }));
  };

  const showCookiesSavedToast = () => {
    if (!cookieSavedToast) return;
    cookieSavedToast.hidden = false;
    clearTimeout(showCookiesSavedToast._t);
    showCookiesSavedToast._t = setTimeout(() => {
      cookieSavedToast.hidden = true;
    }, 2200);
  };

  const lockScreenForCookies = () => {
    document.body.classList.add("cookie-locked");
    if (cookieLock) {
      cookieLock.hidden = false;
      cookieLock.setAttribute("aria-hidden", "false");
    }
    cookieDock?.classList.add("is-forced");
  };

  const unlockScreenForCookies = () => {
    document.body.classList.remove("cookie-locked");
    if (cookieLock) {
      cookieLock.hidden = true;
      cookieLock.setAttribute("aria-hidden", "true");
    }
    cookieDock?.classList.remove("is-forced");
  };

  const openCookiePanel = () => {
    cookieDock?.classList.add("is-open");
    cookieFab?.setAttribute("aria-expanded", "true");
  };

  const closeCookiePanel = () => {
    cookieDock?.classList.remove("is-open");
    cookieFab?.setAttribute("aria-expanded", "false");
    if (cookieConfig) cookieConfig.hidden = true;
  };

  const finishCookieChoice = () => {
    unlockScreenForCookies();
    closeCookiePanel();
    showCookiesSavedToast();
  };

  // Na abertura: se ainda não escolheu, trava a tela com a barra de cookies
  if (!readCookiePrefs()) {
    openCookiePanel();
    lockScreenForCookies();
  }

  cookieFab?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (document.body.classList.contains("cookie-locked")) return;
    if (cookieDock?.classList.contains("is-open")) closeCookiePanel();
    else openCookiePanel();
  });

  document.getElementById("cookieAccept")?.addEventListener("click", () => {
    saveCookiePrefs({ essential: true, analytics: true, marketing: true, choice: "accept" });
    finishCookieChoice();
  });

  document.getElementById("cookieRefuse")?.addEventListener("click", () => {
    saveCookiePrefs({ essential: true, analytics: false, marketing: false, choice: "refuse" });
    const a = document.getElementById("ckAnalytics");
    const m = document.getElementById("ckMarketing");
    if (a) a.checked = false;
    if (m) m.checked = false;
    finishCookieChoice();
  });

  document.getElementById("cookieConfigure")?.addEventListener("click", () => {
    if (cookieConfig) cookieConfig.hidden = !cookieConfig.hidden;
  });

  document.getElementById("cookieSaveConfig")?.addEventListener("click", () => {
    saveCookiePrefs({
      essential: true,
      analytics: !!document.getElementById("ckAnalytics")?.checked,
      marketing: !!document.getElementById("ckMarketing")?.checked,
      choice: "custom",
    });
    finishCookieChoice();
  });

  /* ——— Help chat ——— */
  const helpDock = document.getElementById("helpDock");
  const helpFab = document.getElementById("helpFab");
  const helpPanel = document.getElementById("helpPanel");
  const helpClose = document.getElementById("helpClose");
  const helpForm = document.getElementById("helpForm");
  const helpThread = document.getElementById("helpThread");
  const helpStatus = document.getElementById("helpStatus");

  const addBubble = (text, type = "bot") => {
    if (!helpThread) return;
    const el = document.createElement("div");
    el.className = `help-bubble help-bubble--${type}`;
    el.textContent = text;
    helpThread.appendChild(el);
    helpThread.scrollTop = helpThread.scrollHeight;
    return el;
  };

  const openHelp = () => {
    helpDock?.classList.add("is-open");
    helpFab?.setAttribute("aria-expanded", "true");
  };

  const closeHelp = () => {
    helpDock?.classList.remove("is-open");
    helpFab?.setAttribute("aria-expanded", "false");
  };

  helpFab?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (helpDock?.classList.contains("is-open")) closeHelp();
    else openHelp();
  });
  helpClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeHelp();
  });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const runQueue = async () => {
    let pos = 5 + Math.floor(Math.random() * 3);
    const queueEl = addBubble(`Você está na posição ${pos} da fila. Aguarde um momento…`, "queue");
    if (helpStatus) helpStatus.textContent = "Na fila";

    while (pos > 1) {
      await sleep(3000);
      pos -= 1;
      if (queueEl) queueEl.textContent = `Você está na posição ${pos} da fila. Aguarde um momento…`;
    }

    await sleep(2500);
    if (queueEl) queueEl.textContent = "Conectando você ao atendimento…";
    await sleep(1200);
    if (queueEl) queueEl.remove();
    if (helpStatus) helpStatus.textContent = "Em atendimento";
    addBubble("Atendente disponível. Recebemos sua mensagem e já estamos analisando.");
  };

  const sendWhatsAppSilent = (name, email, message) => {
    if (!WHATSAPP_NUMBER) return;
    const text = encodeURIComponent(
      `Central de atendimento — Site The Orizon\nNome: ${name}\nE-mail: ${email}\n\n${message}`
    );
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
    // Abre em janela oculta/minimizada para o time receber sem rótulo no chat do site
    const w = window.open(url, "_blank", "noopener,noreferrer,width=1,height=1,left=-2000,top=-2000");
    if (w) {
      setTimeout(() => {
        try {
          w.close();
        } catch (_) {}
      }, 1500);
    }
  };

  helpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(helpForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) return;

    const submitBtn = helpForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
    }

    addBubble(message, "user");
    helpForm.reset();
    // Mantém o formulário visível para novas mensagens
    Array.from(helpForm.elements).forEach((el) => {
      el.disabled = true;
    });
    if (submitBtn) submitBtn.textContent = "Enviando…";

    await runQueue();
    await sendEmailNotify(name, email, message, "Atendimento site");
    sendWhatsAppSilent(name, email, message);

    await sleep(900);
    addBubble(
      `Obrigado, ${name}. Sua solicitação foi registrada. Retornaremos no e-mail ${email} em breve.`
    );

    await sleep(4000);
    addBubble("Equipe The Orizon: recebemos seu contato. Se precisar complementar, responda por aqui.");

    Array.from(helpForm.elements).forEach((el) => {
      el.disabled = false;
    });
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar";
    }
  });
})();
