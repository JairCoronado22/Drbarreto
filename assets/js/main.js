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
      window.location.href =
        "https://wa.me/51960359369?text=" +
        encodeURIComponent(
          `Hola, Dr. Barreto. Quisiera agendar una cita por: ${reason}. ¿Podrían indicarme disponibilidad y ubicación exacta?`,
        );
    });
  const config = window.CLINIC_CONFIG || {};
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
      frame.title = "Ubicación del consultorio del Dr. Barreto";
    }
    const caption = document.querySelector("[data-map-caption]");
    if (caption) {
      caption.textContent = "Ubicación del consultorio";
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
      el.textContent = "Cómo llegar ↗";
    });
})();
