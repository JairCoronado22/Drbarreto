(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      toggle?.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) closeMenu();
  });
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  const trackWhatsappClick = (url, text, onComplete) => {
    const clickData = {
      event: "whatsapp_click",
      link_url: url,
      link_text: text,
      page_path: window.location.pathname,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(clickData);
    if (typeof window.gtag === "function") {
      const eventData = { ...clickData };
      delete eventData.event;
      if (onComplete) {
        let completed = false;
        const complete = () => {
          if (completed) return;
          completed = true;
          onComplete();
        };
        eventData.event_callback = complete;
        eventData.event_timeout = 500;
        window.setTimeout(complete, 600);
      }
      window.gtag("event", "whatsapp_click", eventData);
    } else if (onComplete) {
      onComplete();
    }
  };
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      let count = 0;
      document.querySelectorAll("[data-category]").forEach((item) => {
        item.hidden =
          button.dataset.filter !== "all" &&
          item.dataset.category !== button.dataset.filter;
        if (!item.hidden) count++;
      });
      document.getElementById("gallery-status").textContent =
        `${count} espacios de fotografía`;
    }),
  );
  document
    .getElementById("appointment-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const reason = document.getElementById("reason").value;
      const url =
        "https://wa.me/51960359369?text=" +
        encodeURIComponent(
          `Hola, Dr. Barreto. Quisiera agendar una cita por: ${reason}. ¿Podrían indicarme disponibilidad y ubicación exacta?`,
        );
      trackWhatsappClick(url, "Agendar por WhatsApp", () => {
        window.location.href = url;
      });
    });
  const config = window.CLINIC_CONFIG || {};
  if (/^G-[A-Z0-9]+$/.test(config.gaMeasurementId || "")) {
    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
    document.head.append(analyticsScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", config.gaMeasurementId);
  }
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href*="wa.me/"]');
    if (!link) return;
    trackWhatsappClick(link.href, link.textContent.trim());
  });
  if (config.address)
    document
      .querySelectorAll("[data-address]")
      .forEach((el) => (el.textContent = config.address));
  if (config.hours)
    document
      .querySelectorAll("[data-hours]")
      .forEach((el) => (el.textContent = config.hours));
  if (
    config.mapsEmbedUrl &&
    /^https:\/\/(www\.)?google\.com\/maps/.test(config.mapsEmbedUrl)
  ) {
    const frame = document.querySelector(".map-panel iframe");
    if (frame) {
      frame.src = config.mapsEmbedUrl;
      frame.title =
        "Mapa con la dirección del consultorio del Dr. Barreto en Urb. Vipol Naranjal";
    }
    const caption = document.querySelector("[data-map-caption]");
    if (caption) {
      caption.textContent = "Dirección del consultorio";
      caption.nextElementSibling.textContent =
        config.address || "Consulta los detalles antes de acudir.";
    }
  }
  if (
    config.mapsDirectionsUrl &&
    /^https:\/\/(www\.google\.com|maps\.google\.com|maps\.app\.goo\.gl)\//.test(
      config.mapsDirectionsUrl,
    )
  )
    document.querySelectorAll("[data-directions]").forEach((el) => {
      el.href = config.mapsDirectionsUrl;
      el.textContent = "Ver en Google Maps ↗";
    });
  const linkedQuestion = document.getElementById(
    window.location.hash.slice(1),
  );
  if (linkedQuestion instanceof HTMLDetailsElement) linkedQuestion.open = true;
})();
