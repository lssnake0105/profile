(function () {
  const GOATCOUNTER_CODE = "";
  const PRODUCTION_HOST = "lssnake0105.github.io";
  const counter = document.querySelector("[data-visit-count]");
  const note = document.querySelector("[data-visit-note]");

  if (!counter) return;

  function setStatus(text, detail) {
    counter.textContent = text;
    if (note && detail) note.textContent = detail;
  }

  if (window.location.hostname !== PRODUCTION_HOST) {
    setStatus("Local preview", "Visit counting is enabled only on the public GitHub Pages site.");
    return;
  }

  if (!GOATCOUNTER_CODE) {
    setStatus("Not configured", "Add a GoatCounter site code in site-activity.js to enable counting.");
    return;
  }

  window.goatcounter = window.goatcounter || {};
  window.goatcounter.no_onload = true;

  const script = document.createElement("script");
  script.src = `https://${GOATCOUNTER_CODE}.goatcounter.com/count.js`;
  script.async = true;
  script.onload = function () {
    if (!window.goatcounter || typeof window.goatcounter.visit_count !== "function") {
      setStatus("Visit count unavailable", "The counter script loaded, but the count API was unavailable.");
      return;
    }

    window.goatcounter.count({
      path: "TOTAL",
      title: "Portfolio total visits",
      event: true
    });

    window.goatcounter.visit_count({
      append: "[data-visit-count]",
      path: "TOTAL",
      no_branding: true
    });
  };
  script.onerror = function () {
    setStatus("Visit count unavailable", "The counter script could not be loaded.");
  };

  document.head.appendChild(script);
})();
